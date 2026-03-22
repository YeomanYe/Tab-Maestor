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

class TabStore {
  tabs: SavedTab[] = [];
  isLoading = false;
  toast: { message: string; type: 'success' | 'error' } | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  async loadTabs(): Promise<void> {
    this.isLoading = true;
    try {
      const tabs = await getStoredTabs();
      runInAction(() => {
        this.tabs = tabs.sort((a, b) => b.savedAt - a.savedAt);
      });
    } catch (error) {
      this.showToast('Failed to load tabs', 'error');
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
        if (tab.url && !tab.url.startsWith('chrome://')) {
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

  get isEmpty(): boolean {
    return this.tabs.length === 0;
  }
}

export const tabStore = new TabStore();
