/**
 * Tests for blockquotes converter
 *
 * @jest-environment jsdom
 */

import { convertBlockquotes } from './blockquotes.js';

describe('convertBlockquotes', () => {

  describe('Type Safety', () => {
    test('throws TypeError for non-string input', () => {
      expect(() => convertBlockquotes(123)).toThrow(TypeError);
      expect(() => convertBlockquotes(123)).toThrow('Text must be a string');
    });

    test('throws TypeError for null', () => {
      expect(() => convertBlockquotes(null)).toThrow(TypeError);
    });

    test('throws TypeError for undefined', () => {
      expect(() => convertBlockquotes(undefined)).toThrow(TypeError);
    });

    test('throws TypeError for object', () => {
      expect(() => convertBlockquotes({})).toThrow(TypeError);
    });

    test('returns string for valid input', () => {
      const result = convertBlockquotes('> test');
      expect(typeof result).toBe('string');
    });
  });

  describe('Basic Blockquotes', () => {
    test('preserves single-line blockquote', () => {
      const input = '> This is a quote';
      expect(convertBlockquotes(input)).toBe(input);
    });

    test('preserves multi-line blockquote', () => {
      const input = '> Line 1\n> Line 2\n> Line 3';
      expect(convertBlockquotes(input)).toBe(input);
    });

    test('preserves blockquote with formatting inside', () => {
      const input = '> This has **bold** and *italic* text';
      expect(convertBlockquotes(input)).toBe(input);
    });

    test('preserves blockquote with link inside', () => {
      const input = '> Check out [WordPress](https://wordpress.org)';
      expect(convertBlockquotes(input)).toBe(input);
    });

    test('preserves blockquote with code inside', () => {
      const input = '> This has `inline code` here';
      expect(convertBlockquotes(input)).toBe(input);
    });

    test('preserves empty blockquote line', () => {
      const input = '>';
      expect(convertBlockquotes(input)).toBe(input);
    });

    test('preserves blockquote at start of text', () => {
      const input = '> Quote at start\nNormal text after';
      expect(convertBlockquotes(input)).toBe(input);
    });

    test('preserves blockquote at end of text', () => {
      const input = 'Normal text before\n> Quote at end';
      expect(convertBlockquotes(input)).toBe(input);
    });
  });

  describe('Nested Blockquotes', () => {
    test('preserves double-nested blockquote (>>)', () => {
      const input = '>> Nested quote';
      expect(convertBlockquotes(input)).toBe(input);
    });

    test('preserves triple-nested blockquote (>>>)', () => {
      const input = '>>> Deeply nested quote';
      expect(convertBlockquotes(input)).toBe(input);
    });

    test('preserves four-level nested blockquote', () => {
      const input = '>>>> Very deep quote';
      expect(convertBlockquotes(input)).toBe(input);
    });

    test('preserves mixed nesting levels', () => {
      const input = '>> Level 2\n> Level 1\n>>> Level 3';
      expect(convertBlockquotes(input)).toBe(input);
    });

    test('preserves descending nesting', () => {
      const input = '>>> Level 3\n>> Level 2\n> Level 1';
      expect(convertBlockquotes(input)).toBe(input);
    });

    test('preserves ascending nesting', () => {
      const input = '> Level 1\n>> Level 2\n>>> Level 3';
      expect(convertBlockquotes(input)).toBe(input);
    });

    test('preserves nesting with content between', () => {
      const input = '>> Nested\n> Parent\nNormal text\n>> Another nested';
      expect(convertBlockquotes(input)).toBe(input);
    });
  });

  describe('Multiple Blockquotes', () => {
    test('preserves two consecutive blockquotes', () => {
      const input = '> First quote\n> Still first\n\n> Second quote';
      expect(convertBlockquotes(input)).toBe(input);
    });

    test('preserves blockquotes with text between', () => {
      const input = '> Quote 1\n\nNormal text\n\n> Quote 2';
      expect(convertBlockquotes(input)).toBe(input);
    });

    test('preserves three blockquotes', () => {
      const input = '> Quote 1\n\n> Quote 2\n\n> Quote 3';
      expect(convertBlockquotes(input)).toBe(input);
    });

    test('preserves multiple single-line blockquotes', () => {
      const input = '> A\n> B\n> C';
      expect(convertBlockquotes(input)).toBe(input);
    });

    test('preserves blockquotes mixed with headers', () => {
      const input = '# Header\n\n> Quote\n\n## Another header';
      expect(convertBlockquotes(input)).toBe(input);
    });
  });

  describe('Edge Cases', () => {
    test('handles empty string', () => {
      expect(convertBlockquotes('')).toBe('');
    });

    test('handles whitespace-only string', () => {
      const input = '   ';
      expect(convertBlockquotes(input)).toBe(input);
    });

    test('handles text without blockquotes', () => {
      const input = 'This is normal text\nWith multiple lines\nNo blockquotes here';
      expect(convertBlockquotes(input)).toBe(input);
    });

    test('handles blockquote with leading spaces after marker', () => {
      const input = '>   Extra spaces after marker';
      expect(convertBlockquotes(input)).toBe(input);
    });

    test('handles blockquote with trailing spaces', () => {
      const input = '> Text with trailing spaces   ';
      expect(convertBlockquotes(input)).toBe(input);
    });

    test('handles single > not at line start', () => {
      const input = 'Text with > in the middle';
      expect(convertBlockquotes(input)).toBe(input);
    });
  });

  describe('Content Preservation', () => {
    test('preserves bold formatting inside blockquote', () => {
      const input = '> This has **bold** text';
      expect(convertBlockquotes(input)).toBe(input);
      expect(input).toContain('**bold**');
    });

    test('preserves italic formatting inside blockquote', () => {
      const input = '> This has *italic* text';
      expect(convertBlockquotes(input)).toBe(input);
      expect(input).toContain('*italic*');
    });

    test('preserves links inside blockquote', () => {
      const input = '> Check [link](https://example.com)';
      expect(convertBlockquotes(input)).toBe(input);
      expect(input).toContain('[link](https://example.com)');
    });

    test('preserves inline code inside blockquote', () => {
      const input = '> Use `code` here';
      expect(convertBlockquotes(input)).toBe(input);
      expect(input).toContain('`code`');
    });

    test('preserves multiple formatting types', () => {
      const input = '> **Bold**, *italic*, [link](url), and `code`';
      expect(convertBlockquotes(input)).toBe(input);
    });

    test('preserves headers inside blockquote', () => {
      const input = '> # Header in quote';
      expect(convertBlockquotes(input)).toBe(input);
    });

    test('preserves list markers inside blockquote', () => {
      const input = '> - List item\n> - Another item';
      expect(convertBlockquotes(input)).toBe(input);
    });

    test('preserves code fence markers inside blockquote', () => {
      const input = '> ```javascript\n> code\n> ```';
      expect(convertBlockquotes(input)).toBe(input);
    });
  });

  describe('Special Characters', () => {
    test('preserves blockquote with Unicode characters', () => {
      const input = '> Unicode: café, naïve, 日本語';
      expect(convertBlockquotes(input)).toBe(input);
    });

    test('preserves blockquote with emoji', () => {
      const input = '> This has emoji 🎉 🚀 ✨';
      expect(convertBlockquotes(input)).toBe(input);
    });

    test('preserves blockquote with special symbols', () => {
      const input = '> Symbols: © ™ ® € £ ¥';
      expect(convertBlockquotes(input)).toBe(input);
    });

    test('preserves blockquote with HTML entities', () => {
      const input = '> &lt;html&gt; &amp; &quot;quotes&quot;';
      expect(convertBlockquotes(input)).toBe(input);
    });

    test('preserves blockquote with punctuation', () => {
      const input = '> Question? Exclamation! Ellipsis...';
      expect(convertBlockquotes(input)).toBe(input);
    });

    test('preserves blockquote with newlines', () => {
      const input = '> Line 1\n> Line 2\n>\n> Line 4';
      expect(convertBlockquotes(input)).toBe(input);
    });
  });
});
