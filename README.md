# Snack Cards

Display your Chrome Reading List as beautiful cards in a new tab.

## Features

- 📚 **Card-based Display**: View your reading list in a visually appealing card layout
- 🔍 **Smart Filtering**: Filter by all, unread, or read articles
- ✅ **Quick Actions**: Mark as read/unread, remove articles with one click
- 🌙 **Dark Mode**: Automatic dark mode support
- 🎯 **Auto-read**: Articles are automatically marked as read when you open them
- 🎬 **Video Preview**: Embedded video support for supported articles

## Installation

Install this extension from the Chrome Web Store (coming soon).

## Development

### Prerequisites

- Node.js 18+ (managed via mise or asdf)
- pnpm

### Setup

1. Install dependencies

```bash
pnpm install
```

2. Run the development server

```bash
pnpm dev
```

3. Load the extension in Chrome

   - Open `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `.output/chrome-mv3-dev` directory

### Building

```bash
pnpm build
```

The built extension will be in the `.output/chrome-mv3` directory.

### Creating a Distribution Package

```bash
pnpm zip
```

This creates a zip file in the `.output` directory ready for Chrome Web Store upload.

## Technology Stack

- [WXT](https://wxt.dev/) - Modern web extension framework
- [React 19](https://react.dev/) - UI framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling

## Release

See [.claude/commands/release.md](.claude/commands/release.md) for release procedures.

## License

MIT
