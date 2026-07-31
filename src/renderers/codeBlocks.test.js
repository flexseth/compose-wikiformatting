/**
 * Tests for Code Block Rendering
 * Phase 5b: WikiFormatting → React
 *
 * @jest-environment jsdom
 */

import React from 'react';
import { render } from '@testing-library/react';
import { escapeHtml, renderCodeBlock, renderInlineCode } from './codeBlocks';

describe('escapeHtml', () => {
  test('escapes < to &lt;', () => {
    expect(escapeHtml('<')).toBe('&lt;');
  });

  test('escapes > to &gt;', () => {
    expect(escapeHtml('>')).toBe('&gt;');
  });

  test('escapes & to &amp;', () => {
    expect(escapeHtml('&')).toBe('&amp;');
  });

  test('escapes " to &quot;', () => {
    expect(escapeHtml('"')).toBe('&quot;');
  });

  test('escapes \' to &#x27;', () => {
    expect(escapeHtml("'")).toBe('&#x27;');
  });

  test('handles empty string', () => {
    expect(escapeHtml('')).toBe('');
  });

  test('handles text with no special characters', () => {
    expect(escapeHtml('hello world')).toBe('hello world');
  });

  test('escapes multiple special characters', () => {
    const input = '<script>alert("XSS")</script>';
    const expected = '&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;';
    expect(escapeHtml(input)).toBe(expected);
  });

  test('escapes in correct order (& first)', () => {
    const input = '&<>"\'';
    const expected = '&amp;&lt;&gt;&quot;&#x27;';
    expect(escapeHtml(input)).toBe(expected);
  });

  test('handles mixed content', () => {
    const input = 'const str = "Special: <>&"\';';
    const expected = 'const str = &quot;Special: &lt;&gt;&amp;&quot;&#x27;;';
    expect(escapeHtml(input)).toBe(expected);
  });

  test('escapes img tag with event handler', () => {
    const input = '<img src=x onerror="alert(1)">';
    const expected = '&lt;img src=x onerror=&quot;alert(1)&quot;&gt;';
    expect(escapeHtml(input)).toBe(expected);
  });

  test('escapes SVG injection', () => {
    const input = '<svg><script>alert(1)</script></svg>';
    const expected = '&lt;svg&gt;&lt;script&gt;alert(1)&lt;/script&gt;&lt;/svg&gt;';
    expect(escapeHtml(input)).toBe(expected);
  });
});

