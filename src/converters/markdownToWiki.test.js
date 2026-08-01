import { convertMarkdownToWiki } from './markdownToWiki';

describe('convertMarkdownToWiki - Integration Tests', () => {
  test('converts headers through main function', () => {
    const input = '# Title\nContent\n## Subtitle';
    const result = convertMarkdownToWiki(input);
    expect(result).toContain('= Title =');
    expect(result).toContain('== Subtitle ==');
    expect(result).toContain('Content');
  });

  test('handles document with mixed content', () => {
    const input = `# Main Title

This is a paragraph with some text.

## Section 1

More content here.

### Subsection

Even more content.`;

    const result = convertMarkdownToWiki(input);
    expect(result).toContain('= Main Title =');
    expect(result).toContain('== Section 1 ==');
    expect(result).toContain('=== Subsection ===');
    expect(result).toContain('This is a paragraph');
  });

  test('preserves empty lines', () => {
    const input = '# Header\n\n\nContent';
    const result = convertMarkdownToWiki(input);
    expect(result).toBe('= Header =\n\n\nContent');
  });

  test('handles empty string', () => {
    expect(convertMarkdownToWiki('')).toBe('');
  });

  test('handles string with no Markdown', () => {
    const input = 'Just plain text\nNo markdown here';
    expect(convertMarkdownToWiki(input)).toBe(input);
  });
});

describe('convertMarkdownToWiki - Options', () => {
  test('accepts empty options object', () => {
    const input = '# Test';
    const result = convertMarkdownToWiki(input, {});
    expect(result).toBe('= Test =');
  });

  test('accepts preserveNewlines option', () => {
    const input = '# Test\n\n## Two';
    const result = convertMarkdownToWiki(input, { preserveNewlines: true });
    expect(result).toBe('= Test =\n\n== Two ==');
  });

  test('works without options parameter', () => {
    const input = '# Test';
    const result = convertMarkdownToWiki(input);
    expect(result).toBe('= Test =');
  });
});

describe('convertMarkdownToWiki - Security', () => {
  test('escapes XSS in headers', () => {
    const input = '# <script>alert("xss")</script>';
    const result = convertMarkdownToWiki(input);
    expect(result).not.toContain('<script>');
    expect(result).toContain('&lt;script&gt;');
  });

  test('escapes HTML in content headers', () => {
    const input = '## <img src=x onerror=alert(1)>';
    const result = convertMarkdownToWiki(input);
    expect(result).not.toContain('<img');
    expect(result).toContain('&lt;img');
  });

  test('handles multiple security issues in one document', () => {
    const input = `# <script>Bad</script>
## <iframe src=evil>
### Normal header`;

    const result = convertMarkdownToWiki(input);
    expect(result).not.toContain('<script>');
    expect(result).not.toContain('<iframe');
    expect(result).toContain('&lt;script&gt;');
    expect(result).toContain('&lt;iframe');
    expect(result).toContain('=== Normal header ===');
  });
});

describe('convertMarkdownToWiki - Type Safety', () => {
  test('throws TypeError for number', () => {
    expect(() => convertMarkdownToWiki(123)).toThrow(TypeError);
  });

  test('throws TypeError for null', () => {
    expect(() => convertMarkdownToWiki(null)).toThrow(TypeError);
  });

  test('throws TypeError for undefined', () => {
    expect(() => convertMarkdownToWiki(undefined)).toThrow(TypeError);
  });

  test('throws TypeError for object', () => {
    expect(() => convertMarkdownToWiki({})).toThrow(TypeError);
  });

  test('throws TypeError for array', () => {
    expect(() => convertMarkdownToWiki([])).toThrow(TypeError);
  });
});

describe('convertMarkdownToWiki - Real-world Examples', () => {
  test('converts typical documentation structure', () => {
    const input = `# API Documentation

The main API endpoint.

## Authentication

Use Bearer tokens.

### Getting a Token

Follow these steps.`;

    const result = convertMarkdownToWiki(input);
    expect(result).toContain('= API Documentation =');
    expect(result).toContain('== Authentication ==');
    expect(result).toContain('=== Getting a Token ===');
  });

  test('handles bug report format', () => {
    const input = `# Bug: Login fails

Description of the bug.

## Steps to Reproduce

1. Go to login page
2. Enter credentials

## Expected Behavior

Should log in.`;

    const result = convertMarkdownToWiki(input);
    expect(result).toContain('= Bug: Login fails =');
    expect(result).toContain('== Steps to Reproduce ==');
    expect(result).toContain('== Expected Behavior ==');
  });
});

