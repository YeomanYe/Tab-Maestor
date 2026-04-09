# 功能规范

## 核心功能

### 1. 保存当前标签页

- 点击按钮保存当前活动的标签页
- 存储: title, url, favicon, timestamp
- 显示成功 toast

### 2. 保存所有标签页

- 保存所有窗口中的标签页
- 显示已保存标签页数量
- 去重: 跳过已保存的 URL

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
```

## 边界情况处理

- 无效 URL 处理
- 重复 URL 检测
- 最大存储限制 (500 个标签页时警告)
- 离线 favicon 回退 (使用默认图标)
- 过长标题/URL (截断并显示省略号)
