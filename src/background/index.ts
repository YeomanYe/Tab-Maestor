import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'tab-maestro-tabs';

interface SavedTab {
  id: string;
  title: string;
  url: string;
  favicon: string;
  savedAt: number;
  originalTabId?: number;
}

// Create context menu items
async function createContextMenus() {
  try {
    // Remove existing menus first to avoid duplicates
    await chrome.contextMenus.removeAll();

    // Create menu for current tab - show on both extension icon and page context
    await chrome.contextMenus.create({
      id: 'saveCurrentTab',
      title: 'Save Current Tab',
      contexts: ['action', 'page'],
    });
    console.log('[Background] Created Save Current Tab menu');

    // Create menu for all tabs
    await chrome.contextMenus.create({
      id: 'saveAllTabs',
      title: 'Save All Tabs',
      contexts: ['action', 'page'],
    });
    console.log('[Background] Created Save All Tabs menu');
  } catch (error) {
    console.error('[Background] Failed to create context menus:', error);
  }
}

// Initialize context menus when extension is installed
chrome.runtime.onInstalled.addListener(() => {
  console.log('[Background] Extension installed, initializing...');
  // Initialize storage with empty array
  chrome.storage.local.set({ [STORAGE_KEY]: [] });
  createContextMenus();
});

// Also create menus when service worker starts (for development)
chrome.runtime.onStartup.addListener(() => {
  console.log('[Background] Extension started, creating menus...');
  createContextMenus();
});

// Create menus immediately on service worker load
createContextMenus();

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (!tab?.id) return;

  if (info.menuItemId === 'saveCurrentTab') {
    await saveCurrentTab();
  } else if (info.menuItemId === 'saveAllTabs') {
    await saveAllTabs();
  }
});

async function getStoredTabs(): Promise<SavedTab[]> {
  const result = await chrome.storage.local.get(STORAGE_KEY);
  return (result?.[STORAGE_KEY] as SavedTab[]) || [];
}

async function saveStoredTabs(tabs: SavedTab[]): Promise<void> {
  await chrome.storage.local.set({ [STORAGE_KEY]: tabs });
}

async function showNotification(title: string, message: string): Promise<void> {
  await chrome.notifications.create({
    type: 'basic',
    title,
    message,
  });
}

async function saveCurrentTab(): Promise<void> {
  try {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const tab = tabs[0];

    if (!tab || !tab.url || tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://')) {
      await showNotification('Tab Maestro', 'No valid tab to save');
      return;
    }

    const storedTabs = await getStoredTabs();
    const exists = storedTabs.some((t) => t.url === tab.url);

    if (exists) {
      await showNotification('Tab Maestro', 'Tab already saved');
      return;
    }

    const newTab: SavedTab = {
      id: uuidv4(),
      title: tab.title || 'Untitled',
      url: tab.url,
      favicon: tab.favIconUrl || '',
      savedAt: Date.now(),
      originalTabId: tab.id,
    };

    storedTabs.unshift(newTab);
    await saveStoredTabs(storedTabs);
    await showNotification('Tab Maestro', `Saved: ${newTab.title}`);
  } catch {
    await showNotification('Tab Maestro', 'Failed to save tab');
  }
}

async function saveAllTabs(): Promise<void> {
  try {
    const allTabs = await chrome.tabs.query({});

    const validTabs = allTabs.filter(
      (tab) =>
        tab.url &&
        !tab.url.startsWith('chrome://') &&
        !tab.url.startsWith('chrome-extension://') &&
        !tab.pinned
    );

    if (validTabs.length === 0) {
      await showNotification('Tab Maestro', 'No tabs to save');
      return;
    }

    const storedTabs = await getStoredTabs();
    const tabsToSave: SavedTab[] = [];
    const tabIdsToClose: number[] = [];

    for (const tab of validTabs) {
      const exists = storedTabs.some((t) => t.url === tab.url);
      if (!exists && tab.id) {
        const newTab: SavedTab = {
          id: uuidv4(),
          title: tab.title || 'Untitled',
          url: tab.url,
          favicon: tab.favIconUrl || '',
          savedAt: Date.now(),
          originalTabId: tab.id,
        };
        tabsToSave.push(newTab);
        tabIdsToClose.push(tab.id);
      }
    }

    if (tabsToSave.length === 0) {
      await showNotification('Tab Maestro', 'All tabs already saved');
      return;
    }

    const updatedTabs = [...tabsToSave, ...storedTabs];
    await saveStoredTabs(updatedTabs);

    // Close saved tabs
    if (tabIdsToClose.length > 0) {
      await chrome.tabs.remove(tabIdsToClose);
    }

    await showNotification('Tab Maestro', `Saved and closed ${tabsToSave.length} tab(s)`);
  } catch {
    await showNotification('Tab Maestro', 'Failed to save tabs');
  }
}
