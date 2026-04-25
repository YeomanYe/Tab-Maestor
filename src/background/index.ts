import { v4 as uuidv4 } from 'uuid';
import type { SaveRule } from '../types';

// Global error handler
self.onerror = (message, source, lineno, colno, error) => {
  console.error('[Background] Global error:', { message, source, lineno, colno, error });
};

self.onunhandledrejection = (event) => {
  console.error('[Background] Unhandled promise rejection:', event.reason);
};

console.log('[Background] Service worker starting...');

const STORAGE_KEY = 'tab-maestro-tabs';
const RULES_STORAGE_KEY = 'tab-maestro-rules';

interface SavedTab {
  id: string;
  title: string;
  url: string;
  favicon: string;
  savedAt: number;
  originalTabId?: number;
}

// Create context menu items
function createContextMenus() {
  // Remove existing menus first to avoid duplicates
  chrome.contextMenus.removeAll(() => {
    // Create menu for current tab - show on extension icon
    chrome.contextMenus.create({
      id: 'saveCurrentTab',
      title: 'Save Current Tab',
      contexts: ['action'],
    });
    console.log('[Background] Created Save Current Tab menu');

    // Create menu for all tabs
    chrome.contextMenus.create({
      id: 'saveAllTabs',
      title: 'Save All Tabs',
      contexts: ['action'],
    });
    console.log('[Background] Created Save All Tabs menu');
  });
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

// Handle keyboard commands - with safety check
if (chrome.commands) {
  chrome.commands.onCommand.addListener(async (command) => {
    console.log('[Background] Command triggered:', command);
    if (command === 'save-current-tab') {
      await saveCurrentTab();
    } else if (command === 'save-all-tabs') {
      await saveAllTabs();
    }
  });
} else {
  console.warn('[Background] Commands API not available');
}

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

// Get saved rules
async function getRules(): Promise<SaveRule[]> {
  try {
    const result = await chrome.storage.local.get(RULES_STORAGE_KEY);
    return (result[RULES_STORAGE_KEY] as SaveRule[]) || [];
  } catch {
    return [];
  }
}

// Check if domain matches rule pattern
function matchDomain(url: string, pattern: string): boolean {
  try {
    const urlObj = new URL(url);
    const urlDomain = urlObj.hostname.replace(/^www\./, '');

    // Convert pattern to regex
    // *.example.com -> matches example.com, sub.example.com, etc.
    const regexPattern = pattern
      .replace(/\./g, '\\.')
      .replace(/\*/g, '.*');

    const regex = new RegExp(`^${regexPattern}$`, 'i');
    return regex.test(urlDomain);
  } catch {
    return false;
  }
}

// Check if current time matches rule time
function matchTime(rule: SaveRule): boolean {
  const now = new Date();
  const currentDay = now.getDay();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  // Parse rule time
  const [startHour, startMin] = rule.startTime.split(':').map(Number);
  const [endHour, endMin] = rule.endTime.split(':').map(Number);
  const startMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;

  // Check day
  const dayMatch = rule.days.length === 0 || rule.days.includes(currentDay);

  // Check time
  const timeMatch = currentMinutes >= startMinutes && currentMinutes <= endMinutes;

  return dayMatch && timeMatch;
}

// Check if URL should be blocked by rules
async function shouldBlockByRules(url: string): Promise<boolean> {
  const rules = await getRules();
  const enabledRules = rules.filter((r) => r.enabled);

  for (const rule of enabledRules) {
    if (matchDomain(url, rule.domain) && matchTime(rule)) {
      return true;
    }
  }

  return false;
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

async function getExtensionUrl(): Promise<string> {
  // Get the extension ID dynamically
  return chrome.runtime.getURL('index.html');
}

async function focusOrOpenOptionsPage(): Promise<void> {
  const extensionUrl = await getExtensionUrl();

  // Query for tabs with the options page URL
  const tabs = await chrome.tabs.query({ url: extensionUrl });

  if (tabs.length > 0) {
    // Options page is already open, focus the first match
    const existingTab = tabs[0];
    if (existingTab.id) {
      await chrome.tabs.update(existingTab.id, { active: true });
      // Also focus the window if it's in a different window
      if (existingTab.windowId) {
        await chrome.windows.update(existingTab.windowId, { focused: true });
      }
      // Refresh the options page
      await chrome.tabs.reload(existingTab.id);
    }
  } else {
    // Options page is not open, open it
    await chrome.tabs.create({ url: extensionUrl });
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
    const blockedTabs: string[] = [];

    // Save all tabs (no deduplication) and collect all tab IDs to close
    // Also check each tab against rules
    for (const tab of validTabs) {
      if (tab.id && tab.url) {
        // Check if blocked by rules
        const isBlocked = await shouldBlockByRules(tab.url);
        if (isBlocked) {
          blockedTabs.push(tab.url);
          continue;
        }

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
      await showNotification('Tab Maestro', 'No tabs to save');
      return;
    }

    const updatedTabs = [...tabsToSave, ...storedTabs];
    await saveStoredTabs(updatedTabs);

    // Close all valid tabs
    if (tabIdsToClose.length > 0) {
      await chrome.tabs.remove(tabIdsToClose);
    }

    // Build notification message
    let message = `Saved and closed ${tabsToSave.length} tab(s)`;
    if (blockedTabs.length > 0) {
      message += `, blocked ${blockedTabs.length} tab(s) by rules`;
    }
    await showNotification('Tab Maestro', message);

    // Focus or open options page (will refresh if already open)
    await focusOrOpenOptionsPage();
  } catch {
    await showNotification('Tab Maestro', 'Failed to save tabs');
  }
}
