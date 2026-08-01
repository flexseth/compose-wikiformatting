/**
 * Tests for WikiFormatting to React converter
 *
 * @jest-environment jsdom
 */

import React from 'react';
import { render } from '@testing-library/react';
import { convertWikiToReact } from './wikiToReact';

describe('convertWikiToReact - Headers', () => {
  describe('Basic headers with matching equals', () => {
    test('converts level 1 header to h1 element', () => {
      const elements = convertWikiToReact('= Heading =');
      const { container } = render(<>{elements}</>);

      const h1 = container.querySelector('h1');
      expect(h1).toBeInTheDocument();
      expect(h1).toHaveClass('section');
      expect(h1).toHaveAttribute('id', 'Heading');
      expect(h1).toHaveTextContent('Heading');
    });

    test('includes anchor link in header', () => {
      const elements = convertWikiToReact('= Test =');
      const { container } = render(<>{elements}</>);

      const anchor = container.querySelector('a.anchor');
      expect(anchor).toBeInTheDocument();
      expect(anchor).toHaveAttribute('href', '#Test');
      expect(anchor).toHaveTextContent('¶');
    });

    test('converts all 6 header levels', () => {
      const wiki = `= H1 =
== H2 ==
=== H3 ===
==== H4 ====
===== H5 =====
====== H6 ======`;
      const elements = convertWikiToReact(wiki);
      const { container } = render(<>{elements}</>);

      expect(container.querySelector('h1')).toBeInTheDocument();
      expect(container.querySelector('h2')).toBeInTheDocument();
      expect(container.querySelector('h3')).toBeInTheDocument();
      expect(container.querySelector('h4')).toBeInTheDocument();
      expect(container.querySelector('h5')).toBeInTheDocument();
      expect(container.querySelector('h6')).toBeInTheDocument();
    });
  });

  describe('Headers without trailing equals', () => {
    test('converts header without trailing equals', () => {
      const elements = convertWikiToReact('== Subheading');
      const { container } = render(<>{elements}</>);

      const h2 = container.querySelector('h2');
      expect(h2).toBeInTheDocument();
      expect(h2).toHaveAttribute('id', 'Subheading');
    });

    test('handles level 1 without trailing', () => {
      const elements = convertWikiToReact('= Title');
      const { container } = render(<>{elements}</>);

      expect(container.querySelector('h1')).toHaveTextContent('Title');
    });
  });

  describe('Headers with inline formatting', () => {
    test('renders italic text in headers', () => {
      const elements = convertWikiToReact("=== About ''this'' ===");
      const { container } = render(<>{elements}</>);

      const h3 = container.querySelector('h3');
      expect(h3).toBeInTheDocument();
      expect(h3.textContent).toContain('About');
      expect(h3.textContent).toContain('this');

      const em = h3.querySelector('em');
      expect(em).toBeInTheDocument();
      expect(em).toHaveTextContent('this');
    });

    test('generates correct ID from formatted text', () => {
      const elements = convertWikiToReact("== Test ''italic''");
      const { container } = render(<>{elements}</>);

      const h2 = container.querySelector('h2');
      expect(h2).toHaveAttribute('id', 'Testitalic');
    });
  });

  describe('Headers with explicit IDs', () => {
    test('uses explicit ID', () => {
      const elements = convertWikiToReact('=== Title === #custom-id');
      const { container } = render(<>{elements}</>);

      const h3 = container.querySelector('h3');
      expect(h3).toHaveAttribute('id', 'custom-id');
    });

    test('explicit ID without trailing equals', () => {
      const elements = convertWikiToReact('== Subheading #sub2');
      const { container } = render(<>{elements}</>);

      const h2 = container.querySelector('h2');
      expect(h2).toHaveAttribute('id', 'sub2');
    });

    test('anchor links to explicit ID', () => {
      const elements = convertWikiToReact('= Test = #my-id');
      const { container } = render(<>{elements}</>);

      const anchor = container.querySelector('a.anchor');
      expect(anchor).toHaveAttribute('href', '#my-id');
    });
  });

  describe('Auto-generated IDs', () => {
    test('removes spaces from ID', () => {
      const elements = convertWikiToReact('= Hello World =');
      const { container } = render(<>{elements}</>);

      expect(container.querySelector('h1')).toHaveAttribute('id', 'HelloWorld');
    });

    test('removes special characters from ID', () => {
      const elements = convertWikiToReact('= Test (note) =');
      const { container } = render(<>{elements}</>);

      expect(container.querySelector('h1')).toHaveAttribute('id', 'Testnote');
    });
  });

  describe('Invalid headers', () => {
    test('renders mismatched equals as paragraph', () => {
      const elements = convertWikiToReact('== Text ===');
      const { container } = render(<>{elements}</>);

      expect(container.querySelector('h2')).not.toBeInTheDocument();
      expect(container.querySelector('p')).toHaveTextContent('== Text ===');
    });

    test('renders header without space as paragraph', () => {
      const elements = convertWikiToReact('==NoSpace');
      const { container } = render(<>{elements}</>);

      expect(container.querySelector('h2')).not.toBeInTheDocument();
      expect(container.querySelector('p')).toBeInTheDocument();
    });
  });

  describe('Non-header content', () => {
    test('renders plain text as paragraph', () => {
      const elements = convertWikiToReact('Just plain text');
      const { container } = render(<>{elements}</>);

      const p = container.querySelector('p');
      expect(p).toBeInTheDocument();
      expect(p).toHaveTextContent('Just plain text');
    });

    test('renders empty lines as line breaks', () => {
      const elements = convertWikiToReact('Line 1\n\nLine 2');
      const { container } = render(<>{elements}</>);

      const br = container.querySelector('br');
      expect(br).toBeInTheDocument();
    });
  });

  describe('Security - XSS Prevention', () => {
    test('escapes HTML in plain text', () => {
      const elements = convertWikiToReact('<script>alert("XSS")</script>');
      const { container } = render(<>{elements}</>);

      // React auto-escapes text content
      expect(container.innerHTML).toContain('&lt;script&gt;');
      expect(container.innerHTML).not.toContain('<script>alert');
    });

    test('escapes special characters in headers', () => {
      const elements = convertWikiToReact('= Test <tag> & "quotes" =');
      const { container } = render(<>{elements}</>);

      const h1 = container.querySelector('h1');
      // React renders text safely
      expect(h1.textContent).toContain('<tag>');
      expect(h1.textContent).toContain('&');
      expect(h1.textContent).toContain('"quotes"');
    });

    test('React prevents script execution in content', () => {
      const malicious = '= Title = <img src=x onerror="alert(1)">';
      const elements = convertWikiToReact(malicious);
      const { container } = render(<>{elements}</>);

      // The <img> tag should be escaped (not executable)
      expect(container.innerHTML).toContain('&lt;img');
      // The actual img tag should not exist (would be executable)
      expect(container.querySelector('img')).not.toBeInTheDocument();
    });
  });

  describe('Mixed content', () => {
    test('handles headers and paragraphs together', () => {
      const wiki = `= Title =
Some text
== Subtitle ==
More text`;
      const elements = convertWikiToReact(wiki);
      const { container } = render(<>{elements}</>);

      expect(container.querySelector('h1')).toHaveTextContent('Title');
      expect(container.querySelector('h2')).toHaveTextContent('Subtitle');

      const paragraphs = container.querySelectorAll('p');
      expect(paragraphs).toHaveLength(2);
    });
  });

  describe('Type safety', () => {
    test('throws TypeError for non-string input', () => {
      expect(() => convertWikiToReact(123)).toThrow(TypeError);
      expect(() => convertWikiToReact(null)).toThrow(TypeError);
      expect(() => convertWikiToReact(undefined)).toThrow(TypeError);
      expect(() => convertWikiToReact({})).toThrow(TypeError);
    });

    test('handles empty string', () => {
      const elements = convertWikiToReact('');
      expect(elements).toEqual([]);
    });

    test('handles whitespace-only string', () => {
      const elements = convertWikiToReact('   ');
      expect(elements).toEqual([]);
    });
  });

  describe('React elements', () => {
    test('returns array of React elements', () => {
      const elements = convertWikiToReact('= Test =');
      expect(Array.isArray(elements)).toBe(true);
      expect(elements.length).toBeGreaterThan(0);
      expect(React.isValidElement(elements[0])).toBe(true);
    });

    test('elements have unique keys', () => {
      const wiki = `= H1 =
== H2 ==
=== H3 ===`;
      const elements = convertWikiToReact(wiki);

      const keys = elements.map(el => el.key);
      const uniqueKeys = new Set(keys);
      expect(uniqueKeys.size).toBe(keys.length);
    });
  });
});

