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

### Phase 3: Text Formatting
**Branch:** `feature/convert-text` (from trunk after Phase 2.5)

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

**Completed:** 2/10 phases (added Phase 2.5 for localStorage)  
**Security Reviews Passed:** 2/10  
**Current:** Phase 2 complete, ready for review/merge. Phase 2.5 (LocalStorage) next.

**Last Updated:** 2026-07-26
