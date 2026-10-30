const { spawn, execSync } = require('child_process');
const path = require('path');
const readline = require('readline');
const { syncEnv } = require('./sync-env');

const rootDir = path.resolve(__dirname, '..');
const isWindows = process.platform === 'win32';
const npxCmd = isWindows ? 'npx.cmd' : 'npx';

const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';
const CYAN = '\x1b[36m';
const MAGENTA = '\x1b[35m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const RED = '\x1b[31m';

console.log(`${BOLD}${GREEN}====================================================${RESET}`);
console.log(`${BOLD}${GREEN}   🚀 CodePath - Production Server                  ${RESET}`);
console.log(`${BOLD}${GREEN}====================================================${RESET}`);

const env = syncEnv();
console.log(`🌐 ${BOLD}Frontend App:${RESET}  http://localhost:3000`);
console.log(`⚙️  ${BOLD}Backend API:${RESET}   http://localhost:5000`);
console.log(`${BOLD}${GREEN}====================================================${RESET}\n`);

function attachPrefixedStream(stream, prefix, color) {
  if (!stream) return;
  const rl = readline.createInterface({ input: stream, terminal: false });
  rl.on('line', (line) => {
    console.log(`${color}${BOLD}[${prefix}]${RESET} ${line}`);
  });
}

const children = [];

function spawnService(name, cwd, args, color) {
  const child = spawn(npxCmd, args, {
    cwd,
    env: { ...process.env, ...env },
    stdio: ['inherit', 'pipe', 'pipe'],
    shell: isWindows,
  });

  attachPrefixedStream(child.stdout, name, color);
  attachPrefixedStream(child.stderr, name, RED);

  children.push({ name, process: child });
  return child;
}

// Start Backend on 5000
spawnService('Backend', path.join(rootDir, 'Backend'), ['next', 'start', '-p', '5000'], MAGENTA);

// Start Frontend on 3000
spawnService('Frontend', path.join(rootDir, 'Frontend'), ['next', 'start', '-p', '3000'], CYAN);

let shuttingDown = false;
function shutdown() {
  if (shuttingDown) return;
  shuttingDown = true;
  console.log(`\n${YELLOW}🛑 Stopping CodePath production servers...${RESET}`);

  for (const { name, process: child } of children) {
    if (!child || child.killed) continue;
    try {
      if (isWindows && child.pid) {
        execSync(`taskkill /pid ${child.pid} /T /F`, { stdio: 'ignore' });
      } else if (child.pid) {
        process.kill(-child.pid, 'SIGINT');
      }
    } catch (e) {
      try {
        child.kill('SIGINT');
      } catch (err) {}
    }
  }

  setTimeout(() => {
    console.log(`${GREEN}👋 Servers stopped.${RESET}`);
    process.exit(0);
  }, 500);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
process.on('SIGHUP', shutdown);
process.on('exit', shutdown);
