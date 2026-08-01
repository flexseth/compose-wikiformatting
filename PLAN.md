# Markdown to WikiFormatting Converter Implementation Plan

## 🔀 Branching Strategy

### Portfolio Approach: Feature Branch Development

**Two Patterns:**

**Pattern 1: Sequential Merge-then-Branch** (Simple phases)
1. Create `feature/phase-name` from `trunk`
2. Implement, test, security review
3. Merge to `trunk`
4. Create next feature branch from `trunk`

**Pattern 2: Base Feature Branch** (Complex/related phases) ⭐ **CURRENT**
1. Create base feature branch (e.g., `feature/text-formatting`)
2. Build initial implementation directly on base branch
3. **For additional functionality:**
   - Create sub-branch from base feature: `feature/sub-functionality`
   - Implement, test, security review on sub-branch
   - Create PR: `feature/sub-functionality` → `feature/base-feature`
   - Merge to base feature (keep sub-branch)
   - Continue building on base feature or create new sub-branch
4. When feature complete, merge base feature → `trunk`

**Current Example: Text Formatting (Phases 3 + 3.5)**
- Base: `feature/text-formatting` (Phase 3 conversion)
- Sub: `feature/rendered-preview` (Phase 3.5 rendering) → merged back to base
- Result: Complete text formatting implementation on one feature branch
- Next: Continue with Phase 4 on `feature/text-formatting`, or merge to trunk first

**Benefits:** 
- Related work stays together
- Sub-branches allow focused PRs and reviews
- Base branch becomes integration point for a feature area
- All branches preserved (portfolio approach - never delete)
- Flexible: can add functionality incrementally before merging to trunk

---

## ⚠️ CRITICAL: Security Requirements

**EVERY commit must pass `/security-review` before merging.**

**Security Checklist:**
- [ ] All user input properly escaped/sanitized
- [ ] No XSS vulnerabilities
- [ ] No injection attack vectors
- [ ] Input validation (type checking)
- [ ] URLs properly sanitized (no javascript:, data: schemes)
- [ ] HTML entities escaped
- [ ] No `dangerouslySetInnerHTML`
- [ ] Tested with malicious patterns

**Before Every Commit:**
1. `npm test` - All tests pass
2. `/security-review` - No vulnerabilities
3. Fix any issues
4. Commit only when secure

---

## Conversion Phases

### Phase 1: Headers ✅
**Branch:** `feature/convert-headers` (from trunk)

- [x] Convert ATX headers # to ======
- [x] Levels 1-6 supported
- [x] Trailing # handled
- [x] **SECURITY: Escape HTML in headers**
- [x] **SECURITY: XSS tests**
- [x] Type safety
- [x] 100% coverage
- [x] JSDoc complete
- [x] Preview component
- [x] **SECURITY REVIEW PASSED**

**Status:** ✅ Complete (113 tests passing, 100% coverage, security review passed)

---

### Phase 2: WikiFormatting Renderer 🎨 ✅
**Branch:** `feature/wiki-renderer` (from trunk after Phase 1)

- [x] Parse WikiFormatting to React components (better than HTML!)
- [x] Render headers (= syntax) with all variations
- [x] Third view: Rendered output panel
- [x] **SECURITY: NO dangerouslySetInnerHTML - pure React rendering**
- [x] **SECURITY: React auto-escaping prevents XSS**
- [x] **SECURITY: Safe anchor links (regex-validated IDs)**
- [x] Layout: Editor | WikiFormatting | Rendered (3 columns)
- [x] Responsive: 3 cols → 2 cols → 1 col (desktop → tablet → mobile)
- [x] Styles match WordPress Trac theme
- [x] 100% coverage (41 new tests)
- [x] JSDoc complete
- [x] **SECURITY REVIEW PASSED**

**Purpose:** Show users what their WikiFormatting will look like on WordPress Trac

**Implementation:**
- ✅ `src/renderers/wikiToReact.js` - WikiFormatting → React elements (PRIMARY)
- ✅ `src/renderers/wikiToHtml.js` - WikiFormatting → HTML strings (reference, not used)
- ✅ `src/components/RenderedView.jsx` - Displays React elements (NO dangerouslySetInnerHTML)
- ✅ Trac-like styling: proper heading hierarchy, anchor links with ¶ symbol
- ✅ All heading variations: with/without trailing =, explicit IDs, inline formatting

