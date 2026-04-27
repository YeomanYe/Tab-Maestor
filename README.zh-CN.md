[English](README.md) | [中文](README.zh-CN.md)

# Tab Maestro

Chrome 浏览器标签页管理扩展，支持自动保存规则。

## 功能特性

- **保存标签页**: 保存当前标签页或所有窗口的标签页
- **自动保存规则**: 配置自动保存计划
  - 设置每周具体日期
  - 设置时间范围（如 9:00 - 18:00）
  - 支持通配符域名 (*.example.com)
- **搜索与筛选**: 搜索已保存的标签页，按日期范围筛选
- **主题支持**: 浅色和深色主题，配以暖黄色点缀
- **多语言**: 英语和简体中文
- **标签管理**: 查看、打开、置顶和删除已保存的标签页

## 安装步骤

1. 克隆仓库
2. 安装依赖：
   ```bash
   pnpm install
   ```
3. 构建扩展：
   ```bash
   pnpm build
   ```
4. 在 Chrome 中加载扩展：
   - 打开 `chrome://extensions/`
   - 启用"开发者模式"
   - 点击"加载已解压的扩展程序"
   - 选择 `dist` 文件夹

## 开发命令

```bash
# 启动开发服务器
pnpm dev

# 运行测试
pnpm test

# 监听模式运行测试
pnpm test:watch

# 代码检查
pnpm lint

# 自动修复代码检查问题
pnpm lint:fix

# 样式检查
pnpm lint:style

# 自动修复样式检查问题
pnpm lint:style:fix

# 代码格式化
pnpm format
```

## 技术栈

- React 18
- TypeScript
- MobX（状态管理）
- SCSS Modules
- Vite
- Vitest
- ESLint
- Stylelint
- Husky

## 项目结构

```
tab-maestro/
├── docs/                    # 需求规格文档
├── __test__/                # 测试文件
├── public/
│   └── manifest.json         # Chrome 扩展清单
├── src/
│   ├── background/           # 后台脚本
│   ├── components/          # React 组件
│   │   ├── AutoSaveSetting/ # 自动保存设置
│   │   ├── DateFilterBar/   # 日期筛选栏
│   │   ├── Header/          # 头部组件
│   │   ├── SearchBox/       # 搜索框
│   │   ├── TabCard/         # 标签卡片
│   │   ├── TabList/         # 标签列表
│   │   └── ...
│   ├── contexts/            # React 上下文
│   ├── popup/              # 弹窗页面组件
│   ├── stores/             # MobX 状态管理
│   ├── styles/             # 全局样式
│   ├── types/              # TypeScript 类型定义
│   └── utils/              # 工具函数
├── .husky/                  # Git 钩子
├── package.json
├── vite.config.ts
├── vitest.config.ts
└── tsconfig.json
```

## 主题

扩展使用暖黄色主题：

- **背景色**: `#FFFCF0` (浅色) / `#1C1917` (深色)
- **强调色**: `#EAB308` (浅色) / `#FBBF24` (深色)
- **字体**: Nunito

## 许可证

MIT
