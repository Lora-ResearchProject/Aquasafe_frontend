import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  return {
    plugins: [react()], // Enable React support
    envDir: './', // Directory for .env files
    envPrefix: 'VITE_', // Prefix for exposed env variables
    define: {
      'import.meta.env.MODE': JSON.stringify(mode), // Expose mode to app
    },
    build: {
      sourcemap: mode === 'production' ? false : true, // Sourcemaps off in prod
      outDir: 'dist', // Output directory
      assetsDir: 'assets', // Assets subdirectory
    },
    server: {
      port: 9000, // Dev server port
      open: true, // Auto-open browser
    },
  };
});
