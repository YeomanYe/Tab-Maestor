import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchBox from '@/components/SearchBox/SearchBox';
import { tabStore } from '@/stores/TabStore';

describe('SearchBox Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    tabStore.searchQuery = '';
    tabStore.tabs = [
      {
        id: 'tab-1',
        title: 'Google Search',
        url: 'https://google.com',
        favicon: '',
        savedAt: Date.now(),
      },
      {
        id: 'tab-2',
        title: 'GitHub Repo',
        url: 'https://github.com',
        favicon: '',
        savedAt: Date.now(),
      },
    ];
  });

  describe('normal: rendering', () => {
    it('normal: should render search input', () => {
      render(<SearchBox />);
      expect(screen.getByPlaceholderText('Search tabs...')).toBeInTheDocument();
    });

    it('normal: should render search icon', () => {
      render(<SearchBox />);
      const input = screen.getByPlaceholderText('Search tabs...');
      expect(input.previousSibling).toBeInTheDocument();
    });
  });

  describe('normal: search functionality', () => {
    it('normal: should update store searchQuery when typing', () => {
      render(<SearchBox />);
      const input = screen.getByPlaceholderText('Search tabs...');
      fireEvent.change(input, { target: { value: 'google' } });
      expect(tabStore.searchQuery).toBe('google');
    });

    it('normal: should show clear button when searchQuery is not empty', () => {
      tabStore.searchQuery = 'test';
      render(<SearchBox />);
      expect(screen.getByRole('button', { name: /clear search/i })).toBeInTheDocument();
    });

    it('normal: should hide clear button when searchQuery is empty', () => {
      render(<SearchBox />);
      expect(screen.queryByRole('button', { name: /clear search/i })).not.toBeInTheDocument();
    });

    it('normal: should clear searchQuery when clear button is clicked', () => {
      tabStore.searchQuery = 'test';
      render(<SearchBox />);
      const clearButton = screen.getByRole('button', { name: /clear search/i });
      fireEvent.click(clearButton);
      expect(tabStore.searchQuery).toBe('');
    });
  });

  describe('edge: placeholder text', () => {
    it('edge: should display search placeholder', () => {
      render(<SearchBox />);
      expect(screen.getByPlaceholderText('Search tabs...')).toBeInTheDocument();
    });
  });
});