describe('convertMarkdownToWiki - Text Formatting (Phase 3)', () => {
  test('converts bold in headers', () => {
    const input = '# Heading with **bold**';
    const result = convertMarkdownToWiki(input);
    expect(result).toBe("= Heading with '''bold''' =");
  });

  test('converts italic in headers', () => {
    const input = '# Heading with *italic*';
    const result = convertMarkdownToWiki(input);
    expect(result).toBe("= Heading with ''italic'' =");
  });

  test('converts emphasis with underscores in headers', () => {
    const input = '# Heading with __emphasis__';
    const result = convertMarkdownToWiki(input);
    expect(result).toBe("= Heading with '''emphasis''' =");
  });

  test('converts bold in paragraph text', () => {
    const input = 'This is **bold** text';
    const result = convertMarkdownToWiki(input);
    expect(result).toBe("This is '''bold''' text");
  });

  test('converts italic in paragraph text', () => {
    const input = 'This is *italic* text';
    const result = convertMarkdownToWiki(input);
    expect(result).toBe("This is ''italic'' text");
  });

  test('converts both bold and italic', () => {
    const input = '**bold** and *italic*';
    const result = convertMarkdownToWiki(input);
    expect(result).toBe("'''bold''' and ''italic''");
  });

  test('converts bold+italic combination', () => {
    const input = 'This is ***important***';
    const result = convertMarkdownToWiki(input);
    expect(result).toBe("This is '''''important'''''");
  });

  test('converts headers with text formatting', () => {
    const input = `# **Bold** Heading

This is **bold** and *italic* text.

## *Italic* Subheading`;

    const result = convertMarkdownToWiki(input);
    expect(result).toContain("= '''Bold''' Heading =");
    expect(result).toContain("This is '''bold''' and ''italic'' text.");
    expect(result).toContain("== ''Italic'' Subheading ==");
  });

  test('converts complex document with headers and formatting', () => {
    const input = `# API **Documentation**

The ***new API*** endpoint returns **JSON** data.

## Usage

Use the \`api.call()\` method with *caution*.`;

    const result = convertMarkdownToWiki(input);
    expect(result).toContain("= API '''Documentation''' =");
    expect(result).toContain("The '''''new API''''' endpoint returns '''JSON''' data.");
    expect(result).toContain("== Usage ==");
    expect(result).toContain("Use the `api.call()` method with ''caution''.");
  });
});

