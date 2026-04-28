# Tab Maestro - 项目概览

## 项目信息

- **项目名称:** Tab Maestro
- **类型:** Chrome 扩展程序 (Manifest V3)
- **核心功能:** 允许用户从选项页面保存/收集打开的浏览器标签页到一个管理列表中，之后可以一键恢复。支持自动保存规则、标签页分组、置顶等功能。
- **目标用户:** 经常使用大量浏览器标签页并需要一种方式来组织/保存它们的高级用户。

## 扩展架构

Tab Maestro 是一个具有**三个入口点**的 Chrome 扩展程序：

| 入口点 | 文件 | 描述 |
|--------|------|------|
| **选项页面 (Options Page)** | `index.html` → `src/main.tsx` → `src/App.tsx` | 主管理界面，全功能标签页管理 |
| **弹出页面 (Popup)** | `popup.html` → `src/popup/main.tsx` → `src/popup/Popup.tsx` | 快速操作弹窗，用于规则管理 |
| **后台服务 (Background)** | `src/background/index.ts` | Service Worker，处理快捷键、上下文菜单、自动保存 |

## 核心设计

### 状态管理
- **MobX** 用于全局状态管理
- `TabStore` 是核心 store，管理所有标签页数据和 UI 状态
- 使用 `observer` HOC 实现响应式 UI 更新

### 数据存储
- **chrome.storage.local**: 存储标签页数据 (`tab-maestro-tabs`) 和保存规则 (`tab-maestro-rules`)
- **chrome.storage.sync**: 存储用户偏好设置（日期筛选、自动保存延迟等）
- **localStorage**: 开发环境和测试时的降级方案

### 消息通信
- 后台服务与选项页面通过 `chrome.runtime.onMessage` 进行通信
- 支持自动保存延迟更新等消息类型

## 相关文档

- [UI/UX 规范](./SPEC-ui.md)
- [功能规范](./SPEC-functionality.md)
- [技术规范](./SPEC-technical.md)
- [验收标准](./SPEC-acceptance.md)
