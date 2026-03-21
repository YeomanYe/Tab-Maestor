[English](README.md) | [中文](README.zh-CN.md)

# Tab Maestro

A Chrome extension for saving and managing browser tabs.

## Features

- Save current tab or all tabs from all windows
- View and manage saved tabs
- Open saved tabs with one click
- Delete individual tabs or clear all
- Dark theme with indigo accent
- Toast notifications for feedback

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

# Fix lint errors
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
│   ├── components/         # React components
│   ├── stores/             # MobX stores
│   ├── styles/            # Global styles
│   ├── types/              # TypeScript types
│   └── utils/              # Utility functions
├── .husky/                 # Git hooks
├── package.json
├── vite.config.ts
├── vitest.config.ts
└── tsconfig.json
```

## License

MIT
