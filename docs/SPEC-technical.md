# 技术规范

## 技术栈

- **框架:** React 18
- **状态管理:** MobX 6 (makeAutoObservable)
- **语言:** TypeScript
- **构建工具:** Vite 5 + @samrum/vite-plugin-web-extension
- **测试:** Vitest + React Testing Library
- **包管理器:** pnpm
- **样式:** SCSS Modules (`.module.scss`)
- **代码检查:** ESLint + Prettier + Stylelint

## 项目结构

```
tab-maestro/
├── public/                     # 静态资源
├── src/
│   ├── background/             # Service Worker (后台服务)
│   │   └── index.ts           # 快捷键、上下文菜单、自动保存
│   ├── components/            # React 组件 (按功能模块组织)
│   │   ├── Header/            # 头部组件 (标题、按钮、搜索)
│   │   ├── TabList/           # 标签页列表组件
│   │   ├── TabCard/           # 单个标签页卡片
│   │   ├── DateFilterBar/     # 日期范围筛选器
│   │   ├── SearchBox/         # 搜索框组件
│   │   ├── EmptyState/        # 空状态组件
│   │   ├── ThemeSwitcher/     # 主题切换器
│   │   ├── LanguageSwitcher/  # 语言切换器
│   │   ├── Toast/             # 通知提示组件
│   │   └── AutoSaveSetting/   # 自动保存设置组件
│   ├── popup/                 # Popup 弹窗
│   │   ├── main.tsx           # Popup 入口
│   │   ├── Popup.tsx          # Popup 主组件
│   │   └── RuleEditor.tsx     # 规则编辑器
│   ├── contexts/              # React Context
│   │   └── ThemeContext.tsx  # 主题上下文
│   ├── stores/                # MobX 状态管理
│   │   └── TabStore.ts       # 核心数据 store
│   ├── styles/                # 全局样式
│   │   ├── _variables.scss   # SCSS 变量
│   │   └── global.scss       # 全局样式
│   ├── types/                 # TypeScript 类型定义
│   │   └── index.ts          # SavedTab, TabInfo, SaveRule 接口
│   ├── utils/                 # 工具函数
│   │   ├── storage.ts        # Chrome storage 抽象层
│   │   ├── rulesStorage.ts   # 规则存储工具
│   │   ├── i18n.ts          # 国际化 (en/zh)
│   │   ├── date.ts          # 日期处理和分组
│   │   └── mockData.ts      # 开发用模拟数据
│   ├── App.tsx               # 选项页面根组件
│   ├── App.module.scss       # 根组件样式
│   └── main.tsx              # 选项页面入口
├── index.html                 # 选项页面 HTML
├── popup.html                 # Popup HTML
├── package.json               # 项目配置
├── tsconfig.json              # TypeScript 配置
├── vite.config.ts             # Vite 构建配置
├── vitest.config.ts           # Vitest 测试配置
├── .eslintrc.cjs              # ESLint 配置
└── .prettierrc                # Prettier 配置
```

## Chrome 扩展 Manifest

Manifest 由 `@samrum/vite-plugin-web-extension` 插件从 `vite.config.ts` 自动生成，核心配置：

```json
{
  "manifest_version": 3,
  "name": "Tab Maestro",
  "version": "1.0.0",
  "description": "Save and manage your browser tabs",
  "permissions": [
    "tabs",
    "storage",
    "contextMenus",
    "notifications"
  ],
  "background": {
    "service_worker": "src/background/index.ts",
    "type": "module"
  },
  "action": {
    "default_title": "Open Tab Maestro"
  },
  "options_page": "index.html",
  "commands": {
    "save-current-tab": "Ctrl+Q",
    "save-all-tabs": "Ctrl+Shift+Q"
  }
}
```

## 构建配置

- 使用 `@samrum/vite-plugin-web-extension` 插件自动生成 manifest
- 输出格式: ES modules
- 支持 HMR (热更新)
- 入口点: `index.html` (选项页面), `popup.html` (弹窗), `src/background/index.ts` (后台)

## 数据模型

```typescript
// 已保存的标签页
interface SavedTab {
  id: string;           // UUID
  title: string;        // 页面标题
  url: string;          // 页面 URL
  favicon: string;      // Favicon URL 或 data URI
  savedAt: number;     // 保存时间戳 (Unix timestamp)
  visitedAt?: number;  // 上次访问时间戳 (自动保存功能)
  pinned?: boolean;     // 是否置顶
  originalTabId?: number; // 原始标签页 ID
}

// 标签页信息 (保存时使用)
interface TabInfo {
  id?: number;
  title: string;
  url: string;
  favIconUrl: string;
  originalTabId?: number;
}

// 保存规则 (自动保存)
interface SaveRule {
  id: string;         // UUID
  domain: string;    // 域名模式，支持通配符 (*.example.com)
  enabled: boolean; // 是否启用
  days: number[];   // 星期几 (0-6，0为周日，空数组表示每天)
  startTime: string; // 开始时间 (HH:mm)
  endTime: string;  // 结束时间 (HH:mm)
}
```

## 核心模块

### TabStore (`src/stores/TabStore.ts`)
- 管理所有标签页数据
- 处理搜索、筛选、排序逻辑
- 提供 CRUD 操作 (添加、打开、删除、置顶)
- 存储设置到 chrome.storage.sync

### Storage 工具 (`src/utils/storage.ts`)
- 环境检测: Chrome 扩展 vs 开发服务器
- 双层存储: chrome.storage + localStorage 降级
- MobX Observable 转换

### Rules 存储 (`src/utils/rulesStorage.ts`)
- 域名转换为通配符模式
- 规则 CRUD 操作

### 国际化 (`src/utils/i18n.ts`)
- 支持中文 (zh) 和英文 (en)
- localStorage 保存语言偏好
- 浏览器语言自动检测
