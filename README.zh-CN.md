[English](README.md) | [中文](README.zh-CN.md)

# Tab Maestro

Chrome 浏览器标签页管理扩展，支持自动过滤规则。

## 功能特性

- **保存标签页**:
  - **保存当前标签页 (Save Current Tab)**: 保存并关闭当前活动标签页
    - 获取标签页标题、URL、favicon等信息
    - 保存后自动关闭当前标签页
    - 如果选项页已打开，自动刷新
  - **保存所有标签页 (Save All Tabs)**: 保存并关闭所有窗口的非固定标签页
    - 过滤掉固定的标签页和扩展程序自身的选项页面
    - 检查每个标签页是否被规则阻止
    - 保存后自动关闭所有有效标签页
    - 显示保存和阻止的标签页数量
    - 自动打开或聚焦选项页面
- **过滤规则**: 配置过滤计划
  - 设置每周具体日期
  - 设置时间范围（如 9:00 - 18:00）
  - 支持通配符域名 (*.example.com)
- **自动保存**: 自动保存长时间不活动的标签页
  - 设置自动保存延迟时间（15分钟、30分钟、45分钟、1小时、1.5小时、2小时或自定义）
  - 当标签页不活动达到设定时间时自动保存并关闭
  - **注意**: 以下标签页不会被保存:
    - 浏览器中固定的标签页
    - 扩展程序自身的选项页面
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
│   │   ├── AutoSaveSetting/ # 自动过滤设置
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
