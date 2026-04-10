# Tab Maestro 开发记录

## 2026-02-19 更新

### 1. 构建修复

**问题**: Vite 构建失败
```
Invalid value "iife" for option "output.format" - UMD and IIFE output formats are not supported for code-splitting builds.
```

**解决方案**: 简化 vite 配置，移除手动 output 配置，让 `@samrum/vite-plugin-web-extension` 插件自动处理。

**相关文件**:
- `vite.config.ts`

### 2. TabCard 简化

**改动**:
- 列表项更小更紧凑
- 只保留：网页图标 + URL + 删除按钮
- 点击 URL 即可打开网页并从列表中删除
- 移除外边框和背景色

**相关文件**:
- `src/components/TabCard/TabCard.tsx`
- `src/components/TabCard/TabCard.module.scss`

### 3. 按天分组显示

**功能**:
- Tab 按保存时间分组显示
- 组标题：`今天`、`昨天`、日期（如 `Feb 15, 2026`）
- 时间显示：
  - 今天/昨天：显示时间（如 "14:30"）
  - 更早：显示绝对日期（如 "Feb 15"）
- 时间与组标题对齐显示

**相关文件**:
- `src/components/TabList/TabList.tsx`
- `src/components/TabList/TabList.module.scss`
- `src/utils/date.ts` (新增)

### 4. Mock 数据

**功能**: 在非 Chrome 扩展环境（普通浏览器页面）访问时自动加载 mock 数据，方便测试。

**相关文件**:
- `src/utils/mockData.ts` (新增)
- `src/utils/storage.ts`

### 5. public 目录

**问题**: 缺少 `public` 目录导致 Vite dev 模式报错

**解决方案**: 创建空的 `public` 目录。

### 6. Save All 功能更新

**改动**:
- Save All 不再去重，所有标签页都会被保存（允许重复）
- 保存后关闭所有有效标签页
- 保存完成后自动切换到 options 页面，如果已打开则刷新显示

**相关文件**:
- `src/background/index.ts`

### 7. 移除 Save Current 按钮

**改动**:
- 从 options 页面 Header 中移除 "Save Current" 按钮
- "Save Current" 功能仅通过扩展图标的右键菜单提供

**相关文件**:
- `src/components/Header/Header.tsx`
