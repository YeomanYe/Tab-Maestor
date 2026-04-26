import { makeAutoObservable, runInAction } from 'mobx';
import { v4 as uuidv4 } from 'uuid';
import { SavedTab, TabInfo } from '@/types';
import {
  getStoredTabs,
  saveTabs,
  getCurrentTab,
  getAllTabs,
  openTab,
  closeAllTabs as closeAllStoredTabs,
} from '@/utils/storage';
import { getTabGroupKey } from '@/utils/date';

const DATE_FILTER_KEY = 'tab-maestro-date-filter';
const DATE_START_TIME_KEY = 'tab-maestro-date-start-time';
const DATE_END_TIME_KEY = 'tab-maestro-date-end-time';
const AUTO_SAVE_HOURS_KEY = 'tab-maestro-auto-save-hours';

class TabStore {
  tabs: SavedTab[] = [];
  searchQuery = '';
  isLoading = false;
  toast: { message: string; type: 'success' | 'error' } | null = null;
  dateFilter: number | null = null; // timestamp, null means no filter (show all)
  startTimeFilter: number | null = null; // minutes from midnight, null means no start time
  endTimeFilter: number | null = null; // minutes from midnight, null means no end time
  autoSaveHours: number | null = null; // hours, null means disabled

  constructor() {
    makeAutoObservable(this);
    this.loadSettings();
  }

  private async loadSettings(): Promise<void> {
    try {
      if (typeof window !== 'undefined' && window.chrome?.storage?.sync) {
        const keys = [
          DATE_FILTER_KEY,
          DATE_START_TIME_KEY,
          DATE_END_TIME_KEY,
          AUTO_SAVE_HOURS_KEY,
        ];
        const result = await window.chrome.storage.sync.get(keys as unknown as string);
        runInAction(() => {
          this.dateFilter = (result[DATE_FILTER_KEY] as number | null) ?? null;
          this.startTimeFilter = (result[DATE_START_TIME_KEY] as number | null) ?? null;
          this.endTimeFilter = (result[DATE_END_TIME_KEY] as number | null) ?? null;
          this.autoSaveHours = (result[AUTO_SAVE_HOURS_KEY] as number | null) ?? null;
        });
      }
    } catch {
      // Silently fail
    }
  }

  async setDateFilter(timestamp: number | null): Promise<void> {
    this.dateFilter = timestamp;
    try {
      if (typeof window !== 'undefined' && window.chrome?.storage?.sync) {
        await window.chrome.storage.sync.set({ [DATE_FILTER_KEY]: timestamp });
      }
    } catch {
      // Silently fail
    }
  }

  async setStartTimeFilter(minutes: number | null): Promise<void> {
    this.startTimeFilter = minutes;
    try {
      if (typeof window !== 'undefined' && window.chrome?.storage?.sync) {
        await window.chrome.storage.sync.set({ [DATE_START_TIME_KEY]: minutes });
      }
    } catch {
      // Silently fail
    }
  }

  async setEndTimeFilter(minutes: number | null): Promise<void> {
    this.endTimeFilter = minutes;
    try {
      if (typeof window !== 'undefined' && window.chrome?.storage?.sync) {
        await window.chrome.storage.sync.set({ [DATE_END_TIME_KEY]: minutes });
      }
    } catch {
      // Silently fail
    }
  }

  async setAutoSaveHours(hours: number | null): Promise<void> {
    this.autoSaveHours = hours;
    try {
      if (typeof window !== 'undefined' && window.chrome?.storage?.sync) {
        await window.chrome.storage.sync.set({ [AUTO_SAVE_HOURS_KEY]: hours });
      }
    } catch {
      // Silently fail
    }
  }

