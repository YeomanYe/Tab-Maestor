# Theme Switcher Design

## Overview
Add a theme switcher dropdown to the Header component for switching between light, dark, and system themes. Theme preference persists via `chrome.storage.sync`.

## Data Structure

- **Theme Type**: `'light' | 'dark' | 'system'`
- **Storage Key**: `'theme'`
- **Storage API**: `chrome.storage.sync`

## Architecture

### Components
1. **ThemeContext** - Global theme state management using React Context
2. **ThemeSwitcher** - Dropdown component in Header's right action area

### Data Flow
```
User clicks dropdown → Selects theme → ThemeContext updates
→ Save to chrome.storage.sync → Apply CSS class to document
```

## UI/UX

### Theme Switcher Component
- Position: Header right side, after action buttons
- Trigger: Click to open dropdown menu
- Menu items:
  - 🌙 Dark (current default)
  - ☀️ Light
  - 💻 System
- Visual: Checkmark indicator for current selection
- Persist: Theme saved to chrome.storage.sync

### Theme Colors

#### Dark Theme (Current)
- Background: `#0f0f0f`, `#1a1a1a`, `#252525`
- Text: `#fafafa`, `#a1a1aa`, `#71717a`
- Accent: `#6366f1`

#### Light Theme (New)
- Background: `#ffffff`, `#f4f4f5`, `#e4e4e7`
- Text: `#18181b`, `#52525b`, `#71717a`
- Accent: `#6366f1`

## Implementation Steps

1. Add light theme variables to `src/styles/_variables.scss`
2. Create `src/contexts/ThemeContext.tsx` for theme state management
3. Create `src/components/ThemeSwitcher/ThemeSwitcher.tsx` dropdown component
4. Update `src/components/Header/Header.tsx` to include ThemeSwitcher
5. Add dropdown styles to Header module SCSS
6. Apply theme class to document root on theme change
7. Load saved theme on app initialization
