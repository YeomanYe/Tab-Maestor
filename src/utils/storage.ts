import { SavedTab } from '@/types';

const STORAGE_KEY = 'tab-maestro-tabs';

export const getStoredTabs = async (): Promise<SavedTab[]> => {
  try {
    const result = await window.chrome?.storage?.local?.get(STORAGE_KEY);
    return (result?.[STORAGE_KEY] as SavedTab[]) || [];
  } catch {
    // Fallback for development environment
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }
};

export const saveTabs = async (tabs: SavedTab[]): Promise<void> => {
  try {
    await window.chrome?.storage?.local?.set({ [STORAGE_KEY]: tabs });
  } catch {
    // Fallback for development environment
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tabs));
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
    return tabs.filter((tab) => tab.url && !tab.url.startsWith('chrome://') && !tab.pinned);
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
