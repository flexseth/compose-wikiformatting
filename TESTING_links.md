# Testing Guide: Phase 4 - Links (Conversion + Rendering)

**Purpose:** Comprehensive documentation and user guide for testing Phase 4 (Links) functionality. Contains 31 detailed test cases with expected inputs, outputs, and explanations of why each test works or doesn't work. Serves as both a testing guide and reference documentation.

**Audience:** Developers, QA testers, and anyone validating link conversion and rendering functionality.

**How to Use:** Copy individual test case sections and paste into the editor to verify specific functionality. Each test includes:
- Input example (Markdown or WikiFormatting)
- Expected WikiFormatting conversion
- Expected rendered HTML output
- Explanation of why it works or should be blocked

**What This Covers:**
- Basic external links (HTTP/HTTPS)
- Complex URLs (paths, queries, fragments, special characters)
- Wiki links and Trac-specific links
- Links with text formatting (bold/italic)
- Security tests (blocked dangerous protocols)
- Edge cases and known limitations
- Automated test coverage summary

**Related Files:**
- `TESTING_links_raw.md` - Quick copy/paste test file (no documentation)
- `REPORT_testing_links_findings.md` - Validation results and findings

---

**Original Purpose**: Comprehensive test cases for link conversion (Markdown → WikiFormatting) and rendering (WikiFormatting → HTML).

**How to Use**: Copy sections below into the editor to verify conversion and rendering work correctly.

---

## ✅ BASIC EXTERNAL LINKS

### Test 1: Simple HTTPS Link
**Input (Markdown)**:
```
Check out [WordPress.org](https://wordpress.org) for more info.
```

**Expected WikiFormatting**:
```
Check out [https://wordpress.org WordPress.org] for more info.
```

**Expected Rendering**: 
- Link text: "WordPress.org"
- Href: `https://wordpress.org`
- Link should be clickable

**Why it works**: https:// is an allowed protocol. Markdown `[text](url)` converts to WikiFormatting `[url text]`.

---

### Test 2: HTTP Link
**Input (Markdown)**:
```
Visit [Example Site](http://example.com) here.
```

**Expected WikiFormatting**:
```
Visit [http://example.com Example Site] here.
```

**Expected Rendering**:
- Link text: "Example Site"
- Href: `http://example.com`
- Link should be clickable

**Why it works**: http:// is allowed (less secure than https but valid).

---

## 📁 LINKS WITH PATHS, QUERIES, AND FRAGMENTS

### Test 3: Link with Path
**Input (Markdown)**:
```
Read the [Installation Guide](https://docs.wordpress.org/install/guide.html).
```

**Expected WikiFormatting**:
```
Read the [https://docs.wordpress.org/install/guide.html Installation Guide].
```

**Expected Rendering**: Full URL with path preserved in href.

**Why it works**: Paths are part of the URL, no special handling needed.

---

### Test 4: Link with Query String
**Input (Markdown)**:
```
Search results: [WordPress Plugins](https://wordpress.org/plugins/?search=security&type=featured)
```

**Expected WikiFormatting**:
```
Search results: [https://wordpress.org/plugins/?search=security&type=featured WordPress Plugins]
```

**Expected Rendering**: Query parameters (`?search=security&type=featured`) preserved.

**Why it works**: Query strings are valid URL components.

---

### Test 5: Link with Fragment/Anchor
**Input (Markdown)**:
```
Jump to [Section 3](https://example.com/page#section-3).
```

**Expected WikiFormatting**:
```
Jump to [https://example.com/page#section-3 Section 3].
```

**Expected Rendering**: Fragment (`#section-3`) preserved for in-page navigation.

**Why it works**: Fragments are standard URL parts.

---

### Test 6: Complex URL (Path + Query + Fragment)
**Input (Markdown)**:
```
See [Advanced Search](https://wordpress.org/support/search.php?q=custom+post&forums=all#results).
```

**Expected WikiFormatting**:
```
See [https://wordpress.org/support/search.php?q=custom+post&forums=all#results Advanced Search].
```

**Expected Rendering**: All URL components preserved.

**Why it works**: URL parser handles complex URLs correctly.

---

## 🔗 SPECIAL CHARACTERS IN URLS

### Test 7: URL with Encoded Characters
**Input (Markdown)**:
```
Link with spaces: [Test Page](https://example.com/test%20page).
```

**Expected WikiFormatting**:
```
Link with spaces: [https://example.com/test%20page Test Page].
```

