# Phase 4: Lists Implementation Plan

Detailed plan for converting Markdown lists to WikiFormatting and rendering them.

**Branch:** `feature/lists` (sub-branch from `feature/text-formatting`)  
**Parent:** Phase 3 + 3.5 (Text Formatting)  
**Target:** Complete list conversion and rendering

---

## Overview

Lists are a fundamental markup feature with multiple syntax variations in Markdown. This phase implements:
1. **Conversion**: Markdown list syntax → WikiFormatting list syntax
2. **Rendering**: WikiFormatting lists → React `<ul>`/`<ol>` elements

---

## Part 1: Markdown to WikiFormatting Conversion

### 1.1 Unordered Lists

**Markdown Syntax** (multiple options):
```markdown
* Item with asterisk
- Item with dash
+ Item with plus
```

**WikiFormatting Output** (standardized):
```wiki
* Item with asterisk
* Item with dash
* Item with plus
```

**Implementation Strategy:**
- Normalize all unordered list markers (`*`, `-`, `+`) → `*`
- Detect list items by line-start pattern: `^\s*[-*+]\s+(.+)$`
- Preserve indentation for nesting (see 1.3)
- Handle inline formatting within items (already works from Phase 3)

**Edge Cases:**
- Distinguish list markers from horizontal rules (`---`, `***`)
- Distinguish from bold/italic markers mid-sentence
- Handle items that start with markers: `* * is a wildcard`

---

### 1.2 Ordered Lists

**Markdown Syntax** (multiple options):
```markdown
1. First item (period)
2. Second item

1) First item (parenthesis)
2) Second item

1. Lazy numbering
1. All use 1
1. Auto-increment expected
```

**WikiFormatting Output** (normalized):
```wiki
1. First item
2. Second item

1. First item
2. Second item

1. Lazy numbering
2. All use 1
3. Auto-increment expected
```

**Implementation Strategy:**
- Detect: `^\s*(\d+)[.)]\s+(.+)$`
- Normalize parenthesis `1)` → period `1.`
- Track numbering counter per list block
- Handle lazy numbering: renumber `1. 1. 1.` → `1. 2. 3.`
- Reset counter on list break (blank line or different list type)

**Edge Cases:**
- Numbers > 9 (alignment in WikiFormatting)
- Starting number != 1 (e.g., `5. Pick up from step 5`)
- Mixed lazy and explicit numbering

---

### 1.3 Nested Lists

**Markdown Syntax** (indentation-based):
```markdown
* Level 1
  * Level 2 (2 spaces)
    * Level 3 (4 spaces total)
  
* Level 1
    * Level 2 (4 spaces)
        * Level 3 (8 spaces total)

* Level 1
	* Level 2 (1 tab)
		* Level 3 (2 tabs)

* Mixed
  1. Ordered inside unordered
  2. Second item
1. Ordered
   * Unordered inside ordered
```

**WikiFormatting Output** (space-based):
```wiki
* Level 1
  * Level 2
    * Level 3

* Level 1
  * Level 2
    * Level 3

* Level 1
  * Level 2
    * Level 3

* Mixed
  1. Ordered inside unordered
  2. Second item
1. Ordered
   * Unordered inside ordered
```

**Implementation Strategy:**
- Detect indentation level: count leading spaces/tabs
- Normalize tabs → 2 spaces (or 4, decide on standard)
- Calculate nesting level: `indent / indent_size`
- Preserve list type (ordered/unordered) per level
- Track nesting stack to handle level changes

**Edge Cases:**
- Inconsistent indentation (2 spaces, then 4, then 3)
- Mixed tabs and spaces
- Deeply nested lists (5+ levels)
- List item continuation (hanging indent)

---

### 1.4 List Item Content

**Single-Line Items** (simple):
```markdown
* Simple item
```
→ `* Simple item`

**Multi-Line Items** (continuation):
```markdown
* First line
  continuation on next line
  still the same item
* Second item
```
→ 
```wiki
* First line continuation on next line still the same item
* Second item
```

**Items with Inline Formatting**:
```markdown
* This is **bold** item
* This is *italic* item
* This is ***both***
```
→
```wiki
* This is '''bold''' item
* This is ''italic'' item
* This is '''''both'''''
```

**Loose Lists** (blank lines between items):
```markdown
* First item

* Second item (blank line above)

* Third item
```
→ WikiFormatting treats these as separate paragraphs:
```wiki
* First item

* Second item (blank line above)

* Third item
```

**Implementation Strategy:**
- Single-line: straightforward conversion
- Multi-line: detect continuation by indentation >= item indent
- Inline formatting: reuse Phase 3 `convertTextFormatting()`
- Loose lists: preserve blank lines between items
- Paragraph items: handle multi-paragraph list items (rare but valid)

