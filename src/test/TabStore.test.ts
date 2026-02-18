import { describe, it, expect, beforeEach } from 'vitest';
import { tabStore } from '@/stores/TabStore';

describe('TabStore', () => {
  beforeEach(() => {
    // Reset store state
    tabStore.tabs = [];
    tabStore.toast = null;
  });

  describe('initial state', () => {
    it('should have empty tabs array initially', () => {
      expect(tabStore.tabs).toEqual([]);
    });

    it('should not be loading initially', () => {
      expect(tabStore.isLoading).toBe(false);
    });

    it('should have no toast initially', () => {
      expect(tabStore.toast).toBeNull();
    });
  });

  describe('tabCount', () => {
    it('should return 0 when no tabs', () => {
      expect(tabStore.tabCount).toBe(0);
    });
  });

  describe('isEmpty', () => {
    it('should return true when no tabs', () => {
      expect(tabStore.isEmpty).toBe(true);
    });
  });

  describe('showToast', () => {
    it('should show success toast', () => {
      tabStore.showToast('Test message', 'success');
      expect(tabStore.toast).toEqual({
        message: 'Test message',
        type: 'success',
      });
    });

    it('should show error toast', () => {
      tabStore.showToast('Error message', 'error');
      expect(tabStore.toast).toEqual({
        message: 'Error message',
        type: 'error',
      });
    });

    it('should auto-dismiss toast after 3 seconds', async () => {
      tabStore.showToast('Test message', 'success');
      expect(tabStore.toast).not.toBeNull();

      await new Promise((resolve) => setTimeout(resolve, 3100));
      expect(tabStore.toast).toBeNull();
    });
  });

  describe('deleteTab', () => {
    it('should remove tab from tabs array', async () => {
      tabStore.tabs = [
        {
          id: 'test-id',
          title: 'Test Tab',
          url: 'https://example.com',
          favicon: '',
          savedAt: Date.now(),
        },
      ];

      await tabStore.deleteTab('test-id');
      expect(tabStore.tabs).toEqual([]);
    });

    it('should not modify array if tab not found', async () => {
      tabStore.tabs = [
        {
          id: 'test-id',
          title: 'Test Tab',
          url: 'https://example.com',
          favicon: '',
          savedAt: Date.now(),
        },
      ];

      await tabStore.deleteTab('non-existent-id');
      expect(tabStore.tabs.length).toBe(1);
    });
  });

  describe('clearAll', () => {
    it('should remove all tabs', async () => {
      tabStore.tabs = [
        {
          id: 'test-id-1',
          title: 'Test Tab 1',
          url: 'https://example.com',
          favicon: '',
          savedAt: Date.now(),
        },
        {
          id: 'test-id-2',
          title: 'Test Tab 2',
          url: 'https://example2.com',
          favicon: '',
          savedAt: Date.now(),
        },
      ];

      await tabStore.clearAll();
      expect(tabStore.tabs).toEqual([]);
      expect(tabStore.tabCount).toBe(0);
    });
  });
});
