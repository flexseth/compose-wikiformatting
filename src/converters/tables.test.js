/**
 * Tests for Tables Converter (Markdown → WikiFormatting)
 *
 * @jest-environment jsdom
 */

import { convertTables } from './tables.js';

describe('convertTables', () => {
  // ============================================================================
  // Type Validation
  // ============================================================================
  describe('Type Validation', () => {
    test('throws TypeError for non-string input', () => {
      expect(() => convertTables(null)).toThrow(TypeError);
      expect(() => convertTables(undefined)).toThrow(TypeError);
      expect(() => convertTables(123)).toThrow(TypeError);
      expect(() => convertTables([])).toThrow(TypeError);
      expect(() => convertTables({})).toThrow(TypeError);
    });

    test('accepts empty string', () => {
      expect(convertTables('')).toBe('');
    });
  });

  // ============================================================================
  // Basic Table Conversion
  // ============================================================================
  describe('Basic Table Conversion', () => {
    test('converts simple 2x2 table', () => {
      const input = `| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |`;
      const expected = `|| '''Header 1''' || '''Header 2''' ||
|| Cell 1 || Cell 2 ||`;
      expect(convertTables(input)).toBe(expected);
    });

    test('converts 3x3 table', () => {
      const input = `| A | B | C |
|---|---|---|
| 1 | 2 | 3 |
| 4 | 5 | 6 |`;
      const expected = `|| '''A''' || '''B''' || '''C''' ||
|| 1 || 2 || 3 ||
|| 4 || 5 || 6 ||`;
      expect(convertTables(input)).toBe(expected);
    });

    test('converts table with single column', () => {
      const input = `| Header |
|--------|
| Cell 1 |
| Cell 2 |`;
      const expected = `|| '''Header''' ||
|| Cell 1 ||
|| Cell 2 ||`;
      expect(convertTables(input)).toBe(expected);
    });

    test('converts table with single row (header only)', () => {
      const input = `| Header 1 | Header 2 |
|----------|----------|`;
      const expected = `|| '''Header 1''' || '''Header 2''' ||`;
      expect(convertTables(input)).toBe(expected);
    });
  });

  // ============================================================================
  // Separator Row Handling
  // ============================================================================
  describe('Separator Row Handling', () => {
    test('removes separator row', () => {
      const input = `| Header |
|--------|
| Cell |`;
      const expected = `|| '''Header''' ||
|| Cell ||`;
      expect(convertTables(input)).toBe(expected);
    });

    test('handles left-aligned separator (:---)', () => {
      const input = `| Left |
|:-----|
| L |`;
      const expected = `|| '''Left''' ||
||L    ||`;
      expect(convertTables(input)).toBe(expected);
    });

    test('handles center-aligned separator (:---:)', () => {
      const input = `| Center |
|:------:|
| C |`;
      const expected = `|| '''Center''' ||
||  C  ||`;
      expect(convertTables(input)).toBe(expected);
    });

    test('handles right-aligned separator (---:)', () => {
      const input = `| Right |
|------:|
| R |`;
      const expected = `|| '''Right''' ||
||    R||`;
      expect(convertTables(input)).toBe(expected);
    });

    test('handles mixed alignment', () => {
      const input = `| Left | Center | Right |
|:-----|:------:|------:|
| L | C | R |`;
      const expected = `|| '''Left''' || '''Center''' || '''Right''' ||
||L    ||  C  ||    R||`;
      expect(convertTables(input)).toBe(expected);
    });
  });

  // ============================================================================
  // Cell Content
  // ============================================================================
  describe('Cell Content', () => {
    test('handles empty cells', () => {
      const input = `| A | B |
|---|---|
|   | 2 |`;
      const expected = `|| '''A''' || '''B''' ||
||  || 2 ||`;
      expect(convertTables(input)).toBe(expected);
    });

    test('preserves spaces in cell content', () => {
      const input = `| Header |
|--------|
| Multiple  spaces |`;
      const expected = `|| '''Header''' ||
|| Multiple  spaces ||`;
      expect(convertTables(input)).toBe(expected);
    });

    test('handles cells with numbers', () => {
      const input = `| ID | Count |
|----|-------|
| 1  | 100   |
| 2  | 200   |`;
      const expected = `|| '''ID''' || '''Count''' ||
|| 1 || 100 ||
|| 2 || 200 ||`;
      expect(convertTables(input)).toBe(expected);
    });

    test('handles cells with special characters', () => {
      const input = `| Symbol | Name |
|--------|------|
| @      | At   |
| #      | Hash |`;
      const expected = `|| '''Symbol''' || '''Name''' ||
|| @ || At ||
|| # || Hash ||`;
      expect(convertTables(input)).toBe(expected);
    });

    test('handles cells with Unicode characters', () => {
      const input = `| Language | Greeting |
|----------|----------|
| 日本語   | こんにちは |
| 한국어   | 안녕하세요 |`;
      const expected = `|| '''Language''' || '''Greeting''' ||
|| 日本語 || こんにちは ||
|| 한국어 || 안녕하세요 ||`;
      expect(convertTables(input)).toBe(expected);
    });

    test('handles cells with emoji', () => {
      const input = `| Icon | Meaning |
|------|---------|
| 🎉   | Party   |
| 🚀   | Rocket  |`;
      const expected = `|| '''Icon''' || '''Meaning''' ||
|| 🎉 || Party ||
|| 🚀 || Rocket ||`;
      expect(convertTables(input)).toBe(expected);
    });
  });

  // ============================================================================
  // Formatting Inside Cells
  // ============================================================================
  describe('Formatting Inside Cells', () => {
    test('preserves bold in cells (will be converted by textFormatting converter)', () => {
      const input = `| Name | Status |
|------|--------|
| **Bold** | Normal |`;
      const expected = `|| '''Name''' || '''Status''' ||
|| **Bold** || Normal ||`;
      expect(convertTables(input)).toBe(expected);
    });

    test('preserves italic in cells', () => {
      const input = `| Type | Example |
|------|---------|
| *Italic* | Text |`;
      const expected = `|| '''Type''' || '''Example''' ||
|| *Italic* || Text ||`;
      expect(convertTables(input)).toBe(expected);
    });

    test('preserves inline code in cells', () => {
      const input = `| Function | Description |
|----------|-------------|
| \`code()\` | A function |`;
      const expected = `|| '''Function''' || '''Description''' ||
|| \`code()\` || A function ||`;
      expect(convertTables(input)).toBe(expected);
    });

    test('preserves links in cells', () => {
      const input = `| Site | URL |
|------|-----|
| [WordPress](https://wordpress.org) | Official |`;
      const expected = `|| '''Site''' || '''URL''' ||
|| [WordPress](https://wordpress.org) || Official ||`;
      expect(convertTables(input)).toBe(expected);
    });
  });

  // ============================================================================
  // Multiple Tables
  // ============================================================================
  describe('Multiple Tables', () => {
    test('handles multiple tables in same document', () => {
      const input = `| Table 1 |
|---------|
| Cell A  |

Some text between tables

| Table 2 |
|---------|
| Cell B  |`;
      const expected = `|| '''Table 1''' ||
|| Cell A ||

Some text between tables

|| '''Table 2''' ||
|| Cell B ||`;
      expect(convertTables(input)).toBe(expected);
    });

    test('handles table followed by other content', () => {
      const input = `| Header |
|--------|
| Cell |

# Heading after table`;
      const expected = `|| '''Header''' ||
|| Cell ||

# Heading after table`;
      expect(convertTables(input)).toBe(expected);
    });

    test('handles content before table', () => {
      const input = `# Heading before table

| Header |
|--------|
| Cell |`;
      const expected = `# Heading before table

|| '''Header''' ||
|| Cell ||`;
      expect(convertTables(input)).toBe(expected);
    });
  });

  // ============================================================================
  // Edge Cases
  // ============================================================================
  describe('Edge Cases', () => {
    test('ignores lines that look like tables but are not complete', () => {
      const input = `| Not a table (no closing pipe)
This is normal text`;
      expect(convertTables(input)).toBe(input);
    });

    test('handles table with extra whitespace', () => {
      const input = `|  Header 1  |  Header 2  |
|------------|------------|
|  Cell 1    |  Cell 2    |`;
      const expected = `|| '''Header 1''' || '''Header 2''' ||
|| Cell 1 || Cell 2 ||`;
      expect(convertTables(input)).toBe(expected);
    });

    test('handles table with no whitespace around pipes', () => {
      const input = `|Header 1|Header 2|
|--------|--------|
|Cell 1|Cell 2|`;
      const expected = `|| '''Header 1''' || '''Header 2''' ||
|| Cell 1 || Cell 2 ||`;
      expect(convertTables(input)).toBe(expected);
    });

    test('handles table with varying cell widths', () => {
      const input = `| Short | Very Long Header Text |
|-------|----------------------|
| A | B |`;
      const expected = `|| '''Short''' || '''Very Long Header Text''' ||
|| A || B ||`;
      expect(convertTables(input)).toBe(expected);
    });
  });

  // ============================================================================
  // Security
  // ============================================================================
  describe('Security', () => {
    test('preserves HTML entities (will be handled by renderer)', () => {
      const input = `| Tag | Entity |
|-----|--------|
| < | &lt; |`;
      const expected = `|| '''Tag''' || '''Entity''' ||
|| < || &lt; ||`;
      expect(convertTables(input)).toBe(expected);
    });

    test('preserves script tags (will be escaped by renderer)', () => {
      const input = `| Type | Code |
|------|------|
| Script | <script>alert('xss')</script> |`;
      const expected = `|| '''Type''' || '''Code''' ||
|| Script || <script>alert('xss')</script> ||`;
      expect(convertTables(input)).toBe(expected);
    });

    test('preserves malicious URLs (will be validated by renderer)', () => {
      const input = `| Link | Type |
|------|------|
| [Click](javascript:alert('xss')) | Malicious |`;
      const expected = `|| '''Link''' || '''Type''' ||
|| [Click](javascript:alert('xss')) || Malicious ||`;
      expect(convertTables(input)).toBe(expected);
    });
  });

  // ============================================================================
  // Real-World Examples
  // ============================================================================
  describe('Real-World Examples', () => {
    test('converts WordPress compatibility table', () => {
      const input = `| WordPress | PHP | MySQL |
|-----------|-----|-------|
| 6.4 | 7.4+ | 5.7+ |
| 6.3 | 7.4+ | 5.7+ |`;
      const expected = `|| '''WordPress''' || '''PHP''' || '''MySQL''' ||
|| 6.4 || 7.4+ || 5.7+ ||
|| 6.3 || 7.4+ || 5.7+ ||`;
      expect(convertTables(input)).toBe(expected);
    });

    test('converts bug report table', () => {
      const input = `| Component | Status | Priority |
|-----------|--------|----------|
| Editor | Open | High |
| REST API | Closed | Low |`;
      const expected = `|| '''Component''' || '''Status''' || '''Priority''' ||
|| Editor || Open || High ||
|| REST API || Closed || Low ||`;
      expect(convertTables(input)).toBe(expected);
    });

    test('converts function comparison table', () => {
      const input = `| Function | Parameters | Return |
|----------|------------|--------|
| \`wp_enqueue_script()\` | \`$handle, $src\` | void |
| \`wp_register_script()\` | \`$handle, $src\` | bool |`;
      const expected = `|| '''Function''' || '''Parameters''' || '''Return''' ||
|| \`wp_enqueue_script()\` || \`$handle, $src\` || void ||
|| \`wp_register_script()\` || \`$handle, $src\` || bool ||`;
      expect(convertTables(input)).toBe(expected);
    });
  });
});
