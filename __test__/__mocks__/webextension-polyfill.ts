// Test-only stand-in for webextension-polyfill: it bails out at import time
// when the runtime isn't a browser extension, so we hand jsdom a plain mock.
// We delegate to window.chrome (set up in setup.ts) so test files can spy on
// the same vi.fn() instances via window.chrome.* — keeping a single source of truth.

const getMock = () => {
  const w = globalThis as unknown as { chrome?: Record<string, unknown> };
  return w.chrome ?? {};
};

const proxyHandler: ProxyHandler<object> = {
  get(_target, prop) {
    const m = getMock() as Record<string, unknown>;
    return m[prop as string];
  },
};

const root = new Proxy({}, proxyHandler) as Record<string, unknown>;

const polyfill = new Proxy(
  {},
  {
    get(_target, prop) {
      return root[prop as string];
    },
  },
) as Record<string, unknown>;

export default polyfill;
export const storage = polyfill.storage;
export const tabs = polyfill.tabs;
export const runtime = polyfill.runtime;
export const notifications = polyfill.notifications;
export const alarms = polyfill.alarms;
export const contextMenus = polyfill.contextMenus;
export const commands = polyfill.commands;
export const windows = polyfill.windows;
