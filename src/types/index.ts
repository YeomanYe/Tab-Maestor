export interface SavedTab {
  id: string;
  title: string;
  url: string;
  favicon: string;
  savedAt: number;
  originalTabId?: number;
}

export interface TabInfo {
  id?: number;
  title: string;
  url: string;
  favIconUrl: string;
  originalTabId?: number;
}
