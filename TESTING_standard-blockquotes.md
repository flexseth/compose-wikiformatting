# Standard Blockquotes Testing - Phase 6c

**Purpose:** Manual testing file for standard blockquote (2-space indent) conversion and rendering. Copy/paste this entire file into the editor (Column 1) to see WikiFormatting conversion in Column 2 and rendered output in Column 3.

**What to verify:**
- Column 2 shows 2-space indent preserved (Markdown and WikiFormatting use same syntax)
- Column 3 renders as `<blockquote>` elements (NO "citation" class)
- Different styling from Discussion Citations (no colored borders)
- Formatting inside blockquotes works (bold, italic, links)
- Security: XSS attempts are escaped

**Key Difference from Discussion Citations:**
- Standard: 2-space indent → `<blockquote>` (no class)
- Citations: `>` markers → `<blockquote class="citation">` (with colored borders)

---

## Basic Standard Blockquotes

### Simple Blockquote

Paragraph before quote.

  This is a standard blockquote.
  It uses 2-space indentation at the start of each line.
  All consecutive indented lines are grouped together.

Paragraph after quote.

**Expected Column 2:** 2-space indent preserved (no conversion needed)
**Expected Column 3:** `<blockquote>` element (no "citation" class, different styling from Discussion Citations)

### Single Line Blockquote

Normal text.

  Single line indented quote.

More normal text.

**Expected:** Renders as blockquote element

### Multi-Paragraph Blockquote

Text before.

  First paragraph of quote.
  Continues on second line.

  Second paragraph of quote.
  Also continues on second line.

Text after.

**Expected:** Two separate blockquote elements (separated by blank line)

---

## Blockquotes with Formatting

### Bold Inside Blockquote

Normal paragraph.

  This quote has **bold text** inside it.
  And **more bold** on the next line.

After quote.

**Expected:** Bold renders inside the blockquote

### Italic Inside Blockquote

Normal paragraph.

  This quote has *italic text* inside it.
  And _more italic_ on the next line.

After quote.

**Expected:** Italic renders inside the blockquote

### Bold and Italic

  This has **bold** and *italic* and ***bold italic***.

**Expected:** All formatting renders correctly