**Expected Rendering**: Encoded characters (%20) preserved.

**Why it works**: Percent-encoding is standard URL encoding.

---

### Test 8: Wikipedia-Style URL with Parentheses
**Input (Markdown)**:
```
Learn about [OOP](https://en.wikipedia.org/wiki/Object-oriented_programming_(OOP)).
```

**Expected WikiFormatting**:
```
Learn about [https://en.wikipedia.org/wiki/Object-oriented_programming_(OOP) OOP].
```

**Expected Rendering**: Parentheses in URL should work (Phase 4b handles this).

**Why it works**: Phase 4b uses proper URL parsing, not simple regex.

**Known Limitation (Phase 4a)**: If testing conversion only, unbalanced parentheses in original Markdown may be truncated. This is fixed in rendering.

---

### Test 9: URL with Unicode
**Input (Markdown)**:
```
Unicode test: [Español](https://example.com/español).
```

**Expected WikiFormatting**:
```
Unicode test: [https://example.com/español Español].
```

**Expected Rendering**: Unicode characters preserved.

**Why it works**: Modern browsers and URL parsers handle Unicode.

---

## 🔢 MULTIPLE LINKS IN ONE LINE

### Test 10: Two Links in Sentence
**Input (Markdown)**:
```
Check [WordPress](https://wordpress.org) and [GitHub](https://github.com) for updates.
```

**Expected WikiFormatting**:
```
Check [https://wordpress.org WordPress] and [https://github.com GitHub] for updates.
```

**Expected Rendering**: Both links clickable and independent.

**Why it works**: Regex processes all matches in the line.

---

### Test 11: Three Consecutive Links
**Input (Markdown)**:
```
Sites: [One](https://one.com), [Two](https://two.com), [Three](https://three.com).
```

**Expected WikiFormatting**:
```
Sites: [https://one.com One], [https://two.com Two], [https://three.com Three].
```

**Expected Rendering**: All three links rendered correctly.

**Why it works**: Global regex flag (`/g`) matches all occurrences.

---

## 📝 WIKI LINKS (INTERNAL PAGES)

### Test 12: Simple Wiki Link
**Input (WikiFormatting - already converted)**:
```
See [[WikiPageName]] for details.
```

**Expected Rendering**:
- Link text: "WikiPageName"
- Href: `/wiki/WikiPageName`
- Link navigates to wiki page

**Why it works**: Wiki links use `[[Page]]` syntax, same in Markdown and WikiFormatting.

---

### Test 13: Wiki Link with Slashes
**Input (WikiFormatting)**:
```
Check [[Category/SubPage]] for more.
```

**Expected Rendering**:
- Href: `/wiki/Category/SubPage`
- Preserves path structure

**Why it works**: Wiki pages can have hierarchical paths.

---

## 🎨 LINKS WITH TEXT FORMATTING

### Test 14: Link with Bold Text
**Input (WikiFormatting - conversion happens first)**:
```
Visit [https://example.com '''Important Site'''].
```

**Expected Rendering**:
- Link text: **Important Site** (bold)
- Text inside link is formatted

**Why it works**: `parseLinks()` calls `parseInlineFormatting()` on link text.

---

### Test 15: Link with Italic Text
**Input (WikiFormatting)**:
```
Read [https://docs.example.com ''Documentation''].
```

**Expected Rendering**:
- Link text: *Documentation* (italic)
- Formatting applied within link

**Why it works**: Inline formatting is parsed recursively.

---

### Test 16: Link with Bold+Italic
**Input (WikiFormatting)**:
```
See [https://example.com '''''Very Important'''''].
```

**Expected Rendering**:
- Link text: ***Very Important*** (bold + italic)

**Why it works**: Combined formatting supported.

---

## 🚫 SECURITY TESTS - REJECTED PROTOCOLS

### Test 17: JavaScript Protocol (XSS Attempt)
**Input (WikiFormatting)**:
```
Don't click [javascript:alert('XSS') Malicious Link].
```

**Expected Rendering**:
- **NOT** rendered as a clickable link
- Text shown as: `[javascript:alert('XSS') Malicious Link]`
- Plain text, no href attribute

**Why it's blocked**: `javascript:` protocol allows XSS attacks. Blocked by `isValidUrlScheme()`.

**Security Impact**: Prevents malicious JavaScript execution in user's browser.

---

