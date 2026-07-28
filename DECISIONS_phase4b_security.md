# Phase 4b Security Design Decisions

**Date:** 2026-07-27  
**Phase:** Phase 4b - Links Rendering  
**Context:** Post-implementation security review identified 2 edge cases requiring design decisions

---

## Background

During Phase 4b testing and security review, two edge cases were flagged:
1. Protocol-relative URLs (`//example.com`)
2. Path traversal in wiki links (`[[../../admin]]`)

Both were initially investigated as potential security vulnerabilities. Security analysis determined both were **false positives** (no actual threat in single-user composition tool context). However, design decisions were needed on whether to allow or block each pattern.

---

## Decision #1: Protocol-Relative URLs

### Pattern
```
[//example.com Site]
```

Renders as:
```html
<a href="//example.com">Site</a>
```

Browser interprets `//example.com` as protocol-relative (uses current page's protocol).

### Initial Concern
- Potential open redirect vulnerability

### Security Analysis
- **Threat Level:** ZERO in this context
- **Rationale:** 
  - Open redirect requires attacker making VICTIM click malicious link
  - This tool: User creates content, user sees content, user decides to use it
  - No multi-user attack vector
  - Like saying text editor has XSS vulnerability because you can type `<script>`

### Design Consideration

**Tool Purpose:**
- This is a **composition tool** for creating Trac content
- NOT a security boundary (Trac is)
- Similar to: Markdown editors, VS Code preview, text editors

**Trac's Role:**
- Trac will enforce its own security when content is published
- This tool's job: Help user compose, not enforce publication rules

**Legitimate Use Cases:**
- Protocol-agnostic links (rare but valid web convention)
- Copy-pasting content from web
- Testing what Trac will do
- User might intentionally want this

**Cost-Benefit Analysis:**
| | Allow | Block |
|---|---|---|
| **Benefit** | User flexibility, no false positives | Appears security-conscious |
| **Cost** | None (no threat) | Prevents legitimate use, frustrating |
| **Alignment** | With composition tools | With security boundaries |

### Decision: ✅ ALLOW

**Rationale:**
1. **Tool role:** Composition aid, not validator or security boundary
2. **Security boundary:** Trac enforces on publication, not preview tool
3. **User flexibility:** Don't block potentially intentional valid input
4. **Precedent:** Other composition tools (VS Code, Notion, etc.) allow all URLs

**Implementation:**
- Keep current behavior (already allows)
- Add documentation comment explaining design decision
- Update report: Mark as "Design Decision (Allowed)" not "Issue"

**Quote from analysis:**
> "This is a composition tool. Security is enforced by Trac when content is published, not by this preview tool."

---

## Decision #2: Path Traversal in Wiki Links

### Pattern
```
[[../../admin]]
```

Renders as:
```html
<a href="/wiki/../../admin">../../admin</a>
```

Browser resolves `/wiki/../../admin` to `/admin`.

### Initial Concern
- Potential path traversal vulnerability

### Security Analysis
- **Threat Level:** ZERO in this context
- **Rationale:**
  - No backend server
  - No file system operations
  - Just a client-side href string
  - Browser URL resolution is normal behavior, not a vulnerability

### Design Consideration

**HOWEVER** - Different from Decision #1:

**Wiki Link Convention:**
- Wiki links use page identifiers: `[[PageName]]`
- NOT filesystem paths
- Valid: `[[Category/SubPage]]` (wiki hierarchy)
- Invalid: `[[../../admin]]` (not a wiki concept)

**Trac Behavior:**
- Trac almost certainly rejects `../` in wiki page names
- Treats as invalid page name → 404 or blocked
- Preview should match Trac behavior

**Legitimate Use Cases:**
- **NONE IDENTIFIED**
- Wiki pages don't use filesystem path syntax
- `../` is not a wiki naming convention
- If user wants `/admin`, should use external link: `[/admin Admin]`

**User Experience:**
| | Allow | Block |
|---|---|---|
| **Preview behavior** | Confusing (links to /admin, not wiki) | Clear (shows as text, error obvious) |
| **Trac alignment** | Mismatched (Trac blocks it) | Matched (preview = publication) |
| **Error detection** | Silent until Trac paste | Immediate feedback |

**Nature of Validation:**
- NOT security validation (no threat)
- IS user-friendly validation (like spell-check)
- Helps catch probable errors

### Decision: ❌ BLOCK

**Rationale:**
1. **No legitimate use case:** Cannot identify valid scenario for `../` in wiki page name
2. **User-friendly:** Blocking catches obvious errors, provides immediate feedback
3. **Trac alignment:** Preview matches expected publication behavior
4. **Low cost:** No valid functionality removed (users can still reference any real wiki page)
5. **Different from Decision #1:**
   - Protocol-relative URLs: Valid web convention, might be intentional
   - Path traversal in wiki names: Not a wiki convention, almost certainly error

**Implementation:**
- Add validation in `parseLinks()` wiki link section
- Reject page names containing `../` or `..\`
- Render as plain text when rejected
- Document as "user-friendly validation" not "security fix"

**Quote from analysis:**
> "Wiki page names don't use filesystem paths. Blocking provides clear feedback and aligns with expected Trac behavior."

---

## Comparison: Why Different Decisions?

| Aspect | Protocol-Relative URLs | Path Traversal |
|--------|----------------------|----------------|
| **Web/Wiki Standard** | Yes (valid URL format) | No (not wiki syntax) |
| **Likely User Intent** | Might be intentional | Almost certainly error |
| **Trac Behavior** | Probably allows | Probably blocks |
| **Legitimate Use** | Identified | None found |
| **Decision Basis** | Composition flexibility | User-friendly validation |
| **Decision** | ✅ ALLOW | ❌ BLOCK |

---

## Key Principle

**"Composition tools should be permissive; validators should be strict."**

This tool is primarily a **composition aid**, but can add **user-friendly validation** when:
- No legitimate use case exists
- User is likely making an error
- Blocking provides clear, helpful feedback
- Aligns with destination platform behavior

It should NOT add **security validation** because:
- Trac is the security boundary, not this tool
- Single-user context has no threat model
- Blocking doesn't improve security at Trac
- Prevents potentially legitimate use

---

## Implementation Pathway

**Phase 4b Development:**
1. ✅ Implement links rendering with security URL validation
2. ✅ Security review - 2 edge cases flagged
3. ✅ Deep analysis - both false positives, but need design decisions
4. ✅ Document design decisions (this file)
5. ⏳ Implement Decision #1 (protocol-relative: document as allowed)
6. ⏳ Implement Decision #2 (path traversal: add user-friendly validation)
7. ⏳ Update testing report with final decisions
8. ⏳ Commit design decisions

**Iterative Development Process:**
- Commit 1: Phase 4b implementation with findings
- Commit 2: Bug fix (Wikipedia URLs)
- Commit 3: Design decisions and final validation (this commit)

This demonstrates portfolio-quality iterative development: implement → test → discover → analyze → decide → refine.

---

## References

- Security Review: All dangerous protocols (javascript:, data:, vbscript:, file:) correctly blocked
- Testing Report: `TESTING_links_report.md`
- Test Coverage: 340 tests passing, 93% manual tests passing
- User Documentation: `TESTING_links.md`

---

**Approved By:** User (Seth)  
**Implemented By:** Claude Code Agent  
**Status:** Ready for implementation
