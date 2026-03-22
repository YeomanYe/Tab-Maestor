# Context Menu Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add "Save Current Tab" and "Save All Tabs" menu items to Chrome extension icon right-click menu.

**Architecture:** Use chrome.contextMenus API in background script to create menu items. Handle click events directly in background script using chrome.storage.local and chrome.notifications APIs.

**Tech Stack:** Chrome Extension Manifest V3, TypeScript, chrome.contextMenus, chrome.notifications

---

### Task 1: Add contextMenus permission to manifest

**Files:**
- Modify: `public/manifest.json`

**Step 1: Update manifest.json**

```json
{
  "manifest_version": 3,
  "name": "Tab Maestro",
  "version": "1.0.0",
  "description": "Save and manage your browser tabs with ease",
  "permissions": ["tabs", "storage", "contextMenus", "notifications"],
  "action": {
    "default_title": "Open Tab Maestro"
  },
  "options_page": "index.html"
}
```

**Step 2: Commit**

```bash
git add public/manifest.json
git commit -m "feat: add contextMenus and notifications permissions"
```

---

### Task 2: Create background script with context menu logic

**Files:**
- Modify: `src/background/index.ts`

**Step 1: Read existing background script**

Read: `src/background/index.ts`

**Step 2: Update background script with context menu**

```typescript
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

// Initialize context menus when extension is installed
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'saveCurrentTab',
    title: 'Save Current Tab',
    contexts: ['action'],
  });

  chrome.contextMenus.create({
    id: 'saveAllTabs',
    title: 'Save All Tabs',
    contexts: ['action'],
  });
});

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
    iconUrl: 'icon.png',
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
  } catch (err) {
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
  } catch (err) {
    await showNotification('Tab Maestro', 'Failed to save tabs');
  }
}
```

**Step 3: Commit**

```bash
git add src/background/index.ts
git commit -m "feat: add context menu with save current and save all"
```

---

### Task 3: Add uuid dependency if needed

**Files:**
- Check: `package.json`

**Step 1: Check if uuid is already installed**

```bash
grep uuid package.json
```

If not found, install it:

```bash
pnpm add uuid
pnpm add -D @types/uuid
```

**Step 2: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add uuid dependency"
```

---

### Task 4: Build and test

**Step 1: Build the project**

```bash
pnpm build
```

**Step 2: Run tests**

```bash
pnpm test
```

**Step 3: Commit**

```bash
git add .
git commit -m "build: verify project builds and tests pass"
```

---

## Execution Complete

All tasks completed. The extension now has context menu items for saving tabs directly from the extension icon.
