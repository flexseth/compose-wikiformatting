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
