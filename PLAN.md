# Markdown to WikiFormatting Converter Implementation Plan

## 🔀 Branching Strategy

**Sequential Merge-then-Branch:**
1. ✅ Merge `add/editor` → `trunk` first
2. Create `feature/convert-headers` from `trunk` (Phase 1)
3. After Phase 1 merged: Create `feature/convert-text` from `trunk` (Phase 2)
4. After Phase 2 merged: Create `feature/convert-lists` from `trunk` (Phase 3)
... continue for all 8 phases

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

### Phase 2: Text Formatting
**Branch:** `feature/convert-text` (from trunk after Phase 1)

- [ ] Bold ** → '''
- [ ] Italic * → ''
- [ ] Inline code
- [ ] **SECURITY: Escape formatted text**
- [ ] 100% coverage
- [ ] **SECURITY REVIEW PASSED**

**Status:** ⏳ Planned

---

### Phase 3: Lists  
**Branch:** `feature/convert-lists` (from trunk after Phase 2)

- [ ] Unordered lists
- [ ] Ordered lists
- [ ] Nested lists
- [ ] **SECURITY: Sanitize items**
- [ ] 100% coverage
- [ ] **SECURITY REVIEW PASSED**

**Status:** ⏳ Planned

---

### Phase 4: Links
**Branch:** `feature/convert-links` (from trunk after Phase 3)

- [ ] External links [text](url) → [url text]
- [ ] **SECURITY: URL validation**
- [ ] **SECURITY: Prevent javascript: URLs**
- [ ] **SECURITY: Malicious URL tests**
- [ ] 100% coverage
- [ ] **SECURITY REVIEW PASSED**

**Status:** ⏳ Planned

---

### Phase 5: Code Blocks
**Branch:** `feature/convert-code-blocks` (from trunk after Phase 4)

- [ ] Fenced blocks ```lang
- [ ] **SECURITY: Escape all code**
- [ ] Language detection
- [ ] 100% coverage
- [ ] **SECURITY REVIEW PASSED**

**Status:** ⏳ Planned

---

### Phase 6: Blockquotes
**Branch:** `feature/convert-blockquotes` (from trunk after Phase 5)

- [ ] > quote → indent
- [ ] **SECURITY: Sanitize content**
- [ ] 100% coverage
- [ ] **SECURITY REVIEW PASSED**

**Status:** ⏳ Planned

---

### Phase 7: Tables
**Branch:** `feature/convert-tables` (from trunk after Phase 6)

- [ ] Pipe tables → ||
- [ ] **SECURITY: Escape cells**
- [ ] 100% coverage
- [ ] **SECURITY REVIEW PASSED**

**Status:** ⏳ Planned

---

### Phase 8: Images
**Branch:** `feature/convert-images` (from trunk after Phase 7)

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

**Completed:** 1/8 phases  
**Security Reviews Passed:** 1/8  
**Current:** Phase 1 complete, ready for review/merge

**Last Updated:** 2026-07-25
