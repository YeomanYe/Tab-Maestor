# 技术规范

## 技术栈

- **框架:** React 18
- **状态管理:** MobX 6
- **语言:** TypeScript
- **构建工具:** Vite
- **测试:** Vitest
- **包管理器:** pnpm
- **样式:** SCSS Modules (`.module.scss`)
- **代码检查:** ESLint + Prettier

## 项目结构

```
tab-maestro/
├── public/
├── src/
│   ├── background/
│   │   └── index.ts
│   ├── components/
│   │   ├── Header/
│   │   ├── TabList/
│   │   ├── TabCard/
│   │   ├── EmptyState/
│   │   └── Toast/
│   ├── stores/
│   │   └── TabStore.ts
│   ├── styles/
│   │   ├── _variables.scss
│   │   └── global.scss
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   ├── storage.ts
│   │   ├── date.ts
│   │   └── mockData.ts
│   ├── App.tsx
│   ├── App.module.scss
│   └── main.tsx
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── vitest.config.ts
├── .eslintrc.cjs
└── .prettierrc
```

## Chrome 扩展 Manifest

```json
{
  "manifest_version": 3,
  "name": "Tab Maestro",
  "version": "1.0.0",
  "description": "Save and manage your browser tabs",
  "permissions": ["tabs", "storage"],
  "background": {
    "service_worker": "src/background/index.ts",
    "type": "module"
  },
  "action": {
    "default_title": "Open Tab Maestro"
  },
  "options_page": "index.html"
}
```

## 构建配置

- 使用 `@samrum/vite-plugin-web-extension` 插件
- 输出格式: ES modules
- 支持 HMR
