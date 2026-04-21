import { SaveRule } from '@/types';

const RULES_STORAGE_KEY = 'tab-maestro-rules';

// Chrome storage API type
interface ChromeStorage {
  local: {
    get: (keys: string | string[] | Record<string, unknown>) => Promise<Record<string, unknown>>;
    set: (items: Record<string, unknown>) => Promise<void>;
  };
}

interface ChromeWithStorage {
  storage?: ChromeStorage;
}

// Check if running in Chrome extension environment
const isChromeExtension = (): boolean => {
  const win = window as Window & { chrome?: ChromeWithStorage };
  if (!win.chrome?.storage?.local) {
    return false;
  }
  try {
    return typeof win.chrome.storage.local.get === 'function';
  } catch {
    return false;
  }
};

// Default rule with current domain placeholder
export const createDefaultRule = (domain: string): SaveRule => ({
  id: crypto.randomUUID(),
  domain: domain,
  enabled: true,
  days: [],
  startTime: '00:00',
  endTime: '23:59',
});

export const getRules = async (): Promise<SaveRule[]> => {
  // Try chrome.storage.local first
  if (isChromeExtension()) {
    try {
      const chromeStorage = (window as Window & { chrome: ChromeWithStorage }).chrome?.storage?.local;
      if (!chromeStorage) {
        throw new Error('Chrome storage not available');
      }
      const result = await chromeStorage.get(RULES_STORAGE_KEY);
      const rules = (result[RULES_STORAGE_KEY] as SaveRule[]) || [];
      if (rules.length > 0) {
        console.log('[RulesStorage] Loaded', rules.length, 'rules from chrome.storage');
        return rules;
      }
    } catch (err) {
      console.warn('[RulesStorage] Chrome storage read failed:', err);
    }
  }

  // Fallback to localStorage
  try {
    const stored = localStorage.getItem(RULES_STORAGE_KEY);
    const rules = stored ? JSON.parse(stored) : [];
    console.log('[RulesStorage] Loaded', rules.length, 'rules from localStorage');
    return rules;
  } catch {
    return [];
  }
};

export const saveRules = async (rules: SaveRule[]): Promise<void> => {
  // Always save to localStorage
  try {
    localStorage.setItem(RULES_STORAGE_KEY, JSON.stringify(rules));
    console.log('[RulesStorage] Saved', rules.length, 'rules to localStorage');
  } catch (err) {
    console.warn('[RulesStorage] localStorage write failed:', err);
  }

  // Only save to chrome.storage when in extension environment
  if (isChromeExtension()) {
    try {
      const chromeStorage = (window as Window & { chrome: ChromeWithStorage }).chrome?.storage?.local;
      if (chromeStorage) {
        await chromeStorage.set({ [RULES_STORAGE_KEY]: rules });
        console.log('[RulesStorage] Saved', rules.length, 'rules to chrome.storage');
      }
    } catch (err) {
      console.warn('[RulesStorage] Chrome storage write failed:', err);
    }
  }
};
