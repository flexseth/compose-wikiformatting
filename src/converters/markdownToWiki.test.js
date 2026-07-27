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
