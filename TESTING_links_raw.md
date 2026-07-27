# Links Testing - Raw Input

**Purpose:** Quick copy/paste testing file for Phase 4 (Links). Contains raw WikiFormatting syntax that can be copied in its entirety and pasted directly into the editor to test all link functionality at once.

**How to Use:**
1. Select all content in this file (Cmd/Ctrl+A)
2. Copy (Cmd/Ctrl+C)
3. Paste into the editor (left column)
4. Verify links render correctly in Column 3 (Rendered Preview)
5. Check that dangerous protocols (javascript:, data:, etc.) are NOT clickable

**What This Tests:** All link types (external, wiki, Trac-specific), formatting within links, security validation, and edge cases. No documentation or explanations - just raw test input.

**Related Files:**
- `TESTING_links.md` - Comprehensive documentation with examples and explanations for each test
- `REPORT_testing_links_findings.md` - Test results and findings from validation

---

## Basic External Links

Check out [https://wordpress.org WordPress.org] for more info.

Visit [http://example.com Example Site] here.

## Links with Paths, Queries, Fragments

Read the [https://docs.wordpress.org/install/guide.html Installation Guide].

Search results: [https://wordpress.org/plugins/?search=security&type=featured WordPress Plugins]

Jump to [https://example.com/page#section-3 Section 3].

See [https://wordpress.org/support/search.php?q=custom+post&forums=all#results Advanced Search].

## Special Characters

Link with spaces: [https://example.com/test%20page Test Page].

Learn about [https://en.wikipedia.org/wiki/Object-oriented_programming_(OOP) OOP].

Unicode test: [https://example.com/español Español].

## Multiple Links

Check [https://wordpress.org WordPress] and [https://github.com GitHub] for updates.

Sites: [https://one.com One], [https://two.com Two], [https://three.com Three].

## Wiki Links

See [[WikiPageName]] for details.

Check [[Category/SubPage]] for more.

## Links with Formatting

Visit [https://example.com '''Important Site'''].

Read [https://docs.example.com ''Documentation''].

See [https://example.com '''''Very Important'''''].

## Security Tests (Should NOT be clickable)

Don't click [javascript:alert('XSS') Malicious Link].

Bad link: [data:text/html,<script>alert(1)</script> Data URL].

Old exploit: [vbscript:msgbox(1) VBScript].

System file: [file:///etc/passwd Sensitive File].

Email link: [mailto:test@example.com Email].

FTP server: [ftp://files.example.com Files].

## Trac-Specific Links

See [ticket:12345 Bug Report].

Fixed in [changeset:54321 Recent Commit].

Check [source:trunk/wp-includes/functions.php Source Code].

## Edge Cases

Link at start: [https://wordpress.org WordPress] is great.

Link at end: Visit this site [https://example.com Example]

Before [https://example.com Link] After

## Security Edge Cases

Protocol-relative: [//example.com Site].

Traversal test: [[../../admin]].