### Links Inside Blockquote

  Check out [WordPress](https://wordpress.org) for more info.
  Also see [GitHub](https://github.com).

**Expected:** Links are clickable inside the blockquote

### Inline Code Inside Blockquote

  This quote contains `inline code` here.
  And more `code` on this line.

**Expected:** Inline code renders with monospace font inside blockquote

### Mixed Formatting

  This is a **bold** statement with *italic* emphasis.
  It also has a [link](https://example.com) and `code`.

**Expected:** All formatting types work together inside blockquote

---

## Code Blocks Inside Blockquotes

### Fenced Code Block in Standard Blockquote

Normal text.

  This quote discusses code:
  ```javascript
  const example = "code";
  console.log(example);
  ```
  And continues after the code.

After quote.

**Expected Column 2:** Convert to WikiFormatting code block syntax:
```
  This quote discusses code:
  {{{#!javascript
  const example = "code";
  console.log(example);
  }}}
  And continues after the code.
```

**Expected Column 3:** Blockquote containing a code block

### Generic Code Block

  Here's some code:
  ```
  generic code
  no language
  ```
  End of quote.

**Expected:** Code block (no language) inside blockquote

---

## Edge Cases

### Blockquote at Start of Document

  This blockquote is at the very start.
  It has no preceding content.

Normal text after.

**Expected:** Renders correctly without preceding content

### Blockquote at End of Document

This is some text.

  This blockquote is at the very end.
  It has no following content.

**Expected:** Renders correctly without following content

### Empty Lines Within Blockquote

  First line of quote.

  Third line (empty line above).

**Expected:** Two separate blockquotes (empty line breaks them)

### Exactly 2 Spaces Required

 This has only 1 space (should NOT be a blockquote).

  This has 2 spaces (should be a blockquote).

   This has 3 spaces (should still be a blockquote).

**Expected:** Only lines with 2+ spaces render as blockquotes

### Tabs vs Spaces

	This line uses a tab character.

  This line uses 2 spaces.

**Expected:** Verify tab handling (may depend on Trac's behavior)

---

## Distinction from Discussion Citations

### Standard Blockquote (This Phase)

Normal text.

  This is a standard blockquote.
  It uses 2-space indentation.

More text.

**Expected:** `<blockquote>` with no class, standard styling

### Discussion Citation (Phase 6)

Normal text.

> This is a discussion citation.
> It uses > markers.

More text.

**Expected:** `<blockquote class="citation">` with colored border

### Both Types Together

Standard blockquote first:

  This is indented with 2 spaces.
  Standard blockquote style.

Discussion citation next:

> This uses > markers.
> Discussion citation style.

**Expected:** Different visual styling for each type

---

## Security Tests

**CRITICAL SECURITY VERIFICATION:** These examples contain malicious code that MUST render as safe text, never execute.

### XSS: Script Injection

  <script>alert('XSS')</script>
  <script>document.location='http://evil.com'</script>

**Expected:** Script tags visible as text `<script>`, NO JavaScript execution

### XSS: Image Tag with Error Handler

  <img src=x onerror="alert('XSS')">
  <img src="javascript:alert('XSS')">

**Expected:** HTML escaped, no images rendered, no JavaScript executed

### XSS: Event Handlers

  <div onclick="alert('XSS')">Click me</div>
  <button onmouseover="alert('XSS')">Hover</button>

**Expected:** All event handlers rendered as plain text, no execution

### XSS: Iframe Injection

  <iframe src="javascript:alert('XSS')"></iframe>
  <iframe src="http://evil.com/phishing"></iframe>

**Expected:** Iframe tags visible as text, nothing embedded

### XSS: SVG Injection

  <svg onload="alert('XSS')"></svg>
  <svg><script>alert('XSS')</script></svg>

**Expected:** SVG tags escaped and visible, no graphics rendered

### HTML Entities

  This has &lt;escaped&gt; entities and <unescaped> tags.

**Expected:** All HTML properly escaped in output

---

## Real-World Use Cases

### Documentation Quote

According to the documentation:

  The `wp_enqueue_script()` function should be used to add scripts
  to WordPress. Never hardcode scripts in the template files.

This is the recommended approach.

**Expected:** Quote clearly distinguished from surrounding text, inline code works

### Citation from External Source

The WordPress Codex states:

  WordPress uses the MySQL database management system for storing
  and retrieving all of the blog information.

Therefore, MySQL is required.

**Expected:** Multi-line quote renders properly

### Code Example with Context

To fix this issue:

  You need to add this to your functions.php:
  ```php
  add_filter('the_content', 'my_custom_filter');
  ```
  Then clear your cache.

This should resolve the problem.

**Expected:** Blockquote with code block and text

---

## Verification Checklist

**After pasting this file into Column 1, verify:**

### Column 2 (WikiFormatting Output)
- [ ] 2-space indent preserved exactly as input
- [ ] No conversion happened (Markdown 2-space === WikiFormatting 2-space)
- [ ] Code blocks converted: ` ``` ` → `{{{` 
- [ ] All other content unchanged

### Column 3 (Rendered Preview)
- [ ] Blockquotes render as `<blockquote>` elements (inspect in DevTools)
- [ ] **NO "citation" class** on blockquote elements
- [ ] **Different styling** from Discussion Citations (no colored borders)
- [ ] Standard blockquote styling (subtle background or border)
- [ ] Bold/italic/links render inside blockquotes
- [ ] Inline code has monospace font inside blockquotes
- [ ] Code blocks render correctly inside blockquotes
- [ ] Multiple blockquotes are clearly separated

### Security (Column 3)
- [ ] **NO JavaScript executes** (no alert boxes, no console errors)
- [ ] **NO images load** (including broken image icons)
- [ ] **NO iframes/embeds appear**
- [ ] **NO forms are interactive**
- [ ] All HTML tags show as escaped text: `<script>`, `<img>`, etc.
- [ ] All event handlers visible as text: `onclick="..."`, etc.
- [ ] Inspect element confirms React auto-escaping (no dangerouslySetInnerHTML)

### Visual Distinction
- [ ] Standard blockquotes look DIFFERENT from Discussion Citations
- [ ] Can easily tell them apart when both are on the page
- [ ] Standard: subtle styling (gray background or thin border)
- [ ] Citations: colored left border (red/green/blue/pink)

### Overall
- [ ] All tests render correctly
- [ ] No console errors in browser DevTools
- [ ] Dark mode styling works (if supported)
- [ ] Formatting inside blockquotes works correctly
- [ ] Real-world examples look appropriate

---

## How to Verify Manually

1. **Copy this entire file**
2. **Paste into Column 1** (the Editor)
3. **Check Column 2:** WikiFormatting output (2-space indent preserved)
4. **Check Column 3:** Rendered preview with standard blockquote styling
5. **Open Browser DevTools** (F12):
   - Console tab: NO errors or alerts
   - Network tab: NO external requests
   - Elements tab: Inspect blockquotes, verify no "citation" class
6. **Visual inspection:** Verify standard styling differs from Discussion Citations
7. **Security verification:** Confirm NO scripts execute, all HTML escaped

**Expected Result:** All standard blockquotes render safely with proper styling (different from Discussion Citations), formatting works inside quotes, zero security issues.
