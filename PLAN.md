# Markdown to WikiFormatting Converter Implementation Plan

## 🔀 Branching Strategy

**Sequential Merge-then-Branch:**
1. ✅ Merge `add/editor` → `trunk` first
2. Create `feature/convert-headers` from `trunk` (Phase 1)
3. After Phase 1 merged: Create `feature/wiki-renderer` from `trunk` (Phase 2)
4. After Phase 2 merged: Create `feature/convert-text` from `trunk` (Phase 3)
5. After Phase 3 merged: Create `feature/convert-lists` from `trunk` (Phase 4)
... continue for all 9 phases

**Benefits:** Clean history, individual reviews, easy reverts

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

### Phase 2: WikiFormatting Renderer 🎨
**Branch:** `feature/wiki-renderer` (from trunk after Phase 1)

- [ ] Parse WikiFormatting to HTML
- [ ] Render headers (= syntax)
- [ ] Third view: Rendered output panel
- [ ] **SECURITY: Sanitize HTML output**
- [ ] **SECURITY: Prevent XSS in rendered HTML**
- [ ] **SECURITY: Safe anchor links only**
- [ ] Layout: Editor | WikiFormatting | Rendered (3 columns)
- [ ] Responsive: stack on mobile/tablet
- [ ] Styles match WordPress Trac theme
- [ ] 100% coverage
- [ ] JSDoc complete
- [ ] **SECURITY REVIEW PASSED**

**Purpose:** Show users what their WikiFormatting will look like on WordPress Trac

**Implementation Notes:**
- Create `src/renderers/wikiToHtml.js` for WikiFormatting → HTML conversion
- Create `src/components/RenderedView.jsx` for HTML display
- Use `dangerouslySetInnerHTML` ONLY after thorough sanitization
- Each WikiFormatting element gets its own parser (headers first, expand with each phase)
- Trac-like styling: monospace fonts for code, proper heading hierarchy, etc.

**Status:** ⏳ Planned (next phase)

---

### Phase 3: Text Formatting
**Branch:** `feature/convert-text` (from trunk after Phase 2)

- [ ] Bold ** → '''
- [ ] Italic * → ''
- [ ] Inline code
- [ ] **SECURITY: Escape formatted text**
- [ ] 100% coverage
- [ ] **SECURITY REVIEW PASSED**

**Status:** ⏳ Planned

---

### Phase 4: Lists  
**Branch:** `feature/convert-lists` (from trunk after Phase 3)

- [ ] Unordered lists
- [ ] Ordered lists
- [ ] Nested lists
- [ ] **SECURITY: Sanitize items**
- [ ] 100% coverage
- [ ] **SECURITY REVIEW PASSED**

**Status:** ⏳ Planned

---

### Phase 5: Links
**Branch:** `feature/convert-links` (from trunk after Phase 4)

- [ ] External links [text](url) → [url text]
- [ ] **SECURITY: URL validation**
- [ ] **SECURITY: Prevent javascript: URLs**
- [ ] **SECURITY: Malicious URL tests**
- [ ] 100% coverage
- [ ] **SECURITY REVIEW PASSED**

**Status:** ⏳ Planned

---

### Phase 6: Code Blocks
**Branch:** `feature/convert-code-blocks` (from trunk after Phase 5)

- [ ] Fenced blocks ```lang
- [ ] **SECURITY: Escape all code**
- [ ] Language detection
- [ ] 100% coverage
- [ ] **SECURITY REVIEW PASSED**

**Status:** ⏳ Planned

---

### Phase 7: Blockquotes
**Branch:** `feature/convert-blockquotes` (from trunk after Phase 6)

- [ ] > quote → indent
- [ ] **SECURITY: Sanitize content**
- [ ] 100% coverage
- [ ] **SECURITY REVIEW PASSED**

**Status:** ⏳ Planned

---

### Phase 8: Tables
**Branch:** `feature/convert-tables` (from trunk after Phase 7)

- [ ] Pipe tables → ||
- [ ] **SECURITY: Escape cells**
- [ ] 100% coverage
- [ ] **SECURITY REVIEW PASSED**

**Status:** ⏳ Planned

---

### Phase 9: Images
**Branch:** `feature/convert-images` (from trunk after Phase 8)

- [ ] ![alt](url) → [[Image()]]
- [ ] **SECURITY: URL validation**
- [ ] **SECURITY: Sanitize alt**
- [ ] 100% coverage
- [ ] **SECURITY REVIEW PASSED**

**Status:** ⏳ Planned

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

**Completed:** 1/9 phases  
**Security Reviews Passed:** 1/9  
**Current:** Phase 1 complete, ready for review/merge. Phase 2 (Renderer) next.

**Last Updated:** 2026-07-25
