# Links Testing - Raw Input

**Purpose:** Quick copy/paste testing file for Phase 4 (Links). Contains raw **Markdown** syntax that can be copied in its entirety and pasted directly into the editor to test all link functionality at once.

**How to Use:**
1. Select all content in this file (Cmd/Ctrl+A)
2. Copy (Cmd/Ctrl+C)
3. Paste into the editor (Column 1 - Markdown input)
4. Verify WikiFormatting conversion in Column 2
5. Verify links render correctly in Column 3 (Rendered Preview)
6. Check that dangerous protocols (javascript:, data:, etc.) are NOT clickable

**What This Tests:** All link types (external, wiki, Trac-specific), formatting within links, security validation, and edge cases. No documentation or explanations - just raw test input.

**Related Files:**
- `TESTING_links.md` - Comprehensive documentation with examples and explanations for each test
- `REPORT_testing_links_findings.md` - Test results and findings from validation

---

## Basic External Links

Check out [WordPress.org](https://wordpress.org) for more info.

Visit [Example Site](http://example.com) here.

## Links with Paths, Queries, Fragments

Read the [Installation Guide](https://docs.wordpress.org/install/guide.html).

Search results: [WordPress Plugins](https://wordpress.org/plugins/?search=security&type=featured)

Jump to [Section 3](https://example.com/page#section-3).

See [Advanced Search](https://wordpress.org/support/search.php?q=custom+post&forums=all#results).

## Special Characters

Link with spaces: [Test Page](https://example.com/test%20page).

Learn about [OOP](https://en.wikipedia.org/wiki/Object-oriented_programming_(OOP)).

Unicode test: [Español](https://example.com/español).

## Multiple Links

Check [WordPress](https://wordpress.org) and [GitHub](https://github.com) for updates.

Sites: [One](https://one.com), [Two](https://two.com), [Three](https://three.com).

## Wiki Links

See [[WikiPageName]] for details.

Check [[Category/SubPage]] for more.

## Links with Formatting

Visit [**Important Site**](https://example.com).

Read [*Documentation*](https://docs.example.com).

See [***Very Important***](https://example.com).

## Security Tests (Should NOT be clickable)

Don't click [Malicious Link](javascript:alert('XSS')).

Bad link: [Data URL](data:text/html,<script>alert(1)</script>).

Old exploit: [VBScript](vbscript:msgbox(1)).

System file: [Sensitive File](file:///etc/passwd).

Email link: [Email](mailto:test@example.com).

FTP server: [Files](ftp://files.example.com).

## Trac-Specific Links (WikiFormatting passthrough)

See [ticket:12345 Bug Report].

Fixed in [changeset:54321 Recent Commit].

Check [source:trunk/wp-includes/functions.php Source Code].

## Edge Cases

Link at start: [WordPress](https://wordpress.org) is great.

Link at end: Visit this site [Example](https://example.com)

Before [Link](https://example.com) After

## Security Edge Cases

Protocol-relative: [Site](//example.com).

Traversal test: [[../../admin]].
