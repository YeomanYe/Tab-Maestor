export type Language = 'en' | 'zh';

export interface Translations {
  // Header
  appTitle: string;
  saveAllTabs: string;
  clearAllTabs: string;
  clearAllConfirm: string;

  // Tab list
  noSavedTabs: string;
  noSavedTabsDescription: string;

  // Group labels
  today: string;
  yesterday: string;

  // Notifications
  tabSaved: string;
  tabAlreadySaved: string;
  tabDeleted: string;
  allTabsCleared: string;
  tabsCleared: string;
  noTabsToSave: string;
  savedAndClosed: string;
  failedToSave: string;

  // Group clear confirm
  clearGroupConfirm: string;

  // Delete button
  deleteTab: string;

  // Clear group button
  clearGroup: string;

  // Theme
  light: string;
  dark: string;
  system: string;
}

const translations: Record<Language, Translations> = {
  en: {
    // Header
    appTitle: 'Tab Maestro',
    saveAllTabs: 'Save All Tabs',
    clearAllTabs: 'Clear All Tabs',
    clearAllConfirm: 'Are you sure you want to clear all saved tabs?',

    // Tab list
    noSavedTabs: 'No saved tabs',
    noSavedTabsDescription: 'Use "Save All Tabs" to save and close your open tabs',

    // Group labels
    today: 'Today',
    yesterday: 'Yesterday',

    // Notifications
    tabSaved: 'Tab saved successfully',
    tabAlreadySaved: 'Tab already saved',
    tabDeleted: 'Tab deleted',
    allTabsCleared: 'All tabs cleared',
    tabsCleared: 'tabs cleared',
    noTabsToSave: 'No tabs to save',
    savedAndClosed: 'Saved and closed',
    failedToSave: 'Failed to save tabs',

    // Group clear confirm
    clearGroupConfirm: 'Clear all tabs from',

    // Delete button
    deleteTab: 'Delete tab',

    // Clear group button
    clearGroup: 'Clear group',

    // Theme
    light: 'Light',
    dark: 'Dark',
    system: 'System',
  },
  zh: {
    // Header
    appTitle: 'Tab Maestro',
    saveAllTabs: 'Save All Tabs',
    clearAllTabs: 'Clear All Tabs',
    clearAllConfirm: '确定要清除所有已保存的标签页吗？',

    // Tab list
    noSavedTabs: 'No saved tabs',
    noSavedTabsDescription: 'Use "Save All Tabs" to save and close your open tabs',

    // Group labels
    today: 'Today',
    yesterday: 'Yesterday',

    // Notifications
    tabSaved: 'Tab saved successfully',
    tabAlreadySaved: 'Tab already saved',
    tabDeleted: 'Tab deleted',
    allTabsCleared: 'All tabs cleared',
    tabsCleared: 'tabs cleared',
    noTabsToSave: 'No tabs to save',
    savedAndClosed: 'Saved and closed',
    failedToSave: 'Failed to save tabs',

    // Group clear confirm
    clearGroupConfirm: 'Clear all tabs from',

    // Delete button
    deleteTab: 'Delete tab',

    // Clear group button
    clearGroup: 'Clear group',

    // Theme
    light: 'Light',
    dark: 'Dark',
    system: 'System',
  },
};

// Get current language from browser or storage
export const getCurrentLanguage = (): Language => {
  // Check localStorage first
  const stored = localStorage.getItem('tab-maestro-language');
  if (stored === 'en' || stored === 'zh') {
    return stored;
  }

  // Default to browser language
  const browserLang = navigator.language.toLowerCase();
  if (browserLang.startsWith('zh')) {
    return 'zh';
  }
  return 'en';
};

export const setLanguage = (lang: Language): void => {
  localStorage.setItem('tab-maestro-language', lang);
};

export const t = (key: keyof Translations): string => {
  const lang = getCurrentLanguage();
  return translations[lang][key];
};
