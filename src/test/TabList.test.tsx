import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import TabList from '@/components/TabList/TabList';

// Use vi.hoisted to create mock that is available at mock time
const { mockStore } = vi.hoisted(() => ({
  mockStore: {
    tabs: [] as any[],
    isLoading: false,
    toast: null as { message: string; type: 'success' | 'error' } | null,
    isEmpty: true,
    // Mock methods
    loadTabs: vi.fn().mockResolvedValue(undefined),
    saveCurrentTab: vi.fn().mockResolvedValue(undefined),
    saveAllTabs: vi.fn().mockResolvedValue(undefined),
    openTab: vi.fn().mockResolvedValue(undefined),
    deleteTab: vi.fn().mockResolvedValue(undefined),
    clearAll: vi.fn().mockResolvedValue(undefined),
    showToast: vi.fn(),
  },
}));

// Mock the TabStore module
vi.mock('@/stores/TabStore', () => {
  return {
    tabStore: mockStore,
  };
});

describe('TabList Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset store to default state
    mockStore.tabs = [];
    mockStore.isLoading = false;
    mockStore.toast = null;
    mockStore.isEmpty = true;
  });

  describe('normal: loading state', () => {
    it('normal: should render loading spinner when isLoading is true', () => {
      mockStore.isLoading = true;
      render(<TabList />);
      // Use CSS module class selector - the class will be hashed
      const spinner = document.querySelector('[class*="spinner"]');
      expect(spinner).toBeInTheDocument();
    });

    it('normal: should match snapshot when loading', () => {
      mockStore.isLoading = true;
      const { container } = render(<TabList />);
      expect(container).toMatchSnapshot();
    });
  });

  describe('normal: empty state', () => {
    it('normal: should render EmptyState when isEmpty is true', () => {
      mockStore.isLoading = false;
      mockStore.tabs = [];
      mockStore.isEmpty = true;
      render(<TabList />);
      expect(screen.getByText('No saved tabs')).toBeInTheDocument();
    });

    it('normal: should match snapshot when empty', () => {
      mockStore.isLoading = false;
      mockStore.tabs = [];
      mockStore.isEmpty = true;
      const { container } = render(<TabList />);
      expect(container).toMatchSnapshot();
    });
  });

  describe('normal: tabs exist', () => {
    it('normal: should render TabCards when tabs exist', () => {
      mockStore.tabs = [
        { id: '1', title: 'Tab 1', url: 'https://example.com', favicon: '', savedAt: Date.now() },
        { id: '2', title: 'Tab 2', url: 'https://example2.com', favicon: '', savedAt: Date.now() },
      ];
      mockStore.isLoading = false;
      mockStore.isEmpty = false;
      render(<TabList />);
      expect(screen.getByText('Tab 1')).toBeInTheDocument();
      expect(screen.getByText('Tab 2')).toBeInTheDocument();
    });

    it('normal: should match snapshot when tabs exist', () => {
      mockStore.tabs = [
        { id: '1', title: 'Tab 1', url: 'https://example.com', favicon: '', savedAt: Date.now() },
      ];
      mockStore.isLoading = false;
      mockStore.isEmpty = false;
      const { container } = render(<TabList />);
      expect(container).toMatchSnapshot();
    });
  });

  describe('edge: single tab', () => {
    it('edge: should render single TabCard correctly', () => {
      mockStore.tabs = [
        { id: '1', title: 'Single Tab', url: 'https://single.com', favicon: '', savedAt: Date.now() },
      ];
      mockStore.isLoading = false;
      mockStore.isEmpty = false;
      render(<TabList />);
      expect(screen.getByText('Single Tab')).toBeInTheDocument();
    });

    it('edge: should match snapshot with single tab', () => {
      mockStore.tabs = [
        { id: '1', title: 'Single Tab', url: 'https://single.com', favicon: '', savedAt: Date.now() },
      ];
      mockStore.isLoading = false;
      mockStore.isEmpty = false;
      const { container } = render(<TabList />);
      expect(container).toMatchSnapshot();
    });
  });

  describe('edge: multiple tabs', () => {
    it('edge: should render multiple TabCards correctly', () => {
      mockStore.tabs = [
        { id: '1', title: 'Tab 1', url: 'https://example1.com', favicon: '', savedAt: Date.now() },
        { id: '2', title: 'Tab 2', url: 'https://example2.com', favicon: '', savedAt: Date.now() },
        { id: '3', title: 'Tab 3', url: 'https://example3.com', favicon: '', savedAt: Date.now() },
      ];
      mockStore.isLoading = false;
      mockStore.isEmpty = false;
      render(<TabList />);
      expect(screen.getByText('Tab 1')).toBeInTheDocument();
      expect(screen.getByText('Tab 2')).toBeInTheDocument();
      expect(screen.getByText('Tab 3')).toBeInTheDocument();
    });

    it('edge: should match snapshot with multiple tabs', () => {
      mockStore.tabs = [
        { id: '1', title: 'Tab 1', url: 'https://example1.com', favicon: '', savedAt: Date.now() },
        { id: '2', title: 'Tab 2', url: 'https://example2.com', favicon: '', savedAt: Date.now() },
        { id: '3', title: 'Tab 3', url: 'https://example3.com', favicon: '', savedAt: Date.now() },
      ];
      mockStore.isLoading = false;
      mockStore.isEmpty = false;
      const { container } = render(<TabList />);
      expect(container).toMatchSnapshot();
    });
  });

  describe('edge: loading takes precedence over empty', () => {
    it('edge: should show loading spinner when both isLoading and isEmpty are true', () => {
      mockStore.isLoading = true;
      mockStore.tabs = [];
      mockStore.isEmpty = true;
      render(<TabList />);
      const spinner = document.querySelector('[class*="spinner"]');
      expect(spinner).toBeInTheDocument();
      expect(screen.queryByText('No saved tabs')).not.toBeInTheDocument();
    });
  });

  describe('abnormal: isEmpty false but no tabs', () => {
    it('abnormal: should handle isEmpty false with empty tabs array', () => {
      mockStore.isLoading = false;
      mockStore.tabs = [];
      mockStore.isEmpty = false; // Explicitly set to false even with empty tabs
      render(<TabList />);
      // This edge case tests the component's behavior when isEmpty is manually set to false
      // The component will try to map over an empty array, resulting in empty list
      const listContainer = document.querySelector('[class*="list"]');
      expect(listContainer).toBeInTheDocument();
    });
  });
});