describe('renderCodeBlock', () => {
  describe('Basic rendering', () => {
    test('renders pre and code elements', () => {
      const elements = [renderCodeBlock('const x = 1;', null, 'test-1')];
      const { container } = render(<>{elements}</>);

      const pre = container.querySelector('pre');
      const code = container.querySelector('code');

      expect(pre).toBeInTheDocument();
      expect(code).toBeInTheDocument();
      expect(code.parentElement).toBe(pre);
    });

    test('renders generic code block without language class', () => {
      const elements = [renderCodeBlock('generic code', null, 'test-1')];
      const { container } = render(<>{elements}</>);

      const code = container.querySelector('code');
      expect(code).not.toHaveClass('language-javascript');
      expect(code.className).toBe('');
    });

    test('renders code block with language class', () => {
      const elements = [renderCodeBlock('const x = 1;', 'javascript', 'test-1')];
      const { container } = render(<>{elements}</>);

      const code = container.querySelector('code');
      expect(code).toHaveClass('language-javascript');
    });

    test('escapes HTML content', () => {
      const content = '<script>alert("XSS")</script>';
      const elements = [renderCodeBlock(content, null, 'test-1')];
      const { container } = render(<>{elements}</>);

      const code = container.querySelector('code');
      expect(code.textContent).toBe(content);
      // React escapes < and > but quotes differently than HTML entities
      expect(code.innerHTML).toContain('&lt;script&gt;');
      expect(code.innerHTML).toContain('&lt;/script&gt;');
    });

    test('preserves whitespace and newlines', () => {
      const content = 'line 1\n  line 2\n    line 3';
      const elements = [renderCodeBlock(content, null, 'test-1')];
      const { container } = render(<>{elements}</>);

      const code = container.querySelector('code');
      expect(code.textContent).toBe(content);
    });

    test('handles empty code block', () => {
      const elements = [renderCodeBlock('', null, 'test-1')];
      const { container } = render(<>{elements}</>);

      const code = container.querySelector('code');
      expect(code.textContent).toBe('');
    });

    test('includes React key prop', () => {
      const element = renderCodeBlock('test', null, 'test-key-123');
      expect(element.key).toBe('test-key-123');
    });
  });

  describe('Language support', () => {
    test('renders JavaScript code', () => {
      const content = 'const x = 1;';
      const elements = [renderCodeBlock(content, 'javascript', 'test-1')];
      const { container } = render(<>{elements}</>);

      const code = container.querySelector('code');
      expect(code).toHaveClass('language-javascript');
    });

    test('renders PHP code with language class', () => {
      const content = '<?php echo "Hello"; ?>';
      const elements = [renderCodeBlock(content, 'php', 'test-1')];
      const { container } = render(<>{elements}</>);

      const code = container.querySelector('code');
      expect(code).toHaveClass('language-php');
      expect(code.textContent).toBe(content);
    });

    test('renders HTML code with escaping', () => {
      const content = '<div class="test">Content</div>';
      const elements = [renderCodeBlock(content, 'html', 'test-1')];
      const { container } = render(<>{elements}</>);

      const code = container.querySelector('code');
      expect(code).toHaveClass('language-html');
      expect(code.textContent).toBe(content);
      expect(code.innerHTML).toContain('&lt;div');
    });

    test('renders CSS code', () => {
      const content = '.class { color: red; }';
      const elements = [renderCodeBlock(content, 'css', 'test-1')];
      const { container } = render(<>{elements}</>);

      const code = container.querySelector('code');
      expect(code).toHaveClass('language-css');
    });

    test('renders Bash code', () => {
      const content = 'npm install';
      const elements = [renderCodeBlock(content, 'bash', 'test-1')];
      const { container } = render(<>{elements}</>);

      const code = container.querySelector('code');
      expect(code).toHaveClass('language-bash');
    });

    test('renders Python code', () => {
      const content = 'def hello():\n    print("Hello")';
      const elements = [renderCodeBlock(content, 'python', 'test-1')];
      const { container } = render(<>{elements}</>);

      const code = container.querySelector('code');
      expect(code).toHaveClass('language-python');
      expect(code.textContent).toBe(content);
    });
  });

  describe('XSS Prevention - Security Tests', () => {
    test('escapes script tags', () => {
      const content = '<script>alert("XSS")</script>';
      const elements = [renderCodeBlock(content, null, 'test-1')];
      const { container } = render(<>{elements}</>);

      const code = container.querySelector('code');
      expect(code.textContent).toBe(content);
      expect(container.querySelector('script')).not.toBeInTheDocument();
    });

    test('escapes img tag with onerror', () => {
      const content = '<img src=x onerror="alert(1)">';
      const elements = [renderCodeBlock(content, null, 'test-1')];
      const { container } = render(<>{elements}</>);

      const code = container.querySelector('code');
      expect(code.textContent).toBe(content);
      expect(container.querySelector('img')).not.toBeInTheDocument();
    });

    test('escapes iframe injection', () => {
      const content = '<iframe src="javascript:alert(1)"></iframe>';
      const elements = [renderCodeBlock(content, null, 'test-1')];
      const { container } = render(<>{elements}</>);

      const code = container.querySelector('code');
      expect(code.textContent).toBe(content);
      expect(container.querySelector('iframe')).not.toBeInTheDocument();
    });

    test('escapes SVG with script injection', () => {
      const content = '<svg><script>alert(1)</script></svg>';
      const elements = [renderCodeBlock(content, null, 'test-1')];
      const { container } = render(<>{elements}</>);

      const code = container.querySelector('code');
      expect(code.textContent).toBe(content);
      expect(container.querySelector('svg')).not.toBeInTheDocument();
    });

    test('escapes event handlers - onclick', () => {
      const content = '<div onclick="alert(1)">Click</div>';
      const elements = [renderCodeBlock(content, null, 'test-1')];
      const { container } = render(<>{elements}</>);

      const code = container.querySelector('code');
      expect(code.textContent).toBe(content);
      expect(code.innerHTML).toContain('onclick');
      expect(code.innerHTML).not.toContain('<div');
    });

    test('escapes event handlers - onload', () => {
      const content = '<body onload="alert(1)">';
      const elements = [renderCodeBlock(content, null, 'test-1')];
      const { container } = render(<>{elements}</>);

      const code = container.querySelector('code');
      expect(code.textContent).toBe(content);
    });

    test('escapes data URIs', () => {
      const content = '<a href="data:text/html,<script>alert(1)</script>">Click</a>';
      const elements = [renderCodeBlock(content, null, 'test-1')];
      const { container } = render(<>{elements}</>);

      const code = container.querySelector('code');
      expect(code.textContent).toBe(content);
      expect(container.querySelector('a[href^="data:"]')).not.toBeInTheDocument();
    });

    test('escapes javascript protocol URIs', () => {
      const content = '<a href="javascript:alert(1)">Click</a>';
      const elements = [renderCodeBlock(content, null, 'test-1')];
      const { container } = render(<>{elements}</>);

      const code = container.querySelector('code');
      expect(code.textContent).toBe(content);
      expect(container.querySelector('a[href^="javascript:"]')).not.toBeInTheDocument();
    });

    test('escapes object/embed tags', () => {
      const content = '<object data="malicious.swf"></object>';
      const elements = [renderCodeBlock(content, null, 'test-1')];
      const { container } = render(<>{elements}</>);

      const code = container.querySelector('code');
      expect(code.textContent).toBe(content);
      expect(container.querySelector('object')).not.toBeInTheDocument();
    });

    test('escapes form injection', () => {
      const content = '<form action="malicious.php"><input type="submit"></form>';
      const elements = [renderCodeBlock(content, null, 'test-1')];
      const { container } = render(<>{elements}</>);

      const code = container.querySelector('code');
      expect(code.textContent).toBe(content);
      expect(container.querySelector('form')).not.toBeInTheDocument();
    });

    test('escapes meta tag redirects', () => {
      const content = '<meta http-equiv="refresh" content="0;url=malicious.com">';
      const elements = [renderCodeBlock(content, null, 'test-1')];
      const { container } = render(<>{elements}</>);

      const code = container.querySelector('code');
      expect(code.textContent).toBe(content);
      expect(container.querySelector('meta')).not.toBeInTheDocument();
    });

    test('escapes link tag injection', () => {
      const content = '<link rel="stylesheet" href="malicious.css">';
      const elements = [renderCodeBlock(content, null, 'test-1')];
      const { container } = render(<>{elements}</>);

      const code = container.querySelector('code');
      expect(code.textContent).toBe(content);
      expect(container.querySelector('link')).not.toBeInTheDocument();
    });
  });
});

