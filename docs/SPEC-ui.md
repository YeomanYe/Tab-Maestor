# UI/UX 规范

## 布局结构

**选项页面布局:**
- 单页应用，包含 header、main content 和 footer
- 最大宽度: 720px，居中
- 最小高度: 100vh
- 响应式: 适配所有屏幕尺寸

**页面分区:**
1. **Header** - 应用标题、logo、自动保存设置、搜索框
2. **Tab List** - 可滚动的已保存标签页列表
3. **DateFilterBar** - 固定底部的日期范围筛选器
4. **Empty State** - 无保存标签页时显示

**Popup 页面布局:**
- 固定宽度: 360px
- 固定高度: 最小 400px
- 默认显示规则编辑器（添加新规则）
- 可切换到规则列表视图

## 视觉设计

### 色彩系统 - 暖黄色主题

**浅色模式 (默认):**
- Background Primary: `#FFFCF0` (暖白米色)
- Background Secondary: `#FFF8E7` (浅奶油色)
- Background Tertiary: `#FFF0D4` (浅黄色)
- Accent Primary: `#EAB308` (暖黄色)
- Accent Hover: `#CA8A04` (深黄色)
- Accent Subtle: `#FEF3C7` (淡黄色)
- Text Primary: `#292524` (深灰)
- Text Secondary: `#57534E` (中灰)
- Text Muted: `#A8A29E` (浅灰)
- Border: `#E7E5E4` (边框灰)
- Success: `#65A30D` (绿色)
- Danger: `#DC2626` (红色)

**暗色模式:**
- Background Primary: `#1C1917` (深灰)
- Background Secondary: `#292524` (中深灰)
- Background Tertiary: `#44403C` (深灰)
- Accent Primary: `#FBBF24` (亮黄)
- Accent Hover: `#F59E0B` (橙黄)
- Accent Subtle: `#78350F` (深褐色)
- Text Primary: `#FAFAF9` (近白)
- Text Secondary: `#D6D3D1` (浅灰)
- Text Muted: `#78716C` (中灰)
- Border: `#44403C` (边框灰)
- Success: `#84CC16` (亮绿)
- Danger: `#EF4444` (亮红)

### 排版

- 字体: `"Nunito", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`
- 标题 (H1): 22px, font-weight: 700
- 标题 (H2): 16px, font-weight: 600
- 正文: 14px, font-weight: 400
- Caption: 12px, font-weight: 400

### 间距系统

- 基础单位: 4px
- XS: 4px, SM: 8px, MD: 16px, LG: 24px, XL: 32px

### 视觉效果

- 卡片阴影: `0 2px 8px rgb(234 179 8 / 8%)`
- 圆角: 12px (cards), 8px (buttons), 6px (inputs), 50px (pills)
- 过渡: 200ms ease-out

## 组件

### 1. Header

- App logo (图标 + 文字)
- "Save All Tabs" 按钮
- 标签页计数徽章
- 自动保存设置下拉菜单
- 搜索框
- 主题切换器
- 语言切换器

### 2. DateFilterBar (固定底部)

- 快捷筛选药丸按钮 (全部/今天/本周/本月)
- 日期范围输入框 (开始日期 → 结束日期)
- 清除筛选按钮
- 圆角药丸设计，激活状态有渐变背景

### 3. SearchBox

- 药丸形状搜索输入框
- 搜索图标在左侧
- 清除按钮在右侧
- 聚焦时有黄色光环效果

### 4. AutoSaveSetting

- 自定义下拉菜单
- 预设选项 (15min, 30min, 45min, 1hour, 1.5hours, 2hours)
- 自定义输入框支持手动输入任意分钟数
- 选中状态有黄色高亮指示器
- 下拉菜单淡入动画

### 5. Tab Card

- Favicon (16x16)
- 标签页 URL (截断显示省略号)
- 时间戳 (今天/昨天显示时间，更早显示日期)
- 删除按钮 (悬停时显示)
- 置顶徽章
- 点击 URL 打开并从列表删除

### 6. Popup - Rule Editor

- 网站域名输入框
- 快捷日期选择按钮 (每天/工作日/周末)
- 星期按钮网格 (一二三四五六日)
- 时间范围选择器 (开始时间 - 结束时间)
- 保存/取消按钮

### 7. Popup - Rule List

- 规则卡片显示域名和生效日期
- 启用/禁用开关
- 编辑/删除按钮
- 每天显示特殊徽章

### 8. Empty State

- 图标 + 文字说明
- "暂无保存的标签页" 消息

### 9. Toast 通知

- 成功/错误反馈
- 3秒后自动消失
- 滑入动画

## 交互与状态

- **悬停:** 背景微变，轻微阴影
- **激活:** 缩放 (0.98)
- **禁用:** 50% 透明度，cursor not-allowed
- **加载:** 旋转图标
- **聚焦:** 黄色强调色轮廓环
- **下拉菜单:** 点击外部关闭，点击内部保持展开
- **日期选择:** 选择开始日期后，结束日期自动限制最小值
- **星期选择:** 点击选中，再次点击无效（不能取消）
