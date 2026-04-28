/// <reference types="vitest/globals" />
import '@testing-library/jest-dom';

// Mock webextension-polyfill browser API for testing
const mockBrowser = {
  storage: {
    local: {
      get: vi.fn().mockResolvedValue({}),
      set: vi.fn().mockResolvedValue(undefined),
    },
    sync: {
      get: vi.fn().mockResolvedValue({}),
      set: vi.fn().mockResolvedValue(undefined),
    },
  },
  tabs: {
    query: vi.fn().mockResolvedValue([]),
    create: vi.fn().mockResolvedValue({}),
    remove: vi.fn().mockResolvedValue(undefined),
    get: vi.fn().mockResolvedValue({}),
    reload: vi.fn().mockResolvedValue(undefined),
    update: vi.fn().mockResolvedValue(undefined),
  },
  runtime: {
    onInstalled: { addListener: vi.fn() },
    onStartup: { addListener: vi.fn() },
    onMessage: { addListener: vi.fn() },
    sendMessage: vi.fn().mockResolvedValue(undefined),
    getURL: vi.fn().mockReturnValue('mock-extension-url'),
    openOptionsPage: vi.fn(),
  },
  notifications: {
    create: vi.fn().mockResolvedValue('mock-notification-id'),
  },
  alarms: {
    create: vi.fn(),
    onAlarm: { addListener: vi.fn() },
  },
  contextMenus: {
    removeAll: vi.fn().mockResolvedValue(undefined),
    create: vi.fn().mockReturnValue('mock-menu-id'),
    onClicked: { addListener: vi.fn() },
  },
  commands: {
    onCommand: { addListener: vi.fn() },
  },
  windows: {
    update: vi.fn().mockResolvedValue({}),
  },
};

// Set up browser API mock
Object.defineProperty(window, 'browser', {
  value: mockBrowser,
  writable: true,
});

// Also set up chrome for backwards compatibility
Object.defineProperty(window, 'chrome', {
  value: mockBrowser,
  writable: true,
});