  async loadTabs(): Promise<void> {
    this.isLoading = true;
    try {
      const tabs = await getStoredTabs();
      runInAction(() => {
        this.tabs = tabs.sort((a, b) => b.savedAt - a.savedAt);
      });
    } catch {
      // Silently fail - empty tabs is acceptable
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async saveCurrentTab(): Promise<void> {
    try {
      const tab = await getCurrentTab();
      if (!tab || !tab.url) {
        this.showToast('No active tab found', 'error');
        return;
      }

      const tabInfo: TabInfo = {
        id: tab.id,
        title: tab.title || 'Untitled',
        url: tab.url,
        favIconUrl: tab.favIconUrl || '',
        originalTabId: tab.id,
      };

      await this.addTab(tabInfo);
      this.showToast('Tab saved successfully', 'success');
    } catch {
      this.showToast('Failed to save tab', 'error');
    }
  }

  async saveAllTabs(): Promise<void> {
    try {
      const tabs = await getAllTabs();
      if (tabs.length === 0) {
        this.showToast('No tabs to save', 'error');
        return;
      }

      const tabsToSave: SavedTab[] = [];
      const tabIdsToClose: number[] = [];

      for (const tab of tabs) {
        if (
          tab.url &&
          !tab.url.startsWith('chrome://') &&
          !tab.url.startsWith('chrome-extension://')
        ) {
          const tabInfo: TabInfo = {
            id: tab.id,
            title: tab.title || 'Untitled',
            url: tab.url,
            favIconUrl: tab.favIconUrl || '',
            originalTabId: tab.id,
          };

          const exists = this.tabs.some((t) => t.url === tabInfo.url);
          if (!exists) {
            const newTab: SavedTab = {
              id: uuidv4(),
              title: tabInfo.title,
              url: tabInfo.url,
              favicon: tabInfo.favIconUrl,
              savedAt: Date.now(),
              originalTabId: tabInfo.originalTabId,
            };
            tabsToSave.push(newTab);
            tabIdsToClose.push(tab.id as number);
          }
        }
      }

      if (tabsToSave.length === 0) {
        this.showToast('All tabs already saved', 'error');
        return;
      }

      // Add new tabs to the list
      this.tabs = [...tabsToSave, ...this.tabs];
      await saveTabs(this.tabs);

      // Close the saved tabs
      if (tabIdsToClose.length > 0) {
        await closeAllStoredTabs(tabIdsToClose);
      }

      this.showToast(`Saved and closed ${tabsToSave.length} tab(s)`, 'success');
    } catch {
      this.showToast('Failed to save tabs', 'error');
    }
  }

  private async addTab(tabInfo: TabInfo): Promise<void> {
    const exists = this.tabs.some((t) => t.url === tabInfo.url);
    if (exists) {
      this.showToast('Tab already saved', 'error');
      return;
    }

    const newTab: SavedTab = {
      id: uuidv4(),
      title: tabInfo.title,
      url: tabInfo.url,
      favicon: tabInfo.favIconUrl,
      savedAt: Date.now(),
      originalTabId: tabInfo.originalTabId,
    };

    this.tabs.unshift(newTab);
    await saveTabs(this.tabs);
  }

  async openTab(tabId: string): Promise<void> {
    const tab = this.tabs.find((t) => t.id === tabId);
    if (tab) {
      await openTab(tab.url);
    }
  }

  async openAndDeleteTab(tabId: string): Promise<void> {
    const tab = this.tabs.find((t) => t.id === tabId);
    if (tab) {
      const url = tab.url;
      await this.deleteTab(tabId);
      await openTab(url);
    }
  }

  async deleteTab(tabId: string): Promise<void> {
    const index = this.tabs.findIndex((t) => t.id === tabId);
    if (index !== -1) {
      this.tabs.splice(index, 1);
      await saveTabs(this.tabs);
      this.showToast('Tab deleted', 'success');
    }
  }

  async clearAll(): Promise<void> {
    this.tabs = [];
    await saveTabs([]);
    this.showToast('All tabs cleared', 'success');
  }

  async deleteTabsByGroup(groupKey: string): Promise<void> {
    const tabsToDelete = this.tabs.filter((tab) => getTabGroupKey(tab.savedAt) === groupKey);
    const tabIds = tabsToDelete.map((tab) => tab.id);

    this.tabs = this.tabs.filter((tab) => !tabIds.includes(tab.id));
    await saveTabs(this.tabs);
    this.showToast(`${tabsToDelete.length} tabs cleared`, 'success');
  }

  showToast(message: string, type: 'success' | 'error'): void {
    this.toast = { message, type };
    setTimeout(() => {
      runInAction(() => {
        this.toast = null;
      });
    }, 3000);
  }

  get tabCount(): number {
    return this.tabs.length;
  }

  get filteredTabs(): SavedTab[] {
    let result = this.tabs;

    // Apply date filter
    if (this.dateFilter) {
      const dateStart = this.dateFilter;
      // End of the selected day (next day at 00:00:00)
      const dateEnd = dateStart + 24 * 60 * 60 * 1000;

      result = result.filter((tab) => {
        const tabTime = tab.savedAt;
        // First check if date matches
        if (tabTime < dateStart || tabTime >= dateEnd) {
          return false;
        }
        // Then check time range if specified
        if (this.startTimeFilter !== null || this.endTimeFilter !== null) {
          const tabMinutes = new Date(tabTime).getHours() * 60 + new Date(tabTime).getMinutes();
          if (this.startTimeFilter !== null && tabMinutes < this.startTimeFilter) {
            return false;
          }
          if (this.endTimeFilter !== null && tabMinutes > this.endTimeFilter) {
            return false;
          }
        }
        return true;
      });
    }

    // Apply search filter
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      result = result.filter(
        (tab) =>
          tab.title.toLowerCase().includes(query) ||
          tab.url.toLowerCase().includes(query)
      );
    }

    return result;
  }

  setSearchQuery(query: string): void {
    this.searchQuery = query;
  }

  get isEmpty(): boolean {
    return this.tabs.length === 0;
  }
}

export const tabStore = new TabStore();