describe('renderInlineCode', () => {
  test('renders inline code with backticks', () => {
    const elements = renderInlineCode('This is `code` here', 0);
    const { container } = render(<>{elements}</>);

    const code = container.querySelector('code');
    expect(code).toBeInTheDocument();
    expect(code.textContent).toBe('code');
  });

  test('handles text without inline code', () => {
    const elements = renderInlineCode('No code here', 0);
    const { container } = render(<>{elements}</>);

    expect(container.querySelector('code')).not.toBeInTheDocument();
    expect(container.textContent).toBe('No code here');
  });

  test('handles multiple inline code segments', () => {
    const elements = renderInlineCode('Use `const` and `let` keywords', 0);
    const { container } = render(<>{elements}</>);

    const codes = container.querySelectorAll('code');
    expect(codes).toHaveLength(2);
    expect(codes[0].textContent).toBe('const');
    expect(codes[1].textContent).toBe('let');
  });

  test('escapes HTML in inline code', () => {
    const elements = renderInlineCode('Tag: `<script>`', 0);
    const { container } = render(<>{elements}</>);

    const code = container.querySelector('code');
    expect(code.textContent).toBe('<script>');
    expect(code.innerHTML).toContain('&lt;script&gt;');
  });

  test('handles inline code at start of line', () => {
    const elements = renderInlineCode('`code` at start', 0);
    const { container } = render(<>{elements}</>);

    const code = container.querySelector('code');
    expect(code.textContent).toBe('code');
    expect(container.textContent).toBe('code at start');
  });

  test('handles inline code at end of line', () => {
    const elements = renderInlineCode('At end `code`', 0);
    const { container } = render(<>{elements}</>);

    const code = container.querySelector('code');
    expect(code.textContent).toBe('code');
    expect(container.textContent).toBe('At end code');
  });

  test('handles empty inline code', () => {
    const elements = renderInlineCode('Empty `` code', 0);
    const { container } = render(<>{elements}</>);

    const code = container.querySelector('code');
    expect(code).toBeInTheDocument();
    expect(code.textContent).toBe('');
  });

  test('preserves surrounding text', () => {
    const elements = renderInlineCode('Before `code` after', 0);
    const { container } = render(<>{elements}</>);

    expect(container.textContent).toBe('Before code after');
  });

  test('uses keyOffset for React keys', () => {
    const elements = renderInlineCode('Use `const` here', 5);
    // First element (text) is a string, second element (code) is React element
    const codeElement = elements.find(el => typeof el !== 'string');
    expect(codeElement.key).toContain('5');
  });

  test('escapes special characters in inline code', () => {
    const elements = renderInlineCode("Use `<>&\"'` chars", 0);
    const { container } = render(<>{elements}</>);

    const code = container.querySelector('code');
    expect(code.textContent).toBe("<>&\"'");
  });
});
