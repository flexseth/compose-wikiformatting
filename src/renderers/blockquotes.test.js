/**
 * Tests for blockquotes renderer
 *
 * @jest-environment jsdom
 */

import React from 'react';
import { render } from '@testing-library/react';
import { renderBlockquote, parseBlockquoteLines, groupBlockquotesByLevel } from './blockquotes.js';

describe('Blockquote Rendering', () => {

  describe('renderBlockquote - Basic Rendering', () => {
    test('renders simple blockquote', () => {
      const element = renderBlockquote('Simple quote', 1, 'test-1');
      const { container } = render(element);

      const blockquote = container.querySelector('blockquote');
      expect(blockquote).toBeInTheDocument();
      expect(blockquote.textContent).toBe('Simple quote');
    });

    test('renders blockquote with citation class', () => {
      const element = renderBlockquote('Quote', 1, 'test-1');
      const { container } = render(element);

      const blockquote = container.querySelector('blockquote');
      expect(blockquote).toHaveClass('citation');
    });

    test('renders blockquote with text content', () => {
      const element = renderBlockquote('Text content here', 1, 'test-1');
      const { container } = render(element);

      expect(container.textContent).toBe('Text content here');
    });

    test('renders blockquote with React key', () => {
      const element = renderBlockquote('Content', 1, 'unique-key');
      expect(element.key).toBe('unique-key');
    });

    test('renders empty blockquote', () => {
      const element = renderBlockquote('', 1, 'test-1');
      const { container } = render(element);

      const blockquote = container.querySelector('blockquote');
      expect(blockquote).toBeInTheDocument();
      expect(blockquote.textContent).toBe('');
    });

    test('renders blockquote with spaces', () => {
      const element = renderBlockquote('  Text with spaces  ', 1, 'test-1');
      const { container } = render(element);

      expect(container.textContent).toBe('  Text with spaces  ');
    });

    test('renders blockquote with newlines', () => {
      const element = renderBlockquote('Line 1\nLine 2', 1, 'test-1');
      const { container } = render(element);

      expect(container.textContent).toContain('Line 1');
      expect(container.textContent).toContain('Line 2');
    });

    test('renders blockquote with special characters', () => {
      const element = renderBlockquote('Special: © ™ € £', 1, 'test-1');
      const { container } = render(element);

      expect(container.textContent).toBe('Special: © ™ € £');
    });
  });

  describe('renderBlockquote - Nested Blockquotes', () => {
    test('renders level 1 blockquote (>)', () => {
      const element = renderBlockquote('Level 1', 1, 'test-1');
      const { container } = render(element);

      const blockquote = container.querySelector('blockquote');
      expect(blockquote.getAttribute('data-level')).toBe('1');
    });

    test('renders level 2 nested blockquote (>>)', () => {
      const element = renderBlockquote('Level 2', 2, 'test-2');
      const { container } = render(element);

      const blockquote = container.querySelector('blockquote');
      expect(blockquote.getAttribute('data-level')).toBe('2');
    });

    test('renders level 3 nested blockquote (>>>)', () => {
      const element = renderBlockquote('Level 3', 3, 'test-3');
      const { container } = render(element);

      const blockquote = container.querySelector('blockquote');
      expect(blockquote.getAttribute('data-level')).toBe('3');
    });

    test('renders deeply nested blockquote (>>>>)', () => {
      const element = renderBlockquote('Level 4', 4, 'test-4');
      const { container } = render(element);

      const blockquote = container.querySelector('blockquote');
      expect(blockquote.getAttribute('data-level')).toBe('4');
    });

    test('nested blockquotes have correct structure', () => {
      const element = renderBlockquote('Nested content', 2, 'test-1');
      const { container } = render(element);

      const blockquote = container.querySelector('blockquote');
      expect(blockquote.className).toBe('citation');
      expect(blockquote.getAttribute('data-level')).toBe('2');
    });

    test('nested blockquotes have correct classes', () => {
      const element = renderBlockquote('Content', 3, 'test-1');
      const { container } = render(element);

      const blockquote = container.querySelector('blockquote');
      expect(blockquote).toHaveClass('citation');
    });
  });

  describe('renderBlockquote - Content Formatting', () => {
    test('renders bold inside blockquote', () => {
      const content = <><strong>bold</strong> text</>;
      const element = renderBlockquote(content, 1, 'test-1');
      const { container } = render(element);

      const strong = container.querySelector('strong');
      expect(strong).toBeInTheDocument();
      expect(strong.textContent).toBe('bold');
    });

    test('renders italic inside blockquote', () => {
      const content = <><em>italic</em> text</>;
      const element = renderBlockquote(content, 1, 'test-1');
      const { container } = render(element);

      const em = container.querySelector('em');
      expect(em).toBeInTheDocument();
      expect(em.textContent).toBe('italic');
    });

    test('renders bold+italic inside blockquote', () => {
      const content = <><strong><em>bold italic</em></strong></>;
      const element = renderBlockquote(content, 1, 'test-1');
      const { container } = render(element);

      const strong = container.querySelector('strong');
      const em = container.querySelector('em');
      expect(strong).toBeInTheDocument();
      expect(em).toBeInTheDocument();
    });

    test('renders links inside blockquote', () => {
      const content = <>Check <a href="https://example.com">link</a></>;
      const element = renderBlockquote(content, 1, 'test-1');
      const { container } = render(element);

      const link = container.querySelector('a');
      expect(link).toBeInTheDocument();
      expect(link.href).toBe('https://example.com/');
    });

    test('renders inline code inside blockquote', () => {
      const content = <>Use <code>code</code> here</>;
      const element = renderBlockquote(content, 1, 'test-1');
      const { container } = render(element);

      const code = container.querySelector('code');
      expect(code).toBeInTheDocument();
      expect(code.textContent).toBe('code');
    });

    test('renders mixed formatting inside blockquote', () => {
      const content = <><strong>bold</strong>, <em>italic</em>, <code>code</code></>;
      const element = renderBlockquote(content, 1, 'test-1');
      const { container } = render(element);

      expect(container.querySelector('strong')).toBeInTheDocument();
      expect(container.querySelector('em')).toBeInTheDocument();
      expect(container.querySelector('code')).toBeInTheDocument();
    });

    test('renders multiple formatting elements', () => {
      const content = [
        <strong key="1">Bold</strong>,
        ' and ',
        <em key="2">Italic</em>
      ];
      const element = renderBlockquote(content, 1, 'test-1');
      const { container } = render(element);

      expect(container.textContent).toContain('Bold');
      expect(container.textContent).toContain('Italic');
    });

    test('preserves text node structure', () => {
      const content = 'Plain text content';
      const element = renderBlockquote(content, 1, 'test-1');
      const { container } = render(element);

      const blockquote = container.querySelector('blockquote');
      expect(blockquote.textContent).toBe('Plain text content');
    });
  });

  describe('renderBlockquote - Security', () => {
    test('escapes HTML tags in blockquote', () => {
      const content = '<div>HTML content</div>';
      const element = renderBlockquote(content, 1, 'test-1');
      const { container } = render(element);

      // React auto-escapes, so <div> should appear as text
      expect(container.textContent).toBe('<div>HTML content</div>');
      expect(container.querySelector('div')).toBeNull();
    });

    test('escapes script tags in blockquote', () => {
      const content = '<script>alert("XSS")</script>';
      const element = renderBlockquote(content, 1, 'test-1');
      const { container } = render(element);

      // Script tags should be escaped as text
      expect(container.textContent).toContain('<script>');
      expect(container.querySelector('script')).toBeNull();
    });

    test('escapes event handlers in blockquote', () => {
      const content = '<button onclick="alert(1)">Click</button>';
      const element = renderBlockquote(content, 1, 'test-1');
      const { container } = render(element);

      // Event handlers should be escaped
      expect(container.textContent).toContain('onclick');
      expect(container.querySelector('button')).toBeNull();
    });

    test('escapes img tags in blockquote', () => {
      const content = '<img src=x onerror="alert(1)">';
      const element = renderBlockquote(content, 1, 'test-1');
      const { container } = render(element);

      // Img tags should be escaped
      expect(container.textContent).toContain('<img');
      expect(container.querySelector('img')).toBeNull();
    });

    test('escapes iframe tags in blockquote', () => {
      const content = '<iframe src="evil.com"></iframe>';
      const element = renderBlockquote(content, 1, 'test-1');
      const { container } = render(element);

      // Iframe tags should be escaped
      expect(container.textContent).toContain('<iframe');
      expect(container.querySelector('iframe')).toBeNull();
    });

    test('React auto-escaping prevents XSS', () => {
      const content = '"><script>alert("XSS")</script>';
      const element = renderBlockquote(content, 1, 'test-1');
      const { container } = render(element);

      // All HTML should be escaped
      expect(container.querySelector('script')).toBeNull();
      expect(container.textContent).toContain('<script>');
    });
  });

  describe('parseBlockquoteLines - Basic Parsing', () => {
    test('parses single blockquote line', () => {
      const lines = ['> Quote'];
      const result = parseBlockquoteLines(lines, 0);

      expect(result.blocks).toHaveLength(1);
      expect(result.blocks[0]).toEqual({ level: 1, content: 'Quote' });
      expect(result.endIndex).toBe(0);
    });

    test('parses multiple blockquote lines', () => {
      const lines = ['> Line 1', '> Line 2', '> Line 3'];
      const result = parseBlockquoteLines(lines, 0);

      expect(result.blocks).toHaveLength(3);
      expect(result.blocks[0].content).toBe('Line 1');
      expect(result.blocks[1].content).toBe('Line 2');
      expect(result.blocks[2].content).toBe('Line 3');
    });

    test('detects end of blockquote block', () => {
      const lines = ['> Quote', 'Normal text'];
      const result = parseBlockquoteLines(lines, 0);

      expect(result.blocks).toHaveLength(1);
      expect(result.endIndex).toBe(0);
    });

    test('extracts content without > marker', () => {
      const lines = ['> Content here'];
      const result = parseBlockquoteLines(lines, 0);

      expect(result.blocks[0].content).toBe('Content here');
      expect(result.blocks[0].content).not.toContain('>');
    });

    test('handles empty blockquote line', () => {
      const lines = ['>'];
      const result = parseBlockquoteLines(lines, 0);

      expect(result.blocks).toHaveLength(1);
      expect(result.blocks[0].content).toBe('');
    });

    test('handles blockquote with no space after >', () => {
      const lines = ['>Content'];
      const result = parseBlockquoteLines(lines, 0);

      expect(result.blocks[0].content).toBe('Content');
    });
  });

  describe('parseBlockquoteLines - Nesting Detection', () => {
    test('detects level 1 blockquote (>)', () => {
      const lines = ['> Level 1'];
      const result = parseBlockquoteLines(lines, 0);

      expect(result.blocks[0].level).toBe(1);
    });

    test('detects level 2 blockquote (>>)', () => {
      const lines = ['>> Level 2'];
      const result = parseBlockquoteLines(lines, 0);

      expect(result.blocks[0].level).toBe(2);
    });

    test('detects level 3 blockquote (>>>)', () => {
      const lines = ['>>> Level 3'];
      const result = parseBlockquoteLines(lines, 0);

      expect(result.blocks[0].level).toBe(3);
    });

    test('detects mixed nesting levels', () => {
      const lines = ['> Level 1', '>> Level 2', '> Level 1'];
      const result = parseBlockquoteLines(lines, 0);

      expect(result.blocks[0].level).toBe(1);
      expect(result.blocks[1].level).toBe(2);
      expect(result.blocks[2].level).toBe(1);
    });

    test('returns correct level count', () => {
      const lines = ['>>>> Level 4'];
      const result = parseBlockquoteLines(lines, 0);

      expect(result.blocks[0].level).toBe(4);
    });

    test('handles changing nesting levels', () => {
      const lines = ['>>> Deep', '>> Less deep', '> Shallow'];
      const result = parseBlockquoteLines(lines, 0);

      expect(result.blocks[0].level).toBe(3);
      expect(result.blocks[1].level).toBe(2);
      expect(result.blocks[2].level).toBe(1);
    });
  });

  describe('groupBlockquotesByLevel - Grouping Logic', () => {
    test('groups consecutive same-level lines', () => {
      const blocks = [
        { level: 1, content: 'Line 1' },
        { level: 1, content: 'Line 2' }
      ];
      const result = groupBlockquotesByLevel(blocks);

      expect(result).toHaveLength(1);
      expect(result[0].content).toBe('Line 1\nLine 2');
    });

    test('splits on level change', () => {
      const blocks = [
        { level: 1, content: 'Parent' },
        { level: 2, content: 'Nested' }
      ];
      const result = groupBlockquotesByLevel(blocks);

      expect(result).toHaveLength(2);
      expect(result[0].level).toBe(1);
      expect(result[1].level).toBe(2);
    });

    test('handles single block', () => {
      const blocks = [{ level: 1, content: 'Single' }];
      const result = groupBlockquotesByLevel(blocks);

      expect(result).toHaveLength(1);
      expect(result[0].content).toBe('Single');
    });

    test('handles empty array', () => {
      const result = groupBlockquotesByLevel([]);
      expect(result).toHaveLength(0);
    });

    test('preserves content order', () => {
      const blocks = [
        { level: 1, content: 'First' },
        { level: 1, content: 'Second' },
        { level: 1, content: 'Third' }
      ];
      const result = groupBlockquotesByLevel(blocks);

      expect(result[0].content).toBe('First\nSecond\nThird');
    });

    test('joins content with newlines', () => {
      const blocks = [
        { level: 1, content: 'A' },
        { level: 1, content: 'B' }
      ];
      const result = groupBlockquotesByLevel(blocks);

      expect(result[0].content).toContain('\n');
      expect(result[0].content.split('\n')).toHaveLength(2);
    });
  });
});
