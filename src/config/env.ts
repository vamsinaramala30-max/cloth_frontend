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
  // Client-side detection of local hostname
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    const isLocal =
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname === '[::1]' ||
      hostname.startsWith('192.168.');
    if (isLocal) {
      return 'http://localhost:5001/api';
    }
  }

  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.trim();
  }
  
  // Check if we are in production environment (server or client side)
  const isProd = 
    process.env.NEXT_PUBLIC_NODE_ENV === 'production' || 
    process.env.NODE_ENV === 'production';

  return isProd 
    ? 'https://cloth-backend-1gft.onrender.com/api' 
    : 'http://localhost:5001/api';
}

function getEnvironment(): 'development' | 'production' | 'test' {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    const isLocal =
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname === '[::1]';
    if (!isLocal) return 'production';
  }
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
