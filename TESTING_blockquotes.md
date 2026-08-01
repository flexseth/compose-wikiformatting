# Blockquotes Testing - Phase 6

**Purpose:** Manual testing file for blockquote conversion and rendering. Copy/paste examples into Trac to compare both WikiFormatting blockquote syntaxes.

**Two WikiFormatting Blockquote Syntaxes:**
1. **Indentation-based:** 2-space indent (standard Trac blockquotes)
2. **Discussion Citations:** `>` markers (email-style, used in ticket comments)

**Test Goal:** Determine which syntax to use for Markdown `>` conversion in Phase 6.

---

## Example 1: Simple Blockquote (Indentation Style)

**WikiFormatting (2-space indent):**

```
This is a normal paragraph.

  This is a blockquote created with 2-space indentation.
  It can span multiple lines as long as each line starts with 2 spaces.

This is a normal paragraph after the quote.
```

**What to verify:**
- Does it render as a `<blockquote>` element?
- Does the visual styling look like a proper quote?
- Can you tell it's indented in the raw text?

---

## Example 2: Simple Blockquote (Citation Style)

**WikiFormatting (`>` markers):**

```
This is a normal paragraph.

> This is a blockquote using the > marker (Discussion Citation style).
> Multiple lines with > markers create one blockquote.

This is a normal paragraph after the citation.
```

**What to verify:**
- Does it render as a `<blockquote class="citation">` element?
- Is the visual styling different from indentation style?
- Is the `>` marker easier to read in raw form?

---

## Example 3: Nested Blockquotes (Indentation Style)

**WikiFormatting (nested indentation):**

```
Regular paragraph.

  First level blockquote (2 spaces).
    Second level nested quote (4 spaces).
      Third level nested quote (6 spaces).

Back to regular text.
```

**What to verify:**
- Does nesting work correctly?
- Are there visual differences between nesting levels?
- Is the indentation clear in raw text?

---

## Example 4: Nested Blockquotes (Citation Style)

**WikiFormatting (nested `>` markers):**

```
Regular paragraph.

>> Someone's original comment
> My reply to that comment
My final response
```

**Another nested example:**

```
>> Original text (double nested)
> Reply text (single level)
>  - which can be any kind of Wiki markup
My response (no quote)
```

**What to verify:**
- Does `>>` create a nested quote?
- Does the visual nesting match the markup?
- Is the email-style easier to understand?

---

## Example 5: Blockquote with Text Formatting (Indentation)

**WikiFormatting (indentation with formatting):**

```
Normal paragraph.

  This blockquote has '''bold text''' and ''italic text''.
  It also has a [https://wordpress.org link to WordPress].
  And some `inline code` too.

Normal paragraph.
```

**What to verify:**
- Does bold/italic render inside the blockquote?
- Do links work correctly?
- Does inline code render properly?

---

## Example 6: Blockquote with Text Formatting (Citation)

**WikiFormatting (citation with formatting):**

```
Normal paragraph.

> This citation has '''bold text''' and ''italic text'''
> It also has a [https://wordpress.org link to WordPress]
> And some `inline code` too

Normal paragraph.
```

**What to verify:**
- Same formatting questions as Example 5
- Compare visual appearance to indentation style

---

## Example 7: Blockquote with Code Block (Indentation)

**WikiFormatting (indentation with code):**

```
Normal paragraph.

  This blockquote contains an explanation.
  
  {{{#!javascript
  const example = "code inside a quote";
  console.log(example);
  }}}
  
  More quote text after the code.

Normal paragraph.
```

**What to verify:**
- Does the code block render inside the blockquote?
- Is the syntax highlighting preserved?
- Does the nesting look correct?

---

## Example 8: Blockquote with Code Block (Citation)

**WikiFormatting (citation with code):**

```
Normal paragraph.

> This citation explains some code:
>
> {{{#!javascript
> const example = "code in citation";
> }}}
>
> The code above demonstrates the concept.

Normal paragraph.
```

