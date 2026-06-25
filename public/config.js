/**
 * Plasma Atelier GLOBAL FRONTEND ENVIRONMENT CONFIGURATION
 * Decoupled client-side runtime values.
 */
const ENV = {
    // Localhost runtime base architecture endpoint
    API_BASE_URL: 'http://localhost:5001/api',
    
    // Explicit route tree endpoints 
    PRODUCTS_ENDPOINT: 'http://localhost:5001/api/products',
    AUTH_ENDPOINT: 'http://localhost:5001/api/auth',
    PAYMENTS_ENDPOINT: 'http://localhost:5001/api/payments',

    
    // UI Metadata Configuration
    APP_VERSION: '5.0.0-Royal',
    DEBUG_MODE: true
};

// Freeze the object completely to prevent runtime mutations by client scripts
Object.freeze(ENV);