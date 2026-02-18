import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TabCard from '@/components/TabCard/TabCard';
import { SavedTab } from '@/types';
import { tabStore } from '@/stores/TabStore';

describe('TabCard Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(tabStore, 'openTab').mockResolvedValue();
    vi.spyOn(tabStore, 'deleteTab').mockResolvedValue();
  });

  describe('normal: rendering with valid tab data', () => {
    it('normal: should render tab title', () => {
      const mockTab: SavedTab = {
        id: 'test-id',
        title: 'Test Tab Title',
        url: 'https://example.com',
        favicon: '',
        savedAt: Date.now(),
      };

      render(<TabCard tab={mockTab} />);
      expect(screen.getByText('Test Tab Title')).toBeInTheDocument();
    });

    it('normal: should render domain from URL', () => {
      const mockTab: SavedTab = {
        id: 'test-id',
        title: 'Test Tab',
        url: 'https://example.com/page',
        favicon: '',
        savedAt: Date.now(),
      };

      render(<TabCard tab={mockTab} />);
      expect(screen.getByText('example.com')).toBeInTheDocument();
    });

    it('normal: should render with custom favicon', () => {
      const mockTab: SavedTab = {
        id: 'test-id',
        title: 'Test Tab',
        url: 'https://example.com',
        favicon: 'https://example.com/favicon.ico',
        savedAt: Date.now(),
      };

      render(<TabCard tab={mockTab} />);
      const faviconImg = screen.getByAltText('');
      expect(faviconImg).toHaveAttribute('src', 'https://example.com/favicon.ico');
    });

    it('normal: should render open button with correct title', () => {
      const mockTab: SavedTab = {
        id: 'test-id',
        title: 'Test Tab',
        url: 'https://example.com',
        favicon: '',
        savedAt: Date.now(),
      };

      render(<TabCard tab={mockTab} />);
      const openButton = screen.getByRole('button', { name: /open tab/i });
      expect(openButton).toBeInTheDocument();
    });

    it('normal: should render delete button with correct title', () => {
      const mockTab: SavedTab = {
        id: 'test-id',
        title: 'Test Tab',
        url: 'https://example.com',
        favicon: '',
        savedAt: Date.now(),
      };

      render(<TabCard tab={mockTab} />);
      const deleteButton = screen.getByRole('button', { name: /delete tab/i });
      expect(deleteButton).toBeInTheDocument();
    });

    it('normal: should call openTab when content is clicked', async () => {
      const mockTab: SavedTab = {
        id: 'test-id-123',
        title: 'Test Tab',
        url: 'https://example.com',
        favicon: '',
        savedAt: Date.now(),
      };

      render(<TabCard tab={mockTab} />);
      const content = screen.getByText('Test Tab').parentElement;
      fireEvent.click(content!);

      expect(tabStore.openTab).toHaveBeenCalledWith('test-id-123');
    });

    it('normal: should call openTab when open button is clicked', async () => {
      const mockTab: SavedTab = {
        id: 'test-id-456',
        title: 'Test Tab',
        url: 'https://example.com',
        favicon: '',
        savedAt: Date.now(),
      };

      render(<TabCard tab={mockTab} />);
      const openButton = screen.getByRole('button', { name: /open tab/i });
      fireEvent.click(openButton);

      expect(tabStore.openTab).toHaveBeenCalledWith('test-id-456');
    });

    it('normal: should call deleteTab when delete button is clicked', async () => {
      const mockTab: SavedTab = {
        id: 'test-id-789',
        title: 'Test Tab',
        url: 'https://example.com',
        favicon: '',
        savedAt: Date.now(),
      };

      render(<TabCard tab={mockTab} />);
      const deleteButton = screen.getByRole('button', { name: /delete tab/i });
      fireEvent.click(deleteButton);

      expect(tabStore.deleteTab).toHaveBeenCalledWith('test-id-789');
    });

    it('normal: should match snapshot with complete tab data', () => {
      const mockTab: SavedTab = {
        id: 'test-id',
        title: 'Test Tab Title',
        url: 'https://example.com',
        favicon: '',
        savedAt: Date.now(),
      };

      const { container } = render(<TabCard tab={mockTab} />);
      expect(container).toMatchSnapshot();
    });
  });

  describe('edge: time formatting', () => {
    it('edge: should display "Just now" for timestamps less than 1 minute ago', () => {
      const mockTab: SavedTab = {
        id: 'test-id',
        title: 'Test Tab',
        url: 'https://example.com',
        favicon: '',
        savedAt: Date.now() - 30000, // 30 seconds ago
      };

      render(<TabCard tab={mockTab} />);
      expect(screen.getByText('Just now')).toBeInTheDocument();
    });

    it('edge: should display minutes ago for timestamps between 1-59 minutes', () => {
      const mockTab: SavedTab = {
        id: 'test-id',
        title: 'Test Tab',
        url: 'https://example.com',
        favicon: '',
        savedAt: Date.now() - 5 * 60000, // 5 minutes ago
      };

      render(<TabCard tab={mockTab} />);
      expect(screen.getByText('5m ago')).toBeInTheDocument();
    });

    it('edge: should display hours ago for timestamps between 1-23 hours', () => {
      const mockTab: SavedTab = {
        id: 'test-id',
        title: 'Test Tab',
        url: 'https://example.com',
        favicon: '',
        savedAt: Date.now() - 3 * 3600000, // 3 hours ago
      };

      render(<TabCard tab={mockTab} />);
      expect(screen.getByText('3h ago')).toBeInTheDocument();
    });

    it('edge: should display days ago for timestamps between 1-6 days', () => {
      const mockTab: SavedTab = {
        id: 'test-id',
        title: 'Test Tab',
        url: 'https://example.com',
        favicon: '',
        savedAt: Date.now() - 2 * 86400000, // 2 days ago
      };

      render(<TabCard tab={mockTab} />);
      expect(screen.getByText('2d ago')).toBeInTheDocument();
    });

    it('edge: should display date for timestamps 7+ days old', () => {
      const mockTab: SavedTab = {
        id: 'test-id',
        title: 'Test Tab',
        url: 'https://example.com',
        favicon: '',
        savedAt: Date.now() - 10 * 86400000, // 10 days ago
      };

      const { container } = render(<TabCard tab={mockTab} />);
      // Find the time element using its class
      const timeElement = container.querySelector('span[class*="time"]');
      expect(timeElement).toBeInTheDocument();
      const timeText = timeElement?.textContent || '';
      // Should NOT be relative time (minutes/hours/days ago)
      expect(timeText).not.toMatch(/^\d+[mhd] ago$/);
      // Should contain a date separator
      expect(timeText).toMatch(/\//);
    });
  });

  describe('edge: URL handling', () => {
    it('edge: should handle URL with www prefix', () => {
      const mockTab: SavedTab = {
        id: 'test-id',
        title: 'Test Tab',
        url: 'https://www.example.com/page',
        favicon: '',
        savedAt: Date.now(),
      };

      render(<TabCard tab={mockTab} />);
      expect(screen.getByText('www.example.com')).toBeInTheDocument();
    });

    it('edge: should handle URL with subdomains', () => {
      const mockTab: SavedTab = {
        id: 'test-id',
        title: 'Test Tab',
        url: 'https://sub.domain.example.com/page',
        favicon: '',
        savedAt: Date.now(),
      };

      render(<TabCard tab={mockTab} />);
      expect(screen.getByText('sub.domain.example.com')).toBeInTheDocument();
    });

    it('edge: should handle invalid URL gracefully', () => {
      const mockTab: SavedTab = {
        id: 'test-id',
        title: 'Test Tab',
        url: 'not-a-valid-url',
        favicon: '',
        savedAt: Date.now(),
      };

      render(<TabCard tab={mockTab} />);
      expect(screen.getByText('not-a-valid-url')).toBeInTheDocument();
    });
  });

  describe('edge: favicon handling', () => {
    it('edge: should use default favicon when favicon is empty', () => {
      const mockTab: SavedTab = {
        id: 'test-id',
        title: 'Test Tab',
        url: 'https://example.com',
        favicon: '',
        savedAt: Date.now(),
      };

      render(<TabCard tab={mockTab} />);
      const faviconImg = screen.getByAltText('');
      expect(faviconImg.getAttribute('src')).toContain('data:image/svg+xml');
    });

    it('edge: should fallback to default favicon on image error', () => {
      const mockTab: SavedTab = {
        id: 'test-id',
        title: 'Test Tab',
        url: 'https://example.com',
        favicon: 'https://invalid-favicon-url.ico',
        savedAt: Date.now(),
      };

      render(<TabCard tab={mockTab} />);
      const faviconImg = screen.getByAltText('');
      // Simulate error event
      fireEvent.error(faviconImg);
      expect(faviconImg.getAttribute('src')).toContain('data:image/svg+xml');
    });
  });
});
