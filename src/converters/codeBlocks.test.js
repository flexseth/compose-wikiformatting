/**
 * @jest-environment jsdom
 */

import { convertCodeBlocks } from './codeBlocks';

describe('convertCodeBlocks', () => {
  describe('Type Safety', () => {
    test('throws TypeError for non-string input', () => {
      expect(() => convertCodeBlocks(null)).toThrow(TypeError);
      expect(() => convertCodeBlocks(undefined)).toThrow(TypeError);
      expect(() => convertCodeBlocks(123)).toThrow(TypeError);
      expect(() => convertCodeBlocks({})).toThrow(TypeError);
      expect(() => convertCodeBlocks([])).toThrow(TypeError);
    });

    test('returns string for valid input', () => {
      expect(typeof convertCodeBlocks('')).toBe('string');
      expect(typeof convertCodeBlocks('text')).toBe('string');
    });
  });

  describe('Inline Code (No Conversion - Same Syntax)', () => {
    test('preserves inline code', () => {
      expect(convertCodeBlocks('Use `console.log()` for debugging'))
        .toBe('Use `console.log()` for debugging');
    });

    test('preserves multiple inline code blocks', () => {
      expect(convertCodeBlocks('Use `npm install` then `npm start`'))
        .toBe('Use `npm install` then `npm start`');
    });

    test('preserves inline code with special characters', () => {
      expect(convertCodeBlocks('Run `git commit -m "message"`'))
        .toBe('Run `git commit -m "message"`');
    });
  });

  describe('Fenced Code Blocks - Generic (No Language)', () => {
    test('converts generic code block (no language)', () => {
      const input = '```\ncode line 1\ncode line 2\n```';
      const expected = '{{{\ncode line 1\ncode line 2\n}}}';
      expect(convertCodeBlocks(input)).toBe(expected);
    });

    test('converts empty code block', () => {
      const input = '```\n```';
      const expected = '{{{\n}}}';
      expect(convertCodeBlocks(input)).toBe(expected);
    });

    test('converts code block with single line', () => {
      const input = '```\nconst x = 42;\n```';
      const expected = '{{{\nconst x = 42;\n}}}';
      expect(convertCodeBlocks(input)).toBe(expected);
    });
  });

  describe('Fenced Code Blocks - With Language', () => {
    test('converts JavaScript code block', () => {
      const input = '```javascript\nfunction test() {\n  return true;\n}\n```';
      const expected = '{{{#!javascript\nfunction test() {\n  return true;\n}\n}}}';
      expect(convertCodeBlocks(input)).toBe(expected);
    });

    test('converts js shorthand to javascript', () => {
      const input = '```js\nconsole.log("test");\n```';
      const expected = '{{{#!javascript\nconsole.log("test");\n}}}';
      expect(convertCodeBlocks(input)).toBe(expected);
    });

    test('converts PHP code block', () => {
      const input = '```php\n<?php echo "Hello"; ?>\n```';
      const expected = '{{{#!php\n<?php echo "Hello"; ?>\n}}}';
      expect(convertCodeBlocks(input)).toBe(expected);
    });

    test('converts HTML code block', () => {
      const input = '```html\n<div>Content</div>\n```';
      const expected = '{{{#!html\n<div>Content</div>\n}}}';
      expect(convertCodeBlocks(input)).toBe(expected);
    });

    test('converts CSS code block', () => {
      const input = '```css\n.class { color: red; }\n```';
      const expected = '{{{#!css\n.class { color: red; }\n}}}';
      expect(convertCodeBlocks(input)).toBe(expected);
    });

    test('converts Markdown code block', () => {
      const input = '```markdown\n# Heading\n```';
      const expected = '{{{#!markdown\n# Heading\n}}}';
      expect(convertCodeBlocks(input)).toBe(expected);
    });

    test('converts md shorthand to markdown', () => {
      const input = '```md\n# Heading\n```';
      const expected = '{{{#!markdown\n# Heading\n}}}';
      expect(convertCodeBlocks(input)).toBe(expected);
    });
  });

  describe('Multiple Code Blocks', () => {
    test('converts multiple code blocks in same text', () => {
      const input = 'First:\n```js\ncode1\n```\n\nSecond:\n```php\ncode2\n```';
      const expected = 'First:\n{{{#!javascript\ncode1\n}}}\n\nSecond:\n{{{#!php\ncode2\n}}}';
      expect(convertCodeBlocks(input)).toBe(expected);
    });

    test('converts mixed language and generic blocks', () => {
      const input = '```javascript\njs code\n```\n\n```\ngeneric\n```';
      const expected = '{{{#!javascript\njs code\n}}}\n\n{{{\ngeneric\n}}}';
      expect(convertCodeBlocks(input)).toBe(expected);
    });
  });

  describe('Code Blocks with Surrounding Text', () => {
    test('preserves text before code block', () => {
      const input = 'Here is an example:\n```js\ncode\n```';
      const expected = 'Here is an example:\n{{{#!javascript\ncode\n}}}';
      expect(convertCodeBlocks(input)).toBe(expected);
    });

    test('preserves text after code block', () => {
      const input = '```js\ncode\n```\nThat was the example.';
      const expected = '{{{#!javascript\ncode\n}}}\nThat was the example.';
      expect(convertCodeBlocks(input)).toBe(expected);
    });

    test('preserves text before and after', () => {
      const input = 'Before\n```js\ncode\n```\nAfter';
      const expected = 'Before\n{{{#!javascript\ncode\n}}}\nAfter';
      expect(convertCodeBlocks(input)).toBe(expected);
    });
  });

  describe('Edge Cases', () => {
    test('handles empty string', () => {
      expect(convertCodeBlocks('')).toBe('');
    });

    test('handles text with no code blocks', () => {
      const input = 'Just plain text\nwith multiple lines';
      expect(convertCodeBlocks(input)).toBe(input);
    });

    test('handles code block at start of text', () => {
      const input = '```js\ncode\n```\nFollowing text';
      const expected = '{{{#!javascript\ncode\n}}}\nFollowing text';
      expect(convertCodeBlocks(input)).toBe(expected);
    });

    test('handles code block at end of text', () => {
      const input = 'Preceding text\n```js\ncode\n```';
      const expected = 'Preceding text\n{{{#!javascript\ncode\n}}}';
      expect(convertCodeBlocks(input)).toBe(expected);
    });

    test('handles backticks that are not code fences', () => {
      const input = 'Single ` backtick';
      expect(convertCodeBlocks(input)).toBe(input);
    });

    test('handles code block with special characters', () => {
      const input = '```js\nconst str = "Hello <>&";\n```';
      const expected = '{{{#!javascript\nconst str = "Hello <>&";\n}}}';
      expect(convertCodeBlocks(input)).toBe(expected);
    });
  });

  describe('Language Normalization', () => {
    test('converts jsx to javascript', () => {
      const input = '```jsx\nconst el = <div/>;\n```';
      const expected = '{{{#!javascript\nconst el = <div/>;\n}}}';
      expect(convertCodeBlocks(input)).toBe(expected);
    });

    test('converts typescript to javascript', () => {
      const input = '```typescript\nconst x: number = 42;\n```';
      const expected = '{{{#!javascript\nconst x: number = 42;\n}}}';
      expect(convertCodeBlocks(input)).toBe(expected);
    });

    test('converts ts to javascript', () => {
      const input = '```ts\ninterface Test {}\n```';
      const expected = '{{{#!javascript\ninterface Test {}\n}}}';
      expect(convertCodeBlocks(input)).toBe(expected);
    });

    test('converts shell to bash', () => {
      const input = '```shell\necho "test"\n```';
      const expected = '{{{#!bash\necho "test"\n}}}';
      expect(convertCodeBlocks(input)).toBe(expected);
    });

    test('converts sh to bash', () => {
      const input = '```sh\nls -la\n```';
      const expected = '{{{#!bash\nls -la\n}}}';
      expect(convertCodeBlocks(input)).toBe(expected);
    });

    test('preserves unknown languages as-is', () => {
      const input = '```python\nprint("test")\n```';
      const expected = '{{{#!python\nprint("test")\n}}}';
      expect(convertCodeBlocks(input)).toBe(expected);
    });
  });

  describe('Integration with Other Formatting', () => {
    test('preserves existing WikiFormatting code blocks', () => {
      const input = '{{{\nexisting\n}}}';
      expect(convertCodeBlocks(input)).toBe(input);
    });
  });

  describe('Nested Code Blocks (Variable Backtick Counts)', () => {
    test('converts outer fence with 4 backticks containing inner 3-backtick fence', () => {
      const input = '````\n```\ninner code\n```\n````';
      const expected = '{{{\n```\ninner code\n```\n}}}';
      expect(convertCodeBlocks(input)).toBe(expected);
    });

    test('converts outer fence with 4 backticks and language', () => {
      const input = '````markdown\n```js\nconsole.log("hello");\n```\n````';
      const expected = '{{{#!markdown\n```js\nconsole.log("hello");\n```\n}}}';
      expect(convertCodeBlocks(input)).toBe(expected);
    });

    test('converts outer fence with 5 backticks containing 4 and 3 backtick fences', () => {
      const input = '`````\n````\n```\ndeep\n```\n````\n`````';
      const expected = '{{{\n````\n```\ndeep\n```\n````\n}}}';
      expect(convertCodeBlocks(input)).toBe(expected);
    });

    test('does not match closing fence with fewer backticks than opening', () => {
      const input = '````\nsome code\n```\nstill inside\n````';
      const expected = '{{{\nsome code\n```\nstill inside\n}}}';
      expect(convertCodeBlocks(input)).toBe(expected);
    });

    test('handles nested code block showing Markdown syntax as documentation', () => {
      const input = '````md\nTo create a code block:\n```js\nconst x = 1;\n```\n````';
      const expected = '{{{#!markdown\nTo create a code block:\n```js\nconst x = 1;\n```\n}}}';
      expect(convertCodeBlocks(input)).toBe(expected);
    });

    test('handles multiple nested blocks in same document', () => {
      const input = '````\n```\nfirst nested\n```\n````\n\nText between\n\n````\n```\nsecond nested\n```\n````';
      const expected = '{{{\n```\nfirst nested\n```\n}}}\n\nText between\n\n{{{\n```\nsecond nested\n```\n}}}';
      expect(convertCodeBlocks(input)).toBe(expected);
    });

    test('handles nested block with surrounding text', () => {
      const input = 'Before\n````\n```js\ncode\n```\n````\nAfter';
      const expected = 'Before\n{{{\n```js\ncode\n```\n}}}\nAfter';
      expect(convertCodeBlocks(input)).toBe(expected);
    });

    test('handles mixed regular and nested blocks', () => {
      const input = '```js\nregular block\n```\n\n````\n```\nnested block\n```\n````';
      const expected = '{{{#!javascript\nregular block\n}}}\n\n{{{\n```\nnested block\n```\n}}}';
      expect(convertCodeBlocks(input)).toBe(expected);
    });
  });

  describe('Code Block Content Protection', () => {
    test('code content with Markdown headers is not converted', () => {
      const input = '```md\n# This is a heading\n## Another heading\n```';
      const expected = '{{{#!markdown\n# This is a heading\n## Another heading\n}}}';
      expect(convertCodeBlocks(input)).toBe(expected);
    });

    test('code content with Markdown bold/italic is not converted', () => {
      const input = '```\n**bold** and *italic* text\n```';
      const expected = '{{{\n**bold** and *italic* text\n}}}';
      expect(convertCodeBlocks(input)).toBe(expected);
    });

    test('code content with Markdown links is not converted', () => {
      const input = '```\n[link text](https://example.com)\n```';
      const expected = '{{{\n[link text](https://example.com)\n}}}';
      expect(convertCodeBlocks(input)).toBe(expected);
    });

    test('code content with WikiFormatting delimiters is preserved literally', () => {
      const input = '```\n{{{ and }}} are WikiFormatting delimiters\n```';
      const expected = '{{{\n{{{ and }}} are WikiFormatting delimiters\n}}}';
      expect(convertCodeBlocks(input)).toBe(expected);
    });
  });
});