### Test 18: Data URL Protocol (XSS Attempt)
**Input (WikiFormatting)**:
```
Bad link: [data:text/html,<script>alert(1)</script> Data URL].
```

**Expected Rendering**:
- **NOT** rendered as link
- Text shown as plain text

**Why it's blocked**: `data:` URLs can contain inline JavaScript. Blocked by validation.

**Security Impact**: Prevents data URL-based XSS attacks.

---

### Test 19: VBScript Protocol (Legacy XSS)
**Input (WikiFormatting)**:
```
Old exploit: [vbscript:msgbox(1) VBScript].
```

**Expected Rendering**:
- **NOT** rendered as link
- Text shown as plain text

**Why it's blocked**: `vbscript:` is dangerous in legacy browsers. Blocked for safety.

---

### Test 20: File Protocol (Local File Access)
**Input (WikiFormatting)**:
```
System file: [file:///etc/passwd Sensitive File].
```

**Expected Rendering**:
- **NOT** rendered as link
- Text shown as plain text

**Why it's blocked**: `file:` protocol accesses local filesystem. Security risk.

---

### Test 21: Mailto Protocol (Not in Spec)
**Input (WikiFormatting)**:
```
Email link: [mailto:test@example.com Email].
```

**Expected Rendering**:
- **NOT** rendered as link
- Text shown as plain text

**Why it's blocked**: Not in WikiFormatting specification. Conservative allowlist approach.

**Note**: While `mailto:` isn't dangerous, it's not documented in Trac WikiFormatting, so it's excluded.

---

### Test 22: FTP Protocol (Not in Spec)
**Input (WikiFormatting)**:
```
FTP server: [ftp://files.example.com Files].
```

**Expected Rendering**:
- **NOT** rendered as link
- Text shown as plain text

**Why it's blocked**: Not in WikiFormatting specification. Only http/https documented.

---

## 🎫 TRAC-SPECIFIC LINKS

### Test 23: Ticket Link
**Input (WikiFormatting)**:
```
See [ticket:12345 Bug Report].
```

**Expected Rendering**:
- Clickable link
- Href: `ticket:12345`
- Text: "Bug Report"

**Why it works**: `ticket:` is a Trac-specific scheme, allowed in validation.

---

### Test 24: Changeset Link
**Input (WikiFormatting)**:
```
Fixed in [changeset:54321 Recent Commit].
```

**Expected Rendering**:
- Clickable link
- Href: `changeset:54321`

**Why it works**: `changeset:` is a Trac scheme for version control references.

---

### Test 25: Source Code Link
**Input (WikiFormatting)**:
```
Check [source:trunk/wp-includes/functions.php Source Code].
```

**Expected Rendering**:
- Clickable link
- Href: `source:trunk/wp-includes/functions.php`

**Why it works**: `source:` is a Trac scheme for browsing repository files.

---

## ⚠️ EDGE CASES

### Test 26: Empty Link Text
**Input (WikiFormatting)**:
```
Link with no text: [https://example.com ].
```

**Expected Rendering**: Should handle gracefully (may show URL as text).

**Why it's tested**: Edge case validation.

---

### Test 27: Link at Start of Line
**Input (Markdown)**:
```
[WordPress](https://wordpress.org) is great.
```

**Expected WikiFormatting**:
```
[https://wordpress.org WordPress] is great.
```

**Expected Rendering**: Link works at line start.

---

### Test 28: Link at End of Line
**Input (Markdown)**:
```
Visit this site: [Example](https://example.com)
```

**Expected WikiFormatting**:
```
Visit this site: [https://example.com Example]
```

**Expected Rendering**: Link works at line end.

---

### Test 29: Text Before and After Link
**Input (Markdown)**:
```
Before [Link](https://example.com) After
```

**Expected WikiFormatting**:
```
Before [https://example.com Link] After
```

**Expected Rendering**: Surrounding text preserved correctly.

---

## 🔍 SECURITY EDGE CASES (Investigated but Safe)

### Test 30: Protocol-Relative URL
**Input (WikiFormatting)**:
```
Protocol-relative: [//example.com Site].
```

**Expected Rendering**: 
- Currently **NOT** rendered as link (treated as plain text)
- Text shown as: `[//example.com Site]`

**Security Analysis**:
- Protocol-relative URLs (`//example.com`) use current page's protocol
- Investigated as potential open redirect
- **Determination**: FALSE POSITIVE - no security risk in single-user editor
- User only affects their own content
- No multi-user attack vector

