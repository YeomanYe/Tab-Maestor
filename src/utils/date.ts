import { getCurrentLanguage } from './i18n';

/**
 * Format timestamp for display in tab list
 * - Today: just time (e.g., "14:30")
 * - Yesterday: just time (e.g., "14:30")
 * - Older: absolute date (e.g., "Feb 15")
 */
export const formatTabTime = (timestamp: number): string => {
  const now = new Date();
  const date = new Date(timestamp);

  const nowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterdayDate = new Date(nowDate.getTime() - 24 * 60 * 60 * 1000);
  const tabDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (tabDate.getTime() === nowDate.getTime()) {
    // Today
    return timeStr;
  }

  if (tabDate.getTime() === yesterdayDate.getTime()) {
    // Yesterday
    return timeStr;
  }

  // Older - absolute date
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
};

/**
 * Get group key for tab grouping
 * Returns: 'today', 'yesterday', or date string
 */
export const getTabGroupKey = (timestamp: number): string => {
  const now = new Date();
  const date = new Date(timestamp);

  const nowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterdayDate = new Date(nowDate.getTime() - 24 * 60 * 60 * 1000);
  const tabDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  if (tabDate.getTime() === nowDate.getTime()) {
    return 'today';
  }

  if (tabDate.getTime() === yesterdayDate.getTime()) {
    return 'yesterday';
  }

  return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
};

/**
 * Get display label for group key
 */
export const getGroupLabel = (key: string): string => {
  const lang = getCurrentLanguage();
  const now = new Date();

  if (key === 'today') {
    // Show today with date
    const dateStr = now.toLocaleDateString(lang === 'zh' ? 'zh-CN' : 'en-US', {
      month: 'short',
      day: 'numeric',
    });
    return lang === 'zh' ? `今天 ${dateStr}` : `Today ${dateStr}`;
  }

  if (key === 'yesterday') {
    // Show yesterday with date
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const dateStr = yesterday.toLocaleDateString(lang === 'zh' ? 'zh-CN' : 'en-US', {
      month: 'short',
      day: 'numeric',
    });
    return lang === 'zh' ? `昨天 ${dateStr}` : `Yesterday ${dateStr}`;
  }

  return key;
};
