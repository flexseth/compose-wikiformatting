# Blockquotes Testing - Phase 6

**Purpose:** Manual testing file for blockquote conversion and rendering. Copy/paste this entire file into the editor (Column 1) to see WikiFormatting conversion in Column 2 and rendered output in Column 3.

**What to verify:**
- Column 2 shows `>` markers preserved (Markdown and WikiFormatting use same syntax)
- Column 3 renders as `<blockquote class="citation">` elements
- Nested blockquotes display correctly
- Formatting inside blockquotes works (bold, italic, links)
- Security: XSS attempts are escaped

---

## Basic Blockquotes

### Simple Blockquote

> This is a simple blockquote.
> It spans multiple lines.
> All consecutive lines starting with > are grouped together.

**Expected Column 2:** Same as input (no conversion needed)
**Expected Column 3:** `<blockquote class="citation">` element with gray background and left border

### Single Line Blockquote

> Single line quote.

**Expected:** Renders as blockquote element

### Empty Blockquote

>

**Expected:** Empty blockquote element (edge case)

---

## Nested Blockquotes

### Two Levels

>> This is a nested quote (level 2)
> This is the parent quote (level 1)
> Still part of parent quote

**Expected:** Nested `<blockquote>` elements with progressive indentation

### Three Levels

>>> Level 3 (deepest)
>> Level 2
> Level 1

**Expected:** Three nested blockquote elements

### Mixed Nesting

> Level 1 first
>> Level 2 nested
>> Still level 2
> Back to level 1
>> Another level 2

**Expected:** Proper nesting structure with level changes

---

## Blockquotes with Formatting

### Bold Inside Blockquote

> This quote has **bold text** inside it.
> And **more bold** on the next line.

**Expected:** Bold renders inside the blockquote

### Italic Inside Blockquote

> This quote has *italic text* inside it.
> And _more italic_ on the next line.

**Expected:** Italic renders inside the blockquote

### Bold and Italic

> This has **bold** and *italic* and ***bold italic***.

**Expected:** All formatting renders correctly

### Links Inside Blockquote

