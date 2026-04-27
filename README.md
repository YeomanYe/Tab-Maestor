[English](README.md) | [中文](README.zh-CN.md)

# Tab Maestro

A Chrome extension for saving and managing browser tabs with automatic saving rules.

## Features

- **Save Tabs**: Save current tab or all tabs from all windows
- **Auto-Save Rules**: Configure automatic tab saving with custom schedules
  - Set specific days of the week
  - Set time ranges (e.g., 9:00 - 18:00)
  - Support wildcard domains (*.example.com)
- **Search & Filter**: Search saved tabs and filter by date range
- **Theme Support**: Light and dark theme with warm yellow accent
- **Multi-language**: English and Chinese (Simplified)
- **Tab Management**: View, open, pin, and delete saved tabs

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Build the extension:
   ```bash
   pnpm build
   ```
4. Load the extension in Chrome:
   - Open `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist` folder

## Development

```bash
# Start development server
pnpm dev

# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Lint code
pnpm lint

# fix lint errors
pnpm lint:fix

# Lint styles
pnpm lint:style

# Fix style lint errors
pnpm lint:style:fix

# Format code
pnpm format
```

## Tech Stack

- React 18
- TypeScript
- MobX (State Management)
- SCSS Modules
- Vite
- Vitest
- ESLint
- Stylelint
- Husky

## Project Structure

```
tab-maestro/
├── docs/                    # Specification documents
├── __test__/               # Test files
├── public/
│   └── manifest.json       # Chrome extension manifest
├── src/
│   ├── background/         # Background scripts
│   ├── components/        # React components
│   │   ├── AutoSaveSetting/
│   │   ├── DateFilterBar/
│   │   ├── Header/
│   │   ├── SearchBox/
│   │   ├── TabCard/
│   │   ├── TabList/
│   │   └── ...
│   ├── contexts/          # React contexts
│   ├── popup/             # Popup page components
│   ├── stores/            # MobX stores
│   ├── styles/            # Global styles
│   ├── types/             # TypeScript types
│   └── utils/            # Utility functions
├── .husky/                # Git hooks
├── package.json
├── vite.config.ts
├── vitest.config.ts
└── tsconfig.json
```

## Theme

The extension uses a warm yellow theme:

- **Background**: `#FFFCF0` (light) / `#1C1917` (dark)
- **Accent**: `#EAB308` (light) / `#FBBF24` (dark)
- **Font**: Nunito

## License

MIT