describe('convertWikiToReact - Links (Phase 4b)', () => {
  describe('External links', () => {
    test('converts external link to anchor element', () => {
      const elements = convertWikiToReact('[https://example.com Example Site]');
      const { container } = render(<>{elements}</>);

      const link = container.querySelector('a');
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', 'https://example.com');
      expect(link).toHaveTextContent('Example Site');
    });

    test('renders http links', () => {
      const elements = convertWikiToReact('[http://test.org Test]');
      const { container } = render(<>{elements}</>);

      const link = container.querySelector('a');
      expect(link).toHaveAttribute('href', 'http://test.org');
    });

    test('renders https links', () => {
      const elements = convertWikiToReact('[https://secure.com Secure]');
      const { container } = render(<>{elements}</>);

      const link = container.querySelector('a');
      expect(link).toHaveAttribute('href', 'https://secure.com');
    });

    test('rejects mailto links (not in WikiFormatting spec)', () => {
      const elements = convertWikiToReact('[mailto:test@example.com Email]');
      const { container } = render(<>{elements}</>);

      const link = container.querySelector('a');
      // mailto is not in allowed schemes, should render as text
      expect(link).not.toBeInTheDocument();
      expect(container.textContent).toContain('Email');
    });

    test('rejects ftp links (not in WikiFormatting spec)', () => {
      const elements = convertWikiToReact('[ftp://files.example.com Files]');
      const { container } = render(<>{elements}</>);

      const link = container.querySelector('a');
      // ftp is not in allowed schemes, should render as text
      expect(link).not.toBeInTheDocument();
      expect(container.textContent).toContain('Files');
    });

    test('handles links with paths', () => {
      const elements = convertWikiToReact('[https://example.com/path/to/page Page]');
      const { container } = render(<>{elements}</>);

      const link = container.querySelector('a');
      expect(link).toHaveAttribute('href', 'https://example.com/path/to/page');
    });

    test('handles links with query strings', () => {
      const elements = convertWikiToReact('[https://example.com?foo=bar&baz=qux Link]');
      const { container } = render(<>{elements}</>);

      const link = container.querySelector('a');
      expect(link).toHaveAttribute('href', 'https://example.com?foo=bar&baz=qux');
    });

    test('handles links with fragments', () => {
      const elements = convertWikiToReact('[https://example.com#section Link]');
      const { container } = render(<>{elements}</>);

      const link = container.querySelector('a');
      expect(link).toHaveAttribute('href', 'https://example.com#section');
    });

    test('handles Wikipedia-style URLs with parentheses', () => {
      const elements = convertWikiToReact('[https://en.wikipedia.org/wiki/Object-oriented_programming_(OOP) OOP]');
      const { container } = render(<>{elements}</>);

      const link = container.querySelector('a');
      expect(link).toHaveAttribute('href', 'https://en.wikipedia.org/wiki/Object-oriented_programming_(OOP)');
    });

    test('handles encoded characters in URLs', () => {
      const elements = convertWikiToReact('[https://example.com/test%20space Test]');
      const { container } = render(<>{elements}</>);

      const link = container.querySelector('a');
      expect(link).toHaveAttribute('href', 'https://example.com/test%20space');
    });

    test('handles multiple links in one line', () => {
      const elements = convertWikiToReact('See [https://one.com One] and [https://two.com Two]');
      const { container } = render(<>{elements}</>);

      const links = container.querySelectorAll('a');
      expect(links).toHaveLength(2);
      expect(links[0]).toHaveAttribute('href', 'https://one.com');
      expect(links[1]).toHaveAttribute('href', 'https://two.com');
    });
  });

  describe('Wiki links', () => {
    test('converts wiki link to anchor element', () => {
      const elements = convertWikiToReact('[[WikiPage]]');
      const { container } = render(<>{elements}</>);

      const link = container.querySelector('a');
      expect(link).toBeInTheDocument();
      expect(link).toHaveTextContent('WikiPage');
    });

    test('generates wiki path for wiki links', () => {
      const elements = convertWikiToReact('[[SomePage]]');
      const { container } = render(<>{elements}</>);

      const link = container.querySelector('a');
      // Wiki links should reference the wiki path structure
      expect(link).toHaveAttribute('href');
      expect(link.getAttribute('href')).toContain('SomePage');
    });

    test('handles wiki links with slashes', () => {
      const elements = convertWikiToReact('[[Category/SubPage]]');
      const { container } = render(<>{elements}</>);

      const link = container.querySelector('a');
      expect(link).toHaveTextContent('Category/SubPage');
    });
  });

  describe('Security - URL validation', () => {
    test('rejects javascript: protocol', () => {
      const elements = convertWikiToReact('[javascript:alert(1) Bad]');
      const { container } = render(<>{elements}</>);

      const link = container.querySelector('a');
      // Should either not render as link, or sanitize the href
      if (link) {
        expect(link.getAttribute('href')).not.toBe('javascript:alert(1)');
      }
    });

    test('rejects data: protocol', () => {
      const elements = convertWikiToReact('[data:text/html,<script>alert(1)</script> Bad]');
      const { container } = render(<>{elements}</>);

      const link = container.querySelector('a');
      if (link) {
        expect(link.getAttribute('href')).not.toContain('data:');
      }
    });

    test('rejects vbscript: protocol', () => {
      const elements = convertWikiToReact('[vbscript:msgbox(1) Bad]');
      const { container } = render(<>{elements}</>);

      const link = container.querySelector('a');
      if (link) {
        expect(link.getAttribute('href')).not.toContain('vbscript:');
      }
    });

    test('rejects file: protocol', () => {
      const elements = convertWikiToReact('[file:///etc/passwd Bad]');
      const { container } = render(<>{elements}</>);

      const link = container.querySelector('a');
      if (link) {
        expect(link.getAttribute('href')).not.toContain('file:');
      }
    });

    test('preserves text but prevents execution for dangerous URLs', () => {
      const elements = convertWikiToReact('[javascript:alert(1) Click me]');
      const { container } = render(<>{elements}</>);

      // Text should still be visible
      expect(container.textContent).toContain('Click me');
    });
  });

  describe('Links with formatting', () => {
    test('handles bold text in links', () => {
      const elements = convertWikiToReact("[https://example.com '''Bold Link''']");
      const { container } = render(<>{elements}</>);

      const link = container.querySelector('a');
      expect(link).toBeInTheDocument();
      const strong = link.querySelector('strong');
      expect(strong).toBeInTheDocument();
      expect(strong).toHaveTextContent('Bold Link');
    });

    test('handles italic text in links', () => {
      const elements = convertWikiToReact("[https://example.com ''Italic Link'']");
      const { container } = render(<>{elements}</>);

      const link = container.querySelector('a');
      expect(link).toBeInTheDocument();
      const em = link.querySelector('em');
      expect(em).toBeInTheDocument();
      expect(em).toHaveTextContent('Italic Link');
    });
  });

  describe('Edge cases', () => {
    test('handles link at start of line', () => {
      const elements = convertWikiToReact('[https://example.com Link] and text');
      const { container } = render(<>{elements}</>);

      const link = container.querySelector('a');
      expect(link).toBeInTheDocument();
    });

    test('handles link at end of line', () => {
      const elements = convertWikiToReact('Text and [https://example.com Link]');
      const { container } = render(<>{elements}</>);

      const link = container.querySelector('a');
      expect(link).toBeInTheDocument();
    });

    test('preserves surrounding text', () => {
      const elements = convertWikiToReact('Before [https://example.com Link] After');
      const { container } = render(<>{elements}</>);

      expect(container.textContent).toContain('Before');
      expect(container.textContent).toContain('Link');
      expect(container.textContent).toContain('After');
    });
  });

  describe('Type safety', () => {
    test('handles text with no links', () => {
      const elements = convertWikiToReact('Just plain text');
      const { container } = render(<>{elements}</>);

      const link = container.querySelector('a');
      expect(link).not.toBeInTheDocument();
    });

    test('handles empty link text', () => {
      const elements = convertWikiToReact('[https://example.com ]');
      const { container } = render(<>{elements}</>);

      // Should still render or handle gracefully
      expect(container).toBeInTheDocument();
    });
  });

  describe('Code Blocks - Phase 5b', () => {
    describe('Basic code block rendering', () => {
      test('renders generic code block as pre and code elements', () => {
        const wiki = `{{{\nconst x = 1;\n}}}`;
        const elements = convertWikiToReact(wiki);
        const { container } = render(<>{elements}</>);

        const pre = container.querySelector('pre');
        const code = container.querySelector('code');

        expect(pre).toBeInTheDocument();
        expect(code).toBeInTheDocument();
        expect(code.parentElement).toBe(pre);
        expect(code.textContent).toBe('const x = 1;');
      });

      test('renders language-specific code block with class', () => {
        const wiki = `{{{#!javascript\nconst x = 1;\n}}}`;
        const elements = convertWikiToReact(wiki);
        const { container } = render(<>{elements}</>);

        const code = container.querySelector('code');
        expect(code).toHaveClass('language-javascript');
        expect(code.textContent).toBe('const x = 1;');
      });

      test('renders multiple code blocks in document', () => {
        const wiki = `{{{#!javascript\nconst x = 1;\n}}}\n\n{{{#!php\n<?php echo "hi"; ?>\n}}}`;
        const elements = convertWikiToReact(wiki);
        const { container } = render(<>{elements}</>);

        const codes = container.querySelectorAll('code');
        expect(codes).toHaveLength(2);
        expect(codes[0]).toHaveClass('language-javascript');
        expect(codes[1]).toHaveClass('language-php');
      });

      test('renders code blocks mixed with headers and text', () => {
        const wiki = `= Header =\n\nSome text\n\n{{{\ncode\n}}}\n\nMore text`;
        const elements = convertWikiToReact(wiki);
        const { container } = render(<>{elements}</>);

        expect(container.querySelector('h1')).toBeInTheDocument();
        expect(container.querySelector('pre')).toBeInTheDocument();
        expect(container.querySelectorAll('p')).toHaveLength(2);
      });

      test('renders empty code block', () => {
        const wiki = `{{{\n}}}`;
        const elements = convertWikiToReact(wiki);
        const { container } = render(<>{elements}</>);

        const code = container.querySelector('code');
        expect(code).toBeInTheDocument();
        expect(code.textContent).toBe('');
      });

      test('renders code block at start of document', () => {
        const wiki = `{{{\ncode\n}}}\n\nText after`;
        const elements = convertWikiToReact(wiki);
        const { container } = render(<>{elements}</>);

        expect(container.querySelector('pre')).toBeInTheDocument();
        expect(container.querySelector('p')).toBeInTheDocument();
      });

      test('renders code block at end of document', () => {
        const wiki = `Text before\n\n{{{\ncode\n}}}`;
        const elements = convertWikiToReact(wiki);
        const { container } = render(<>{elements}</>);

        expect(container.querySelector('p')).toBeInTheDocument();
        expect(container.querySelector('pre')).toBeInTheDocument();
      });

      test('renders multiple languages correctly', () => {
        const wiki = `{{{#!php\n<?php ?>\n}}}\n{{{#!css\n.class{}\n}}}\n{{{#!bash\nnpm install\n}}}`;
        const elements = convertWikiToReact(wiki);
        const { container } = render(<>{elements}</>);

        const codes = container.querySelectorAll('code');
        expect(codes[0]).toHaveClass('language-php');
        expect(codes[1]).toHaveClass('language-css');
        expect(codes[2]).toHaveClass('language-bash');
      });

      test('handles nested code blocks (WikiFormatting delimiters inside code)', () => {
        const wiki = `{{{\nShowing WikiFormatting syntax:\n\n{{{\n  code block\n}}}\n\n{{{#!python\n  code with language\n}}}\n}}}`;
        const elements = convertWikiToReact(wiki);
        const { container } = render(<>{elements}</>);

        // Should render as ONE code block with nested syntax preserved
        const pres = container.querySelectorAll('pre');
        expect(pres).toHaveLength(1);

        const code = container.querySelector('code');
        const expectedContent = `Showing WikiFormatting syntax:\n\n{{{\n  code block\n}}}\n\n{{{#!python\n  code with language\n}}}`;
        expect(code.textContent).toBe(expectedContent);

        // Inner {{{ and }}} should be literal text, not separate code blocks
        expect(code.textContent).toContain('{{{');
        expect(code.textContent).toContain('}}}');
        expect(code.textContent).toContain('{{{#!python');
      });
    });

    describe('Content protection - CRITICAL', () => {
      test('headers in code blocks stay literal (not rendered as headers)', () => {
        const wiki = `{{{\n= Not A Header =\n== Also Not ==\n}}}`;
        const elements = convertWikiToReact(wiki);
        const { container } = render(<>{elements}</>);

        const code = container.querySelector('code');
        expect(code.textContent).toBe('= Not A Header =\n== Also Not ==');
        expect(container.querySelector('h1')).not.toBeInTheDocument();
        expect(container.querySelector('h2')).not.toBeInTheDocument();
      });

      test('bold in code blocks stays literal (not rendered as bold)', () => {
        const wiki = `{{{\n'''not bold'''\n}}}`;
        const elements = convertWikiToReact(wiki);
        const { container } = render(<>{elements}</>);

        const code = container.querySelector('code');
        expect(code.textContent).toBe("'''not bold'''");
        expect(container.querySelector('strong')).not.toBeInTheDocument();
      });

      test('italic in code blocks stays literal (not rendered as italic)', () => {
        const wiki = `{{{\n''not italic''\n}}}`;
        const elements = convertWikiToReact(wiki);
        const { container } = render(<>{elements}</>);

        const code = container.querySelector('code');
        expect(code.textContent).toBe("''not italic''");
        expect(container.querySelector('em')).not.toBeInTheDocument();
      });

      test('links in code blocks stay literal (not rendered as links)', () => {
        const wiki = `{{{\n[https://example.com Not A Link]\n}}}`;
        const elements = convertWikiToReact(wiki);
        const { container } = render(<>{elements}</>);

        const code = container.querySelector('code');
        expect(code.textContent).toBe('[https://example.com Not A Link]');
        expect(container.querySelector('a')).not.toBeInTheDocument();
      });

      test('wiki links in code blocks stay literal (not rendered as links)', () => {
        const wiki = `{{{\n[[WikiPage]]\n}}}`;
        const elements = convertWikiToReact(wiki);
        const { container } = render(<>{elements}</>);

        const code = container.querySelector('code');
        expect(code.textContent).toBe('[[WikiPage]]');
        expect(container.querySelector('a')).not.toBeInTheDocument();
      });

      test('all WikiFormatting syntax preserved in code blocks', () => {
        const wiki = `{{{\n= Header =\n'''bold''' and ''italic''\n[https://example.com link]\n[[WikiPage]]\n}}}`;
        const elements = convertWikiToReact(wiki);
        const { container } = render(<>{elements}</>);

        const code = container.querySelector('code');
        const expected = "= Header =\n'''bold''' and ''italic''\n[https://example.com link]\n[[WikiPage]]";
        expect(code.textContent).toBe(expected);

        // Verify NO formatting elements rendered
        expect(container.querySelector('h1')).not.toBeInTheDocument();
        expect(container.querySelector('strong')).not.toBeInTheDocument();
        expect(container.querySelector('em')).not.toBeInTheDocument();
        expect(container.querySelector('a')).not.toBeInTheDocument();
      });
    });

    describe('Security - XSS Prevention', () => {
      test('script tags in code blocks are escaped', () => {
        const wiki = `{{{\n<script>alert("XSS")</script>\n}}}`;
        const elements = convertWikiToReact(wiki);
        const { container } = render(<>{elements}</>);

        const code = container.querySelector('code');
        expect(code.textContent).toBe('<script>alert("XSS")</script>');
        expect(container.querySelector('script')).not.toBeInTheDocument();
      });

      test('img tags with onerror are escaped', () => {
        const wiki = `{{{\n<img src=x onerror="alert(1)">\n}}}`;
        const elements = convertWikiToReact(wiki);
        const { container } = render(<>{elements}</>);

        const code = container.querySelector('code');
        expect(code.textContent).toBe('<img src=x onerror="alert(1)">');
        expect(container.querySelector('img')).not.toBeInTheDocument();
      });

      test('iframe injection is escaped', () => {
        const wiki = `{{{\n<iframe src="javascript:alert(1)"></iframe>\n}}}`;
        const elements = convertWikiToReact(wiki);
        const { container } = render(<>{elements}</>);

        const code = container.querySelector('code');
        expect(code.textContent).toBe('<iframe src="javascript:alert(1)"></iframe>');
        expect(container.querySelector('iframe')).not.toBeInTheDocument();
      });

      test('SVG with script is escaped', () => {
        const wiki = `{{{\n<svg><script>alert(1)</script></svg>\n}}}`;
        const elements = convertWikiToReact(wiki);
        const { container } = render(<>{elements}</>);

        const code = container.querySelector('code');
        expect(code.textContent).toBe('<svg><script>alert(1)</script></svg>');
        expect(container.querySelector('svg')).not.toBeInTheDocument();
      });

      test('event handlers are escaped', () => {
        const wiki = `{{{\n<div onclick="alert(1)">Click</div>\n}}}`;
        const elements = convertWikiToReact(wiki);
        const { container } = render(<>{elements}</>);

        const code = container.querySelector('code');
        expect(code.textContent).toBe('<div onclick="alert(1)">Click</div>');
        // Verify the literal text contains onclick but no actual div was created
        expect(code.innerHTML).toContain('onclick');
      });
    });

    describe('Inline code - Phase 5b', () => {
      test('renders inline code in paragraph', () => {
        const wiki = 'Use `const` for constants';
        const elements = convertWikiToReact(wiki);
        const { container } = render(<>{elements}</>);

        const code = container.querySelector('code');
        expect(code).toBeInTheDocument();
        expect(code.textContent).toBe('const');
        expect(container.querySelector('p')).toBeInTheDocument();
      });

      test('renders multiple inline code segments in paragraph', () => {
        const wiki = 'Use `const` and `let` keywords';
        const elements = convertWikiToReact(wiki);
        const { container } = render(<>{elements}</>);

        const codes = container.querySelectorAll('code');
        expect(codes).toHaveLength(2);
        expect(codes[0].textContent).toBe('const');
        expect(codes[1].textContent).toBe('let');
      });

      test('renders inline code in header', () => {
        const wiki = '= Using `const` in JavaScript =';
        const elements = convertWikiToReact(wiki);
        const { container } = render(<>{elements}</>);

        const h1 = container.querySelector('h1');
        const code = h1.querySelector('code');
        expect(code).toBeInTheDocument();
        expect(code.textContent).toBe('const');
      });

      test('inline code with bold/italic surrounding it', () => {
        const wiki = "'''Bold''' and `code` and ''italic''";
        const elements = convertWikiToReact(wiki);
        const { container } = render(<>{elements}</>);

        expect(container.querySelector('strong')).toBeInTheDocument();
        expect(container.querySelector('code')).toBeInTheDocument();
        expect(container.querySelector('em')).toBeInTheDocument();
      });

      test('inline code protects content from formatting', () => {
        const wiki = "Text `with '''bold''' inside code` text";
        const elements = convertWikiToReact(wiki);
        const { container } = render(<>{elements}</>);

        const code = container.querySelector('code');
        expect(code.textContent).toBe("with '''bold''' inside code");
        // Should only have one code element, no strong inside it
        expect(container.querySelectorAll('code')).toHaveLength(1);
        expect(code.querySelector('strong')).not.toBeInTheDocument();
      });

      test('escapes HTML in inline code', () => {
        const wiki = 'Use `<div>` element';
        const elements = convertWikiToReact(wiki);
        const { container } = render(<>{elements}</>);

        const code = container.querySelector('code');
        expect(code.textContent).toBe('<div>');
        // No actual div should be created
        const allDivs = container.querySelectorAll('div');
        // Only the container div from the test, not from the inline code
        expect(allDivs.length).toBe(0);
      });
    });
  });

  describe('Blockquote Integration (Phase 6b)', () => {
    describe('Basic Blockquote Rendering', () => {
      test('renders single-line blockquote', () => {
        const wiki = '> This is a quote';
        const elements = convertWikiToReact(wiki);
        const { container } = render(<>{elements}</>);

        const blockquote = container.querySelector('blockquote');
        expect(blockquote).toBeInTheDocument();
        expect(blockquote).toHaveClass('citation');
        expect(blockquote.textContent).toBe('This is a quote');
      });

      test('renders multi-line blockquote', () => {
        const wiki = '> Line 1\n> Line 2\n> Line 3';
        const elements = convertWikiToReact(wiki);
        const { container } = render(<>{elements}</>);

        const blockquote = container.querySelector('blockquote');
        expect(blockquote).toBeInTheDocument();
        expect(blockquote.textContent).toContain('Line 1');
        expect(blockquote.textContent).toContain('Line 2');
        expect(blockquote.textContent).toContain('Line 3');
      });

      test('renders blockquote with paragraphs before/after', () => {
        const wiki = 'Before\n\n> Quote\n\nAfter';
        const elements = convertWikiToReact(wiki);
        const { container } = render(<>{elements}</>);

        const paragraphs = container.querySelectorAll('p');
        const blockquote = container.querySelector('blockquote');

        expect(paragraphs).toHaveLength(2);
        expect(blockquote).toBeInTheDocument();
        expect(paragraphs[0].textContent).toBe('Before');
        expect(blockquote.textContent).toBe('Quote');
        expect(paragraphs[1].textContent).toBe('After');
      });

      test('renders blockquote with headers', () => {
        const wiki = '= Header =\n\n> Quote\n\n== Subheader ==';
        const elements = convertWikiToReact(wiki);
        const { container } = render(<>{elements}</>);

        const h1 = container.querySelector('h1');
        const h2 = container.querySelector('h2');
        const blockquote = container.querySelector('blockquote');

        expect(h1).toBeInTheDocument();
        expect(h2).toBeInTheDocument();
        expect(blockquote).toBeInTheDocument();
      });

      test('renders blockquote with code blocks', () => {
        const wiki = '> Quote\n\n{{{#!javascript\ncode\n}}}';
        const elements = convertWikiToReact(wiki);
        const { container } = render(<>{elements}</>);

        const blockquote = container.querySelector('blockquote');
        const pre = container.querySelector('pre');

        expect(blockquote).toBeInTheDocument();
        expect(pre).toBeInTheDocument();
      });
    });

    describe('Nested Blockquotes', () => {
      test('renders nested blockquote (>>)', () => {
        const wiki = '>> Nested quote';
        const elements = convertWikiToReact(wiki);
        const { container } = render(<>{elements}</>);

        const blockquote = container.querySelector('blockquote');
        expect(blockquote).toBeInTheDocument();
        expect(blockquote.getAttribute('data-level')).toBe('2');
      });

      test('renders deeply nested blockquotes (>>>)', () => {
        const wiki = '>>> Very nested';
        const elements = convertWikiToReact(wiki);
        const { container } = render(<>{elements}</>);

        const blockquote = container.querySelector('blockquote');
        expect(blockquote.getAttribute('data-level')).toBe('3');
      });

      test('renders mixed nesting levels', () => {
        const wiki = '> Level 1\n>> Level 2\n> Level 1 again';
        const elements = convertWikiToReact(wiki);
        const { container } = render(<>{elements}</>);

        const blockquotes = container.querySelectorAll('blockquote');
        // 3 blockquotes: level 1, level 2, level 1 (different groups)
        expect(blockquotes).toHaveLength(3);
        expect(blockquotes[0].getAttribute('data-level')).toBe('1');
        expect(blockquotes[1].getAttribute('data-level')).toBe('2');
        expect(blockquotes[2].getAttribute('data-level')).toBe('1');
      });

      test('renders descending nesting', () => {
        const wiki = '>>> Level 3\n>> Level 2\n> Level 1';
        const elements = convertWikiToReact(wiki);
        const { container } = render(<>{elements}</>);

        const blockquotes = container.querySelectorAll('blockquote');
        expect(blockquotes.length).toBeGreaterThan(0);
      });

      test('renders ascending nesting', () => {
        const wiki = '> Level 1\n>> Level 2\n>>> Level 3';
        const elements = convertWikiToReact(wiki);
        const { container } = render(<>{elements}</>);

        const blockquotes = container.querySelectorAll('blockquote');
        expect(blockquotes.length).toBeGreaterThan(0);
      });
    });

    describe('Multiple Blockquotes', () => {
      test('renders multiple separate blockquotes', () => {
        const wiki = '> First\n\n> Second';
        const elements = convertWikiToReact(wiki);
        const { container } = render(<>{elements}</>);

        const blockquotes = container.querySelectorAll('blockquote');
        expect(blockquotes).toHaveLength(2);
      });

      test('renders blockquotes with content between', () => {
        const wiki = '> Quote 1\n\nNormal text\n\n> Quote 2';
        const elements = convertWikiToReact(wiki);
        const { container } = render(<>{elements}</>);

        const blockquotes = container.querySelectorAll('blockquote');
        const paragraph = container.querySelector('p');

        expect(blockquotes).toHaveLength(2);
        expect(paragraph.textContent).toBe('Normal text');
      });

      test('renders three or more blockquotes', () => {
        const wiki = '> A\n\n> B\n\n> C';
        const elements = convertWikiToReact(wiki);
        const { container } = render(<>{elements}</>);

        const blockquotes = container.querySelectorAll('blockquote');
        expect(blockquotes).toHaveLength(3);
      });

      test('renders blockquotes mixed with other elements', () => {
        const wiki = '= Header =\n\n> Quote\n\n{{{code}}}';
        const elements = convertWikiToReact(wiki);
        const { container } = render(<>{elements}</>);

        const h1 = container.querySelector('h1');
        const blockquote = container.querySelector('blockquote');
        const pre = container.querySelector('pre');

        expect(h1).toBeInTheDocument();
        expect(blockquote).toBeInTheDocument();
        expect(pre).toBeInTheDocument();
      });
    });

    describe('Formatting Inside Blockquotes', () => {
      test('renders bold inside blockquote', () => {
        const wiki = "> This has '''bold''' text";
        const elements = convertWikiToReact(wiki);
        const { container } = render(<>{elements}</>);

        const blockquote = container.querySelector('blockquote');
        const strong = blockquote.querySelector('strong');

        expect(strong).toBeInTheDocument();
        expect(strong.textContent).toBe('bold');
      });

      test('renders italic inside blockquote', () => {
        const wiki = "> This has ''italic'' text";
        const elements = convertWikiToReact(wiki);
        const { container } = render(<>{elements}</>);

        const blockquote = container.querySelector('blockquote');
        const em = blockquote.querySelector('em');

        expect(em).toBeInTheDocument();
        expect(em.textContent).toBe('italic');
      });

      test('renders links inside blockquote', () => {
        const wiki = '> Check [https://example.com link]';
        const elements = convertWikiToReact(wiki);
        const { container } = render(<>{elements}</>);

        const blockquote = container.querySelector('blockquote');
        const link = blockquote.querySelector('a');

        expect(link).toBeInTheDocument();
        expect(link.href).toBe('https://example.com/');
      });

      test('renders inline code inside blockquote', () => {
        const wiki = '> Use `code` here';
        const elements = convertWikiToReact(wiki);
        const { container } = render(<>{elements}</>);

        const blockquote = container.querySelector('blockquote');
        const code = blockquote.querySelector('code');

        expect(code).toBeInTheDocument();
        expect(code.textContent).toBe('code');
      });

      test('renders mixed formatting inside blockquote', () => {
        const wiki = "> '''Bold''', ''italic'', and `code`";
        const elements = convertWikiToReact(wiki);
        const { container } = render(<>{elements}</>);

        const blockquote = container.querySelector('blockquote');
        expect(blockquote.querySelector('strong')).toBeInTheDocument();
        expect(blockquote.querySelector('em')).toBeInTheDocument();
        expect(blockquote.querySelector('code')).toBeInTheDocument();
      });

      test('renders WikiFormatting syntax inside blockquote', () => {
        const wiki = "> '''Text''' with formatting";
        const elements = convertWikiToReact(wiki);
        const { container } = render(<>{elements}</>);

        const blockquote = container.querySelector('blockquote');
        const strong = blockquote.querySelector('strong');

        // WikiFormatting processed inside blockquote
        expect(strong).toBeInTheDocument();
        // Original ''' markers should not appear
        expect(blockquote.textContent).not.toContain("'''");
      });
    });

    describe('Edge Cases', () => {
      test('handles empty blockquote', () => {
        const wiki = '>';
        const elements = convertWikiToReact(wiki);
        const { container } = render(<>{elements}</>);

        const blockquote = container.querySelector('blockquote');
        expect(blockquote).toBeInTheDocument();
      });

      test('handles blockquote with only whitespace', () => {
        const wiki = '>   ';
        const elements = convertWikiToReact(wiki);
        const { container } = render(<>{elements}</>);

        const blockquote = container.querySelector('blockquote');
        expect(blockquote).toBeInTheDocument();
      });

      test('handles > not at line start (paragraph)', () => {
        const wiki = 'Text with > in middle';
        const elements = convertWikiToReact(wiki);
        const { container } = render(<>{elements}</>);

        // Should be paragraph, not blockquote
        const paragraph = container.querySelector('p');
        const blockquote = container.querySelector('blockquote');

        expect(paragraph).toBeInTheDocument();
        expect(blockquote).not.toBeInTheDocument();
      });

      test('handles blockquote at start of document', () => {
        const wiki = '> First line quote';
        const elements = convertWikiToReact(wiki);
        const { container } = render(<>{elements}</>);

        const blockquote = container.querySelector('blockquote');
        expect(blockquote).toBeInTheDocument();
      });

      test('handles blockquote at end of document', () => {
        const wiki = 'Text\n\n> Last line quote';
        const elements = convertWikiToReact(wiki);
        const { container } = render(<>{elements}</>);

        const blockquote = container.querySelector('blockquote');
        expect(blockquote).toBeInTheDocument();
      });
    });

    describe('Security - XSS Prevention', () => {
      test('escapes HTML in blockquote content', () => {
        const wiki = '> <script>alert("XSS")</script>';
        const elements = convertWikiToReact(wiki);
        const { container } = render(<>{elements}</>);

        const blockquote = container.querySelector('blockquote');
        expect(blockquote.textContent).toContain('<script>');
        expect(container.querySelector('script')).not.toBeInTheDocument();
      });

      test('escapes event handlers in blockquote', () => {
        const wiki = '> <div onclick="alert(1)">Click</div>';
        const elements = convertWikiToReact(wiki);
        const { container } = render(<>{elements}</>);

        const blockquote = container.querySelector('blockquote');
        expect(blockquote.textContent).toContain('onclick');
        // No actual div should be created from the content
        const allDivs = container.querySelectorAll('div');
        expect(allDivs.length).toBe(0);
      });

      test('React auto-escaping prevents XSS', () => {
        const wiki = '> <img src=x onerror="alert(1)">';
        const elements = convertWikiToReact(wiki);
        const { container } = render(<>{elements}</>);

        const blockquote = container.querySelector('blockquote');
        expect(blockquote.textContent).toContain('<img');
        expect(container.querySelector('img')).not.toBeInTheDocument();
      });
    });
  });
});