> Check out [WordPress](https://wordpress.org) for more info.
> Also see [GitHub](https://github.com).

**Expected:** Links are clickable inside the blockquote

### Code Inside Blockquote

> This quote contains `inline code` here.
> And more `code` on this line.

**Expected:** Inline code renders with monospace font inside blockquote

### Mixed Formatting

> This is a **bold** statement with *italic* emphasis.
> It also has a [link](https://example.com) and `code`.

**Expected:** All formatting types work together inside blockquote

---

## Multiple Blockquotes

### Two Separate Blockquotes

> First blockquote here.
> It has multiple lines.

This is normal text between blockquotes.

> Second blockquote here.
> Also with multiple lines.

**Expected:** Two distinct blockquote elements separated by paragraph

### Three Blockquotes

> Quote 1

> Quote 2

> Quote 3

**Expected:** Three separate blockquote elements

---

## Blockquotes with Other Elements

### Blockquote with Header Before

## This is a header

> This is a blockquote after a header.

**Expected:** Header renders normally, then blockquote below it

### Blockquote with Header After

> This is a blockquote before a header.

## This is a header

**Expected:** Blockquote renders normally, then header below it

### Blockquote with Code Block

> This quote discusses code:

```javascript
const example = "code";
```

> And continues after the code.

**Expected:** Blockquote, then code block, then another blockquote

---

## Edge Cases

### Blockquote at Start of Document

> This blockquote is at the very start.

**Expected:** Renders correctly without preceding content

### Blockquote at End of Document

This is some text.

> This blockquote is at the very end.

**Expected:** Renders correctly without following content

### Blockquote with Leading/Trailing Spaces

>   This has spaces after the marker.

**Expected:** Renders correctly, spaces handled gracefully

### Multiple Empty Lines

> First line

> Third line (empty line above)

**Expected:** Two separate blockquotes or one with paragraph break

---

## Security Tests

**CRITICAL SECURITY VERIFICATION:** These examples contain malicious code that MUST render as safe text, never execute.

### XSS: Script Injection

> <script>alert('XSS')</script>
> <script>document.location='http://evil.com'</script>

**Expected:** Script tags visible as text `<script>`, NO JavaScript execution

### XSS: Image Tag with Error Handler

> <img src=x onerror="alert('XSS')">
> <img src="javascript:alert('XSS')">

**Expected:** HTML escaped, no images rendered, no JavaScript executed

### XSS: Event Handlers

> <div onclick="alert('XSS')">Click me</div>
> <button onmouseover="alert('XSS')">Hover</button>

**Expected:** All event handlers rendered as plain text, no execution

### XSS: Iframe Injection

> <iframe src="javascript:alert('XSS')"></iframe>
> <iframe src="http://evil.com/phishing"></iframe>

**Expected:** Iframe tags visible as text, nothing embedded

### XSS: SVG Injection

> <svg onload="alert('XSS')"></svg>
> <svg><script>alert('XSS')</script></svg>

**Expected:** SVG tags escaped and visible, no graphics rendered

### XSS: Data URIs

> <a href="data:text/html,<script>alert('XSS')</script>">Click</a>

**Expected:** Links escaped, no data URI execution

### HTML Entities

> This has &lt;escaped&gt; entities and <unescaped> tags.

**Expected:** All HTML properly escaped in output

---

## Real-World Use Cases

### Bug Report Quote

I found a bug in the login system.

> The original report stated:
> "When I click the login button, nothing happens. Console shows: TypeError: undefined is not a function at auth.js:42"

After investigation, the issue is in the event handler.

**Expected:** Quote clearly distinguished from surrounding text

### Code Review Comment

Regarding the changes in PR #123:

> From the pull request description:
> "Added input validation for email addresses. Now supports international domains and special characters."

The regex pattern looks good, but we should add tests for edge cases.

**Expected:** Multi-line quote renders properly in discussion context

### Documentation Reference

The documentation explains this feature:

> **Important:** Always validate user input before processing.
> Never trust data from external sources.

This is a critical security principle.

**Expected:** Bold formatting works inside quoted documentation

---

## Verification Checklist

**After pasting this file into Column 1, verify:**

### Column 2 (WikiFormatting Output)
- [ ] `>` markers preserved exactly as input
- [ ] No conversion happened (Markdown `>` === WikiFormatting `>`)
- [ ] All content after `>` markers unchanged
- [ ] Nested `>>` and `>>>` markers intact

### Column 3 (Rendered Preview)
- [ ] Blockquotes render as `<blockquote class="citation">` elements
- [ ] Visual styling: gray background, left border
- [ ] Nested blockquotes have progressive indentation
- [ ] Bold/italic/links render inside blockquotes
- [ ] Inline code has monospace font inside blockquotes
- [ ] Multiple blockquotes are clearly separated

### Security (Column 3)
- [ ] **NO JavaScript executes** (no alert boxes, no console errors)
- [ ] **NO images load** (including broken image icons)
- [ ] **NO iframes/embeds appear**
- [ ] **NO forms are interactive**
- [ ] All HTML tags show as escaped text: `<script>`, `<img>`, etc.
- [ ] All event handlers visible as text: `onclick="..."`, etc.
- [ ] Inspect element confirms React auto-escaping (no dangerouslySetInnerHTML)

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
3. **Check Column 2:** WikiFormatting output (should be identical to input)
4. **Check Column 3:** Rendered preview with blockquote styling
5. **Open Browser DevTools** (F12):
   - Console tab: NO errors or alerts
   - Network tab: NO external requests
   - Elements tab: Inspect blockquotes, verify `<blockquote class="citation">`
6. **Visual inspection:** Verify styling matches Trac Discussion Citations
7. **Security verification:** Confirm NO scripts execute, all HTML escaped

**Expected Result:** All blockquotes render safely with proper styling, formatting works inside quotes, nested quotes display correctly, zero security issues.
