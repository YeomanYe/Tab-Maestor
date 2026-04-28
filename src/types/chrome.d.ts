export {};

declare global {
  // Global chrome variable for Chrome extension API
  const chrome: {
    storage?: {
      local?: {
        get: (key: string) => Promise<Record<string, unknown>>;
        set: (data: Record<string, unknown>) => Promise<void>;
      };
      sync?: {
        get: (key: string) => Promise<Record<string, unknown>>;
        set: (data: Record<string, unknown>) => Promise<void>;
      };
    };
    tabs?: {
      query: (query: Record<string, unknown>) => Promise<ChromeTab[]>;
      create: (props: { url: string; active?: boolean }) => Promise<ChromeTab>;
      update: (tabId: number, props: Record<string, unknown>) => Promise<ChromeTab>;
      reload: (tabId: number) => Promise<void>;
      remove: (tabIds: number | number[]) => Promise<void>;
    };
    runtime?: {
      onInstalled?: {
        addListener: (callback: () => void) => void;
      };
      onStartup?: {
        addListener: (callback: () => void) => void;
      };
      onMessage?: {
        addListener: (
          callback: (
            message: { type: string },
            sender: unknown,
            sendResponse: (response?: unknown) => void
          ) => boolean | void
        ) => void;
      };
      getURL?: (path: string) => string;
      sendMessage?: (message: Record<string, unknown>) => Promise<unknown>;
    };
    contextMenus?: {
      create: (props: Record<string, unknown>, callback?: () => void) => void;
      removeAll: (callback?: () => void) => void;
      onClicked?: {
        addListener: (callback: (info: unknown, tab: ChromeTab) => void) => void;
      };
    };
    notifications?: {
      create: (props: Record<string, unknown>, callback?: () => void) => void;
    };
    windows?: {
      update: (windowId: number, props: Record<string, unknown>) => Promise<unknown>;
    };
  };

  interface Window {
    chrome?: typeof chrome;
  }

  interface ChromeTab {
    id?: number;
    title?: string;
    url?: string;
    favIconUrl?: string;
    active?: boolean;
    windowId?: number;
    pinned?: boolean;
  }
}