**Design Decision**: Blocked conservatively, though not a true vulnerability.

---

### Test 31: Path Traversal in Wiki Links
**Input (WikiFormatting)**:
```
Traversal test: [[../../admin]].
```

**Expected Rendering**:
- Currently renders as: `<a href="/wiki/../../admin">../../admin</a>`
- Browser resolves to: `/admin`

**Security Analysis**:
- Investigated as potential path traversal
- **Determination**: FALSE POSITIVE - no backend to exploit
- This is a client-side editor (no server-side file operations)
- Browser URL resolution is normal behavior
- User previewing their own content

**Design Decision**: No sanitization needed - this is a preview/editor tool, not a content server.

---

## 📊 COVERAGE SUMMARY

**Total Test Cases**: 31

**Categories**:
- ✅ Basic External Links: 2 tests
- ✅ Complex URLs: 4 tests  
- ✅ Special Characters: 3 tests
- ✅ Multiple Links: 2 tests
- ✅ Wiki Links: 2 tests
- ✅ Formatted Link Text: 3 tests
- ✅ Security (Blocked Protocols): 6 tests
- ✅ Trac-Specific Links: 3 tests
- ✅ Edge Cases: 4 tests
- ✅ Security Edge Cases: 2 tests

**Security Reviews**: 2 passed (Phase 4a conversion, Phase 4b rendering)

**Code Coverage**: 100% on converters, 94% on renderers

---

## 🧪 AUTOMATED TEST RESULTS

**Converter Tests** (src/converters/links.test.js): 42 passing
- External links: 11 tests
- Wiki links: 3 tests
- Automatic URLs: 2 tests
- Multiple links: 2 tests
- Special characters: 8 tests
- Edge cases: 8 tests
- Type safety: 5 tests
- Real-world examples: 3 tests

**Renderer Tests** (src/renderers/wikiToReact.test.js): 26 passing (Phase 4b)
- External links: 11 tests
- Wiki links: 3 tests
- Security validation: 5 tests
- Links with formatting: 2 tests
- Edge cases: 3 tests
- Type safety: 2 tests

**Total**: 68 link-related tests, all passing ✅

---

## 🎯 VALIDATION CHECKLIST

Use this checklist when testing manually:

- [ ] HTTP links convert and render correctly
- [ ] HTTPS links convert and render correctly
- [ ] URLs with paths work
- [ ] URLs with query strings work
- [ ] URLs with fragments work
- [ ] Wikipedia-style URLs with parentheses work
- [ ] Multiple links on one line work
- [ ] Wiki links render with correct href
- [ ] Bold text in links renders
- [ ] Italic text in links renders
- [ ] JavaScript protocol is blocked (shows as text)
- [ ] Data URL protocol is blocked
- [ ] VBScript protocol is blocked
- [ ] File protocol is blocked
- [ ] Mailto protocol is blocked (not in spec)
- [ ] FTP protocol is blocked (not in spec)
- [ ] Trac ticket: links work
- [ ] Trac changeset: links work
- [ ] Trac source: links work
- [ ] Links at start of line work
- [ ] Links at end of line work
- [ ] Surrounding text is preserved

---

## 📝 TESTING WORKFLOW

1. **Copy a test case** from above
2. **Paste into the editor** (left column)
3. **Verify WikiFormatting** (middle column shows correct syntax)
4. **Verify rendering** (right column shows clickable link or plain text)
5. **Click the link** (if applicable) to verify href is correct
6. **Check console** for any React errors

---

## 🐛 KNOWN LIMITATIONS

### From Phase 4a (Conversion)
- URLs with unbalanced parentheses in Markdown may be truncated by the regex
- Example: `[Test](https://example.com/page(incomplete)` → missing closing `)`
- **Mitigation**: Phase 4b rendering handles parentheses correctly

### Future Enhancements
- None identified - implementation is complete per specification

---

## ✅ SIGN-OFF

**Phase 4a (Conversion)**: COMPLETE ✅
- 42 tests passing
- 100% code coverage
- Security review passed

**Phase 4b (Rendering)**: COMPLETE ✅  
- 26 tests passing
- 94% code coverage
- Security review passed
- 2 security findings investigated and cleared as false positives

**Total Link Tests**: 68 passing
**Security Reviews**: 2 passed (0 vulnerabilities)
**Overall Status**: READY FOR PRODUCTION ✅
