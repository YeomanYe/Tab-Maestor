# UI/UX 规范

## 布局结构

**选项页面布局:**
- 单页应用，包含 header、main content 和 footer
- 最大宽度: 720px，居中
- 最小高度: 100vh
- 响应式: 适配所有屏幕尺寸

**页面分区:**
1. **Header** - 应用标题、logo和操作按钮
2. **Tab List** - 可滚动的已保存标签页列表
3. **Empty State** - 无保存标签页时显示

## 视觉设计

### 色彩系统

- Background Primary: `#0f0f0f` (近黑色)
- Background Secondary: `#1a1a1a` (卡片背景)
- Background Tertiary: `#252525` (悬停状态)
- Accent Primary: `#6366f1` (indigo-500)
- Accent Hover: `#818cf8` (indigo-400)
- Text Primary: `#fafafa` (近白色)
- Text Secondary: `#a1a1aa` (zinc-400)
- Text Muted: `#71717a` (zinc-500)
- Border: `#27272a` (zinc-800)
- Success: `#22c55e` (green-500)
- Danger: `#ef4444` (red-500)

### 排版

- 字体: `"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`
- 标题 (H1): 24px, font-weight: 600
- 标题 (H2): 18px, font-weight: 600
- 正文: 14px, font-weight: 400
-  Caption: 12px, font-weight: 400

### 间距系统

- 基础单位: 4px
- XS: 4px, SM: 8px, MD: 16px, LG: 24px, XL: 32px

### 视觉效果

- 卡片阴影: `0 4px 24px rgba(0, 0, 0, 0.4)`
- 圆角: 8px (cards), 6px (buttons), 4px (inputs)
- 过渡: 150ms ease-out
- 悬停缩放: 1.01

## 组件

### 1. Header

- App logo (简单图标 + 文字)
- "Save Current Tab" 按钮 (主要操作)
- "Save All Tabs" 按钮 (次要操作)
- 标签页计数徽章

### 2. Tab Card

- Favicon (16x16)
- 标签页 URL (截断)
- 时间戳 (今天/昨天显示时间，更早显示日期)
- 删除按钮 (悬停时显示)
- 点击 URL 打开并从列表删除

### 3. Empty State

- 插图或图标
- "No saved tabs" 消息
- 简短说明文字

### 4. Action Buttons

- 主要: 填充强调色
- 次要: 边框描边
- 图标按钮: 32x32，悬停时背景微亮

### 5. Toast 通知

- 成功/错误反馈
- 3秒后自动消失
- 滑入动画

## 交互与状态

- **悬停:** 背景微变，轻微缩放
- **激活:** 缩小 (0.98)
- **禁用:** 50% 透明度，cursor not-allowed
- **加载:** 旋转图标
- **聚焦:** 强调色轮廓环
