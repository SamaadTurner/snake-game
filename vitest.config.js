import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup.js',
    // the e2e specs are Playwright tests, so vitest should not try to run them
    exclude: ['node_modules/**', 'tests/e2e/**'],
    testTimeout: 10000,
    hookTimeout: 10000
  }
});
