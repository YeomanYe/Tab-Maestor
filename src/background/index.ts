import { v4 as uuidv4 } from 'uuid';
import type { SaveRule } from '../types';
import { storage, tabs, runtime, notifications, alarms, windows, contextMenus, commands, isAlarmsSupported, isContextMenusSupported } from '../utils/extension-api';

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
const AUTO_SAVE_DELAY_KEY = 'tab-maestro-auto-save-delay';

// Track tab timers for auto-save (tabId -> startTime)
const tabTimers = new Map<number, number>();
let autoSaveDelay: number | null = null; // minutes, null means disabled

interface SavedTab {
  id: string;
  title: string;
  url: string;
  favicon: string;
  savedAt: number;
  originalTabId?: number;
}

// Create context menu items
function createContextMenus(): void {
  if (!isContextMenusSupported()) {
    console.log('[Background] Context menus not supported in this browser');
    return;
  }

  // Remove existing menus first to avoid duplicates
  contextMenus.removeAll().then(() => {
    // Create menu for current tab - show on extension icon
    contextMenus.create({
      id: 'saveCurrentTab',
      title: 'Save Current Tab',
      contexts: ['action'],
    });
    console.log('[Background] Created Save Current Tab menu');

    // Create menu for all tabs
    contextMenus.create({
      id: 'saveAllTabs',
      title: 'Save All Tabs',
      contexts: ['action'],
    });
    console.log('[Background] Created Save All Tabs menu');
  });
}

// Initialize context menus when extension is installed
runtime.onInstalled.addListener(() => {
  console.log('[Background] Extension installed, initializing...');
  // Initialize storage with empty array
  storage.local.set({ [STORAGE_KEY]: [] });
  createContextMenus();
});

// Also create menus when service worker starts (for development)
runtime.onStartup.addListener(() => {
  console.log('[Background] Extension started, creating menus...');
  createContextMenus();
});

// Create menus immediately on service worker load
createContextMenus();

// Load auto-save settings
async function loadAutoSaveSettings(): Promise<void> {
  try {
    const result = await storage.local.get(AUTO_SAVE_DELAY_KEY);
    autoSaveDelay = result[AUTO_SAVE_DELAY_KEY] as number | null;
    console.log('[Background] Auto-save delay loaded:', autoSaveDelay);
  } catch (err) {
    console.error('[Background] Error loading auto-save settings:', err);
  }
}

loadAutoSaveSettings();

// Handle tab activation - start timer when user switches away from a tab
tabs.onActivated.addListener(async (activeInfo) => {
  console.log('[Background] Tab activated:', activeInfo.tabId, 'in window:', activeInfo.windowId);

  // Clear timer for the newly activated tab (user returned to it)
  if (tabTimers.has(activeInfo.tabId)) {
    tabTimers.delete(activeInfo.tabId);
    console.log('[Background] Cleared timer for activated tab:', activeInfo.tabId);
  }

  // If auto-save is disabled, do nothing
  if (!autoSaveDelay || autoSaveDelay <= 0) {
    return;
  }

  // Get all tabs from all windows to find the previously active tab
  const allTabs = await tabs.query({});

  // Find the tab that is no longer active (the one user switched away from)
  for (const tab of allTabs) {
    // Skip pinned tabs and tabs that already have a timer
    if (tab.id && !tab.active && !tab.pinned) {
      if (tabTimers.has(tab.id)) {
        continue;
      }
      // Start timer for this tab
      tabTimers.set(tab.id, Date.now());
      console.log('[Background] Started timer for tab:', tab.id, 'title:', tab.title);
    }
  }
});

// Check for tabs that need auto-save using chrome.alarms (or fallback)
const AUTO_SAVE_ALARM_NAME = 'tab-maestro-auto-save-check';

