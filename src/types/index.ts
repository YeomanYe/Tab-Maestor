export interface SavedTab {
  id: string;
  title: string;
  url: string;
  favicon: string;
  savedAt: number;
}

export interface TabInfo {
  id?: number;
  title: string;
  url: string;
  favIconUrl: string;
}
