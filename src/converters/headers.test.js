import { convertHeader, convertHeaders } from './headers';

describe('convertHeader - Basic Conversion', () => {
  test('converts level 1 header', () => {
    expect(convertHeader('# Hello')).toBe('= Hello =');
  });

  test('converts level 2 header', () => {
    expect(convertHeader('## World')).toBe('== World ==');
  });

  test('converts level 3 header', () => {
    expect(convertHeader('### Level 3')).toBe('=== Level 3 ===');
  });

  test('converts level 4 header', () => {
    expect(convertHeader('#### Level 4')).toBe('==== Level 4 ====');
  });

  test('converts level 5 header', () => {
    expect(convertHeader('##### Level 5')).toBe('===== Level 5 =====');
  });

  test('converts level 6 header', () => {
    expect(convertHeader('###### Level 6')).toBe('====== Level 6 ======');
  });
});

describe('convertHeader - Trailing Hashes', () => {
  test('handles trailing hashes on level 1', () => {
    expect(convertHeader('# Test #')).toBe('= Test =');
  });

  test('handles multiple trailing hashes', () => {
    expect(convertHeader('## Test ####')).toBe('== Test ==');
  });

  test('handles trailing hashes with no space', () => {
    expect(convertHeader('### Test###')).toBe('=== Test ===');
  });

  test('handles header with only trailing hash', () => {
    expect(convertHeader('# Test #')).toBe('= Test =');
  });
});

describe('convertHeader - Edge Cases', () => {
  test('preserves non-header lines', () => {
    expect(convertHeader('Not a header')).toBe('Not a header');
  });

  test('requires space after #', () => {
    expect(convertHeader('#NoSpace')).toBe('#NoSpace');
  });

  test('does not convert 7+ hashes (invalid)', () => {
    expect(convertHeader('####### Too many')).toBe('####### Too many');
  });

  test('handles empty header', () => {
    expect(convertHeader('#  ')).toBe('=  =');
  });

  test('handles header with extra spaces', () => {
    expect(convertHeader('#  Multiple   Spaces  ')).toBe('= Multiple   Spaces =');
  });

  test('handles empty string', () => {
    expect(convertHeader('')).toBe('');
  });

  test('handles just hash signs', () => {
    expect(convertHeader('###')).toBe('###');
  });
});

describe('convertHeader - Special Characters', () => {
  test('handles headers with ampersands', () => {
    expect(convertHeader('# Tom & Jerry')).toBe('= Tom &amp; Jerry =');
  });

  test('handles headers with less than', () => {
    expect(convertHeader('# A < B')).toBe('= A &lt; B =');
  });

  test('handles headers with greater than', () => {
    expect(convertHeader('# A > B')).toBe('= A &gt; B =');
  });

  test('handles headers with quotes', () => {
    expect(convertHeader('# Say "Hello"')).toBe('= Say &quot;Hello&quot; =');
  });

  test('handles headers with apostrophes', () => {
    expect(convertHeader("# It's working")).toBe("= It's working =");
  });

  test('preserves WikiFormatting italic syntax in headers', () => {
    expect(convertHeader("# heading with ''emphasis''")).toBe("= heading with ''emphasis'' =");
  });

  test('preserves WikiFormatting bold syntax in headers', () => {
    expect(convertHeader("# heading with '''bold'''")).toBe("= heading with '''bold''' =");
  });

  test('handles multiple special characters', () => {
    expect(convertHeader('# <script>alert("XSS")</script>'))
      .toBe('= &lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt; =');
  });
});

describe('convertHeader - Security (XSS Prevention)', () => {
  test('escapes script tags', () => {
    const result = convertHeader('# <script>alert("xss")</script>');
    expect(result).not.toContain('<script>');
    expect(result).toContain('&lt;script&gt;');
  });

  test('escapes img onerror XSS', () => {
    const result = convertHeader('# <img src=x onerror=alert("xss")>');
    expect(result).not.toContain('<img');
    expect(result).toContain('&lt;img');
  });

  test('escapes iframe injection', () => {
    const result = convertHeader('# <iframe src="evil.com"></iframe>');
    expect(result).not.toContain('<iframe');
    expect(result).toContain('&lt;iframe');
  });

  test('escapes SVG XSS', () => {
    const result = convertHeader('# <svg onload=alert("xss")>');
    expect(result).not.toContain('<svg');
    expect(result).toContain('&lt;svg');
  });
});

describe('convertHeader - Unicode Support', () => {
  test('handles Unicode characters', () => {
    expect(convertHeader('# 你好世界')).toBe('= 你好世界 =');
  });

  test('handles emojis', () => {
    expect(convertHeader('# Hello 👋 World')).toBe('= Hello 👋 World =');
  });

  test('handles mixed Unicode and ASCII', () => {
    expect(convertHeader('# Café & Coffee')).toBe('= Café &amp; Coffee =');
  });
});

describe('convertHeader - Type Safety', () => {
  test('throws TypeError for number', () => {
    expect(() => convertHeader(123)).toThrow(TypeError);
  });

  test('throws TypeError for null', () => {
    expect(() => convertHeader(null)).toThrow(TypeError);
  });

  test('throws TypeError for undefined', () => {
    expect(() => convertHeader(undefined)).toThrow(TypeError);
  });

  test('throws TypeError for object', () => {
    expect(() => convertHeader({})).toThrow(TypeError);
  });

  test('throws TypeError for array', () => {
    expect(() => convertHeader([])).toThrow(TypeError);
  });
});

describe('convertHeaders - Multi-line Conversion', () => {
  test('converts multiple headers', () => {
    const input = '# One\ntext\n## Two';
    const expected = '= One =\ntext\n== Two ==';
    expect(convertHeaders(input)).toBe(expected);
  });

  test('preserves non-header lines', () => {
    const input = '# Header\nParagraph\nAnother line\n## Header 2';
    const expected = '= Header =\nParagraph\nAnother line\n== Header 2 ==';
    expect(convertHeaders(input)).toBe(expected);
  });

  test('handles empty lines', () => {
    const input = '# Title\n\n## Subtitle';
    const expected = '= Title =\n\n== Subtitle ==';
    expect(convertHeaders(input)).toBe(expected);
  });

  test('handles document with no headers', () => {
    const input = 'Just text\nNo headers here';
    expect(convertHeaders(input)).toBe(input);
  });

  test('handles document with only headers', () => {
    const input = '# One\n## Two\n### Three';
    const expected = '= One =\n== Two ==\n=== Three ===';
    expect(convertHeaders(input)).toBe(expected);
  });

  test('preserves trailing newlines', () => {
    const input = '# Header\n\n';
    const expected = '= Header =\n\n';
    expect(convertHeaders(input)).toBe(expected);
  });
});

describe('convertHeaders - Type Safety', () => {
  test('throws TypeError for number', () => {
    expect(() => convertHeaders(123)).toThrow(TypeError);
  });

  test('throws TypeError for null', () => {
    expect(() => convertHeaders(null)).toThrow(TypeError);
  });

  test('throws TypeError for undefined', () => {
    expect(() => convertHeaders(undefined)).toThrow(TypeError);
  });
});
