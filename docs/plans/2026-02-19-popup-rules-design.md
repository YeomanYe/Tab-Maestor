# Popup 页面 - 保存规则配置

## 概述

在扩展图标的 popup 页面中，允许用户配置保存规则，可以完全自定义域名匹配和时间段。

## 功能

1. **弹出 Popup** → 自动获取当前 tab 的一级域名作为默认填充
2. **添加规则** → 使用当前域名作为默认值，显示编辑弹窗
3. **编辑规则** → 点击编辑按钮，修改域名/时间，显示编辑弹窗
4. **删除规则** → 确认后删除
5. **启用/禁用** → 点击开关切换

## 数据模型

```typescript
interface SaveRule {
  id: string;
  domain: string;        // 域名，支持通配符 *（默认：当前 tab 的一级域名）
  enabled: boolean;       // 是否启用
  days: number[];        // 0-6, 周日到周六，[] 表示每天
  startTime: string;     // "HH:mm" 格式，如 "09:00"
  endTime: string;       // "HH:mm" 格式，如 "18:00"
}
```

## 规则匹配逻辑

当用户点击 "Save All Tabs" 时:
1. 获取当前 tab 的域名
2. 遍历所有**已启用**的规则
3. 如果域名匹配规则 **且** 当前时间在规则的时间段内 → **阻止保存**
4. 否则 → 允许保存

## 持久化

- 使用 `chrome.storage.local` 存储规则列表
- Key: `tab-maestro-rules`
