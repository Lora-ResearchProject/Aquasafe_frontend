import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom', // Simulates a browser DOM for React
    setupFiles: './src/setupTests.js', // Same setup file as before
    globals: true, // Enables global `describe`, `it`, `expect` (Jest-like)
    include: ['tests/**/*.test.{js,jsx,ts,tsx}'],
    coverage: {
      provider: 'v8', // Use V8 for coverage
      reporter: ['text', 'html', 'lcov'], // Text in terminal, HTML in browser
    },
  },
});
