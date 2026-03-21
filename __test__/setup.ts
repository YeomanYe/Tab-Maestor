/// <reference types="vitest/globals" />
import '@testing-library/jest-dom';

// Mock chrome API for testing
Object.defineProperty(window, 'chrome', {
  value: {
    storage: {
      local: {
        get: vi.fn().mockResolvedValue({}),
        set: vi.fn().mockResolvedValue(undefined),
      },
    },
    tabs: {
      query: vi.fn().mockResolvedValue([]),
      create: vi.fn().mockResolvedValue({}),
    },
  },
  writable: true,
});
