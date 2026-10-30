const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const rootEnvPath = path.join(rootDir, '.env');
const exampleEnvPath = path.join(rootDir, '.env.example');
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
 * Format an object of key-value pairs back into .env format
 */
function formatEnv(envObj) {
  let output = '# Auto-synced from root .env\n# DO NOT EDIT DIRECTLY - edit the root .env instead\n\n';
  for (const [key, value] of Object.entries(envObj)) {
    output += `${key}=${value}\n`;
  }
  return output;
}

/**
 * Synchronize the single root .env to Frontend and Backend
 */
function syncEnv() {
  if (!fs.existsSync(rootEnvPath)) {
    if (fs.existsSync(exampleEnvPath)) {
      console.log('ℹ️  No root .env found. Automatically creating .env from .env.example...');
      fs.copyFileSync(exampleEnvPath, rootEnvPath);
    } else {
      console.warn('⚠️  Warning: Neither .env nor .env.example was found in root.');
      return {};
    }
  }

  const rootContent = fs.readFileSync(rootEnvPath, 'utf8');
  const envObj = parseEnv(rootContent);

  // Normalize Gemini API keys so both frontend and backend work seamlessly
  const geminiKey = envObj.GEMINI_API_KEY || envObj.NEXT_PUBLIC_GEMINI_API_KEY || '';
  if (geminiKey) {
    envObj.GEMINI_API_KEY = geminiKey;
    envObj.NEXT_PUBLIC_GEMINI_API_KEY = geminiKey;
  }

  // Ensure default ports and URL
  if (!envObj.NEXT_PUBLIC_APP_URL) {
    envObj.NEXT_PUBLIC_APP_URL = 'http://localhost:3000';
  }
  if (!envObj.MONGODB_URI) {
    envObj.MONGODB_URI = 'mongodb://localhost:27017/codepath';
  }

  // Inject into current process.env
  for (const [key, val] of Object.entries(envObj)) {
    if (!process.env[key]) {
      process.env[key] = val;
    }
  }

  const syncedContent = formatEnv(envObj);

  // Ensure directories exist
  const frontendDir = path.join(rootDir, 'Frontend');
  const backendDir = path.join(rootDir, 'Backend');
  if (fs.existsSync(frontendDir)) {
    fs.writeFileSync(frontendEnvPath, syncedContent, 'utf8');
  }
  if (fs.existsSync(backendDir)) {
    fs.writeFileSync(backendEnvPath, syncedContent, 'utf8');
  }

  return envObj;
}

if (require.main === module) {
  syncEnv();
  console.log('✅ Environment variables synchronized successfully.');
}

module.exports = { syncEnv, parseEnv };