**Edge Cases:**
- Empty list items: `*` alone
- Items with only whitespace
- Items with code blocks (backticks)
- Items with links (Phase 5 feature, preserve for now)

---

### 1.5 List Detection & Boundaries

**Starting a List:**
- First line matches list pattern
- May have leading blank line
- Previous line is not a list item (new list)

**Continuing a List:**
- Line matches list pattern
- Indentation indicates same or nested level
- No blank lines (tight list) OR blank lines (loose list)

**Ending a List:**
- Non-list-item line (different syntax)
- Blank line followed by non-list content
- End of document
- Different list type with no indentation change

**Implementation Strategy:**
- Track list state: `in_list`, `current_indent`, `list_type`
- Process line-by-line, detecting transitions
- Emit list markers and indentation accordingly

---

## Part 2: WikiFormatting to React Rendering

### 2.1 Unordered List Rendering

**WikiFormatting Input:**
```wiki
* Item 1
* Item 2
  * Nested item
* Item 3
```

**React Output:**
```jsx
<ul>
  <li>Item 1</li>
  <li>Item 2
    <ul>
      <li>Nested item</li>
    </ul>
  </li>
  <li>Item 3</li>
</ul>
```

**Implementation:**
- Detect unordered list: line starts with `*` (after whitespace)
- Calculate nesting by leading spaces
- Build nested `<ul>` structure
- Each item → `<li>` element
- Parse inline formatting within items (reuse `parseInlineFormatting()`)

---

### 2.2 Ordered List Rendering

**WikiFormatting Input:**
```wiki
1. First
2. Second
   1. Nested ordered
   2. Another nested
3. Third
```

**React Output:**
```jsx
<ol>
  <li>First</li>
  <li>Second
    <ol>
      <li>Nested ordered</li>
      <li>Another nested</li>
    </ol>
  </li>
  <li>Third</li>
</ol>
```

**Implementation:**
- Detect ordered list: line starts with `\d+\.`
- Track nesting depth
- Build nested `<ol>` structure
- Number is implicit (browser auto-numbers)
- Parse inline formatting within items

---

### 2.3 Mixed Nesting

**WikiFormatting Input:**
```wiki
* Unordered
  1. Ordered inside
  2. Another
* Back to unordered
```

**React Output:**
```jsx
<ul>
  <li>Unordered
    <ol>
      <li>Ordered inside</li>
      <li>Another</li>
    </ol>
  </li>
  <li>Back to unordered</li>
</ul>
```

**Implementation:**
- Track list type stack: `['ul', 'ol', 'ul', ...]`
- Push/pop as nesting changes
- Emit correct opening/closing tags
- Maintain proper DOM hierarchy

---

### 2.4 Parsing Algorithm

**Stack-Based Approach:**

```javascript
function parseListsToReact(wikiText) {
  const lines = wikiText.split('\n');
  const stack = []; // { type: 'ul'|'ol', indent: number, items: [] }
  const result = [];
  
  for (const line of lines) {
    if (isListItem(line)) {
      const { type, indent, content } = parseListLine(line);
      
      // Close deeper levels
      while (stack.length > 0 && stack[stack.length - 1].indent >= indent) {
        const closed = stack.pop();
        addToParent(stack, closed);
      }
      
      // Open new level if needed
      if (stack.length === 0 || stack[stack.length - 1].indent < indent) {
        stack.push({ type, indent, items: [] });
      }
      
      // Add item to current level
      const formattedContent = parseInlineFormatting(content);
      stack[stack.length - 1].items.push(formattedContent);
    } else {
      // Not a list item - close all levels
      while (stack.length > 0) {
        const closed = stack.pop();
        addToParent(stack, closed);
      }
      // Add non-list content
      result.push(parseOther(line));
    }
  }
  
  // Close remaining open lists
  while (stack.length > 0) {
    const closed = stack.pop();
    result.push(createListElement(closed));
  }
  
  return result;
}
```

---

## Part 3: File Structure

### 3.1 Converter Module

**File:** `src/converters/lists.js`

**Exports:**
- `convertLists(text)` - Main conversion function
- `parseListItem(line)` - Parse single list item
- `normalizeListMarker(marker)` - Normalize * - + → *
- `normalizeNumbering(marker)` - Normalize 1) → 1.
- `calculateIndent(line)` - Determine nesting level

**Tests:** `src/converters/lists.test.js`
- 60+ test cases covering all syntax variations
- 100% code coverage requirement
- Edge cases, Unicode, special characters
- Real-world examples

---

### 3.2 Renderer Module

