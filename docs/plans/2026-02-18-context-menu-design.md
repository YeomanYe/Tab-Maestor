# Context Menu Design

## Overview

Add "Save Current Tab" and "Save All Tabs" menu items to Chrome extension icon right-click menu.

## Architecture

### Manifest Configuration
- Add `contextMenus` permission to `manifest.json`
- Use `chrome.contextMenus.create()` in background script to create menu items

### Background Script
- Handle menu item click events
- Implement save logic directly in background script using storage API
- Use `chrome.notifications` for user feedback (more reliable than Toast)

### Storage
- Reuse existing `storage.ts` functions where possible
- Background script has direct access to `chrome.storage.local`

## Implementation Details

### Files to Modify
1. `public/manifest.json` - Add `contextMenus` permission
2. `src/background/index.ts` - Add menu creation and click handlers

### Menu Structure
- Parent item: "Tab Maestro" (optional, for organization)
- Menu item 1: "Save Current Tab"
- Menu item 2: "Save All Tabs"

### User Interaction Flow
1. User right-clicks extension icon
2. User clicks "Save Current Tab" or "Save All Tabs"
3. Background script executes save logic
4. Chrome notification shows result

### Save Current Tab Logic
1. Query active tab in current window
2. Check URL is valid (not chrome:// or chrome-extension://)
3. Get existing tabs from storage
4. Check for duplicates
5. Add new tab to storage
6. Show notification with result

### Save All Tabs Logic
1. Query all tabs
2. Filter out pinned tabs and extension pages
3. Get existing tabs from storage
4. Add non-duplicate tabs to list
5. Close saved tabs
6. Save updated list to storage
7. Show notification with result

## Error Handling
- Show error notification if no tabs to save
- Show error if tab already saved
- Silent fail for permission errors (user may have revoked)

## Testing
- Manual testing in Chrome extension environment
- Verify menu items appear correctly
- Verify save and close behavior works
- Verify notifications display properly
