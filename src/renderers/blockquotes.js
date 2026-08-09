/**
 * Blockquotes Renderer
 *
 * Renders WikiFormatting blockquote syntax as React components.
 *
 * Two types of blockquotes:
 * 1. Discussion Citations (Phase 6): > text with citation class
 * 2. Standard Blockquotes (Phase 6c): 2-space indent without citation class
 *
 * Discussion Citations syntax:
 * - Single-level: > text
 * - Nested: >> text, >>> text
 * - Multi-line: consecutive lines starting with >
 * - Code blocks inside quotes: > {{{ code }}}
 *
 * Standard Blockquotes syntax:
 * - 2+ space indent: "  text"
 * - Multi-line: consecutive lines with 2+ space indent
 * - Code blocks inside quotes: "  {{{ code }}}"
 *
 * @module renderers/blockquotes
 */

import React from 'react';
import { renderCodeBlock } from './codeBlocks.js';

/**
 * Parse blockquote content that may contain code blocks and inline formatting
 *
 * Processes WikiFormatting inside blockquotes, including:
 * - Code blocks: {{{ code }}}
 * - Inline formatting: bold, italic, links, inline code
 *
 * @param {string} content - Blockquote content to parse
 * @param {string} keyPrefix - Prefix for React keys
 * @returns {Array<React.Element>} Array of React elements
 *
 * @example
 * parseBlockquoteContent('Text with {{{ code }}}', 'quote-1')
 * // Returns: [<span>Text with</span>, <pre><code>code</code></pre>]
 *
 * @security
 * - Code blocks rendered via renderCodeBlock (HTML-escaped)
 * - Inline formatting via parseLinks (URL validation, React auto-escape)
 */
