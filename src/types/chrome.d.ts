export {};

declare global {
  interface Window {
    chrome?: {
      storage?: {
        local?: {
          get: (key: string) => Promise<Record<string, unknown>>;
          set: (data: Record<string, unknown>) => Promise<void>;
        };
      };
      tabs?: {
        query: (query: Record<string, unknown>, callback?: (tabs: ChromeTab[]) => void) => Promise<ChromeTab[]>;
        create: (props: { url: string; active?: boolean }) => Promise<ChromeTab>;
        remove: (tabIds: number | number[]) => Promise<void>;
      };
      runtime?: {
        onInstalled?: {
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
      };
    };
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