**File:** `src/renderers/wikiToReact.js` (extend existing)

**New Functions:**
- `parseListsToReact(wikiText)` - Main list parser
- `isListItem(line)` - Detect list item
- `parseListLine(line)` - Extract type, indent, content
- `createListElement({ type, items })` - Build React <ul>/<ol>

**Tests:** `src/renderers/wikiToReact.test.js` (extend existing)
- 40+ test cases for rendering
- Nested structures
- Mixed list types
- Inline formatting within lists

---

## Part 4: Testing Strategy

### 4.1 Unit Tests - Conversion

**Test Categories:**
1. **Unordered Lists**
   - Single marker type: `*`, `-`, `+`
   - Mixed markers in same list
   - Normalization to `*`
   
2. **Ordered Lists**
   - Period syntax: `1.`
   - Parenthesis syntax: `1)`
   - Lazy numbering
   - Explicit numbering
   - Starting number != 1

3. **Nesting**
   - 2-space indentation
   - 4-space indentation
   - Tab indentation
   - Mixed ordered/unordered
   - Deep nesting (5 levels)

4. **Content**
   - Single-line items
   - Multi-line items
   - Inline formatting (bold, italic)
   - Empty items
   - Special characters

5. **Edge Cases**
   - Horizontal rules vs. list markers
   - Inconsistent indentation
   - Mixed tabs/spaces
   - Unicode bullets
   - Very long items

---

### 4.2 Unit Tests - Rendering

**Test Categories:**
1. **Structure**
   - Flat unordered list
   - Flat ordered list
   - Nested lists
   - Mixed nesting
   
2. **Content**
   - Plain text items
   - Items with bold/italic
   - Multi-paragraph items
   
3. **React Safety**
   - Auto-escaping of content
   - No XSS vulnerabilities
   - Proper key attributes
   - Valid React elements

---

### 4.3 Integration Tests

**End-to-End Conversion:**
```javascript
describe('Lists E2E', () => {
  test('Markdown → WikiFormatting → React', () => {
    const markdown = `
# Todo List

* Complete Phase 4
  * Write converter
  * Write renderer
  * Write tests
* Review PR
  1. Check conversion
  2. Check rendering
  3. Run security review
`;
    
    const wiki = convertMarkdownToWiki(markdown);
    expect(wiki).toContain('* Complete Phase 4');
    
    const elements = convertWikiToReact(wiki);
    expect(elements).toContainEqual(<ul>...</ul>);
  });
});
```

---

## Part 5: Security Considerations

### 5.1 Conversion Security

- **No HTML injection**: Lists contain only text markers and content
- **Escape list item content**: Use existing escaping from Phase 1
- **Validate indentation**: Prevent overflow/underflow attacks via extreme nesting
- **Sanitize markers**: Ensure markers don't contain executable code

### 5.2 Rendering Security

- **React auto-escaping**: All list item content rendered as text nodes
- **No dangerouslySetInnerHTML**: Pure React element creation
- **Hardcoded element types**: `<ul>`, `<ol>`, `<li>` only
- **Key generation**: Use counter-based keys (no user input)
- **XSS Prevention**: Test with malicious payloads:
  - `* <script>alert('xss')</script>`
  - `* "><img src=x onerror=alert(1)>`
  - `* javascript:alert(1)`

### 5.3 Security Review Checklist

- [ ] All user content properly escaped
- [ ] No XSS vulnerabilities
- [ ] No HTML injection
- [ ] No infinite loop risks (nesting depth limit?)
- [ ] Type checking on all inputs
- [ ] Malicious pattern tests pass
- [ ] React auto-escaping verified
- [ ] No dangerouslySetInnerHTML usage

---

## Part 6: Implementation Phases

### Phase 4a: Conversion (Week 1)

**Day 1-2:**
- [ ] Create `src/converters/lists.js`
- [ ] Implement unordered list detection
- [ ] Implement ordered list detection
- [ ] Write basic tests (20 tests)

**Day 3-4:**
- [ ] Implement nesting detection
- [ ] Implement indentation normalization
- [ ] Handle multi-line items
- [ ] Write nesting tests (20 tests)

**Day 5:**
- [ ] Edge case handling
- [ ] Inline formatting integration
- [ ] Write edge case tests (20 tests)
- [ ] 100% coverage verification

---

### Phase 4b: Rendering (Week 2)

**Day 1-2:**
- [ ] Extend `wikiToReact.js` with list parsing
- [ ] Implement stack-based parser
- [ ] Flat list rendering
- [ ] Write rendering tests (15 tests)