export function parseBlockquoteContent(content, keyPrefix, parseLinksFunction) {
  // If no code blocks present, just parse the content directly with newlines preserved
  if (!content.includes('{{{')) {
    const formatted = parseLinksFunction(content, 0);
    return [<span key={keyPrefix}>{formatted}</span>];
  }

  const lines = content.split('\n');
  const elements = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Check for code block start
    if (line.trim().startsWith('{{{')) {
      // Extract language if present: {{{#!javascript
      const langMatch = line.match(/^\s*{{{#!(\w+)/);
      const language = langMatch ? langMatch[1] : null;

      // Collect code lines until closing }}}
      const codeLines = [];
      let nestingDepth = 0;
      i++; // Move past opening {{{

      while (i < lines.length) {
        const currentLine = lines[i];

        // Check for nested opening
        if (currentLine.trim() === '{{{') {
          nestingDepth++;
          codeLines.push(currentLine);
          i++;
          continue;
        }

        // Check for closing
        if (currentLine.trim() === '}}}') {
          if (nestingDepth > 0) {
            nestingDepth--;
            codeLines.push(currentLine);
            i++;
            continue;
          } else {
            // Found closing bracket at depth 0
            break;
          }
        }

        codeLines.push(currentLine);
        i++;
      }

      // Render code block
      const codeContent = codeLines.join('\n');
      elements.push(
        renderCodeBlock(codeContent, language, `${keyPrefix}-code-${i}`)
      );

      i++; // Move past closing }}}
      continue;
    }

    // Regular text line - process inline formatting
    if (line.trim() !== '') {
      const formatted = parseLinksFunction(line, 0);
      elements.push(
        <span key={`${keyPrefix}-text-${i}`}>{formatted}{'\n'}</span>
      );
    }

    i++;
  }

  return elements;
}

/**
 * Render a blockquote with WikiFormatting citation syntax
 *
 * Creates a <blockquote> element with citation class for Trac-style rendering.
 * Content can be string or React elements (for formatted text inside quotes).
 *
 * @param {string|Array|React.Element} content - Blockquote content
 * @param {number} level - Nesting level (1 = >, 2 = >>, etc.)
 * @param {string} key - React key for the element
 * @returns {React.Element} <blockquote> element
 *
 * @example
 * renderBlockquote('Simple quote', 1, 'quote-1')
 * // Returns: <blockquote className="citation">Simple quote</blockquote>
 *
 * @example
 * renderBlockquote('Nested quote', 2, 'quote-2')
 * // Returns: <blockquote className="citation" data-level={2}>Nested quote</blockquote>
 *
 * @security
 * - React auto-escaping prevents XSS (content passed as children)
 * - No dangerouslySetInnerHTML used
 * - HTML tags in content rendered as text
 */
export function renderBlockquote(content, level, key) {
  return (
    <blockquote key={key} className="citation" data-level={level}>
      {content}
    </blockquote>
  );
}

/**
 * Parse consecutive blockquote lines starting from an index
 *
 * Detects lines starting with > and groups them by nesting level.
 * Stops when encountering a non-blockquote line.
 *
 * @private
 * @param {Array<string>} lines - Array of lines to parse
 * @param {number} startIndex - Index to start parsing from
 * @returns {{blocks: Array<{level: number, content: string}>, endIndex: number}}
 *
 * @example
 * parseBlockquoteLines(['> Quote', '>> Nested', 'Normal'], 0)
 * // Returns: {
 * //   blocks: [
 * //     { level: 1, content: 'Quote' },
 * //     { level: 2, content: 'Nested' }
 * //   ],
 * //   endIndex: 1
 * // }
 */
export function parseBlockquoteLines(lines, startIndex) {
  const blocks = [];
  let i = startIndex;

  while (i < lines.length && lines[i].trim().startsWith('>')) {
    const line = lines[i].trim(); // Trim leading whitespace

    // Count > markers to determine nesting level
    let level = 0;
    let pos = 0;
    while (pos < line.length && line[pos] === '>') {
      level++;
      pos++;
    }

    // Extract content after > markers (skip optional space)
    let content = line.substring(pos);
    if (content.startsWith(' ')) {
      content = content.substring(1);
    }

    blocks.push({ level, content });
    i++;
  }

  return {
    blocks,
    endIndex: i - 1  // Last blockquote line index
  };
}

/**
 * Group consecutive blockquote lines at the same nesting level
 *
 * Combines consecutive blocks with identical nesting levels into single blocks.
 * This creates multi-line blockquotes from separate lines.
 *
 * @private
 * @param {Array<{level: number, content: string}>} blocks - Parsed blockquote blocks
 * @returns {Array<{level: number, content: string}>} Grouped blocks
 *
 * @example
 * groupBlockquotesByLevel([
 *   { level: 1, content: 'Line 1' },
 *   { level: 1, content: 'Line 2' },
 *   { level: 2, content: 'Nested' }
 * ])
 * // Returns: [
 * //   { level: 1, content: 'Line 1\nLine 2' },
 * //   { level: 2, content: 'Nested' }
 * // ]
 */
export function groupBlockquotesByLevel(blocks) {
  if (blocks.length === 0) return [];

  const grouped = [];
  let current = { level: blocks[0].level, content: blocks[0].content };

  for (let i = 1; i < blocks.length; i++) {
    if (blocks[i].level === current.level) {
      // Same level - append content with newline
      current.content += '\n' + blocks[i].content;
    } else {
      // Different level - save current and start new group
      grouped.push(current);
      current = { level: blocks[i].level, content: blocks[i].content };
    }
  }

  grouped.push(current); // Add last group
  return grouped;
}

/**
 * Render a standard blockquote (2-space indent syntax)
 *
 * Creates a <blockquote> element WITHOUT citation class for standard quotes.
 * This differs from Discussion Citations which have className="citation".
 *
 * @param {string|Array|React.Element} content - Blockquote content
 * @param {string} key - React key for the element
 * @returns {React.Element} <blockquote> element
 *
 * @example
 * renderStandardBlockquote('Simple quote', 'quote-1')
 * // Returns: <blockquote>Simple quote</blockquote>
 *
 * @security
 * - React auto-escaping prevents XSS (content passed as children)
 * - No dangerouslySetInnerHTML used
 * - HTML tags in content rendered as text
 */
export function renderStandardBlockquote(content, key) {
  return (
    <blockquote key={key}>
      {content}
    </blockquote>
  );
}

/**
 * Parse consecutive standard blockquote lines (2-space indent)
 *
 * Detects lines starting with 2+ spaces and groups them as blockquote content.
 * Stops when encountering a line without 2+ space indent or an empty line.
 *
 * @param {Array<string>} lines - Array of lines to parse
 * @param {number} startIndex - Index to start parsing from
 * @returns {{content: string, endIndex: number}} Blockquote content and end index
 *
 * @example
 * parseStandardBlockquoteLines(['  Quote line 1', '  Quote line 2', 'Normal'], 0)
 * // Returns: {
 * //   content: 'Quote line 1\nQuote line 2',
 * //   endIndex: 1
 * // }
 */
export function parseStandardBlockquoteLines(lines, startIndex) {
  const contentLines = [];
  let i = startIndex;

  while (i < lines.length) {
    const line = lines[i];

    // Stop on empty line
    if (line.trim() === '') {
      break;
    }

    // Check if line starts with 2+ spaces (standard blockquote)
    // Must have at least 2 leading spaces
    if (line.length >= 2 && line[0] === ' ' && line[1] === ' ') {
      // Remove the 2-space indent (preserve any additional indentation)
      const content = line.substring(2);
      contentLines.push(content);
      i++;
    } else {
      // Non-blockquote line, stop parsing
      break;
    }
  }

  return {
    content: contentLines.join('\n'),
    endIndex: i - 1  // Last blockquote line index
  };
}
