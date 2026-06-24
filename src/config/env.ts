/**
 * Frontend Environment Configuration
 * Centralized configuration module for frontend environment variables
 * Matches backend pattern for consistency across the application
 */

interface FrontendConfig {
  apiUrl: string;
  environment: 'development' | 'production' | 'test';
  isDevelopment: boolean;
  isProduction: boolean;
  appName: string;
}

function getApiUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL?.trim() || 'http://localhost:5001/api';
}

function getEnvironment(): 'development' | 'production' | 'test' {
  if (typeof process === 'undefined') return 'production';
  const env = process.env.NEXT_PUBLIC_NODE_ENV || process.env.NODE_ENV || 'development';
  if (env === 'production' || env === 'test') return env;
  return 'development';
}

const environment = getEnvironment();
const apiUrl = getApiUrl();

export const config: FrontendConfig = {
  apiUrl: apiUrl.trim(),
  environment,
  isDevelopment: environment === 'development',
  isProduction: environment === 'production',
  appName: 'Rare Rabbit',
};

// Validate on load
if (!config.apiUrl) {
  console.error('[FRONTEND CONFIG] Missing NEXT_PUBLIC_API_URL environment variable');
  console.warn('[FRONTEND CONFIG] Defaulting to http://localhost:5001/api');
}

console.debug('[FRONTEND CONFIG]', {
  apiUrl: config.apiUrl,
  environment: config.environment,
  appName: config.appName,
});

export default config;
