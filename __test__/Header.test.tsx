import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@/contexts/ThemeContext';
import Header from '@/components/Header/Header';

// Helper to render with ThemeProvider
const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

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

describe('Header Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset store to default state
    mockStore.tabs = [];
    mockStore.isLoading = false;
    mockStore.toast = null;
    mockStore.tabCount = 0;
    mockStore.isEmpty = true;
  });

  describe('normal: rendering with tabs', () => {
    it('normal: should render header with title "Tab Maestro"', () => {
      renderWithTheme(<Header />);
      expect(screen.getByText('Tab Maestro')).toBeInTheDocument();
    });

    it('normal: should render Save Current button', () => {
      renderWithTheme(<Header />);
      expect(screen.getByText('Save Current')).toBeInTheDocument();
    });

    it('normal: should render Save All button', () => {
      renderWithTheme(<Header />);
      expect(screen.getByText('Save All')).toBeInTheDocument();
    });

    it('normal: should render badge with tab count when tabs exist', () => {
      mockStore.tabCount = 5;
      const { container } = renderWithTheme(<Header />);
      const badge = container.querySelector('[class*="badge"]');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveTextContent('5');
    });

    it('normal: should render Clear All button when tabs exist', () => {
      mockStore.tabCount = 1;
      mockStore.isEmpty = false;
      renderWithTheme(<Header />);
      expect(screen.getByText('Clear All')).toBeInTheDocument();
    });

    it('normal: should match snapshot with tabs', () => {
      mockStore.tabCount = 3;
      mockStore.isEmpty = false;
      const { container } = renderWithTheme(<Header />);
      expect(container).toMatchSnapshot();
    });
  });

  describe('edge: empty state', () => {
    it('edge: should not render badge when tab count is 0', () => {
      mockStore.tabCount = 0;
      const { container } = renderWithTheme(<Header />);
      const badge = container.querySelector('[class*="badge"]');
      expect(badge).not.toBeInTheDocument();
    });

    it('edge: should not render Clear All button when no tabs', () => {
      mockStore.tabCount = 0;
      mockStore.isEmpty = true;
      renderWithTheme(<Header />);
      expect(screen.queryByText('Clear All')).not.toBeInTheDocument();
    });

    it('edge: should match snapshot without tabs', () => {
      mockStore.tabCount = 0;
      mockStore.isEmpty = true;
      const { container } = renderWithTheme(<Header />);
      expect(container).toMatchSnapshot();
    });
  });

  describe('abnormal: loading state', () => {
    it('abnormal: should disable buttons when loading', () => {
      mockStore.isLoading = true;
      mockStore.tabCount = 1;
      mockStore.isEmpty = false;
      renderWithTheme(<Header />);

      const saveCurrentBtn = screen.getByText('Save Current');
      const saveAllBtn = screen.getByText('Save All');

      expect(saveCurrentBtn).toBeDisabled();
      expect(saveAllBtn).toBeDisabled();
    });

    it('abnormal: should match snapshot when loading', () => {
      mockStore.isLoading = true;
      mockStore.tabCount = 2;
      mockStore.isEmpty = false;
      const { container } = renderWithTheme(<Header />);
      expect(container).toMatchSnapshot();
    });
  });

  describe('snapshot tests', () => {
    it('should match snapshot with multiple tabs', () => {
      mockStore.tabCount = 10;
      mockStore.isEmpty = false;
      const { container } = renderWithTheme(<Header />);
      expect(container).toMatchSnapshot();
    });
  });
});
