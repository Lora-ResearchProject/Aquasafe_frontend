const config = {
  backendIp: import.meta.env.VITE_BACKEND_IP || 'localhost', // Fallback IP
  backendPort: import.meta.env.VITE_BACKEND_PORT || '3001', // Fallback port
  baseUrl:
    import.meta.env.VITE_BASE_URL ||
    `http://${import.meta.env.VITE_BACKEND_IP}:${import.meta.env.VITE_BACKEND_PORT}`, // Fallback URL
  mode: import.meta.env.MODE || 'development', // Current mode
};

// Validation: Ensure baseUrl is set
if (!config.baseUrl) {
  throw new Error(
    'Base URL could not be determined. Please check your .env files.'
  );
}

// Debug logging in non-production modes
if (config.mode !== 'production') {
  console.log('Loaded Configuration:', config);
}

export default config;
