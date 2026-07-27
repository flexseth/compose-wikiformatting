# UI Testing Guide for Phase 3: Text Formatting

This guide provides comprehensive testing instructions for Phase 3 text formatting conversion (bold, italic).

## Start the App

```bash
npm start
```

App opens at `http://localhost:3000`

---

## What to Test

Type these examples in the **Editor** (Column 1) and verify the output in **WikiFormatting** (Column 2) and **Rendered Preview** (Column 3):

### 1. Basic Bold

**Input:**
```markdown
This is **bold** text
```

**Expected WikiFormatting:** `This is '''bold''' text`  
**Expected Render:** "This is **bold** text" (bold displayed)
> Bold text is not bold.

---

### 2. Basic Italic

**Input:**
```markdown
This is *italic* text
```

**Expected WikiFormatting:** `This is ''italic'' text`  
> ✅
**Expected Render:** "This is *italic* text" (italic displayed)
> Italic text is not italic.

---

### 3. Bold with Underscores

**Input:**
```markdown
This is __also bold__
```

**Expected WikiFormatting:** `This is '''also bold''' text`  
**Expected Render:** "This is **also bold**"
> Render does not work.

---

### 4. Italic with Underscores

**Input:**
```markdown
This is _also italic_
```

**Expected WikiFormatting:** `This is ''also italic'' text`  
**Expected Render:** "This is *also italic*"
> Italic text does not render as italic.

---

### 5. Bold + Italic

**Input:**
```markdown
This is ***very important***
```

**Expected WikiFormatting:** `This is '''''very important'''''`  
**Expected Render:** "This is ***very important***" (bold AND italic)
> Bold + italic text does not correctly render.

---

### 6. Mixed Formatting

**Input:**
```markdown
Use **bold** for emphasis and *italic* for notes.
```

**Expected WikiFormatting:** `Use '''bold''' for emphasis and ''italic'' for notes.`  
**Expected Render:** Bold and italic displayed correctly
> Mixed Formatting does not correctly render.

---

### 7. Headers with Formatting

**Input:**
```markdown
# This is a **Bold** Heading

## This is an *Italic* Subheading

### This is ***Bold and Italic***
```

**Expected WikiFormatting:**
```
= This is a '''Bold''' Heading =

== This is an ''Italic'' Subheading ==

=== This is '''''Bold and Italic''''' ===
```

**Expected Render:** Headers with formatted text inside
> ✅ These work because header render has been completed - see Note.

---

### 8. Complex Document

**Input:**
```markdown
# API **Documentation**

The ***new API*** returns **JSON** data.

## Usage

Call the method with *caution*.
```

**Verify:** All formatting converts correctly in headers AND body text
> ✅ Headings with formatted text work only, others do not. See note.

---

### 9. Edge Cases to Test

#### Unpaired markers (should stay as-is)

**Input:**
```markdown
This has * single * asterisks
This has _ single _ underscores
```

**Expected:** No conversion, markers remain
> ✅

---

#### Inline code (should stay as-is)

**Input:**
```markdown
Use `console.log()` for debugging
```

**Expected:** Backticks preserved, no conversion
> ✅

---

#### Nested formatting

**Input:**
```markdown
**This is bold with *italic* inside**
```

**Expected WikiFormatting:** `'''This is bold with ''italic'' inside'''`
> ✅ - renderer does not work - See note.

---

## Verify All Three Columns

| Column | What to Check |
|--------|---------------|
| **1. Editor** | Type Markdown naturally |
| **2. WikiFormatting** | Verify `'''` for bold, `''` for italic |
| **3. Rendered Preview** | See actual bold/italic styling |
> Note: Rendered Preview does not work for anything other than headings
> This is because we have only done the heading render so far.

---

## localStorage Test

1. Type some formatted text
2. Wait 500ms (debounce delay)
> User can type text, immediately refresh, text is stored (no debounce)
3. Refresh the page (⌘R / Ctrl+R)
4. **Verify:** Content restored with formatting intact

---

## Quick Smoke Test

Paste this full example:

```markdown
# Quick **Test**

This is ***very important*** information.

## Features

- Use **bold** for emphasis
- Use *italic* for notes
- Use `code` for functions

Regular text with **bold** and *italic* mixed together.
```

**Expected:** All formatting converts correctly across headers and body text, displays properly in rendered view.

---

## What Success Looks Like

✅ **Bold** text shows with triple quotes (`'''`) in WikiFormatting  
✅ **Italic** text shows with double quotes (`''`) in WikiFormatting  
✅ **Rendered view** displays actual bold/italic styling  
✅ **Headers** show formatting correctly  
✅ **localStorage** saves and restores formatted content  
✅ **No console errors**

---

## Troubleshooting

### Issue: Formatting not converting

**Check:**
- Are there spaces after `**` or `*`? (e.g., `** text**` won't convert)
- Are markers properly paired? (e.g., single `*` won't convert)

### Issue: localStorage not working

**Check:**
- Wait 500ms after typing (debounce delay)
- Check browser console for errors
- Verify localStorage is enabled in browser

### Issue: Rendered view not showing bold/italic

**Check:**
- WikiFormatting syntax correct? (`'''` for bold, `''` for italic)
- Browser dev tools for CSS issues
- Console for React errors
> No errors, this functionality has not been implemented per "Note"

---

## Test Coverage

This testing guide covers:
- ✅ Basic bold conversion (2 syntaxes)
- ✅ Basic italic conversion (2 syntaxes)
- ✅ Bold+italic combination
- ✅ Mixed formatting
- ✅ Headers with formatting
- ✅ Complex documents
- ✅ Edge cases (unpaired, code, nested)
- ✅ localStorage persistence
- ✅ Real-world usage patterns

**Total test cases:** 9 categories, 20+ specific examples
> Is the renderered preview provided in test cases?

---

## Next Steps After Testing

~~If all tests pass:~~
~~1. Commit any fixes~~
~~2. Run full test suite: `npm test`~~
~~~~3. Run security review: `/security-review`~~~~
~~4. Create pull request~~
~~5. Merge to trunk following portfolio workflow~~

1. Add a `3..5` phase - `feature/rendered-preview` from `text-formatting` branch

---

**Phase 3 Implementation:** `feature/text-formatting` branch  
**Test Count:** 272 tests (49 new for Phase 3)  
**Coverage:** 100% on text formatting converter

# Next action steps for Claude

Create a feature branch from this branch (mentioned above) to format bold, italics, and the other types of text addressed in this PR.
