const { spawnSync } = require('child_process');
const path = require('path');
const { syncEnv } = require('./sync-env');

const rootDir = path.resolve(__dirname, '..');
const isWindows = process.platform === 'win32';
const npxCmd = isWindows ? 'npx.cmd' : 'npx';

console.log('\n📦 Synchronizing environment variables...');
const env = syncEnv();

console.log('\n🔨 Building Backend API service...');
const backendBuild = spawnSync(npxCmd, ['next', 'build'], {
  cwd: path.join(rootDir, 'Backend'),
  env: { ...process.env, ...env },
  stdio: 'inherit',
  shell: isWindows,
});

if (backendBuild.status !== 0) {
  console.error('\n❌ Backend build failed with exit code', backendBuild.status);
  process.exit(backendBuild.status || 1);
}

console.log('\n🔨 Building Frontend application...');
const frontendBuild = spawnSync(npxCmd, ['next', 'build'], {
  cwd: path.join(rootDir, 'Frontend'),
  env: { ...process.env, ...env },
  stdio: 'inherit',
  shell: isWindows,
});

if (frontendBuild.status !== 0) {
  console.error('\n❌ Frontend build failed with exit code', frontendBuild.status);
  process.exit(frontendBuild.status || 1);
}

console.log('\n✅ Both Frontend and Backend built successfully!\n');
