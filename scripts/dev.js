const { spawn, execSync } = require('child_process');
const path = require('path');
const readline = require('readline');
const { syncEnv } = require('./sync-env');

const rootDir = path.resolve(__dirname, '..');
const isWindows = process.platform === 'win32';
const npxCmd = isWindows ? 'npx.cmd' : 'npx';

// ANSI Color Codes
const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';
const CYAN = '\x1b[36m';
const MAGENTA = '\x1b[35m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const RED = '\x1b[31m';

// Step 1: Sync Environment
console.log(`${BOLD}${GREEN}====================================================${RESET}`);
console.log(`${BOLD}${GREEN}   🚀 CodePath - AI-Powered Learning Platform       ${RESET}`);
console.log(`${BOLD}${GREEN}====================================================${RESET}`);

const env = syncEnv();
console.log(`📁 ${BOLD}Configuration:${RESET} Loaded & synchronized from root ${CYAN}.env${RESET}`);
console.log(`🌐 ${BOLD}Frontend App:${RESET}  http://localhost:3000`);
console.log(`⚙️  ${BOLD}Backend API:${RESET}   http://localhost:5000`);
console.log(`${BOLD}${GREEN}====================================================${RESET}\n`);

// Helper to prefix child stream lines
function attachPrefixedStream(stream, prefix, color) {
  if (!stream) return;
  const rl = readline.createInterface({ input: stream, terminal: false });
  rl.on('line', (line) => {
    // Suppress redundant Next.js telemetry warnings
    if (line.includes('Attention: Next.js now collects completely anonymous telemetry')) return;
    console.log(`${color}${BOLD}[${prefix}]${RESET} ${line}`);
  });
}

// Track active children
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

  child.on('error', (err) => {
    console.error(`${RED}${BOLD}[${name}] Failed to start:${RESET} ${err.message}`);
  });

  child.on('exit', (code, signal) => {
    if (code !== null && code !== 0 && !shuttingDown) {
      console.log(`${YELLOW}${BOLD}[${name}] exited with code ${code}${RESET}`);
    }
  });

  children.push({ name, process: child });
  return child;
}

// Start Backend on 5000
const backend = spawnService(
  'Backend',
  path.join(rootDir, 'Backend'),
  ['next', 'dev', '-p', '5000'],
  MAGENTA
);

// Start Frontend on 3000
const frontend = spawnService(
  'Frontend',
  path.join(rootDir, 'Frontend'),
  ['next', 'dev', '-p', '3000'],
  CYAN
);

// Graceful Shutdown
let shuttingDown = false;
function shutdown() {
  if (shuttingDown) return;
  shuttingDown = true;
  console.log(`\n${YELLOW}🛑 Shutting down CodePath services...${RESET}`);

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
      } catch (err) {
        // ignore
      }
    }
  }

  setTimeout(() => {
    console.log(`${GREEN}👋 All services stopped cleanly. Goodbye!${RESET}`);
    process.exit(0);
  }, 500);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
process.on('SIGHUP', shutdown);
process.on('exit', shutdown);
