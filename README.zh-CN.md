[English](README.md) | [中文](README.zh-CN.md)

# Tab Maestro

Chrome 浏览器标签页管理扩展。

## 功能特性

- 保存当前标签页或所有窗口的标签页
- 查看和管理已保存的标签页
- 一键打开已保存的标签页
- 删除单个标签页或清空全部
- 深色主题，配以靛蓝色点缀
- Toast 通知反馈

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
│   ├── stores/              # MobX 状态管理
│   ├── styles/             # 全局样式
│   ├── types/              # TypeScript 类型定义
│   └── utils/              # 工具函数
├── .husky/                  # Git 钩子
├── package.json
├── vite.config.ts
├── vitest.config.ts
└── tsconfig.json
```

## 许可证

MIT