**What to verify:**
- Does code work in citation style?
- Compare to indentation style rendering
- Which looks better visually?

---

## Example 9: Multiple Blockquotes (Indentation)

**WikiFormatting (multiple separate quotes):**

```
First paragraph.

  First blockquote here.
  It has multiple lines.

Second paragraph between quotes.

  Second blockquote here.
  Also with multiple lines.

Final paragraph.
```

**What to verify:**
- Are the two blockquotes clearly separated?
- Does the spacing look correct?

---

## Example 10: Multiple Blockquotes (Citation)

**WikiFormatting (multiple separate citations):**

```
First paragraph.

> First citation here
> It has multiple lines

Second paragraph between citations.

> Second citation here
> Also with multiple lines

Final paragraph.
```

**What to verify:**
- Compare separation to indentation style
- Which is easier to distinguish in raw form?

---

## Example 11: Real-World Use Case - Bug Report Quote

**WikiFormatting (indentation style):**

```
I tested the reported issue and can confirm the bug.

  The original report stated:
  "When I click the submit button, nothing happens. Console shows TypeError: undefined is not a function."

After investigation, I found the issue in the event handler on line 42.
```

**WikiFormatting (citation style):**

```
I tested the reported issue and can confirm the bug.

> The original report stated:
> "When I click the submit button, nothing happens. Console shows TypeError: undefined is not a function."

After investigation, I found the issue in the event handler on line 42.
```

**What to verify:**
- Which style is more appropriate for quoting bug reports?
- Which is easier to read in ticket comments?

---

## Example 12: Real-World Use Case - Code Review Comment

**WikiFormatting (indentation style):**

```
Regarding the changes in src/utils/validation.js:

  From your PR description:
  "Added email validation regex that supports international domains and special characters."

The regex pattern looks good, but we should add tests for edge cases like multiple @ symbols.
```

**WikiFormatting (citation style):**

```
Regarding the changes in src/utils/validation.js:

> From your PR description:
> "Added email validation regex that supports international domains and special characters."

The regex pattern looks good, but we should add tests for edge cases like multiple @ symbols.
```

**What to verify:**
- Which style fits code review discussions better?
- Which is more readable in pull request comments?

---

## Comparison Checklist

After testing all examples on Trac, answer these questions:

**Visual Rendering:**
- [ ] Which style has better visual distinction from normal text?
- [ ] Which style's nesting is clearer?
- [ ] Which style looks better with formatted text inside?
- [ ] Which style works better with code blocks inside?

**Raw Text Readability:**
- [ ] Which is easier to read in raw WikiFormatting?
- [ ] Which is easier to write manually?
- [ ] Which would Markdown users find more familiar?

**Use Case Fit:**
- [ ] Which is better for general blockquotes?
- [ ] Which is better for ticket/PR discussions?
- [ ] Which matches WordPress Trac's conventions?

**Technical Considerations:**
- [ ] Do both styles render correctly in all contexts?
- [ ] Are there any bugs or edge cases with either style?
- [ ] Which style is used more often in existing WordPress Trac tickets?

---

## Decision Criteria

**For Phase 6 Implementation:**

1. **If Indentation Style is chosen:**
   - Convert `>` → `  ` (2 spaces)
   - Convert `>>` → `    ` (4 spaces)
   - Handle multi-line blockquotes
   - Preserve content formatting

2. **If Citation Style is chosen:**
   - NO conversion needed (`>` stays `>`)
   - Minimal code required
   - Markdown-compatible already
   - May need rendering adjustments

3. **Hybrid Approach (if needed):**
   - Use citation style for ticket comments
   - Use indentation for wiki pages
   - Context-aware conversion

---

## Next Steps

1. Paste examples into WordPress Trac (https://core.trac.wordpress.org)
2. Create a test ticket or wiki page
3. Compare visual rendering
4. Check existing tickets to see which style is more common
5. Make decision on which syntax to use for Phase 6
6. Report findings back for implementation planning
