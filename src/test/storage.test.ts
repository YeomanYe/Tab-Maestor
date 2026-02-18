import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as storage from '@/utils/storage';

describe('Storage Utilities', () => {
  // Store reference to chrome API mock
  let chromeStorageGet: ReturnType<typeof vi.fn>;
  let chromeStorageSet: ReturnType<typeof vi.fn>;
  let chromeTabsQuery: ReturnType<typeof vi.fn>;
  let chromeTabsCreate: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();

    // Get references to the mocked chrome functions
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    chromeStorageGet = window.chrome!.storage!.local!.get as ReturnType<typeof vi.fn>;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    chromeStorageSet = window.chrome!.storage!.local!.set as ReturnType<typeof vi.fn>;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    chromeTabsQuery = window.chrome!.tabs!.query as ReturnType<typeof vi.fn>;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    chromeTabsCreate = window.chrome!.tabs!.create as ReturnType<typeof vi.fn>;
  });

  describe('getStoredTabs', () => {
    it('normal: should return empty array when no data stored', async () => {
      // Mock chrome storage to return empty (simulating no data)
      chromeStorageGet.mockResolvedValue({});

      const tabs = await storage.getStoredTabs();
      expect(tabs).toEqual([]);
    });

    it('normal: should return stored tabs from chrome storage', async () => {
      const mockTabs = [
        { id: '1', title: 'Tab 1', url: 'https://example.com', favicon: '', savedAt: Date.now() },
      ];
      // Mock chrome storage to return the stored tabs
      chromeStorageGet.mockResolvedValue({ 'tab-maestro-tabs': mockTabs });

      const tabs = await storage.getStoredTabs();
      expect(tabs).toEqual(mockTabs);
    });

    it('normal: should return stored tabs from localStorage fallback', async () => {
      const mockTabs = [
        { id: '1', title: 'Tab 1', url: 'https://example.com', favicon: '', savedAt: Date.now() },
      ];
      // Force fallback to localStorage by throwing error from chrome API
      chromeStorageGet.mockRejectedValue(new Error('Chrome API error'));

      localStorage.setItem('tab-maestro-tabs', JSON.stringify(mockTabs));

      const tabs = await storage.getStoredTabs();
      expect(tabs).toEqual(mockTabs);
    });

    it('edge: should return empty array when chrome storage returns undefined value', async () => {
      // Chrome storage returns key but value is undefined
      chromeStorageGet.mockResolvedValue({ 'tab-maestro-tabs': undefined });

      const tabs = await storage.getStoredTabs();
      expect(tabs).toEqual([]);
    });

    it('abnormal: should return empty array when localStorage contains invalid JSON', async () => {
      // Force fallback to localStorage
      chromeStorageGet.mockRejectedValue(new Error('Chrome API error'));
      localStorage.setItem('tab-maestro-tabs', 'invalid json');

      const tabs = await storage.getStoredTabs();
      expect(tabs).toEqual([]);
    });
  });

  describe('saveTabs', () => {
    it('normal: should save tabs to chrome storage', async () => {
      const mockTabs = [
        { id: '1', title: 'Tab 1', url: 'https://example.com', favicon: '', savedAt: Date.now() },
      ];

      await storage.saveTabs(mockTabs);

      expect(chromeStorageSet).toHaveBeenCalledWith({ 'tab-maestro-tabs': mockTabs });
    });

    it('normal: should save empty array to chrome storage', async () => {
      await storage.saveTabs([]);

      expect(chromeStorageSet).toHaveBeenCalledWith({ 'tab-maestro-tabs': [] });
    });

    it('normal: should save tabs to localStorage fallback when chrome API fails', async () => {
      const mockTabs = [
        { id: '1', title: 'Tab 1', url: 'https://example.com', favicon: '', savedAt: Date.now() },
      ];
      // Force fallback to localStorage
      chromeStorageSet.mockRejectedValue(new Error('Chrome API error'));

      await storage.saveTabs(mockTabs);

      const stored = localStorage.getItem('tab-maestro-tabs');
      expect(JSON.parse(stored!)).toEqual(mockTabs);
    });

    it('normal: should save empty array to localStorage fallback when chrome API fails', async () => {
      // Force fallback to localStorage
      chromeStorageSet.mockRejectedValue(new Error('Chrome API error'));

      await storage.saveTabs([]);

      const stored = localStorage.getItem('tab-maestro-tabs');
      expect(JSON.parse(stored!)).toEqual([]);
    });
  });

  describe('getCurrentTab', () => {
    it('normal: should return current tab', async () => {
      const mockTab = { id: 1, title: 'Current Tab', url: 'https://example.com', favIconUrl: '' };
      chromeTabsQuery.mockResolvedValue([mockTab]);

      const tab = await storage.getCurrentTab();

      expect(tab).toEqual(mockTab);
    });

    it('edge: should return null when chrome.tabs.query is not available', async () => {
      // Simulate chrome API not available
      chromeTabsQuery.mockRejectedValue(new Error('Chrome API not available'));

      const tab = await storage.getCurrentTab();

      expect(tab).toBeNull();
    });

    it('abnormal: should return null when no tab found', async () => {
      chromeTabsQuery.mockResolvedValue([]);

      const tab = await storage.getCurrentTab();

      expect(tab).toBeNull();
    });
  });

  describe('getAllTabs', () => {
    it('normal: should return all tabs', async () => {
      const mockTabs = [
        { id: 1, title: 'Tab 1', url: 'https://example1.com', favIconUrl: '' },
        { id: 2, title: 'Tab 2', url: 'https://example2.com', favIconUrl: '' },
      ];
      chromeTabsQuery.mockResolvedValue(mockTabs);

      const tabs = await storage.getAllTabs();

      expect(tabs).toEqual(mockTabs);
    });

    it('normal: should filter out chrome:// URLs', async () => {
      const mockTabs = [
        { id: 1, title: 'Tab 1', url: 'https://example.com', favIconUrl: '' },
        { id: 2, title: 'Chrome', url: 'chrome://extensions', favIconUrl: '' },
      ];
      chromeTabsQuery.mockResolvedValue(mockTabs);

      const tabs = await storage.getAllTabs();

      expect(tabs.length).toBe(1);
      expect(tabs[0].url).toBe('https://example.com');
    });

    it('edge: should filter out tabs with undefined or null URLs', async () => {
      const mockTabs = [
        { id: 1, title: 'Tab 1', url: 'https://example.com', favIconUrl: '' },
        { id: 2, title: 'No URL', url: undefined, favIconUrl: '' },
        { id: 3, title: 'Null URL', url: null, favIconUrl: '' },
      ];
      chromeTabsQuery.mockResolvedValue(mockTabs);

      const tabs = await storage.getAllTabs();

      expect(tabs.length).toBe(1);
      expect(tabs[0].url).toBe('https://example.com');
    });

    it('edge: should return empty array when chrome.tabs.query returns null', async () => {
      chromeTabsQuery.mockResolvedValue(null);

      const tabs = await storage.getAllTabs();

      expect(tabs).toEqual([]);
    });

    it('abnormal: should return empty array on error', async () => {
      chromeTabsQuery.mockImplementation(() => {
        throw new Error('Error');
      });

      const tabs = await storage.getAllTabs();

      expect(tabs).toEqual([]);
    });
  });

  describe('openTab', () => {
    it('normal: should create new tab via chrome API', async () => {
      chromeTabsCreate.mockResolvedValue({});

      await storage.openTab('https://example.com');

      expect(chromeTabsCreate).toHaveBeenCalledWith({
        url: 'https://example.com',
        active: true,
      });
    });

    it('edge: should use window.open fallback when chrome API is not available', async () => {
      // Force fallback to window.open
      chromeTabsCreate.mockRejectedValue(new Error('Chrome API not available'));

      const windowOpenSpy = vi.spyOn(window, 'open').mockReturnValue(null);

      await storage.openTab('https://example.com');

      expect(windowOpenSpy).toHaveBeenCalledWith('https://example.com', '_blank');

      windowOpenSpy.mockRestore();
    });
  });
});
