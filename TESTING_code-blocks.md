# Code Blocks Testing - Phase 5a

**Purpose:** Manual testing file for code block conversion. Copy/paste this entire file into the editor (Column 1) to see WikiFormatting conversion in Column 2.

**What to verify:**
- Column 2 shows `{{{` and `}}}` delimiters (not ` ``` `)
- Language blocks show `{{{#!language` (lowercase)
- Case-insensitive: `JAVASCRIPT`, `JavaScript`, `javascript` all → `{{{#!javascript`
- Nested blocks preserve inner ` ``` ` as literal text
- Markdown syntax inside code blocks is NOT converted

---

## Basic Code Blocks

### Generic (no language)

```
function example() {
  return true;
}
```

Expected: `{{{\nfunction example()...\n}}}`

### JavaScript (lowercase)

```javascript
const greeting = "Hello World";
console.log(greeting);
```

Expected: `{{{#!javascript`

### JavaScript (UPPERCASE)

```JAVASCRIPT
const uppercase = "test";
```

Expected: `{{{#!javascript` (normalized to lowercase)

### JavaScript (MixedCase)

```JavaScript
const mixed = "case";
```

Expected: `{{{#!javascript` (normalized to lowercase)

---

## Language Shorthands

### js → javascript

```js
const arr = [1, 2, 3];
```

### ts → javascript

```typescript
interface User {
  name: string;
}
```

### sh → bash

```sh
echo "Hello"
```

### md → markdown

```markdown
# Heading
```

---

## WordPress Languages

### PHP

```php
<?php
function wp_example() {
    return get_option('example');
}
?>
```

### HTML

```html
<div class="container">
  <h1>Title</h1>
</div>
```

### CSS

```css
.button {
  background: #0073aa;
  padding: 10px 20px;
}
```

---

## Content Protection Test

**CRITICAL:** This code block contains Markdown syntax that should NOT be converted:

```
# This heading should stay as #
## This too should stay as ##

**Bold** should NOT become '''Bold'''
*Italic* should NOT become ''Italic''

[Link text](https://example.com) should NOT become [https://example.com Link text]

[[WikiPage]] should stay as [[WikiPage]]
```

**Expected in Column 2:** All Markdown preserved literally inside `{{{` / `}}}`

---

## Nested Code Blocks

### Documentation: Showing how to write code blocks

````markdown
To create a JavaScript code block in Markdown:

```javascript
console.log("hello");
```

That's it!
````

**Expected:** Inner ` ```javascript ` preserved as literal text

### Deep Nesting (5 backticks)

`````
Outer fence (5 backticks) contains:

````
Middle fence (4 backticks) contains:

```
Inner content
```
````
`````

---

## Multiple Blocks

First block:
```js
const first = 1;
```

Some text between blocks.

Second block:
```php
<?php echo "second"; ?>
```

More text.

Third block:
```
generic
```

---

## Edge Cases

### Empty Block

```
```

**Expected:** `{{{\n}}}`

### Single Line

```js
const x = 42;
```

### Special Characters

```javascript
const str = "Special: <>&\"'";
const regex = /test/g;
```

### WikiFormatting Delimiters Inside Code

```
Showing WikiFormatting syntax:

{{{
  code block
}}}

{{{#!python
  code with language
}}}
```

**Expected:** The `{{{` and `}}}` inside preserved literally

---

## Real-World WordPress Example

```php
<?php
/**
 * Register custom post type for Books
 *
 * @since 1.0.0
 */
function register_book_post_type() {
    $labels = array(
        'name'               => __( 'Books', 'textdomain' ),
        'singular_name'      => __( 'Book', 'textdomain' ),
        'add_new'            => __( 'Add New Book', 'textdomain' ),
        'edit_item'          => __( 'Edit Book', 'textdomain' ),
    );

    $args = array(
        'labels'             => $labels,
        'public'             => true,
        'has_archive'        => true,
        'menu_icon'          => 'dashicons-book',
        'supports'           => array( 'title', 'editor', 'thumbnail' ),
    );

    register_post_type( 'book', $args );
}
add_action( 'init', 'register_book_post_type' );
?>
```

---

## Verification Checklist

**In Column 2 (WikiFormatting), verify:**

- [ ] All code blocks wrapped in `{{{` and `}}}`
- [ ] Language blocks show `{{{#!` prefix
- [ ] Languages normalized to lowercase (`JAVASCRIPT` → `javascript`)
- [ ] Shorthands converted: `js`→`javascript`, `ts`→`javascript`, `sh`→`bash`, `md`→`markdown`
- [ ] Nested blocks: inner ` ``` ` NOT converted, preserved as literal text
- [ ] Content protection: `#`, `**`, `*`, `[text](url)` inside code stay literal
- [ ] Empty blocks: `{{{\n}}}`
- [ ] Multiple blocks: each converted independently
- [ ] Special chars preserved: `<>&"'`

**Column 3:** Will show raw WikiFormatting text (rendering not implemented in Phase 5a)
