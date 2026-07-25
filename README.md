# Compose WikiFormatting

A React-based web application for composing documents in WikiFormatting syntax for WordPress Trac.

## Purpose

WordPress core uses [Trac](https://core.trac.wordpress.org) for issue tracking, which uses [WikiFormatting](https://core.trac.wordpress.org/wiki/WikiFormatting) - a syntax significantly different from Markdown. This tool helps users familiar with Markdown/GitHub easily compose and convert documents to WikiFormatting.

## Features (v1.0.0)

- ✏️ **Live Editor**: Type or paste Markdown content
- 🔄 **Real-time Preview**: See WikiFormatting output with 3-second debounce
- ⚡ **Quick Update**: Press Tab or Escape for instant preview update
- 📋 **Copy to Clipboard**: One-click copy of formatted WikiFormatting
- 💾 **Auto-save**: Content persists using localStorage
- ⌨️ **Keyboard Shortcuts**: Tab navigation, Escape to unfocus, CMD/CTRL+S to save
- 📚 **Documentation Sidebar**: Quick links to WikiFormatting reference

## Technology Stack

- **React 18+**: UI components
- **Marked**: Markdown parsing
- **Turndown**: HTML to Markdown conversion
- **Jest & Testing Library**: Comprehensive testing (80%+ coverage)
- **LocalStorage**: Client-side persistence

## Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000)

### Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

**Coverage Requirements:**
- Minimum 80% coverage across all metrics
- 100% coverage for conversion functions

### Building for Production

```bash
npm run build
```

## Development Workflow

This project follows test-driven development:

1. Each feature is developed on its own commit
2. Tests must pass before committing
3. Coverage requirements must be met
4. One feature at a time, iterative approach

## Roadmap

- **v1.0.0** (Current): React POC with live editor and preview
- **v1.0.1**: WordPress plugin - Convert Gutenberg blocks
- **v1.1.0**: Multi-format conversion (doc, txt, Markdown)
- **v1.2.0**: Document upload and conversion
- **v1.3.0**: Trac Preferences integration
- **v2.0.0**: Public website with advertisements

## Project Structure

```
compose-wikiformatting/
├── src/
│   ├── components/      # React components
│   ├── converters/      # Markdown to WikiFormatting conversion
│   ├── utils/           # Utility functions (storage, etc.)
│   ├── App.jsx          # Main application component
│   └── index.js         # Entry point
├── tests/               # Test files mirroring src/ structure
├── public/              # Static assets
└── docs/                # Documentation and cheatsheets
```

## Contributing

This is a private repository. For questions or suggestions, contact seth@flexperception.com.

## License

MIT
