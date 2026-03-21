# Tab Maestro - Chrome Tab Management Extension

## 1. Project Overview

**Project Name:** Tab Maestro
**Type:** Chrome Extension (Web App)
**Core Functionality:** A Chrome extension that allows users to save/collect open browser tabs into a managed list from the options page, and restore them later with one click.
**Target Users:** Power users who frequently work with many browser tabs and need a way to organize/save them.

## 2. UI/UX Specification

### Layout Structure

**Options Page Layout:**
- Single page application with header, main content, and footer
- Max width: 720px, centered
- Min height: 100vh
- Responsive: Works on all screen sizes

**Sections:**
1. **Header** - App title, logo, and action buttons
2. **Tab List** - Scrollable list of saved tabs
3. **Empty State** - Shown when no tabs are saved

### Visual Design

**Color Palette:**
- Background Primary: `#0f0f0f` (near black)
- Background Secondary: `#1a1a1a` (card background)
- Background Tertiary: `#252525` (hover states)
- Accent Primary: `#6366f1` (indigo-500)
- Accent Hover: `#818cf8` (indigo-400)
- Text Primary: `#fafafa` (white-ish)
- Text Secondary: `#a1a1aa` (zinc-400)
- Text Muted: `#71717a` (zinc-500)
- Border: `#27272a` (zinc-800)
- Success: `#22c55e` (green-500)
- Danger: `#ef4444` (red-500)

**Typography:**
- Font Family: `"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`
- Heading (H1): 24px, font-weight: 600
- Heading (H2): 18px, font-weight: 600
- Body: 14px, font-weight: 400
- Caption: 12px, font-weight: 400

**Spacing System:**
- Base unit: 4px
- XS: 4px, SM: 8px, MD: 16px, LG: 24px, XL: 32px

**Visual Effects:**
- Card shadow: `0 4px 24px rgba(0, 0, 0, 0.4)`
- Border radius: 8px (cards), 6px (buttons), 4px (inputs)
- Transitions: 150ms ease-out
- Hover scale on cards: 1.01

### Components

**1. Header**
- App logo (simple icon + text)
- "Save Current Tab" button (primary action)
- "Save All Tabs" button (secondary action)
- Tab count badge

**2. Tab Card**
- Favicon (16x16)
- Tab title (truncated with ellipsis)
- Tab URL (truncated)
- Open button (icon)
- Delete button (icon, appears on hover)
- Timestamp (relative time)

**3. Empty State**
- Illustration or icon
- "No saved tabs" message
- Brief instruction text

**4. Action Buttons**
- Primary: Filled with accent color
- Secondary: Outlined with border
- Icon buttons: 32x32, subtle background on hover

**5. Toast Notifications**
- Success/Error feedback
- Auto-dismiss after 3 seconds
- Slide-in animation

### Interactions & States

- **Hover:** Subtle background change, slight scale
- **Active:** Scale down slightly (0.98)
- **Disabled:** 50% opacity, cursor not-allowed
- **Loading:** Spinner icon
- **Focus:** Ring outline with accent color

## 3. Functionality Specification

### Core Features

1. **Save Current Tab**
   - Click button to save the currently active tab
   - Stores: title, url, favicon, timestamp
   - Shows success toast

2. **Save All Tabs**
   - Saves all tabs from all windows
   - Shows count of saved tabs
   - Deduplication: Skip already saved URLs

3. **View Saved Tabs**
   - List all saved tabs with preview info
   - Sort by save time (newest first)
   - Show favicon, title, URL, save time

4. **Open Saved Tab**
   - Click to open tab in new window
   - Removes from list after opening (optional, configurable)

5. **Delete Saved Tab**
   - Remove individual tabs
   - Delete all option

6. **Clear All**
   - Remove all saved tabs with confirmation

### Data Handling

- **Storage:** Chrome `chrome.storage.local`
- **Data Model:**
  ```typescript
  interface SavedTab {
    id: string;          // UUID
    title: string;
    url: string;
    favicon: string;     // URL or data URI
    savedAt: number;     // Unix timestamp
  }
  ```

### Edge Cases

- Invalid URL handling
- Duplicate URL detection
- Maximum storage limit (warn at 500 tabs)
- Offline favicon fallback (use default icon)
- Very long titles/URLs (truncate with ellipsis)

## 4. Technical Specification

### Tech Stack

- **Framework:** React 18
- **State Management:** MobX 6
- **Language:** TypeScript
- **Build Tool:** Vite
- **Testing:** Vitest
- **Package Manager:** pnpm
- **Styling:** SCSS Modules (`.module.scss`)
- **Linting:** ESLint + Prettier

### Project Structure

```
tab-maestro/
├── public/
│   └── manifest.json
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
│   │   └── storage.ts
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

### Chrome Extension Manifest

```json
{
  "manifest_version": 3,
  "name": "Tab Maestro",
  "version": "1.0.0",
  "description": "Save and manage your browser tabs",
  "permissions": ["tabs", "storage"],
  "action": {
    "default_title": "Open Tab Maestro"
  },
  "options_page": "index.html"
}
```

## 5. Acceptance Criteria

### Visual Checkpoints
- [ ] Dark theme with indigo accent applied consistently
- [ ] Cards have proper shadows and hover effects
- [ ] Typography hierarchy is clear
- [ ] Responsive layout works on all sizes
- [ ] Empty state is visually appealing
- [ ] Toast notifications appear and auto-dismiss

### Functional Checkpoints
- [ ] "Save Current Tab" saves active tab
- [ ] "Save All Tabs" saves all open tabs
- [ ] Saved tabs display with correct info
- [ ] Click on tab opens it in new tab
- [ ] Delete removes tab from list
- [ ] Clear all removes all tabs with confirmation
- [ ] Data persists after browser restart

### Technical Checkpoints
- [ ] React + TypeScript compiles without errors
- [ ] MobX store properly manages state
- [ ] SCSS modules work correctly
- [ ] ESLint passes with no errors
- [ ] Vitest tests run and pass
- [ ] Extension loads in Chrome without errors
