import { SavedTab } from '@/types';
import { mockTabs } from './mockData';
import { toJS } from 'mobx';
import browser from 'webextension-polyfill';

const STORAGE_KEY = 'tab-maestro-tabs';

interface ExtensionTab {
  id?: number;
  title?: string;
  url?: string;
  favIconUrl?: string;
  active?: boolean;
  windowId?: number;
  pinned?: boolean;
}

// Check if running in browser extension environment
const isExtensionEnvironment = (): boolean => {
  // Check if we're in a browser with extension API (browser.* or chrome.*)
  if (typeof browser !== 'undefined' && browser.storage?.local) {
    return true;
  }
  // Fallback to chrome for older browsers
  const win = window as Window & { chrome?: { storage?: { local?: unknown } } };
  return !!(win.chrome?.storage?.local);
};

export const getStoredTabs = async (): Promise<SavedTab[]> => {
  // Use mock data when not in extension environment
  if (!isExtensionEnvironment()) {
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

  // Try extension storage first
  try {
    const result = await browser.storage.local.get(STORAGE_KEY);
    const tabs = (result?.[STORAGE_KEY] as SavedTab[]) || [];
    if (tabs.length > 0) {
      console.log('[Storage] Loaded', tabs.length, 'tabs from browser.storage');
      return tabs;
    }
  } catch (err) {
    console.warn('[Storage] Browser storage read failed:', err);
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
  // Convert to plain JS array to avoid MobX observable issues
  const plainTabs = toJS(tabs);

  // Always save to localStorage
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plainTabs));
    console.log('[Storage] Saved', plainTabs.length, 'tabs to localStorage');
  } catch (err) {
    console.warn('[Storage] localStorage write failed:', err);
  }

  // Only save to extension storage when in extension environment
  if (isExtensionEnvironment()) {
    try {
      await browser.storage.local.set({ [STORAGE_KEY]: plainTabs });
      console.log('[Storage] Saved', plainTabs.length, 'tabs to browser.storage');
    } catch (err) {
      console.warn('[Storage] Browser storage write failed:', err);
    }
  }
};

export const getCurrentTab = async (): Promise<ExtensionTab | null> => {
  try {
    const queriedTabs = await browser.tabs.query({ active: true, currentWindow: true });
    return queriedTabs?.[0] || null;
  } catch {
    return null;
  }
};

export const getAllTabs = async (): Promise<ExtensionTab[]> => {
  try {
    const queriedTabs = await browser.tabs.query({}) || [];
    return queriedTabs.filter(
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
    await browser.tabs.create({ url, active: true });
  } catch {
    window.open(url, '_blank');
  }
};

export const closeTab = async (tabId: number): Promise<void> => {
  try {
    await browser.tabs.remove(tabId);
  } catch {
    // Ignore errors when closing tabs
  }
};

export const closeAllTabs = async (tabIds: number[]): Promise<void> => {
  try {
    await browser.tabs.remove(tabIds);
  } catch {
    // Ignore errors when closing tabs
  }
};
