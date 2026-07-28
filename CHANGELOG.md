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
- **Phase 1: Markdown to WikiFormatting Converter - Headers**
  - Core converter module: `src/converters/headers.js`
    - Converts Markdown ATX-style headers (# syntax) to WikiFormatting (= syntax)
    - Supports header levels 1-6
    - Handles trailing # characters (with or without spaces)
    - HTML entity escaping for XSS prevention (&, <, >, ", ')
    - Type safety with TypeError for non-string inputs
    - 100% JSDoc documentation coverage
  - Main orchestrator: `src/converters/markdownToWiki.js`
    - Coordinates all conversion modules
    - Extensible architecture for future phases (text formatting, lists, links, code blocks, etc.)
  - Preview component: `src/components/Preview.jsx`
    - Side-by-side live preview of WikiFormatting output
    - Read-only textarea with monospace font
    - Responsive design matching Editor component
    - Accessibility features with aria-labels
  - Comprehensive test suite (62 tests for converters, 13 for Preview)
    - 100% code coverage on all converter functions
    - Security/XSS attack pattern testing
    - Edge cases: empty headers, special characters, Unicode, emojis
    - Multi-line conversion testing
    - Type safety validation
  - Real-time conversion: Editor → Converter → Preview
  - Side-by-side layout with responsive stacking on mobile

- **Phase 2: WikiFormatting Renderer - React Components**
  - Core renderer module: `src/renderers/wikiToReact.js`
    - Parses WikiFormatting directly to React components (NO dangerouslySetInnerHTML)
    - Renders headers (= syntax) with all Trac variations
    - Supports with/without trailing equals, explicit IDs, inline formatting (italic)
    - Auto-generates readable IDs from header text (Trac-style)
    - Section anchor links with ¶ symbol
    - 100% React-safe (auto-escaped text nodes)
  - Reference HTML renderer: `src/renderers/wikiToHtml.js`
    - WikiFormatting → HTML string conversion (not used in app, kept for reference)
    - Full JSDoc documentation
  - RenderedView component: `src/components/RenderedView.jsx`
    - Third column: live preview of rendered WikiFormatting
    - Displays React elements (no HTML injection)
    - Trac-like styling matching WordPress theme
    - Responsive design with accessibility features
  - Three-column layout in App.jsx:
    - Column 1: Editor (Markdown input)
    - Column 2: Preview (WikiFormatting syntax)
    - Column 3: RenderedView (HTML preview)
    - Responsive: 3 columns desktop → 2 columns tablet → 1 column mobile
  - Comprehensive test suite (41 new tests for renderers + RenderedView)
    - 100% test coverage on renderer functions
    - Security/XSS prevention testing (React auto-escaping verified)
    - Edge cases: Unicode, emojis, special characters, explicit IDs
    - Type safety validation
  - Real-time rendering pipeline: Markdown → WikiFormatting → React → Display

- **Phase 2.5: LocalStorage Persistence - Auto-Save & Restore**
  - Storage utility: `src/utils/storage.js`
    - WordPress-ready storage format: `{ editorContent: string, timestamp: number }`
    - Storage key: `compose-wikiformatting-v1`
    - Five functions: save, load, get full data, clear, check availability
    - Type safety with TypeError for non-string content
    - Graceful error handling (returns false on failure, empty string on missing data)
    - 100% JSDoc documentation coverage
  - Custom debounce hook: `src/utils/useDebounce.js`
    - Generic debounce hook for any value
    - Default 500ms delay (configurable)
    - Prevents excessive localStorage writes on every keystroke
    - Clean timeout management with proper cleanup
  - App integration:
    - Auto-restore content on page load (useEffect on mount)
    - Debounced auto-save (500ms after typing stops)
    - Clear storage function with confirmation prompt
    - Preserves full conversion pipeline on load
  - Comprehensive test suite (23 new tests for storage utilities)
    - 100% test coverage on storage functions
    - WordPress attribute compatibility tests
    - Error handling and edge case testing
    - Mock restoration to prevent test pollution
  - WordPress conversion path documented for Phase 1.0.1 (plugin)

- **Phase 3: Text Formatting Conversion - Bold & Italic**
  - Core module: `src/converters/textFormatting.js`
    - Converts Markdown bold (**text** or __text__) to WikiFormatting ('''text''')
    - Converts Markdown italic (*text* or _text_) to WikiFormatting (''text'')
    - Converts bold+italic (***text***) to WikiFormatting ('''''text''''')
    - Regex-based conversion with boundary detection (no spaces after/before markers)
    - Handles nested and mixed formatting
    - Type safety with TypeError for non-string inputs
    - 100% JSDoc documentation coverage
  - Integration into `markdownToWiki.js` pipeline
    - Applied line-by-line after header conversion
    - Works in both headers and body text
    - Preserves inline code and strikethrough (same syntax in both formats)
  - Comprehensive test suite (40 text formatting tests + 9 integration tests)
    - 100% test coverage on textFormatting.js
    - Real-world examples tested (documentation, bug reports, mixed formatting)
    - Edge cases: unpaired markers, special characters, Unicode, emojis
    - Type safety validation
  - Security review passed (0 vulnerabilities)
    - Text-to-text transformation (no HTML escaping required)
    - React rendering layer provides XSS protection
    - No dangerouslySetInnerHTML usage

- **Phase 3.5: Text Formatting Renderer - Bold & Italic Display**
  - Enhanced renderer module: `src/renderers/wikiToReact.js`
    - Extended `parseInlineFormatting()` to handle all text formatting
    - Bold rendering: `'''text'''` → `<strong>text</strong>`
    - Italic rendering: `''text''` → `<em>text</em>`
    - Bold+Italic rendering: `'''''text'''''` → `<strong><em>text</em></strong>`
    - Regex matching priority: bold+italic (5 quotes) before bold (3) or italic (2)
  - Updated paragraph rendering to parse inline formatting (not just headers)
  - Completes text formatting cycle: conversion (Phase 3) + rendering (Phase 3.5)
  - Fixes gap identified in testing: Column 3 now displays bold/italic in body text
  - Security review passed (0 vulnerabilities)
    - React auto-escaping active (all content as text nodes)
    - No dangerouslySetInnerHTML usage
    - Hardcoded element types
    - Consistent with Phase 2 security patterns
  - All 272 tests passing
  - Renderer extends existing Phase 2 pattern (already tested)

- **Phase 4a: Links Conversion - Markdown to WikiFormatting**
  - Core module: `src/converters/links.js`
    - Converts Markdown external links: `[text](url)` → `[url text]`
    - Preserves WikiFormatting wiki links: `[[WikiPage]]` (no change)
    - Preserves automatic URLs: `http://example.com` (no change)
    - Regex-based conversion with non-greedy matching
    - Handles multiple links per line
    - Type safety with TypeError for non-string inputs
    - 100% JSDoc documentation coverage
  - Integration into `markdownToWiki.js` pipeline
    - Applied line-by-line after text formatting
    - Links can contain formatted text (bold, italic)
    - Conversion order: Headers → Text Formatting → Links
  - Comprehensive test suite (42 test cases)
    - 100% test coverage on links.js
    - External links: simple, https, paths, queries, fragments
    - Wiki links and automatic URLs preserved
    - Edge cases: empty text/URL, malformed links, special characters
    - Real-world examples: documentation, GitHub links, Trac references
    - Type safety validation
  - Security review passed (0 vulnerabilities)
    - Text-to-text transformation (no HTML generation in conversion phase)
    - No injection vectors (simple regex replacement)
    - React rendering layer will provide XSS protection (Phase 4b)
    - Dangerous URL protocols intentionally not validated (Phase 4b scope)
  - Known limitations (to be addressed in Phase 4b):
    - URLs with parentheses (Wikipedia-style) may be truncated
    - URL scheme validation deferred to rendering phase
    - Proper URL parsing will use URL constructor in Phase 4b

- **Phase 4b: Links Rendering - WikiFormatting to React Components**
  - Core renderer module: `src/renderers/wikiToReact.js` (enhanced)
    - External link rendering: `[url text]` → `<a href="url">text</a>`
    - Wiki link rendering: `[[WikiPage]]` → `<a href="/wiki/WikiPage">WikiPage</a>`
    - Trac-specific links: `[ticket:123]`, `[changeset:456]`, `[source:path]`
    - URL scheme validation with security filtering
    - Dangerous protocols blocked: `javascript:`, `data:`, `vbscript:`, `file:`
    - Link text can contain formatting (bold, italic, bold+italic)
    - React-safe rendering (no dangerouslySetInnerHTML)
  - Security features:
    - `isValidUrlScheme()` function blocks XSS attack vectors
    - Malicious URLs render as plain text (no clickable links)
    - React auto-escaping for all link text
    - Script tags in link text properly escaped
    - Query parameters escaped (`&` → `&amp;`)
  - Design decisions documented (commit 92967ab):
    - Protocol-relative URLs (`//example.com`) ALLOWED by design
    - Path traversal in wiki links (`[[../../admin]]`) BLOCKED for user validation
    - Rationale: Composition tool vs. security boundary considerations
    - Full analysis in `DECISIONS_phase4b_security.md`
  - Comprehensive test suite (26 test cases for rendering)
    - 100% test coverage on link rendering functions
    - Security tests: all dangerous protocols verified blocked
    - Edge cases: multiple links, formatted text in links, special characters
    - Real-world URLs: WordPress.org, GitHub, documentation sites
  - Integration with conversion pipeline (Phase 4a → 4b)
    - Markdown → WikiFormatting (4a) → React components (4b)
    - Full link cycle tested end-to-end
  - All 340 tests passing (68 tests for links: 42 conversion + 26 rendering)
  - Security review passed (0 vulnerabilities)

### Fixed
- **Phase 4 Critical Bug Fix (commit 55c145b)**: URLs with underscores and parentheses
  - Fixed Wikipedia-style URLs being corrupted during conversion
  - Problem: `Object-oriented_programming_(OOP)` became `Object-oriented''programming''(OOP)`
  - Root cause: Text formatting converter was treating underscores in URLs as italic markers
  - Solution implemented:
    1. Modified `links.js` regex to handle URLs with parentheses correctly
    2. Modified `textFormatting.js` to skip WikiFormatting link patterns `[url text]`
    3. Reordered conversion pipeline: links BEFORE text formatting
  - Impact: Fixes all URLs containing underscores (Wikipedia, documentation sites, APIs)
  - Testing: All 340 tests passing, Wikipedia URL test now passes
  - Example fix: `[OOP](https://en.wikipedia.org/wiki/Object-oriented_programming_(OOP))` 
    - Before: `[...''programming''(OOP) OOP]` ❌
    - After: `[..._programming_(OOP) OOP]` ✅

- **Phase 2 Bug Fix**: Preserve WikiFormatting syntax in headers
  - Removed single quote escaping from `headers.js` escapeHtml function
  - WikiFormatting italic syntax (`''text''`) and bold syntax (`'''text'''`) now preserved correctly
  - Previously: `''italic''` → `&#39;&#39;italic&#39;&#39;` (broken)
  - Now: `''italic''` → `''italic''` (correct)
  - Column 3 (Rendered View) now properly renders italic/bold in headers
  - Updated tests to verify WikiFormatting syntax preservation
  - Issue discovered during Phase 2 testing, fixed before merge
- **Phase 2 Test Fix**: Correct test syntax in headers.test.js
  - Tests now use Markdown syntax as input (not WikiFormatting)
  - Lines 99 & 103: Changed from WikiFormatting markers to Markdown markers
  - Added comments documenting Phase 3 inline formatting pending
  - Updated test names to reflect current behavior (preserve markers until Phase 3)

### Security
- HTML entity escaping in header converter prevents XSS attacks
- Security review passed with zero vulnerabilities (Phase 1 & 2)
- Defense-in-depth: escaping at converter level + React's built-in XSS protection
- Phase 2: NO dangerouslySetInnerHTML usage - pure React component rendering
- React auto-escapes all text content and attribute values
- Explicit ID validation via regex (word characters and hyphens only)

### Planned
- Phase 3: Text Formatting conversion (bold, italic, code)
- Phase 4: Lists conversion
- Phase 5: Links conversion
- Phase 6: Code blocks conversion
- Phase 7: Blockquotes conversion
- Phase 8: Tables conversion
- Phase 9: Images conversion
- LocalStorage persistence for editor content
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
