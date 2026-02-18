// Background script for Tab Maestro
// This script runs in the background when the extension is installed

window.chrome?.runtime?.onInstalled?.addListener(() => {
  // Initialize storage with empty array
  window.chrome?.storage?.local?.set({ 'tab-maestro-tabs': [] });
});

// Handle messages from content scripts or popup
window.chrome?.runtime?.onMessage?.addListener(
  (message: { type: string }, _sender: unknown, sendResponse: (response?: unknown) => void) => {
    if (message.type === 'GET_TABS') {
      window.chrome?.tabs?.query({}, (tabs: ChromeTab[]) => {
        const validTabs = tabs.filter(
          (tab) => tab.url && !tab.url.startsWith('chrome://')
        );
        sendResponse({ tabs: validTabs });
      });
      return true;
    }
    return false;
  }
);
