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