describe('convertMarkdownToWiki - Code Block Content Protection (Phase 5a)', () => {
  test('headers inside code blocks are NOT converted', () => {
    const input = `# Outside Header

\`\`\`
# This should stay as #
## This too should stay as ##
\`\`\``;

    const result = convertMarkdownToWiki(input);

    // Outside header IS converted
    expect(result).toContain('= Outside Header =');

    // Headers inside code block are NOT converted
    expect(result).toContain('# This should stay as #');
    expect(result).toContain('## This too should stay as ##');
    expect(result).not.toContain('= This should stay as =');
    expect(result).not.toContain('== This too should stay as ==');
  });

  test('bold/italic inside code blocks are NOT converted', () => {
    const input = `**Outside bold**

\`\`\`javascript
const str = "**Bold** should NOT become '''Bold'''";
const italic = "*Italic* should NOT become ''Italic''";
\`\`\``;

    const result = convertMarkdownToWiki(input);

    // Outside bold IS converted
    expect(result).toContain("'''Outside bold'''");

    // Bold/italic inside code block are NOT converted
    expect(result).toContain('**Bold** should NOT become');
    expect(result).toContain('*Italic* should NOT become');
    expect(result).not.toContain("'''Bold''' should NOT become");
    expect(result).not.toContain("''Italic'' should NOT become");
  });

  test('links inside code blocks are NOT converted', () => {
    const input = `[Outside link](https://example.com)

\`\`\`
[Link text](https://example.com) should NOT become [https://example.com Link text]
\`\`\``;

    const result = convertMarkdownToWiki(input);

    // Outside link IS converted
    expect(result).toContain('[https://example.com Outside link]');

    // Link inside code block is NOT converted
    expect(result).toContain('[Link text](https://example.com) should NOT become');
    expect(result).not.toContain('[https://example.com Link text] should NOT become');
  });

  test('underscores in code are NOT converted to italic', () => {
    const input = `\`\`\`php
<?php
function register_book_post_type() {
    $args = array(
        'singular_name' => __( 'Book', 'textdomain' ),
    );
}
?>
\`\`\``;

    const result = convertMarkdownToWiki(input);

    // Underscores should remain as underscores, not converted to italic markers
    expect(result).toContain('register_book_post_type');
    expect(result).toContain('singular_name');
    expect(result).not.toContain("register''book''post''type");
    expect(result).not.toContain("singular''name");
  });

  test('asterisks in code are NOT converted to italic', () => {
    const input = `\`\`\`javascript
const regex = /test/*-/*\`/*\\;
const comment = /* This is a comment */
\`\`\``;

    const result = convertMarkdownToWiki(input);

    // Asterisks should remain as asterisks
    expect(result).toContain('/*-/*');
    expect(result).toContain('/* This is a comment */');
    expect(result).not.toContain("/''-/''");
  });

  test('full content protection test (UI bug example)', () => {
    const input = `\`\`\`
# This heading should stay as #
## This too should stay as ##

**Bold** should NOT become '''Bold'''
*Italic* should NOT become ''Italic''

[Link text](https://example.com) should NOT become [https://example.com Link text]

[[WikiPage]] should stay as [[WikiPage]]
\`\`\``;

    const result = convertMarkdownToWiki(input);

    // All Markdown syntax should be preserved literally
    expect(result).toContain('# This heading should stay as #');
    expect(result).toContain('## This too should stay as ##');
    expect(result).toContain('**Bold** should NOT become');
    expect(result).toContain('*Italic* should NOT become');
    expect(result).toContain('[Link text](https://example.com) should NOT become');
    expect(result).toContain('[[WikiPage]] should stay as [[WikiPage]]');

    // None should be converted
    expect(result).not.toContain('= This heading should stay as =');
    expect(result).not.toContain("'''Bold''' should NOT become '''Bold'''");
    expect(result).not.toContain("''Italic'' should NOT become ''Italic''");
    expect(result).not.toContain('[https://example.com Link text] should NOT become');
  });

  test('mixed content: headers + code blocks + formatting', () => {
    const input = `# Real Header

Some **bold** text outside.

\`\`\`javascript
# Fake header
**fake bold**
function test_with_underscores() {}
\`\`\`

## Another Real Header

More *italic* text outside.`;

    const result = convertMarkdownToWiki(input);

    // Outside headers and formatting ARE converted
    expect(result).toContain('= Real Header =');
    expect(result).toContain('== Another Real Header ==');
    expect(result).toContain("Some '''bold''' text outside");
    expect(result).toContain("More ''italic'' text outside");

    // Inside code block content is NOT converted
    expect(result).toContain('# Fake header');
    expect(result).toContain('**fake bold**');
    expect(result).toContain('test_with_underscores');
    expect(result).not.toContain('= Fake header =');
    expect(result).not.toContain("'''fake bold'''");
    expect(result).not.toContain("test''with''underscores");
  });

  test('nested code blocks preserve inner backticks', () => {
    const input = `\`\`\`\`markdown
To create a code block:

\`\`\`javascript
console.log("hello");
\`\`\`
\`\`\`\``;

    const result = convertMarkdownToWiki(input);

    // Inner backticks should be preserved as literal text
    expect(result).toContain('```javascript');
    expect(result).toContain('console.log("hello");');
    expect(result).toContain('```');
  });

  test('code blocks with language specifiers', () => {
    const input = `\`\`\`php
<?php
function __construct() {
    $this->_private = true;
}
?>
\`\`\``;

    const result = convertMarkdownToWiki(input);

    // Should have WikiFormatting language processor
    expect(result).toContain('{{{#!php');

    // Underscores should NOT be converted to italic
    expect(result).toContain('__construct');
    expect(result).toContain('_private');
    expect(result).not.toContain("_''construct");
    expect(result).not.toContain("''private");
  });
});