if (isAlarmsSupported()) {
  alarms.create(AUTO_SAVE_ALARM_NAME, {
    periodInMinutes: 1 / 12, // 5 seconds = 1/12 minute
  });

  alarms.onAlarm.addListener(async (alarm: { name: string }) => {
    if (alarm.name !== AUTO_SAVE_ALARM_NAME) {
      return;
    }

    if (!autoSaveDelay || autoSaveDelay <= 0) {
      return;
    }

    const delayMs = autoSaveDelay * 60 * 1000;
    const now = Date.now();

    // Check each tracked tab
    for (const [tabId, startTime] of Array.from(tabTimers.entries())) {
      if (now - startTime >= delayMs) {
        console.log('[Background] Auto-save triggered for tab:', tabId);

        // Get the tab info
        try {
          const tab = await tabs.get(tabId);
          const extensionOptionsUrl = runtime.getURL('index.html');

          // Check if tab still exists and is not the active tab, and is not the options page, and is not pinned
          if (tab && !tab.active && !tab.pinned && tab.url && tab.url !== extensionOptionsUrl) {
            // Save and close the tab
            await saveAndCloseTab(tabId);
          }

          // Remove from timer tracking
          tabTimers.delete(tabId);
        } catch (err) {
          console.error('[Background] Error auto-saving tab:', err);
          tabTimers.delete(tabId);
        }
      }
    }
  });
} else {
  // Safari fallback: use setInterval
  console.log('[Background] Using setInterval fallback for auto-save (Safari)');
  setInterval(async () => {
    if (!autoSaveDelay || autoSaveDelay <= 0) {
      return;
    }

    const delayMs = autoSaveDelay * 60 * 1000;
    const now = Date.now();

    // Check each tracked tab
    for (const [tabId, startTime] of Array.from(tabTimers.entries())) {
      if (now - startTime >= delayMs) {
        console.log('[Background] Auto-save triggered for tab:', tabId);

        try {
          const tab = await tabs.get(tabId);
          const extensionOptionsUrl = runtime.getURL('index.html');

          if (tab && !tab.active && !tab.pinned && tab.url && tab.url !== extensionOptionsUrl) {
            await saveAndCloseTab(tabId);
          }

          tabTimers.delete(tabId);
        } catch (err) {
          console.error('[Background] Error auto-saving tab:', err);
          tabTimers.delete(tabId);
        }
      }
    }
  }, 5000); // Check every 5 seconds
}

// Save and close a specific tab
async function saveAndCloseTab(tabId: number): Promise<void> {
  try {
    const tab = await tabs.get(tabId);
    if (!tab || !tab.url) {
      return;
    }

    // Check if tab should be blocked by rules
    const isBlocked = await shouldBlockByRules(tab.url);
    if (isBlocked) {
      console.log('[Background] Tab blocked by rules:', tab.url);
      tabTimers.delete(tabId);
      return;
    }

    const storedTabs = await getStoredTabs();

    const newTab: SavedTab = {
      id: uuidv4(),
      title: tab.title || 'Untitled',
      url: tab.url,
      favicon: tab.favIconUrl || '',
      savedAt: Date.now(),
      originalTabId: tabId,
    };

    storedTabs.unshift(newTab);
    await saveStoredTabs(storedTabs);

    // Close the tab
    await tabs.remove(tabId);

    await showNotification('Tab Maestro', `Auto-saved: ${newTab.title}`);
    console.log('[Background] Tab auto-saved and closed:', tabId);
  } catch (err) {
    console.error('[Background] Error in saveAndCloseTab:', err);
  }
}

