# WikiFormatting Cheatsheet for WordPress Trac

This cheatsheet covers WikiFormatting syntax used in WordPress Trac (https://core.trac.wordpress.org).

## Text Formatting

### Bold
**WikiFormatting:**
```
'''bold text'''
```
**Output:** **bold text**

### Italic
**WikiFormatting:**
```
''italic text''
```
**Output:** *italic text*

### Bold + Italic
**WikiFormatting:**
```
'''''bold and italic'''''
```
**Output:** ***bold and italic***

### Monospace/Code (inline)
**WikiFormatting:**
```
`inline code`
```
**Output:** `inline code`

### Strikethrough
**WikiFormatting:**
```
~~strikethrough~~
```
**Output:** ~~strikethrough~~

### Underline
**WikiFormatting:**
```
__underlined text__
```
**Output:** <u>underlined text</u>

### Superscript
**WikiFormatting:**
```
^superscript^
```
**Output:** text^superscript^

### Subscript
**WikiFormatting:**
```
,,subscript,,
```
**Output:** text₍ₛᵤᵦₛ𝒸ᵣᵢₚₜ₎

---

## Headings

**WikiFormatting:**
```
= Heading 1 =
== Heading 2 ==
=== Heading 3 ===
==== Heading 4 ====
===== Heading 5 =====
```

**Markdown Equivalent:**
```markdown
# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
```

---

## Links

### External Links
**WikiFormatting:**
```
[https://wordpress.org WordPress.org]
[https://wordpress.org]
https://wordpress.org
```

### Wiki Links (Internal Pages)
**WikiFormatting:**
```
WikiPageName
[wiki:WikiPageName Link Text]
[wiki:WikiPageName]
```

### Ticket Links
**WikiFormatting:**
```
#12345
ticket:12345
[ticket:12345 Ticket Description]
```

### Changeset Links
**WikiFormatting:**
```
[12345]
r12345
changeset:12345
[changeset:12345 Changeset Description]
```

### Comment Links
**WikiFormatting:**
```
comment:5:ticket:12345
```

### Source Code Links
**WikiFormatting:**
```
source:trunk/wp-includes/functions.php
source:trunk/wp-includes/functions.php@12345
source:trunk/wp-includes/functions.php@12345#L100
```

---

## Lists

### Unordered Lists (Bullets)
**WikiFormatting:**
```
 * Item 1
 * Item 2
   * Nested item 2.1
   * Nested item 2.2
 * Item 3
```

**Markdown Equivalent:**
```markdown
- Item 1
- Item 2
  - Nested item 2.1
  - Nested item 2.2
- Item 3
```

### Ordered Lists (Numbered)
**WikiFormatting:**
```
 1. First item
 2. Second item
    a. Nested item 2a
    b. Nested item 2b
 3. Third item
```

### Definition Lists
**WikiFormatting:**
```
 Term:: Definition
 Another term:: Another definition
```

---

## Code Blocks

### Generic Code Block
**WikiFormatting:**
```
{{{
code block
multiple lines
}}}
```

### Code Block with Syntax Highlighting

#### JavaScript
**WikiFormatting:**
```
{{{#!javascript
function helloWorld() {
    console.log('Hello, World!');
    return true;
}
}}}
```

#### PHP
**WikiFormatting:**
```
{{{#!php
<?php
function hello_world() {
    echo 'Hello, World!';
    return true;
}
?>
}}}
```

#### HTML
**WikiFormatting:**
```
{{{#!html
<!DOCTYPE html>
<html>
<head>
    <title>Example</title>
</head>
<body>
    <h1>Hello, World!</h1>
</body>
</html>
}}}
```

#### CSS
**WikiFormatting:**
```
{{{#!css
.example {
    color: #333;
    font-size: 16px;
    margin: 0 auto;
}
}}}
```

#### Markdown
**WikiFormatting:**
```
{{{#!markdown
# Heading

This is **bold** and this is *italic*.

- List item 1
- List item 2
}}}
```

---

## Tables

**WikiFormatting:**
```
|| '''Header 1''' || '''Header 2''' || '''Header 3''' ||
|| Cell 1.1 || Cell 1.2 || Cell 1.3 ||
|| Cell 2.1 || Cell 2.2 || Cell 2.3 ||
```

**Output:**
| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Cell 1.1 | Cell 1.2 | Cell 1.3 |
| Cell 2.1 | Cell 2.2 | Cell 2.3 |

**Markdown Equivalent:**
```markdown
| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Cell 1.1 | Cell 1.2 | Cell 1.3 |
| Cell 2.1 | Cell 2.2 | Cell 2.3 |
```

---

## Blockquotes

**WikiFormatting:**
```
  Indented text is shown as a blockquote.
  Multiple lines can be indented.
```

**Markdown Equivalent:**
```markdown
> Indented text is shown as a blockquote.
> Multiple lines can be indented.
```

---

## Line Breaks & Paragraphs

### Hard Line Break
**WikiFormatting:**
```
Line 1[[BR]]Line 2
```

### Paragraph Break
**WikiFormatting:**
```
Paragraph 1

Paragraph 2
```
(Blank line between paragraphs)

---

## Horizontal Rule

**WikiFormatting:**
```
----
```

**Markdown Equivalent:**
```markdown
---
```

---

## Images

**WikiFormatting:**
```
[[Image(image.png)]]
[[Image(image.png, alt="Alt text")]]
[[Image(image.png, width=500)]]
[[Image(https://example.com/image.png)]]
```

---

## Macros & Special Formatting

### Table of Contents
**WikiFormatting:**
```
[[TOC]]
[[TOC(inline)]]
[[TOC(heading=Custom Heading)]]
```

### Timestamp
**WikiFormatting:**
```
[[Timestamp]]
[[Timestamp(format=iso8601)]]
```

### Include Another Wiki Page
**WikiFormatting:**
```
[[Include(OtherPage)]]
```

### No Wiki (Escape WikiFormatting)
**WikiFormatting:**
```
{{{
This '''text''' will not be formatted
}}}

`This '''inline''' text will not be formatted`
```

---

## Conversion Reference: Markdown → WikiFormatting

| Element | Markdown | WikiFormatting |
|---------|----------|----------------|
| Bold | `**text**` or `__text__` | `'''text'''` |
| Italic | `*text*` or `_text_` | `''text''` |
| Code (inline) | `` `code` `` | `` `code` `` |
| Code Block | ` ```code``` ` | `{{{code}}}` |
| Code Block (language) | ` ```js code``` ` | `{{{#!javascript code}}}` |
| Heading 1 | `# Text` | `= Text =` |
| Heading 2 | `## Text` | `== Text ==` |
| Link | `[Text](url)` | `[url Text]` |
| List (unordered) | `- item` | ` * item` |
| List (ordered) | `1. item` | ` 1. item` |
| Horizontal Rule | `---` | `----` |
| Blockquote | `> text` | `  text` (indent) |
| Table | Pipe syntax | `\|\| cell \|\|` |

---

## Example: Full Issue/Comment

### WikiFormatting Example
```
= Bug Report: wp_enqueue_script not loading =

'''Description:'''
The `wp_enqueue_script()` function is not loading the script in the footer as expected.

'''Steps to Reproduce:'''
 1. Add the following code to functions.php
 2. Load the page
 3. Check the footer

'''Code Sample:'''
{{{#!php
<?php
function my_enqueue_scripts() {
    wp_enqueue_script( 
        'my-script', 
        get_template_directory_uri() . '/js/script.js', 
        array(), 
        '1.0', 
        true 
    );
}
add_action( 'wp_enqueue_scripts', 'my_enqueue_scripts' );
?>
}}}

'''Expected Behavior:'''
Script should load in the footer.

'''Actual Behavior:'''
Script loads in the header instead.

'''Related:'''
 * See ticket #12345 for similar issue
 * Related changeset: [56789]
 * Documentation: [wiki:JavaScript_Best_Practices]

'''Environment:'''
 * WordPress version: 6.4
 * PHP version: 8.1
 * Theme: Twenty Twenty-Four
```

---

## Tips for Conversion

1. **Bold/Italic:** Markdown uses `*` and `**`, WikiFormatting uses `''` and `'''`
2. **Headings:** Markdown uses `#` prefix, WikiFormatting wraps in `=` signs
3. **Code Blocks:** Markdown uses ` ``` `, WikiFormatting uses `{{{}}}`
4. **Links:** Markdown is `[text](url)`, WikiFormatting is `[url text]` (reversed)
5. **Lists:** Must be indented with a space in WikiFormatting
6. **Tables:** WikiFormatting uses `||` instead of `|`
7. **Line Breaks:** Use `[[BR]]` in WikiFormatting instead of double space
8. **Trac-specific:** Take advantage of ticket/changeset shortcuts like `#12345` and `[56789]`

---

## WordPress Trac Specific

### Priority Levels
```
'''Priority:''' high
'''Severity:''' blocker
```

### Component References
```
'''Component:''' Build/Test Tools
'''Component:''' Editor
'''Component:''' REST API
```

### Keywords
```
'''Keywords:''' has-patch needs-testing needs-docs
```

### Milestones
```
'''Milestone:''' 6.5
'''Version:''' 6.4
```

---

## Resources

- Official Trac WikiFormatting: https://core.trac.wordpress.org/wiki/WikiFormatting
- WordPress Trac: https://core.trac.wordpress.org
- Trac Preferences: https://core.trac.wordpress.org/prefs
