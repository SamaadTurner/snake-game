import { vi } from 'vitest';

// Mock requestAnimationFrame for tests
global.requestAnimationFrame = vi.fn((callback) => {
  return setTimeout(() => callback(Date.now()), 16);
});

global.cancelAnimationFrame = vi.fn((id) => {
  clearTimeout(id);
});

// Mock window dimensions
global.window = {
  ...global.window,
  innerWidth: 1920,
  innerHeight: 1080
};

// Setup DOM helpers
beforeEach(() => {
  // Clear all mocks before each test
  vi.clearAllMocks();
});

afterEach(() => {
  // Cleanup
  vi.restoreAllMocks();
});
