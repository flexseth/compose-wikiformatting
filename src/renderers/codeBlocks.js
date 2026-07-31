/**
 * Code Block Rendering
 * Phase 5b: WikiFormatting → React
 *
 * Converts WikiFormatting code blocks to React <pre><code> elements.
 * Handles both fenced code blocks and inline code.
 *
 * Security: React automatically escapes all content - no manual escaping needed.
 *
 * @module renderers/codeBlocks
 */

import React from 'react';

/**
 * Escape HTML entities to prevent XSS
 *
 * NOTE: This function exists for testing purposes to verify escaping behavior.
 * In practice, React's auto-escaping handles this when content is passed as children.
 *
 * @param {string} text - Text to escape
 * @returns {string} Escaped text safe for HTML rendering
 *
 * @example
 * escapeHtml('<script>alert("XSS")</script>')
 * // Returns: '&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;'
 */
export function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')   // Must be first to avoid double-escaping
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

/**
 * Render a code block as React elements
 *
 * Converts WikiFormatting code block to <pre><code> structure.
 * Applies language class if specified for syntax highlighting support.
 *
 * @param {string} content - Code content (React auto-escapes)
 * @param {string|null} language - Language identifier (e.g., 'javascript', 'php')
 * @param {string} key - React key for the element
 * @returns {React.Element} Pre element containing code
 *
 * @example
 * renderCodeBlock('const x = 1;', 'javascript', 'code-1')
 * // Returns: <pre><code className="language-javascript">const x = 1;</code></pre>
 *
 * @example
 * renderCodeBlock('<script>alert(1)</script>', null, 'code-2')
 * // Returns: <pre><code>&lt;script&gt;alert(1)&lt;/script&gt;</code></pre>
 * // (React auto-escapes the content)
 *
 * @security React automatically escapes content passed as children
 */
export function renderCodeBlock(content, language, key) {
  const className = language ? `language-${language}` : '';

  return (
    <pre key={key}>
      <code className={className}>
        {content}
      </code>
    </pre>
  );
}

/**
 * Render inline code segments in text
 *
 * Parses text for inline code (backticks) and converts to <code> elements.
 * Returns array of text and React elements for inline rendering.
 *
 * @param {string} text - Text that may contain inline code
 * @param {number} keyOffset - Starting key number for React elements
 * @returns {Array<string|React.Element>} Array of text and code elements
 *
 * @example
 * renderInlineCode('Use `const` and `let` keywords', 0)
 * // Returns: ['Use ', <code>const</code>, ' and ', <code>let</code>, ' keywords']
 *
 * @example
 * renderInlineCode('Tag: `<script>`', 0)
 * // Returns: ['Tag: ', <code>&lt;script&gt;</code>]
 * // (React auto-escapes the content)
 *
 * @security React automatically escapes content passed as children
 */
export function renderInlineCode(text, keyOffset = 0) {
  const parts = [];
  let keyCounter = keyOffset;

  // Regex to match inline code: `code`
  const inlineCodeRegex = /`([^`]*)`/g;
  let match;
  let lastIndex = 0;

  while ((match = inlineCodeRegex.exec(text)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }

    // Add inline code element (React auto-escapes content)
    const codeContent = match[1];

    parts.push(
      <code key={`inline-code-${keyCounter++}`}>
        {codeContent}
      </code>
    );

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  // If no matches found, return original text as array
  return parts.length > 0 ? parts : [text];
}
