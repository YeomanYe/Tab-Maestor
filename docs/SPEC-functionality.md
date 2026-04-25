# 功能规范

## 核心功能

### 1. 保存当前标签页

- 点击按钮保存当前活动的标签页
- 存储: title, url, favicon, timestamp
- 显示成功 toast

### 2. 保存所有标签页

- 保存所有窗口中的标签页
- 显示已保存标签页数量
- 不去重: 所有标签页都会被保存（允许重复保存）
- 关闭所有已保存的标签页
- 保存完成后自动切换到 options 页面并刷新显示

### 3. 查看已保存标签页

- 列表显示所有已保存标签页
- 按保存时间排序 (最新优先)
- 显示 favicon、URL、保存时间

### 4. 打开已保存标签页

- 点击在新区打开标签页
- 打开后从列表中删除

### 5. 删除已保存标签页

- 删除单个标签页
- 全部删除选项

### 6. 清除全部

- 清除所有已保存标签页 (需确认)

### 7. Popup 页面规则管理

- 点击扩展图标打开 popup 页面
- 自动打开添加规则界面，显示当前标签页域名
- 域名自动转换为通配符格式:
  - `www.baidu.com` → `*.baidu.com`
  - `docs.github.com` → `*.github.com`
  - `github.com` → `github.com` (两级域名保持不变)
- 支持添加、编辑、删除规则
- 支持启用/禁用规则
- 支持配置日期和时间段

### 8. 规则自动保存标签页

- 根据规则自动保存符合条件的标签页
- 规则匹配: 域名模式 + 时间段
- 支持通配符域名 (`*.example.com`)
- 支持按星期和时间段控制

## 数据处理

### 存储

- 使用 Chrome `chrome.storage.local`
- 降级使用 `localStorage`

### 数据模型

```typescript
interface SavedTab {
  id: string;          // UUID
  title: string;
  url: string;
  favicon: string;     // URL 或 data URI
  savedAt: number;     // Unix timestamp
}

interface SaveRule {
  id: string;          // UUID
  domain: string;      // 域名，支持通配符 (*.example.com)
  enabled: boolean;   // 是否启用
  days: number[];     // 星期几 (0-6，0为周日，空数组表示每天)
  startTime: string;  // 开始时间 (HH:mm)
  endTime: string;    // 结束时间 (HH:mm)
}
```

## 边界情况处理

- 无效 URL 处理
- 最大存储限制 (500 个标签页时警告)
- 离线 favicon 回退 (使用默认图标)
- 过长标题/URL (截断并显示省略号)
