export interface SavedTab {
  id: string;
  title: string;
  url: string;
  favicon: string;
  savedAt: number;
  visitedAt?: number; // Last visited timestamp for auto-save feature
  originalTabId?: number;
}

export interface TabInfo {
  id?: number;
  title: string;
  url: string;
  favIconUrl: string;
  originalTabId?: number;
}

export interface SaveRule {
  id: string;
  domain: string;
  enabled: boolean;
  days: number[];
  startTime: string;
  endTime: string;
}
