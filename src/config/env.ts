/**
 * Frontend Environment Configuration
 * Centralized configuration module for frontend environment variables
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
  appName: 'Plasma Atelier',
};

export default config;
