const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const rootEnvPath = path.join(rootDir, '.env');
const frontendEnvPath = path.join(rootDir, 'Frontend', '.env.local');
const backendEnvPath = path.join(rootDir, 'Backend', '.env.local');

/**
 * Parse a .env file content into an object of key-value pairs
 */
function parseEnv(content) {
  const env = {};
  const lines = content.split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx !== -1) {
      const key = trimmed.slice(0, eqIdx).trim();
      let value = trimmed.slice(eqIdx + 1).trim();
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      env[key] = value;
    }
  }
  return env;
}

/**
 * Load the single root .env directly into process.env
 * Keeps only ONE .env file in the entire repository.
 */
function loadSingleEnv() {
  // Ensure any leftover subfolder env files are deleted
  if (fs.existsSync(frontendEnvPath)) {
    try { fs.unlinkSync(frontendEnvPath); } catch (e) {}
  }
  if (fs.existsSync(backendEnvPath)) {
    try { fs.unlinkSync(backendEnvPath); } catch (e) {}
  }

  if (!fs.existsSync(rootEnvPath)) {
    console.warn('⚠️  Warning: Root .env file not found.');
    return {};
  }

  const rootContent = fs.readFileSync(rootEnvPath, 'utf8');
  const envObj = parseEnv(rootContent);

  // Normalize Gemini API keys so both frontend and backend work seamlessly
  const geminiKey = envObj.GEMINI_API_KEY || envObj.NEXT_PUBLIC_GEMINI_API_KEY || '';
  if (geminiKey) {
    envObj.GEMINI_API_KEY = geminiKey;
    envObj.NEXT_PUBLIC_GEMINI_API_KEY = geminiKey;
  }

  if (!envObj.NEXT_PUBLIC_APP_URL) {
    envObj.NEXT_PUBLIC_APP_URL = 'http://localhost:3000';
  }
  if (!envObj.MONGODB_URI) {
    envObj.MONGODB_URI = 'mongodb://localhost:27017/codepath';
  }

  // Inject into process.env
  for (const [key, val] of Object.entries(envObj)) {
    process.env[key] = val;
  }

  return envObj;
}

if (require.main === module) {
  loadSingleEnv();
  console.log('✅ Loaded single root .env successfully.');
}

module.exports = { syncEnv: loadSingleEnv, loadSingleEnv, parseEnv };
