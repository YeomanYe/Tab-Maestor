import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Toast from '@/components/Toast/Toast';

// Use vi.hoisted to create mock that is available at mock time
const { mockStore } = vi.hoisted(() => ({
  mockStore: {
    toast: null as { message: string; type: 'success' | 'error' } | null,
  },
}));

// Mock the TabStore module
vi.mock('@/stores/TabStore', () => {
  return {
    tabStore: mockStore,
  };
});

// Mock the styles module
vi.mock('@/components/Toast/Toast.module.scss', () => ({
  default: {
    toast: 'toast',
    success: 'toast--success',
    error: 'toast--error',
  },
}));

describe('Toast Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset store to default state
    mockStore.toast = null;
  });

  describe('normal: no toast', () => {
    it('normal: should return null when tabStore.toast is null', () => {
      mockStore.toast = null;
      const { container } = render(<Toast />);
      expect(container.firstChild).toBeNull();
    });

    it('normal: should match snapshot when no toast', () => {
      mockStore.toast = null;
      const { container } = render(<Toast />);
      expect(container).toMatchSnapshot();
    });
  });

  describe('normal: success toast', () => {
    it('normal: should render success toast with message', () => {
      mockStore.toast = { message: 'Tab saved successfully', type: 'success' };
      render(<Toast />);
      expect(screen.getByText('Tab saved successfully')).toBeInTheDocument();
    });

    it('normal: should render checkmark icon for success toast', () => {
      mockStore.toast = { message: 'Success message', type: 'success' };
      render(<Toast />);
      // Check for the success icon - look for the polyline element in the SVG
      const polyline = document.querySelector('polyline');
      expect(polyline).toBeInTheDocument();
    });

    it('normal: should match snapshot for success toast', () => {
      mockStore.toast = { message: 'Tab saved successfully', type: 'success' };
      const { container } = render(<Toast />);
      expect(container).toMatchSnapshot();
    });
  });

  describe('normal: error toast', () => {
    it('normal: should render error toast with message', () => {
      mockStore.toast = { message: 'Failed to save tab', type: 'error' };
      render(<Toast />);
      expect(screen.getByText('Failed to save tab')).toBeInTheDocument();
    });

    it('normal: should render error icon for error toast', () => {
      mockStore.toast = { message: 'Error occurred', type: 'error' };
      render(<Toast />);
      // Check for the error icon - look for circle element in the SVG
      const circle = document.querySelector('circle');
      expect(circle).toBeInTheDocument();
    });

    it('normal: should match snapshot for error toast', () => {
      mockStore.toast = { message: 'Failed to save tab', type: 'error' };
      const { container } = render(<Toast />);
      expect(container).toMatchSnapshot();
    });
  });

  describe('edge: empty message', () => {
    it('edge: should render toast with empty message', () => {
      mockStore.toast = { message: '', type: 'success' };
      render(<Toast />);
      // For empty message, check that the span element exists
      const span = document.querySelector('span');
      expect(span).toBeInTheDocument();
      expect(span?.textContent).toBe('');
    });

    it('edge: should match snapshot with empty message', () => {
      mockStore.toast = { message: '', type: 'success' };
      const { container } = render(<Toast />);
      expect(container).toMatchSnapshot();
    });
  });

  describe('edge: long message', () => {
    it('edge: should render toast with long message', () => {
      const longMessage = 'This is a very long message that might wrap to multiple lines';
      mockStore.toast = { message: longMessage, type: 'error' };
      render(<Toast />);
      // Use queryByText with exact match for long text
      const span = document.querySelector('span');
      expect(span).toBeInTheDocument();
      expect(span?.textContent).toBe(longMessage);
    });

    it('edge: should match snapshot with long message', () => {
      const longMessage = 'This is a very long message that might wrap to multiple lines';
      mockStore.toast = { message: longMessage, type: 'error' };
      const { container } = render(<Toast />);
      expect(container).toMatchSnapshot();
    });
  });

  describe('edge: special characters in message', () => {
    it('edge: should render toast with special characters', () => {
      mockStore.toast = { message: 'Error: <script>alert("xss")</script>', type: 'error' };
      render(<Toast />);
      // Use query selector for special characters
      const span = document.querySelector('span');
      expect(span).toBeInTheDocument();
      expect(span?.textContent).toBe('Error: <script>alert("xss")</script>');
    });

    it('edge: should match snapshot with special characters', () => {
      mockStore.toast = { message: 'Error: <script>alert("xss")</script>', type: 'error' };
      const { container } = render(<Toast />);
      expect(container).toMatchSnapshot();
    });
  });
});