// Handle keyboard commands - with safety check
if (commands) {
  commands.onCommand.addListener(async (command) => {
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
if (isContextMenusSupported()) {
  contextMenus.onClicked.addListener(async (info, tab) => {
    console.log('[Background] Context menu clicked:', info.menuItemId, 'tab:', tab);

    if (info.menuItemId === 'saveCurrentTab') {
      await saveCurrentTab();
    } else if (info.menuItemId === 'saveAllTabs') {
      await saveAllTabs();
    }
  });
}

// Handle messages from content scripts and options page
// eslint-disable-next-line @typescript-eslint/no-explicit-any
runtime.onMessage.addListener((message: any, _sender, _sendResponse): true => {
  console.log('[Background] Message received:', message);
  if (message.action === 'saveAllTabs') {
    void saveAllTabs();
  } else if (message.action === 'saveCurrentTab') {
    void saveCurrentTab();
  } else if (message.action === 'updateAutoSaveDelay') {
    // Update auto-save delay setting
    autoSaveDelay = message.delay ?? null;
    void storage.local.set({ [AUTO_SAVE_DELAY_KEY]: message.delay });
    console.log('[Background] Auto-save delay updated:', message.delay);

    // Clear all timers if auto-save is disabled
    if (!autoSaveDelay || autoSaveDelay <= 0) {
      tabTimers.clear();
      console.log('[Background] Cleared all tab timers');
    }
  }
  return true;
});

async function getStoredTabs(): Promise<SavedTab[]> {
  try {
    const result = await storage.local.get(STORAGE_KEY);
    const tabs = result?.[STORAGE_KEY];
    if (Array.isArray(tabs)) {
      return tabs as SavedTab[];
    }
    return [];
  } catch (err) {
    console.error('[Background] Error getting stored tabs:', err);
    return [];
  }
}

async function saveStoredTabs(tabs: SavedTab[]): Promise<void> {
  await storage.local.set({ [STORAGE_KEY]: tabs });
}

async function showNotification(title: string, message: string): Promise<void> {
  try {
    await notifications.create({
      type: 'basic',
      title,
      message,
      iconUrl: runtime.getURL('icon-128.png'),
    });
  } catch (err) {
    console.warn('[Background] Notification failed:', err);
  }
}

// Get saved rules
async function getRules(): Promise<SaveRule[]> {
  try {
    const result = await storage.local.get(RULES_STORAGE_KEY);
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
  console.log('[Background] saveCurrentTab called');
  try {
    const currentTabs = await tabs.query({ active: true, currentWindow: true });
    console.log('[Background] Query result tabs:', currentTabs);
    const tab = currentTabs[0];

    // Allow tabs with URL, even chrome:// URLs
    if (!tab || !tab.url) {
      await showNotification('Tab Maestro', 'No valid tab to save');
      console.log('[Background] No valid tab - missing tab or URL');
      return;
    }

    const storedTabs = await getStoredTabs();

    const tabId = tab.id;
    console.log('[Background] Saving tab:', tab.title, 'id:', tabId);

    const newTab: SavedTab = {
      id: uuidv4(),
      title: tab.title || 'Untitled',
      url: tab.url,
      favicon: tab.favIconUrl || '',
      savedAt: Date.now(),
      originalTabId: tabId,
    };

    storedTabs.unshift(newTab);
    await saveStoredTabs(storedTabs);

    // Close the current tab
    if (tabId) {
      await tabs.remove(tabId);
    }

    // Refresh options page if it's open (without focusing)
    const extensionOptionsUrl = runtime.getURL('index.html');
    const optionsTabs = await tabs.query({ url: extensionOptionsUrl });
    for (const optTab of optionsTabs) {
      if (optTab.id) {
        await tabs.reload(optTab.id);
        console.log('[Background] Refreshed options page tab:', optTab.id);
      }
    }

    await showNotification('Tab Maestro', `Saved: ${newTab.title}`);
    console.log('[Background] Tab saved and closed');
    console.log('[Background] Options page data refreshed (if open)');

  } catch (error) {
    console.error('[Background] saveCurrentTab error:', error);
    await showNotification('Tab Maestro', 'Failed to save tab');
  }
}

async function getExtensionUrl(): Promise<string> {
  // Get the extension ID dynamically
  return runtime.getURL('index.html');
}

async function focusOrOpenOptionsPage(): Promise<void> {
  const extensionUrl = await getExtensionUrl();

  // Query for tabs with the options page URL
  const foundTabs = await tabs.query({ url: extensionUrl });

  if (foundTabs.length > 0) {
    // Options page is already open, focus the first match
    const existingTab = foundTabs[0];
    if (existingTab.id) {
      await tabs.update(existingTab.id, { active: true });
      // Also focus the window if it's in a different window
      if (existingTab.windowId) {
        await windows.update(existingTab.windowId, { focused: true });
      }
      // Refresh the options page
      await tabs.reload(existingTab.id);
    }
  } else {
    // Options page is not open, open it
    await tabs.create({ url: extensionUrl });
  }
}

async function saveAllTabs(): Promise<void> {
  try {
    const allTabs = await tabs.query({});
    const extensionOptionsUrl = runtime.getURL('index.html');

    const validTabs = allTabs.filter(
      (tab) =>
        tab.url &&
        !tab.pinned &&
        tab.url !== extensionOptionsUrl
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
      await tabs.remove(tabIdsToClose);
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
