import { SaveRule } from '@/types';
import browser from 'webextension-polyfill';

const RULES_STORAGE_KEY = 'tab-maestro-rules';

// Convert domain to wildcard pattern: www.baidu.com -> *.baidu.com, github.com -> github.com
export const toWildcardDomain = (domain: string): string => {
  // First convert to wildcard, then remove www. prefix
  const parts = domain.split('.');
  let result = domain;
  if (parts.length > 2) {
    result = `*.${parts.slice(-2).join('.')}`;
  }
  // Remove www. prefix from the result
  return result.replace(/^www\./, '');
};

// Check if running in browser extension environment
const isExtensionEnvironment = (): boolean => {
  if (typeof browser !== 'undefined' && browser.storage?.local) {
    return true;
  }
  // Fallback to chrome for older browsers
  const win = window as Window & { chrome?: { storage?: { local?: unknown } } };
  return !!(win.chrome?.storage?.local);
};

// Default rule with current domain placeholder
export const createDefaultRule = (domain: string): SaveRule => ({
  id: crypto.randomUUID(),
  domain: domain,
  enabled: true,
  days: [0, 1, 2, 3, 4, 5, 6],
  startTime: '00:00',
  endTime: '23:59',
});

export const getRules = async (): Promise<SaveRule[]> => {
  // Try extension storage first
  if (isExtensionEnvironment()) {
    try {
      if (!browser.storage?.local) {
        throw new Error('Browser storage not available');
      }
      const result = await browser.storage.local.get(RULES_STORAGE_KEY);
      const rules = (result[RULES_STORAGE_KEY] as SaveRule[]) || [];
      if (rules.length > 0) {
        console.log('[RulesStorage] Loaded', rules.length, 'rules from browser.storage');
        return rules;
      }
    } catch (err) {
      console.warn('[RulesStorage] Browser storage read failed:', err);
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

  // Only save to extension storage when in extension environment
  if (isExtensionEnvironment()) {
    try {
      if (browser.storage?.local) {
        await browser.storage.local.set({ [RULES_STORAGE_KEY]: rules });
        console.log('[RulesStorage] Saved', rules.length, 'rules to browser.storage');
      }
    } catch (err) {
      console.warn('[RulesStorage] Browser storage write failed:', err);
    }
  }
};