**Status:** ✅ Complete (198 tests passing, security review passed, React-safe rendering)

---

### Phase 2.5: LocalStorage Persistence 💾
**Branch:** `feature/localstorage` (from trunk after Phase 2)

- [ ] Save editor content to localStorage on change
- [ ] Restore editor content on page load
- [ ] Clear storage functionality
- [ ] **WordPress-ready**: Use attribute-like structure for easy conversion to block attributes
- [ ] Debounced saves (avoid excessive writes)
- [ ] Storage key namespacing
- [ ] 100% coverage
- [ ] JSDoc complete
- [ ] **SECURITY REVIEW PASSED**

**Purpose:** Persist user work across page reloads - essential for testing and user experience

**Implementation Notes:**
- Use patterns that map to WordPress block attributes (attribute-like structure)
- Save format: `{ editorContent: string, timestamp: number }`
- Storage key: `compose-wikiformatting-v1`
- Debounce saves (500ms) to avoid excessive localStorage writes
- Clear button in UI for privacy
- This will translate to WordPress as block attributes when converting to plugin

**WordPress Conversion Path:**
```javascript
// Current (localStorage):
const saved = localStorage.getItem('compose-wikiformatting-v1');
const { editorContent } = JSON.parse(saved);

// Future (WordPress block attributes):
attributes: {
  editorContent: {
    type: 'string',
    default: ''
  }
}
```

**Status:** ⏳ Next (after Phase 2 merged)

---

### Phase 3: Text Formatting ✅
**Branch:** `feature/text-formatting` (from trunk after Phase 2.5)

