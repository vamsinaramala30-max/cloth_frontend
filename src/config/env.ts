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
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.trim();
  }
  
  // Check if we are in production environment (server or client side)
  const isProd = 
    process.env.NEXT_PUBLIC_NODE_ENV === 'production' || 
    process.env.NODE_ENV === 'production' || 
    (typeof window !== 'undefined' && 
     window.location.hostname !== 'localhost' && 
     window.location.hostname !== '127.0.0.1');

  return isProd 
    ? 'https://cloth-backend-xxvt.onrender.com/api' 
    : 'http://localhost:5001/api';
}

function getEnvironment(): 'development' | 'production' | 'test' {
  if (typeof process === 'undefined') return 'production';
  const env = process.env.NEXT_PUBLIC_NODE_ENV || process.env.NODE_ENV || 'development';
  if (env === 'production' || env === 'test') return env;
  
  // If window is defined and we're not on localhost, treat as production
  if (typeof window !== 'undefined' && 
      window.location.hostname !== 'localhost' && 
      window.location.hostname !== '127.0.0.1') {
    return 'production';
  }
  
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
