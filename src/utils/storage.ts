import { SavedTab } from '@/types';
import { mockTabs } from './mockData';

const STORAGE_KEY = 'tab-maestro-tabs';

// Chrome storage API type
interface ChromeStorage {
  local: {
    get: (keys: string | string[] | Record<string, unknown>) => Promise<Record<string, unknown>>;
    set: (items: Record<string, unknown>) => Promise<void>;
  };
}

interface ChromeWithStorage {
  storage?: ChromeStorage;
}

// Check if running in Chrome extension environment
const hasChromeStorage =
  typeof window !== 'undefined' &&
  (window as Window & { chrome?: ChromeWithStorage }).chrome?.storage?.local != null;

export const getStoredTabs = async (): Promise<SavedTab[]> => {
  // Use mock data when not in Chrome extension environment
  if (!hasChromeStorage) {
    console.log('[Storage] Using mock data for testing');
    // Try to get from localStorage first
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Ignore
    }
    // Return mock data if no localStorage data
    return mockTabs;
  }

  // Try chrome.storage.local first
  try {
    const chromeStorage = (window as Window & { chrome: ChromeWithStorage }).chrome?.storage?.local;
    if (!chromeStorage) {
      throw new Error('Chrome storage not available');
    }
    const result = await chromeStorage.get(STORAGE_KEY);
    const tabs = (result?.[STORAGE_KEY] as SavedTab[]) || [];
    if (tabs.length > 0) {
      console.log('[Storage] Loaded', tabs.length, 'tabs from chrome.storage');
      return tabs;
    }
  } catch (err) {
    console.warn('[Storage] Chrome storage read failed:', err);
  }

  // Fallback to localStorage
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const tabs = stored ? JSON.parse(stored) : [];
    console.log('[Storage] Loaded', tabs.length, 'tabs from localStorage');
    return tabs;
  } catch {
    return [];
  }
};

export const saveTabs = async (tabs: SavedTab[]): Promise<void> => {
  // Always save to localStorage
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tabs));
    console.log('[Storage] Saved', tabs.length, 'tabs to localStorage');
  } catch (err) {
    console.warn('[Storage] localStorage write failed:', err);
  }

  // Only save to chrome.storage when in extension environment
  if (hasChromeStorage) {
    try {
      const chromeStorage = (window as Window & { chrome: ChromeWithStorage }).chrome?.storage?.local;
      if (chromeStorage) {
        await chromeStorage.set({ [STORAGE_KEY]: tabs });
        console.log('[Storage] Saved', tabs.length, 'tabs to chrome.storage');
      }
    } catch (err) {
      console.warn('[Storage] Chrome storage write failed:', err);
    }
  }
};

export const getCurrentTab = async (): Promise<ChromeTab | null> => {
  try {
    const tabs = await window.chrome?.tabs?.query({ active: true, currentWindow: true });
    return tabs?.[0] || null;
  } catch {
    return null;
  }
};

export const getAllTabs = async (): Promise<ChromeTab[]> => {
  try {
    const tabs = await window.chrome?.tabs?.query({}) || [];
    return tabs.filter(
      (tab) =>
        tab.url &&
        !tab.url.startsWith('chrome://') &&
        !tab.url.startsWith('chrome-extension://') &&
        !tab.pinned
    );
  } catch {
    return [];
  }
};

export const openTab = async (url: string): Promise<void> => {
  try {
    await window.chrome?.tabs?.create({ url, active: true });
  } catch {
    window.open(url, '_blank');
  }
};

export const closeTab = async (tabId: number): Promise<void> => {
  try {
    await window.chrome?.tabs?.remove(tabId);
  } catch {
    // Ignore errors when closing tabs
  }
};

export const closeAllTabs = async (tabIds: number[]): Promise<void> => {
  try {
    await window.chrome?.tabs?.remove(tabIds);
  } catch {
    // Ignore errors when closing tabs
  }
};
