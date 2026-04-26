export type Language = 'en' | 'zh';

export interface Translations {
  // Header
  appTitle: string;
  saveAllTabs: string;
  clearAllTabs: string;
  clearAllConfirm: string;

  // Search
  searchPlaceholder: string;

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

  // Pin button
  pinTab: string;
  unpinTab: string;
  pinnedTabs: string;
  pinAllTabs: string;
  openAllTabs: string;
  deleteAllPinned: string;

  // Clear group button
  clearGroup: string;

  // Theme
  light: string;
  dark: string;
  system: string;

  // Date filter
  dateFilter: string;
  dateFilterAll: string;
  dateFilterPlaceholder: string;
  dateTo: string;

  // Auto save
  autoSave: string;
  autoSaveDisabled: string;
  autoSaveMinutes: string;
  autoSaveCustom: string;
}

const translations: Record<Language, Translations> = {
  en: {
    // Header
    appTitle: 'Tab Maestro',
    saveAllTabs: 'Save All Tabs',
    clearAllTabs: 'Clear All Tabs',
    clearAllConfirm: 'Are you sure you want to clear all saved tabs?',

    // Search
    searchPlaceholder: 'Search tabs...',

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

    // Pin button
    pinTab: 'Pin tab',
    unpinTab: 'Unpin tab',
    pinnedTabs: 'Pinned',
    pinAllTabs: 'Pin all',
    openAllTabs: 'Open all',
    deleteAllPinned: 'Delete all pinned',

    // Clear group button
    clearGroup: 'Clear group',

    // Theme
    light: 'Light',
    dark: 'Dark',
    system: 'System',

    // Date filter
    dateFilter: 'Filter by date',
    dateFilterAll: 'All',
    dateFilterPlaceholder: 'Select date',
    dateTo: 'to',

    // Auto save
    autoSave: 'Auto-save after',
    autoSaveDisabled: 'Disabled',
    autoSaveMinutes: 'minutes',
    autoSaveCustom: 'Custom',
  },
  zh: {
    // Header
    appTitle: 'Tab Maestro',
    saveAllTabs: '保存所有标签页',
    clearAllTabs: '清除所有标签页',
    clearAllConfirm: '确定要清除所有已保存的标签页吗？',

    // Search
    searchPlaceholder: '搜索标签页...',

    // Tab list
    noSavedTabs: '暂无保存的标签页',
    noSavedTabsDescription: '点击"保存所有标签页"来保存并关闭您打开的标签页',

    // Group labels
    today: '今天',
    yesterday: '昨天',

    // Notifications
    tabSaved: '标签页保存成功',
    tabAlreadySaved: '标签页已存在',
    tabDeleted: '标签页已删除',
    allTabsCleared: '已清除所有标签页',
    tabsCleared: '个标签页已清除',
    noTabsToSave: '没有可保存的标签页',
    savedAndClosed: '已保存并关闭',
    failedToSave: '保存标签页失败',

    // Group clear confirm
    clearGroupConfirm: '清除该组所有标签页',

    // Delete button
    deleteTab: '删除标签页',

    // Pin button
    pinTab: '固定标签页',
    unpinTab: '取消固定',
    pinnedTabs: '固定的标签页',
    pinAllTabs: '固定全部',
    openAllTabs: '打开全部',
    deleteAllPinned: '删除全部固定',

    // Clear group button
    clearGroup: '清除该组',

    // Theme
    light: '浅色',
    dark: '深色',
    system: '跟随系统',

    // Date filter
    dateFilter: '按日期筛选',
    dateFilterAll: '全部',
    dateFilterPlaceholder: '选择日期',
    dateTo: '到',

    // Auto save
    autoSave: '自动保存于',
    autoSaveDisabled: '已禁用',
    autoSaveMinutes: '分钟',
    autoSaveCustom: '自定义',
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
