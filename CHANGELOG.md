# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Collapsible documentation sidebar component
  - Quick links to all WikiFormatting documentation sections
  - 5 expandable categories: Basics, Lists & Structure, Text Formatting, Links & References, Advanced Features
  - 20+ direct links to specific anchors on https://trac.ffmpeg.org/wiki/WikiFormatting
  - Toggle open/closed functionality (320px ↔ 50px)
  - Smooth animations and transitions
  - Responsive design for desktop, tablet, and mobile
  - Accessibility features (ARIA labels, keyboard navigation)
  - External link indicators on hover
  - 100% test coverage with 13 test cases
- Editor component with controlled textarea and real-time word/character counting

### Planned
- LocalStorage persistence for editor content
- Preview Component for WikiFormatting display
- Markdown to WikiFormatting converter
- Debounced update (3-second delay)
- Keyboard shortcuts (Tab, Escape, CMD+S)
- Copy to clipboard functionality

---

## [0.1.0] - 2026-07-25

### Added
- Initial project setup with React 18 and Create React App
- Project structure:
  - `src/components/` - React components directory
  - `src/converters/` - Markdown to WikiFormatting conversion logic
  - `src/utils/` - Utility functions (storage, helpers)
  - `tests/` - Test files mirroring src structure
  - `docs/` - Project documentation
  - `public/` - Static assets
- Comprehensive WikiFormatting cheatsheet (`docs/wiki-formatting-cheatsheet.md`)
  - All WikiFormatting syntax with examples
  - Markdown to WikiFormatting conversion reference
  - Code block examples for JavaScript, HTML, CSS, PHP, Markdown
  - Full issue/comment examples
  - Trac-specific formatting (tickets, changesets, wiki links)
- Jest testing configuration
  - 80% minimum code coverage requirement
  - 100% coverage requirement for converter functions
  - Testing environment setup with @testing-library/react
- Project documentation
  - Comprehensive README.md with setup instructions
  - Development workflow guidelines
  - Roadmap for v1.0.0 through v2.0.0
- Package dependencies:
  - React 18.3.1
  - react-scripts 5.0.1
  - marked 12.0.0 (Markdown parsing)
  - turndown 7.1.3 (HTML to Markdown conversion)
  - lodash.debounce 4.0.8 (Debounced updates)
  - react-icons 5.0.1 (Icon components)
  - Jest and @testing-library suite for testing
- ESLint configuration with React and Jest support
- Git repository initialization
- GitHub private repository creation

### Configuration
- `.gitignore` - Node.js, build artifacts, IDE files
- `jest.config.js` - Test configuration with coverage thresholds
- `package.json` - Project metadata and dependencies
- GitHub repository: https://github.com/flexseth/compose-wikiformatting

### Documentation
- Two-phase development approach documented in CLAUDE.md
  - Phase 1: JavaScript implementation (current)
  - Phase 2: WordPress plugin (future)
- Testing requirements integrated into project roadmap
- Code coverage requirements specified

### Notes
- This is a greenfield project - no prior implementation exists
- Focus: JavaScript-first approach before WordPress plugin development
- Target: WordPress Trac WikiFormatting conversion tool
- Purpose: Help developers familiar with Markdown/GitHub compose Trac wiki content

---

## Release Categories

### Types of Changes
- **Added** - New features
- **Changed** - Changes to existing functionality
- **Deprecated** - Soon-to-be removed features
- **Removed** - Removed features
- **Fixed** - Bug fixes
- **Security** - Security fixes/improvements

---

## Version History

### v1.0.0 Roadmap (React POC)
- [ ] Basic Editor Component
- [ ] LocalStorage Persistence
- [ ] Preview Component
- [ ] Markdown to WikiFormatting Converter
- [ ] Debounced Update (3-second delay)
- [ ] Keyboard Shortcuts
- [ ] Copy Button
- [ ] Documentation Sidebar

### v1.0.1 Roadmap (WordPress Plugin)
- Convert Gutenberg blocks to WikiFormatting
- WordPress-specific tests
- Plugin submission standards

### v1.1.0 Roadmap (Multi-format Conversion)
- Support .doc, .txt, Markdown files
- Paste detection and conversion
- Tests for all formats

### v1.2.0 Roadmap (Document Reading)
- File upload and conversion
- Drag-and-drop support
- File handling tests

### v1.3.0 Roadmap (Trac Integration)
- Connect to Trac Preferences API
- User preference sync
- Integration tests

### v2.0.0 Roadmap (Public Website)
- Production deployment
- AdWords integration
- Performance and load testing

---

[Unreleased]: https://github.com/flexseth/compose-wikiformatting/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/flexseth/compose-wikiformatting/releases/tag/v0.1.0
