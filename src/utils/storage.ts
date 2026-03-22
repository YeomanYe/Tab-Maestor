import { SavedTab } from '@/types';

const STORAGE_KEY = 'tab-maestro-tabs';

export const getStoredTabs = async (): Promise<SavedTab[]> => {
  // Try chrome.storage.local first
  if (typeof window !== 'undefined' && window.chrome?.storage?.local) {
    try {
      const result = await window.chrome.storage.local.get(STORAGE_KEY);
      const tabs = (result?.[STORAGE_KEY] as SavedTab[]) || [];
      if (tabs.length > 0) {
        console.log('[Storage] Loaded', tabs.length, 'tabs from chrome.storage');
        return tabs;
      }
    } catch (err) {
      console.warn('[Storage] Chrome storage read failed:', err);
    }
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
  // Always save to both storages for reliability
  // Chrome storage is the primary
  if (typeof window !== 'undefined' && window.chrome?.storage?.local) {
    try {
      await window.chrome.storage.local.set({ [STORAGE_KEY]: tabs });
      console.log('[Storage] Saved', tabs.length, 'tabs to chrome.storage');
    } catch (err) {
      console.warn('[Storage] Chrome storage write failed:', err);
    }
  }

  // Also save to localStorage as backup
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tabs));
    console.log('[Storage] Saved', tabs.length, 'tabs to localStorage');
  } catch (err) {
    console.warn('[Storage] localStorage write failed:', err);
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
