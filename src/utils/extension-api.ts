/**
 * Cross-browser extension API abstraction layer
 * Uses webextension-polyfill to provide unified browser.* API
 * that works across Chrome, Firefox, Safari, and Edge
 */

import * as browser from 'webextension-polyfill';

// Re-export all browser APIs we use
export const storage = browser.storage;
export const tabs = browser.tabs;
export const runtime = browser.runtime;
export const notifications = browser.notifications;
export const contextMenus = browser.contextMenus;
export const commands = browser.commands;
export const windows = browser.windows;

// Alarms API - not supported in Safari
// Safari fallback implementation using setTimeout
interface AlarmInfo {
  name: string;
  periodInMinutes: number;
}

let alarmsFallback: Map<string, AlarmInfo> = new Map();
let alarmsCallback: ((alarm: AlarmInfo) => void) | null = null;
let alarmsInterval: ReturnType<typeof setInterval> | null = null;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const safeAlarms: any = browser.alarms;

function startAlarmsFallback(): void {
  if (alarmsInterval) return;

  alarmsInterval = setInterval(() => {
    if (!alarmsCallback) return;

    const now = Date.now();
    for (const [name, alarm] of alarmsFallback.entries()) {
      const intervalMs = alarm.periodInMinutes * 60 * 1000;
      if (now - (alarm as unknown as { lastTriggered: number }).lastTriggered >= intervalMs) {
        alarmsCallback(alarm);
        (alarm as unknown as { lastTriggered: number }).lastTriggered = now;
      }
    }
  }, 1000); // Check every second
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const alarmsAPI: any = {
  create: (name: string, alarmInfo: { periodInMinutes?: number }): void => {
    if (safeAlarms?.create) {
      safeAlarms.create(name, alarmInfo);
    } else {
      // Safari fallback using setTimeout
      alarmsFallback.set(name, {
        name,
        periodInMinutes: alarmInfo.periodInMinutes || 1,
        lastTriggered: Date.now(),
      } as unknown as AlarmInfo);
      startAlarmsFallback();
    }
  },

  onAlarm: {
    addListener: (callback: (alarm: AlarmInfo) => void): void => {
      if (safeAlarms?.onAlarm?.addListener) {
        safeAlarms.onAlarm.addListener(callback);
      } else {
        // Safari fallback
        alarmsCallback = callback;
        startAlarmsFallback();
      }
    },
  },
};

export const alarms = alarmsAPI;

// Check if alarms API is available
export const isAlarmsSupported = (): boolean => {
  return !!safeAlarms?.create;
};

// Check if contextMenus API is available
export const isContextMenusSupported = (): boolean => {
  return !!browser.contextMenus;
};

// Export browser instance for direct access if needed
export { browser };
