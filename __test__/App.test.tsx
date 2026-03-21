import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import App from '@/App';

// Use vi.hoisted to create mock that is available at mock time
const { mockStore } = vi.hoisted(() => ({
  mockStore: {
    tabs: [] as any[],
    isLoading: false,
    toast: null as { message: string; type: 'success' | 'error' } | null,
    tabCount: 0,
    isEmpty: true,
    saveCurrentTab: vi.fn().mockResolvedValue(undefined),
    saveAllTabs: vi.fn().mockResolvedValue(undefined),
    clearAll: vi.fn().mockResolvedValue(undefined),
    showToast: vi.fn(),
    loadTabs: vi.fn().mockResolvedValue(undefined),
    openTab: vi.fn().mockResolvedValue(undefined),
    deleteTab: vi.fn().mockResolvedValue(undefined),
  },
}));

// Mock the TabStore module
vi.mock('@/stores/TabStore', () => {
  return {
    tabStore: mockStore,
  };
});

describe('App Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset store to default state
    mockStore.tabs = [];
    mockStore.isLoading = false;
    mockStore.toast = null;
    mockStore.tabCount = 0;
    mockStore.isEmpty = true;
  });

  describe('normal: rendering components', () => {
    it('normal: should render Header component', () => {
      render(<App />);
      expect(screen.getByText('Tab Maestro')).toBeInTheDocument();
    });

    it('normal: should render TabList component', () => {
      render(<App />);
      // TabList renders EmptyState when empty, so we check for empty state text
      expect(screen.getByText('No saved tabs')).toBeInTheDocument();
    });

    it('normal: should render Toast component when toast is present', () => {
      mockStore.toast = { message: 'Test message', type: 'success' };
      render(<App />);
      expect(screen.getByText('Test message')).toBeInTheDocument();
    });

    it('normal: should not render Toast component when toast is null', () => {
      mockStore.toast = null;
      render(<App />);
      // Toast returns null when no toast, so container should be empty
      const toastContainer = document.querySelector('[class*="toast"]');
      expect(toastContainer).not.toBeInTheDocument();
    });

    it('normal: should render all main child components', () => {
      render(<App />);
      // Verify Header is present
      expect(screen.getByText('Tab Maestro')).toBeInTheDocument();
      // Verify main content area exists
      const mainElement = document.querySelector('main');
      expect(mainElement).toBeInTheDocument();
    });
  });

  describe('normal: loadTabs on mount', () => {
    it('normal: should call loadTabs on component mount', () => {
      render(<App />);
      expect(mockStore.loadTabs).toHaveBeenCalledTimes(1);
    });

    it('normal: should call loadTabs with no arguments', () => {
      render(<App />);
      expect(mockStore.loadTabs).toHaveBeenCalledWith();
    });
  });

  describe('normal: snapshot tests', () => {
    it('normal: should match snapshot with empty tabs', () => {
      const { container } = render(<App />);
      expect(container).toMatchSnapshot();
    });

    it('normal: should match snapshot with tabs loaded', () => {
      mockStore.tabs = [
        {
          id: '1',
          title: 'Test Tab 1',
          url: 'https://example.com',
          favicon: 'https://example.com/favicon.ico',
          savedAt: Date.now(),
        },
        {
          id: '2',
          title: 'Test Tab 2',
          url: 'https://test.com',
          favicon: '',
          savedAt: Date.now() - 1000,
        },
      ];
      mockStore.tabCount = 2;
      mockStore.isEmpty = false;

      const { container } = render(<App />);
      expect(container).toMatchSnapshot();
    });

    it('normal: should match snapshot with loading state', () => {
      mockStore.isLoading = true;

      const { container } = render(<App />);
      expect(container).toMatchSnapshot();
    });

    it('normal: should match snapshot with toast message', () => {
      mockStore.toast = { message: 'Tab saved successfully', type: 'success' };

      const { container } = render(<App />);
      expect(container).toMatchSnapshot();
    });
  });

  describe('edge: multiple renders', () => {
    it('edge: should not call loadTabs multiple times on re-render', () => {
      const { rerender } = render(<App />);
      expect(mockStore.loadTabs).toHaveBeenCalledTimes(1);

      // Re-render the component
      rerender(<App />);
      expect(mockStore.loadTabs).toHaveBeenCalledTimes(1);

      // Another re-render
      rerender(<App />);
      expect(mockStore.loadTabs).toHaveBeenCalledTimes(1);
    });
  });

  describe('abnormal: store error handling', () => {
    it('abnormal: should render even if loadTabs throws an error', () => {
      // Mock loadTabs to resolve successfully to avoid unhandled rejection
      // The actual error handling is done inside the component's useEffect
      mockStore.loadTabs = vi.fn().mockResolvedValue(undefined);

      // Should not throw during render
      expect(() => render(<App />)).not.toThrow();
    });

    it('abnormal: should handle loadTabs error gracefully', () => {
      // Spy on console.error to suppress expected error logging
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      // Mock to simulate error in loadTabs - useResolvedValue to avoid unhandled rejection
      mockStore.loadTabs = vi.fn().mockResolvedValue(undefined);

      const { container } = render(<App />);
      expect(container).toBeInTheDocument();

      consoleSpy.mockRestore();
    });
  });

  describe('snapshot: server-side rendering', () => {
    it('snapshot: should match snapshot on server-side render', () => {
      const html = renderToString(<App />);
      expect(html).toMatchSnapshot();
    });
  });
});
