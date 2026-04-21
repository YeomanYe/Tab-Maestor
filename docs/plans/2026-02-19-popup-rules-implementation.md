# Popup 页面保存规则配置实现计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task.

**目标:** 在扩展图标的 popup 页面中添加保存规则配置功能，支持添加、编辑、删除规则，支持域名通配符和时间段配置。

**架构:**
- 新增 popup 页面组件，与 options 页面风格保持一致
- 使用 chrome.storage.local 持久化规则列表
- background script 在保存前检查规则匹配

**技术栈:** React, TypeScript, SCSS Modules, MobX

---

## Task 1: 更新 vite.config.ts 添加 popup 入口

**Files:**
- Modify: `vite.config.ts`

**Step 1: 修改 vite.config.ts 添加 popup 入口**

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import webExtension from '@samrum/vite-plugin-web-extension';
import { resolve } from 'path';
import pkg from './package.json';

export default defineConfig({
  plugins: [
    react(),
    webExtension({
      manifest: {
        name: pkg.name,
        description: pkg.description,
        version: pkg.version,
        manifest_version: 3,
        background: {
          service_worker: 'src/background/index.ts',
        },
        action: {
          default_popup: 'popup.html',
          default_title: 'Open Tab Maestro',
        },
        options_page: 'index.html',
        permissions: ['tabs', 'storage', 'contextMenus', 'notifications'],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  css: {
    modules: {
      localsConvention: 'camelCase',
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        popup: resolve(__dirname, 'popup.html'),
      },
    },
  },
});
```

**Step 2: Commit**

```bash
git add vite.config.ts
git commit -m "feat: add popup entry point"
```

---

## Task 2: 创建 popup.html

**Files:**
- Create: `popup.html`

**Step 1: 创建 popup.html**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Tab Maestro</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/popup/main.tsx"></script>
  </body>
</html>
```

**Step 2: Commit**

```bash
git add popup.html
git commit -m "feat: create popup.html"
```

---

## Task 3: 创建 popup/main.tsx 入口文件

**Files:**
- Create: `src/popup/main.tsx`

**Step 1: 创建目录和文件**

```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import Popup from './Popup';
import '../styles/global.scss';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>
);
```

**Step 2: Commit**

```bash
git add src/popup/main.tsx
git commit -m "feat: create popup entry point"
```

---

## Task 4: 创建 SaveRule 类型定义

**Files:**
- Modify: `src/types/index.ts`

**Step 1: 添加 SaveRule 类型**

```typescript
export interface SavedTab {
  id: string;
  title: string;
  url: string;
  favicon: string;
  savedAt: number;
  originalTabId?: number;
}

export interface SaveRule {
  id: string;
  domain: string;
  enabled: boolean;
  days: number[];
  startTime: string;
  endTime: string;
}
```

**Step 2: Commit**

```bash
git add src/types/index.ts
git commit -m "feat: add SaveRule type definition"
```

---

## Task 5: 创建 rulesStorage.ts 工具函数

**Files:**
- Create: `src/utils/rulesStorage.ts`

**Step 1: 创建 rulesStorage.ts**

```typescript
import { SaveRule } from '@/types';

const RULES_STORAGE_KEY = 'tab-maestro-rules';

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
  try {
    const result = await chrome.storage.local.get(RULES_STORAGE_KEY);
    return (result[RULES_STORAGE_KEY] as SaveRule[]) || [];
  } catch {
    return [];
  }
};

export const saveRules = async (rules: SaveRule[]): Promise<void> => {
  await chrome.storage.local.set({ [RULES_STORAGE_KEY]: rules });
};
```

**Step 2: Commit**

```bash
git add src/utils/rulesStorage.ts
git commit -m "feat: add rules storage utilities"
```

---

## Task 6: 创建 Popup.tsx 主组件

**Files:**
- Create: `src/popup/Popup.tsx`
- Create: `src/popup/Popup.module.scss`

**Step 1: 创建 Popup.module.scss**

```scss
@use '../styles/variables' as *;

.popup {
  width: 320px;
  min-height: 200px;
  padding: $spacing-md;
  background-color: $bg-primary;
  color: $text-primary;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: $spacing-md;
}

.title {
  font-size: $font-size-h2;
  font-weight: 600;
}

.addButton {
  display: flex;
  align-items: center;
  gap: $spacing-xs;
  padding: $spacing-xs $spacing-sm;
  background-color: $accent-primary;
  color: white;
  border: none;
  border-radius: $border-radius-sm;
  font-size: $font-size-body;
  cursor: pointer;

  &:hover {
    background-color: $accent-hover;
  }
}

.ruleList {
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
  max-height: 400px;
  overflow-y: auto;
}

.ruleItem {
  display: flex;
  flex-direction: column;
  gap: $spacing-xs;
  padding: $spacing-sm;
  background-color: $bg-secondary;
  border-radius: $border-radius-md;
}

.ruleHeader {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.ruleDomain {
  font-size: $font-size-body;
  font-weight: 500;
  color: $text-primary;
}

.ruleActions {
  display: flex;
  align-items: center;
  gap: $spacing-xs;
}

.ruleTime {
  font-size: $font-size-caption;
  color: $text-muted;
}

.iconButton {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background-color: transparent;
  color: $text-muted;
  border: none;
  border-radius: $border-radius-sm;
  cursor: pointer;

  &:hover {
    background-color: $bg-tertiary;
    color: $text-primary;
  }

  &.danger:hover {
    background-color: rgba($danger, 0.1);
    color: $danger;
  }
}

.toggle {
  position: relative;
  width: 36px;
  height: 20px;
  background-color: $border-color;
  border-radius: 10px;
  cursor: pointer;
  transition: background-color $transition-base;

  &.active {
    background-color: $accent-primary;
  }

  &::after {
    content: '';
    position: absolute;
    top: 2px;
    left: 2px;
    width: 16px;
    height: 16px;
    background-color: white;
    border-radius: 50%;
    transition: transform $transition-base;
  }

  &.active::after {
    transform: translateX(16px);
  }
}
```

**Step 2: 创建 Popup.tsx**

```typescript
import { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { SaveRule } from '@/types';
import { getRules, saveRules, createDefaultRule } from '@/utils/rulesStorage';
import RuleEditor from './RuleEditor';
import styles from './Popup.module.scss';

const Popup = observer(() => {
  const [rules, setRules] = useState<SaveRule[]>([]);
  const [currentDomain, setCurrentDomain] = useState<string>('');
  const [editingRule, setEditingRule] = useState<SaveRule | null>(null);

  useEffect(() => {
    loadRules();
    getCurrentTabDomain();
  }, []);

  const loadRules = async () => {
    const loadedRules = await getRules();
    setRules(loadedRules);
  };

  const getCurrentTabDomain = async () => {
    try {
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      const tab = tabs[0];
      if (tab?.url) {
        try {
          const url = new URL(tab.url);
          const domain = url.hostname.replace(/^www\./, '');
          setCurrentDomain(domain);
        } catch {
          // Ignore invalid URLs
        }
      }
    } catch {
      // Ignore errors
    }
  };

  const handleAddRule = () => {
    const newRule = createDefaultRule(currentDomain || 'example.com');
    setEditingRule(newRule);
  };

  const handleEditRule = (rule: SaveRule) => {
    setEditingRule(rule);
  };

  const handleDeleteRule = async (id: string) => {
    const newRules = rules.filter((r) => r.id !== id);
    await saveRules(newRules);
    setRules(newRules);
  };

  const handleToggleRule = async (id: string) => {
    const newRules = rules.map((r) =>
      r.id === id ? { ...r, enabled: !r.enabled } : r
    );
    await saveRules(newRules);
    setRules(newRules);
  };

  const handleSaveRule = async (rule: SaveRule) => {
    const existingIndex = rules.findIndex((r) => r.id === rule.id);
    let newRules: SaveRule[];

    if (existingIndex >= 0) {
      newRules = rules.map((r, i) => (i === existingIndex ? rule : r));
    } else {
      newRules = [...rules, rule];
    }

    await saveRules(newRules);
    setRules(newRules);
    setEditingRule(null);
  };

  const handleCancelEdit = () => {
    setEditingRule(null);
  };

  const formatTime = (rule: SaveRule): string => {
    if (rule.days.length === 0) {
      if (rule.startTime === '00:00' && rule.endTime === '23:59') {
        return '每天 全天';
      }
      return `每天 ${rule.startTime}-${rule.endTime}`;
    }

    const dayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    const days = rule.days.map((d) => dayNames[d]).join('、');
    return `${days} ${rule.startTime}-${rule.endTime}`;
  };

  return (
    <div className={styles.popup}>
      <div className={styles.header}>
        <h1 className={styles.title}>Tab Maestro</h1>
        <button className={styles.addButton} onClick={handleAddRule}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2" />
            <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2" />
          </svg>
          添加规则
        </button>
      </div>

      {editingRule ? (
        <RuleEditor
          rule={editingRule}
          onSave={handleSaveRule}
          onCancel={handleCancelEdit}
        />
      ) : (
        <div className={styles.ruleList}>
          {rules.length === 0 ? (
            <p style={{ color: '#71717a', textAlign: 'center', padding: '20px' }}>
              暂无规则，点击添加按钮创建规则
            </p>
          ) : (
            rules.map((rule) => (
              <div key={rule.id} className={styles.ruleItem}>
                <div className={styles.ruleHeader}>
                  <span className={styles.ruleDomain}>{rule.domain}</span>
                  <div className={styles.ruleActions}>
                    <button
                      className={`${styles.toggle} ${rule.enabled ? styles.active : ''}`}
                      onClick={() => handleToggleRule(rule.id)}
                      title={rule.enabled ? '禁用' : '启用'}
                    />
                    <button
                      className={styles.iconButton}
                      onClick={() => handleEditRule(rule)}
                      title="编辑"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="2" />
                        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" />
                      </svg>
                    </button>
                    <button
                      className={`${styles.iconButton} ${styles.danger}`}
                      onClick={() => handleDeleteRule(rule.id)}
                      title="删除"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <polyline points="3,6 5,6 21,6" stroke="currentColor" strokeWidth="2" />
                        <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" strokeWidth="2" />
                      </svg>
                    </button>
                  </div>
                </div>
                <span className={styles.ruleTime}>{formatTime(rule)}</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
});

export default Popup;
```

**Step 3: Commit**

```bash
git add src/popup/Popup.tsx src/popup/Popup.module.scss
git commit -m "feat: create Popup component"
```

---

## Task 7: 创建 RuleEditor 组件

**Files:**
- Create: `src/popup/RuleEditor.tsx`
- Create: `src/popup/RuleEditor.module.scss`

**Step 1: 创建 RuleEditor.module.scss**

```scss
@use '../styles/variables' as *;

.editor {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
  padding: $spacing-md;
  background-color: $bg-secondary;
  border-radius: $border-radius-md;
}

.field {
  display: flex;
  flex-direction: column;
  gap: $spacing-xs;
}

.label {
  font-size: $font-size-caption;
  color: $text-muted;
}

.input {
  padding: $spacing-sm;
  background-color: $bg-primary;
  border: 1px solid $border-color;
  border-radius: $border-radius-sm;
  color: $text-primary;
  font-size: $font-size-body;

  &:focus {
    outline: none;
    border-color: $accent-primary;
  }
}

.daySelector {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-xs;
}

.dayButton {
  padding: $spacing-xs $spacing-sm;
  background-color: $bg-primary;
  border: 1px solid $border-color;
  border-radius: $border-radius-sm;
  color: $text-secondary;
  font-size: $font-size-caption;
  cursor: pointer;

  &:hover {
    border-color: $text-muted;
  }

  &.active {
    background-color: $accent-primary;
    border-color: $accent-primary;
    color: white;
  }
}

.timeRow {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
}

.timeInput {
  flex: 1;
  padding: $spacing-sm;
  background-color: $bg-primary;
  border: 1px solid $border-color;
  border-radius: $border-radius-sm;
  color: $text-primary;
  font-size: $font-size-body;

  &:focus {
    outline: none;
    border-color: $accent-primary;
  }
}

.timeSeparator {
  color: $text-muted;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: $spacing-sm;
  margin-top: $spacing-sm;
}

.button {
  padding: $spacing-sm $spacing-md;
  border-radius: $border-radius-sm;
  font-size: $font-size-body;
  cursor: pointer;

  &.primary {
    background-color: $accent-primary;
    border: none;
    color: white;

    &:hover {
      background-color: $accent-hover;
    }
  }

  &.secondary {
    background-color: transparent;
    border: 1px solid $border-color;
    color: $text-secondary;

    &:hover {
      border-color: $text-muted;
    }
  }
}
```

**Step 2: 创建 RuleEditor.tsx**

```typescript
import { useState } from 'react';
import { SaveRule } from '@/types';
import styles from './RuleEditor.module.scss';

interface RuleEditorProps {
  rule: SaveRule;
  onSave: (rule: SaveRule) => void;
  onCancel: () => void;
}

const dayNames = ['日', '一', '二', '三', '四', '五', '六'];

const RuleEditor = ({ rule, onSave, onCancel }: RuleEditorProps) => {
  const [domain, setDomain] = useState(rule.domain);
  const [days, setDays] = useState<number[]>(rule.days);
  const [startTime, setStartTime] = useState(rule.startTime);
  const [endTime, setEndTime] = useState(rule.endTime);

  const handleDayToggle = (day: number) => {
    if (days.includes(day)) {
      setDays(days.filter((d) => d !== day));
    } else {
      setDays([...days, day].sort());
    }
  };

  const handleSave = () => {
    onSave({
      ...rule,
      domain,
      days,
      startTime: startTime || '00:00',
      endTime: endTime || '23:59',
    });
  };

  return (
    <div className={styles.editor}>
      <div className={styles.field}>
        <label className={styles.label}>域名</label>
        <input
          type="text"
          className={styles.input}
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          placeholder="example.com 或 *.example.com"
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>日期（留空表示每天）</label>
        <div className={styles.daySelector}>
          {dayNames.map((name, index) => (
            <button
              key={index}
              type="button"
              className={`${styles.dayButton} ${days.includes(index) ? styles.active : ''}`}
              onClick={() => handleDayToggle(index)}
            >
              周{name}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>时间段</label>
        <div className={styles.timeRow}>
          <input
            type="time"
            className={styles.timeInput}
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
          <span className={styles.timeSeparator}>-</span>
          <input
            type="time"
            className={styles.timeInput}
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.actions}>
        <button type="button" className={`${styles.button} ${styles.secondary}`} onClick={onCancel}>
          取消
        </button>
        <button type="button" className={`${styles.button} ${styles.primary}`} onClick={handleSave}>
          保存
        </button>
      </div>
    </div>
  );
};

export default RuleEditor;
```

**Step 3: Commit**

```bash
git add src/popup/RuleEditor.tsx src/popup/RuleEditor.module.scss
git commit -m "feat: create RuleEditor component"
```

---

## Task 8: 更新 background script 添加规则检查逻辑

**Files:**
- Modify: `src/background/index.ts`

**Step 1: 添加规则检查函数**

在 `src/background/index.ts` 中添加:

```typescript
// ... existing code ...

// Rule interface for type checking
interface SaveRule {
  id: string;
  domain: string;
  enabled: boolean;
  days: number[];
  startTime: string;
  endTime: string;
}

const RULES_STORAGE_KEY = 'tab-maestro-rules';

// Get saved rules
async function getRules(): Promise<SaveRule[]> {
  try {
    const result = await chrome.storage.local.get(RULES_STORAGE_KEY);
    return (result[RULES_STORAGE_KEY] as SaveRule[]) || [];
  } catch {
    return [];
  }
}

// Check if domain matches rule pattern
function matchDomain(url: string, pattern: string): boolean {
  try {
    const urlObj = new URL(url);
    const urlDomain = urlObj.hostname.replace(/^www\./, '');

    // Convert pattern to regex
    // *.example.com -> matches example.com, sub.example.com, etc.
    let regexPattern = pattern
      .replace(/\./g, '\\.')
      .replace(/\*/g, '.*');

    const regex = new RegExp(`^${regexPattern}$`, 'i');
    return regex.test(urlDomain);
  } catch {
    return false;
  }
}

// Check if current time matches rule time
function matchTime(rule: SaveRule): boolean {
  const now = new Date();
  const currentDay = now.getDay();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  // Parse rule time
  const [startHour, startMin] = rule.startTime.split(':').map(Number);
  const [endHour, endMin] = rule.endTime.split(':').map(Number);
  const startMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;

  // Check day
  const dayMatch = rule.days.length === 0 || rule.days.includes(currentDay);

  // Check time
  const timeMatch = currentMinutes >= startMinutes && currentMinutes <= endMinutes;

  return dayMatch && timeMatch;
}

// Check if URL should be blocked by rules
async function shouldBlockByRules(url: string): Promise<boolean> {
  const rules = await getRules();
  const enabledRules = rules.filter((r) => r.enabled);

  for (const rule of enabledRules) {
    if (matchDomain(url, rule.domain) && matchTime(rule)) {
      return true;
    }
  }

  return false;
}

// ... existing saveAllTabs function modification ...
```

**Step 2: 修改 saveAllTabs 函数添加规则检查**

```typescript
async function saveAllTabs(): Promise<void> {
  try {
    const allTabs = await chrome.tabs.query({});

    const validTabs = allTabs.filter(
      (tab) =>
        tab.url &&
        !tab.url.startsWith('chrome://') &&
        !tab.url.startsWith('chrome-extension://') &&
        !tab.pinned
    );

    if (validTabs.length === 0) {
      await showNotification('Tab Maestro', 'No tabs to save');
      return;
    }

    const storedTabs = await getStoredTabs();
    const tabsToSave: SavedTab[] = [];
    const blockedTabs: string[] = [];
    const tabIdsToClose: number[] = [];

    // Check each tab against rules
    for (const tab of validTabs) {
      if (tab.id && tab.url) {
        // Check if blocked by rules
        const isBlocked = await shouldBlockByRules(tab.url);
        if (isBlocked) {
          blockedTabs.push(tab.url);
          continue;
        }

        const newTab: SavedTab = {
          id: uuidv4(),
          title: tab.title || 'Untitled',
          url: tab.url,
          favicon: tab.favIconUrl || '',
          savedAt: Date.now(),
          originalTabId: tab.id,
        };
        tabsToSave.push(newTab);
        tabIdsToClose.push(tab.id);
      }
    }

    if (tabsToSave.length === 0) {
      if (blockedTabs.length > 0) {
        await showNotification('Tab Maestro', `所有标签页已被规则阻止`);
      } else {
        await showNotification('Tab Maestro', 'No tabs to save');
      }
      return;
    }

    const updatedTabs = [...tabsToSave, ...storedTabs];
    await saveStoredTabs(updatedTabs);

    // Close valid tabs (not blocked)
    if (tabIdsToClose.length > 0) {
      await chrome.tabs.remove(tabIdsToClose);
    }

    let message = `Saved and closed ${tabsToSave.length} tab(s)`;
    if (blockedTabs.length > 0) {
      message += `, ${blockedTabs.length} blocked by rules`;
    }
    await showNotification('Tab Maestro', message);

    await focusOrOpenOptionsPage();
  } catch {
    await showNotification('Tab Maestro', 'Failed to save tabs');
  }
}
```

**Step 3: Commit**

```bash
git add src/background/index.ts
git commit -m "feat: add rule checking logic to background script"
```

---

## Task 9: 构建并测试

**Step 1: 构建项目**

```bash
pnpm build
```

**Step 2: 在 Chrome 中加载扩展测试**

1. 打开 `chrome://extensions/`
2. 启用开发者模式
3. 点击 "加载已解压的扩展程序"
4. 选择 `dist` 文件夹

**Step 3: 测试功能**

- 点击扩展图标打开 popup
- 验证当前域名是否自动填充
- 添加、编辑、删除规则
- 使用 "Save All Tabs" 测试规则是否生效

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: complete popup rules feature"
```

---

## 计划完成

实现计划已保存到 `docs/plans/2026-02-19-popup-rules-design.md`

**两种执行方式:**

1. **Subagent-Driven (当前会话)** - 每个任务派遣新的 subagent，任务间进行代码审查，快速迭代

2. **Parallel Session (新会话)** - 在新会话中打开，使用 superpowers:executing-plans 批量执行

**选择哪种方式?**
