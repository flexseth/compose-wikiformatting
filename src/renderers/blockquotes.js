/**
 * Blockquotes Renderer
 *
 * Renders WikiFormatting blockquote syntax (Discussion Citations) as React components.
 *
 * Renders blockquotes as <blockquote> elements with citation class.
 * Supports nested blockquotes and processes WikiFormatting inside quote content.
 *
 * Supported syntax:
 * - Single-level: > text
 * - Nested: >> text, >>> text
 * - Multi-line: consecutive lines starting with >
 *
 * @module renderers/blockquotes
 */

import React from 'react';

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

  while (i < lines.length && lines[i].startsWith('>')) {
    const line = lines[i];

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