- [x] Bold ** → '''
- [x] Bold __ → '''
- [x] Italic * → ''
- [x] Italic _ → ''
- [x] Bold+Italic *** → '''''
- [x] Inline code (no conversion needed - same syntax)
- [x] **SECURITY: Text formatting safe (no HTML in markers)**
- [x] 100% coverage (40 text formatting tests + 9 integration tests)
- [x] JSDoc complete
- [x] **SECURITY REVIEW PASSED**

**Implementation:**
- ✅ `src/converters/textFormatting.js` - Text formatting conversion
- ✅ Integrated into `markdownToWiki.js` pipeline
- ✅ Regex-based conversion with proper boundary detection
- ✅ Handles nested/mixed formatting
- ✅ 40 dedicated tests + 9 integration tests

**Status:** ✅ Complete (272 tests passing, security review passed)

---

### Phase 3.5: Text Formatting Renderer ✅
**Branch:** `feature/text-formatting` (continued from Phase 3)

- [x] Render bold: `'''text'''` → `<strong>text</strong>`
- [x] Render italic: `''text''` → `<em>text</em>`
- [x] Render bold+italic: `'''''text'''''` → `<strong><em>text</em></strong>`
- [x] Update paragraph rendering to parse inline formatting
- [x] **SECURITY: React auto-escaping, no dangerouslySetInnerHTML**
- [x] Extends Phase 2 pattern (already tested)
- [x] **SECURITY REVIEW PASSED**

**Purpose:** Fix gap from Phase 3 testing - rendered preview (Column 3) now displays bold/italic in body text, not just headers.

**Implementation:**
- ✅ Enhanced `parseInlineFormatting()` in `src/renderers/wikiToReact.js`
- ✅ Regex priority: bold+italic (5 quotes) before bold (3) or italic (2)
- ✅ Paragraph rendering now parses formatting
- ✅ All 272 tests passing

**Status:** ✅ Complete (security review passed, rendering works in all contexts)

---

### Phase 4: Links
**Branch:** `feature/links` (sub-branch from `feature/text-formatting`)

**Phase 4a: Conversion** (Markdown → WikiFormatting)
- [x] External links: `[text](url)` → `[url text]`
- [x] Wiki links: `[[WikiPage]]` → `[[WikiPage]]` (preserved)
- [x] Automatic URLs: `http://...` (preserved)
- [x] 42 comprehensive tests, 100% coverage
- [x] **SECURITY REVIEW PASSED** (Phase 4a conversion only)

**Phase 4b: Rendering** (WikiFormatting → React) - IN PROGRESS
- [ ] Parse WikiFormatting link syntax: `[url text]` and `[[WikiPage]]`
- [ ] Proper URL parsing (use URL constructor, handle parentheses in URLs)
- [ ] Link rendering: `<a href="...">` elements
- [ ] **SECURITY: URL scheme validation** (allowlist: http, https, mailto, ftp)
- [ ] **SECURITY: Reject dangerous protocols** (javascript:, data:, vbscript:, file:)
- [ ] **SECURITY: Malicious URL tests** (XSS attempts, protocol injection)
- [ ] Handle Wikipedia-style URLs with parentheses
- [ ] Handle encoded characters in URLs (%28, %29, etc.)
- [ ] 100% coverage on rendering
- [ ] **SECURITY REVIEW PASSED**

**Known Limitations from Phase 4a:**
- URLs with unbalanced parentheses may be truncated (will fix in Phase 4b)
- No URL validation yet (intentional - Phase 4b responsibility)

**Status:** ✅ Phase 4a complete, ⏳ Phase 4b next

---

### Phase 5: Code Blocks
**Branch:** `feature/code-blocks` (sub-branch from `feature/text-formatting`)  
**PR:** #7 (ready for merge)  
**Status:** ✅ COMPLETE (August 1, 2026)

**Phase 5a: Conversion** (Markdown → WikiFormatting)
- [x] Fenced code blocks: ` ```lang ` → `{{{#!lang `
- [x] Generic code blocks: ` ``` ` → `{{{` / `}}}`
- [x] Inline code: `` `code` `` → `` `code` `` (no change - same syntax)
- [x] Language normalization (js→javascript, ts→javascript, sh→bash, md→markdown)
- [x] Variable backtick counts (4+ backticks for outer fence when content contains ```)
- [x] Nested code blocks (inner backticks preserved as literal text for documentation)
- [x] **Pipeline order: code blocks must convert FIRST** (protect content from other converters)
- [x] **SECURITY: Code content must not be processed by header/link/text converters**
- [x] 100% coverage (49 unit tests + 9 integration tests)
- [x] **SECURITY REVIEW PASSED**

**Phase 5b: Rendering** (WikiFormatting → React)
- [x] Code block rendering: `{{{` → `<pre><code>` elements
- [x] Language-specific rendering: `{{{#!lang` → `<pre><code class="language-lang">`
- [x] Inline code rendering: `` `code` `` → `<code>` elements
- [x] Nested code block rendering (inner `{{{` preserved as literal text)
- [x] Syntax highlighting classes (CSS-only, no highlighting library yet)
- [x] **SECURITY: Escape all code content (no HTML execution inside code blocks)**
- [x] 100% coverage (47 unit tests + 27 integration tests)
- [x] **SECURITY REVIEW PASSED**

**UI: Tab Key Handling Inside Code Blocks** (DEFERRED to future phase)
- [ ] Detect when cursor is inside a code block (between ``` fences)
- [ ] When inside code block: Tab inserts indentation (2 or 4 spaces) instead of moving focus
- [ ] When outside code block: Tab retains current behavior (move to next focusable element)
- [ ] Shift+Tab inside code block: remove one level of indentation
- [ ] This requires the Editor component to be aware of code block boundaries
- [ ] Consider: cursor position tracking relative to code fence markers

**Implementation Summary:**
- Files: `src/converters/codeBlocks.js`, `src/renderers/codeBlocks.js`
- 467 total tests passing (74 code block specific tests)
- XSS prevention: 47 security test cases verified
- Pure React rendering (no dangerouslySetInnerHTML)
- GitHub-style code block styling with dark mode
- Nested delimiter handling working correctly

**Known Limitations:**
- WikiFormatting has no escape mechanism for `}}}` inside code blocks
- If code content contains `}}}`, it will prematurely close the block (Trac limitation, not ours)
- Documented as known limitation

**Research Notes:**
- Trac natively supports nested processor blocks with indentation
- Trac uses Pygments for syntax highlighting (200+ languages)
- Trac 1.1.2+ supports `lineno` and `marks` arguments on code blocks
- WordPress Trac uses the same WikiFormatting engine as Edgewall Trac

**Syntax Highlighting (Phase 5c - Future):**
- **Current:** Language classes in place (`language-*`), no actual highlighting
- **Trac uses:** Pygments (Python library, server-side rendering)
- **Phase 1 constraint:** Client-side only, cannot run Pygments
- **Options researched:**
  - Client-side JS library (Prism.js/Highlight.js) with Pygments theme
  - Wait for WordPress plugin (Phase 1.0.1) to use actual Pygments server-side
  - CSS-only approach (minimal)
- **Recommendation:** Defer to WordPress plugin phase for true Pygments integration
- **See:** Full research in `TODO.md` - Syntax Highlighting Research section
- **Status:** Deferred - current CSS-only styling sufficient for MVP

---

### Phase 6: Blockquotes
**Branch:** `feature/blockquotes` (sub-branch from `feature/text-formatting`)

- [ ] Blockquote: `> text` → indentation
- [ ] Nested blockquotes
- [ ] Blockquote rendering: `<blockquote>` elements
- [ ] **SECURITY: Sanitize content**
- [ ] 100% coverage
- [ ] **SECURITY REVIEW PASSED**

**Status:** ⏳ Planned

---

### Phase 7: Tables
**Branch:** `feature/tables` (sub-branch from `feature/text-formatting`)

- [ ] Pipe tables: `| col |` → `|| col ||`
- [ ] Header rows
- [ ] Cell alignment
- [ ] Table rendering: `<table><tr><td>` elements
- [ ] **SECURITY: Escape cell content**
- [ ] 100% coverage
- [ ] **SECURITY REVIEW PASSED**

**Status:** ⏳ Planned

---

### Phase 8: Images
**Branch:** `feature/images` (sub-branch from `feature/text-formatting`)

- [ ] Image syntax: `![alt](url)` → `[[Image(url)]]`
- [ ] Alt text handling
- [ ] Image rendering: `<img>` elements
- [ ] **SECURITY: URL validation**
- [ ] **SECURITY: Sanitize alt text**
- [ ] 100% coverage
- [ ] **SECURITY REVIEW PASSED**

**Status:** ⏳ Planned

---

### Phase 9: Lists (MOVED - Complex, implement last)
**Branch:** `feature/lists` (sub-branch from `feature/text-formatting`)

📋 **[→ Detailed Implementation Plan](./PLAN_phase9-lists.md)** - Comprehensive 8-part plan covering all Markdown list syntaxes, nesting strategies, rendering algorithms, 100+ test cases, and week-by-week implementation schedule.

**Why Last:** Lists are the most complex feature with:
- Multiple syntax variations (`*`, `-`, `+`, `1.`, `1)`)
- Complex nesting rules (indentation-based)
- Mixed list types (ordered inside unordered)
- Multi-line item handling
- Loose vs tight list detection

**High-Level Checklist:**
- [ ] **Conversion:** All Markdown list syntaxes → WikiFormatting
- [ ] **Nesting:** 2/4-space and tab indentation, mixed list types
- [ ] **Content:** Single/multi-line items, inline formatting, loose lists
- [ ] **Rendering:** React `<ul>`/`<ol>`/`<li>` elements with proper nesting
- [ ] **Tests:** 100+ tests (60+ converter, 40+ renderer), 100% coverage
- [ ] **Security:** Sanitize content, prevent XSS, React auto-escaping
- [ ] **SECURITY REVIEW PASSED**

**Status:** ⏳ Planned (implement after Phases 4-8 complete)

---

## Quality Standards

**Every Phase:**
- ✅ 100% test coverage
- ✅ Complete JSDoc
- ✅ ESLint clean
- ✅ **Security review passed**
- ✅ WordPress portable
- ✅ Core React only

---

## Progress

**Completed:** 3.5/10 phases (Phases 1, 2, 2.5, 3, 3.5)  
**Security Reviews Passed:** 5/10 (all completed phases)  
**Current:** Phase 3 + 3.5 complete on `feature/text-formatting` branch. Text formatting conversion and rendering fully implemented.

**Last Updated:** 2026-07-27