**Day 3-4:**
- [ ] Nested list rendering
- [ ] Mixed list type rendering
- [ ] Inline formatting in lists
- [ ] Write nesting tests (15 tests)

**Day 5:**
- [ ] Edge case rendering
- [ ] Integration tests
- [ ] Write final tests (10 tests)
- [ ] 100% coverage verification

---

### Phase 4c: Integration & Review

**Day 1:**
- [ ] Integration with main converter pipeline
- [ ] End-to-end testing
- [ ] Performance testing (large lists)

**Day 2:**
- [ ] Security review preparation
- [ ] XSS payload testing
- [ ] Documentation updates (JSDoc)

**Day 3:**
- [ ] Run `/security-review`
- [ ] Fix any security issues
- [ ] Final test run

**Day 4:**
- [ ] Create PR: `feature/lists` → `feature/text-formatting`
- [ ] Address review feedback
- [ ] Merge to base branch

---

## Part 7: Success Criteria

**Conversion:**
- ✅ All Markdown list syntaxes convert correctly
- ✅ Nested lists preserve hierarchy
- ✅ Inline formatting works in list items
- ✅ 100% test coverage on converter
- ✅ Edge cases handled gracefully

**Rendering:**
- ✅ WikiFormatting lists render as proper HTML lists
- ✅ Nested structure displays correctly
- ✅ Trac-style CSS applies
- ✅ 100% test coverage on renderer
- ✅ React-safe (no XSS vulnerabilities)

**Quality:**
- ✅ 100+ total tests passing
- ✅ Security review passed (0 vulnerabilities)
- ✅ JSDoc documentation complete
- ✅ Real-world examples tested
- ✅ Ready to merge to `feature/text-formatting`

---

## Part 8: Examples - Before & After

### Example 1: Simple Todo List

**Markdown Input:**
```markdown
# My Todos

* Write code
* Write tests
* Write docs
```

**WikiFormatting Output:**
```wiki
= My Todos =

* Write code
* Write tests
* Write docs
```

**Rendered Output:**
```html
<h1 id="MyTodos">My Todos<a href="#MyTodos"> ¶</a></h1>
<ul>
  <li>Write code</li>
  <li>Write tests</li>
  <li>Write docs</li>
</ul>
```

---

### Example 2: Nested Feature List

**Markdown Input:**
```markdown
# Features

* **Core Features**
  * Bold and italic text
  * Headers (H1-H6)
  * Lists (this!)
* **Coming Soon**
  1. Links
  2. Code blocks
  3. Images
```

**WikiFormatting Output:**
```wiki
= Features =

* '''Core Features'''
  * Bold and italic text
  * Headers (H1-H6)
  * Lists (this!)
* '''Coming Soon'''
  1. Links
  2. Code blocks
  3. Images
```

**Rendered Output:**
```html
<h1 id="Features">Features<a href="#Features"> ¶</a></h1>
<ul>
  <li><strong>Core Features</strong>
    <ul>
      <li>Bold and italic text</li>
      <li>Headers (H1-H6)</li>
      <li>Lists (this!)</li>
    </ul>
  </li>
  <li><strong>Coming Soon</strong>
    <ol>
      <li>Links</li>
      <li>Code blocks</li>
      <li>Images</li>
    </ol>
  </li>
</ul>
```

---

### Example 3: Real Trac Bug Report

**Markdown Input:**
```markdown
## Steps to Reproduce

1. Open the editor
2. Type **bold text**
3. Notice the following:
   * Column 2 shows WikiFormatting
   * Column 3 shows rendered preview
4. Verify rendering is correct
```

**WikiFormatting Output:**
```wiki
== Steps to Reproduce ==

1. Open the editor
2. Type '''bold text'''
3. Notice the following:
   * Column 2 shows WikiFormatting
   * Column 3 shows rendered preview
4. Verify rendering is correct
```

**Rendered Output:**
```html
<h2 id="StepstoReproduce">Steps to Reproduce<a href="#StepstoReproduce"> ¶</a></h2>
<ol>
  <li>Open the editor</li>
  <li>Type <strong>bold text</strong></li>
  <li>Notice the following:
    <ul>
      <li>Column 2 shows WikiFormatting</li>
      <li>Column 3 shows rendered preview</li>
    </ul>
  </li>
  <li>Verify rendering is correct</li>
</ol>
```

---

## Reference Documentation

- [Markdown Lists Spec](https://spec.commonmark.org/0.30/#lists)
- [WikiFormatting Lists](https://trac.ffmpeg.org/wiki/WikiFormatting#Lists)
- [React Lists & Keys](https://react.dev/learn/rendering-lists)

---

**Last Updated:** 2026-07-27  
**Status:** Planning Complete - Ready for Implementation
