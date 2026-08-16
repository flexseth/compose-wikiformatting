/**
 * Converts WikiFormatting syntax to React components
 *
 * Parses WikiFormatting markup and converts it directly to React elements.
 * This is safer than HTML injection and more idiomatic React.
 *
 * Currently supported:
 * - Headers (= syntax) with all variations:
 *   - With/without trailing equals
 *   - Inline formatting (italic, bold, etc.)
 *   - Explicit IDs
 *   - Auto-generated IDs
 *   - Section anchors
 * - Text formatting:
 *   - Bold ('''text''')
 *   - Italic (''text'')
 *   - Bold+Italic ('''''text''''')
 * - Links (Phase 4b):
 *   - External links: [url text]
 *   - Wiki links: [[WikiPage]]
 *   - URL scheme validation (http, https, Trac-specific)
 *   - Links with inline formatting
 * - Code blocks (Phase 5b):
 *   - Fenced code blocks: {{{ / }}}
 *   - Language-specific blocks: {{{#!lang
 *   - HTML escaping (XSS prevention)
 *   - Inline code: `code`
 * - Blockquotes (Phase 6b):
 *   - Discussion Citations: > text
 *   - Nested blockquotes: >> text, >>> text
 *   - Formatting inside blockquotes (bold, italic, links)
 *   - React auto-escaping for XSS prevention
 * - Tables (Phase 7b):
 *   - WikiFormatting table syntax: || cell ||
 *   - Header rows ('''Header''') render as <thead>
 *   - Regular rows render as <tbody>
 *   - Formatting inside cells (bold, italic, links, code)
 *   - React-safe rendering (no dangerouslySetInnerHTML)
 *
 * Future phases will add:
 * - Lists
 * - Images
 *
 * @module renderers/wikiToReact
 */

import React from 'react';
import { renderCodeBlock, renderInlineCode } from './codeBlocks.js';
import {
  renderBlockquote,
  parseBlockquoteLines,
  groupBlockquotesByLevel,
  parseBlockquoteContent,
  renderStandardBlockquote,
  parseStandardBlockquoteLines
} from './blockquotes.js';
import { isTableRow, parseTable, renderTable } from './tables.js';

/**
 * Build nested blockquote structure from grouped blocks
 *
 * Takes an array of blocks with level information and creates a properly
 * nested React element structure where higher-level blockquotes contain
 * lower-level ones (e.g., level 2 inside level 1).
 *
 * @private
 * @param {Array<{level: number, content: string}>} grouped - Grouped blockquote blocks
 * @param {number} keyPrefix - Prefix for React keys
 * @param {Function} parseLinks - Link parsing function
 * @returns {Array<React.Element>} Array of top-level blockquote elements
 *
 * @example
 * buildNestedBlockquotes([
 *   { level: 1, content: 'Parent' },
 *   { level: 2, content: 'Child' },
 *   { level: 1, content: 'Parent 2' }
 * ], 0, parseLinks)
 * // Returns: [
 * //   <blockquote level={1}>Parent<blockquote level={2}>Child</blockquote></blockquote>,
 * //   <blockquote level={1}>Parent 2</blockquote>
 * // ]
 */
function buildNestedBlockquotes(grouped, keyPrefix, parseLinks) {
  if (grouped.length === 0) return [];

  const result = [];
  let i = 0;

  while (i < grouped.length) {
    const currentBlock = grouped[i];
    const formattedContent = parseBlockquoteContent(
      currentBlock.content,
      `quote-${keyPrefix}-${i}`,
      parseLinks
    );

    // Look ahead to see if next blocks should be nested inside this one
    const children = [];
    let j = i + 1;

    while (j < grouped.length && grouped[j].level > currentBlock.level) {
      // Collect all blocks that should be nested
      const nestedGroup = [];
      const targetLevel = grouped[j].level;

      while (j < grouped.length && grouped[j].level >= targetLevel) {
        nestedGroup.push(grouped[j]);
        j++;
      }

      // Recursively build nested structure
      const nested = buildNestedBlockquotes(nestedGroup, `${keyPrefix}-${i}`, parseLinks);
      children.push(...nested);
    }

    // Create blockquote with content and any nested children
    const allContent = [...formattedContent, ...children];
    const quote = renderBlockquote(
      allContent,
      currentBlock.level,
      `quote-${keyPrefix}-${i}`
    );

    result.push(quote);
    i = j; // Move to next block after nested ones
  }

  return result;
}

/**
 * Generate an ID from heading text
 *
 * Creates a URL-safe ID by removing non-alphanumeric characters
 * and replacing spaces with nothing (Trac style).
 *
 * @private
 * @param {string} text - Heading text (may contain WikiFormatting)
 * @returns {string} URL-safe ID
 *
 * @example
 * generateId('About this')
 * // Returns: 'Aboutthis'
 *
 * @example
 * generateId("Level 3 (note)")
 * // Returns: 'Level3note'
 */
function generateId(text) {
  // Remove WikiFormatting markup (simple version for Phase 2)
  let plainText = text
    .replace(/'{2,5}/g, '') // Remove bold/italic markers
    .replace(/`/g, '')       // Remove inline code markers
    .trim();

  // Remove special characters except alphanumeric, spaces, and hyphens
  // Then remove spaces (Trac style)
  return plainText
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '')
    .replace(/-+/g, '-');
}

/**
 * Validate URL scheme for security
 *
 * Checks if a URL uses an allowed protocol scheme.
 * Rejects dangerous protocols like javascript:, data:, vbscript:, file:
 *
 * @private
 * @param {string} url - URL to validate
 * @returns {boolean} True if URL scheme is safe, false otherwise
 *
 * @example
 * isValidUrlScheme('https://example.com')
 * // Returns: true
 *
 * @example
 * isValidUrlScheme('wiki:WikiPageName')
 * // Returns: true
 *
 * @example
 * isValidUrlScheme('javascript:alert(1)')
 * // Returns: false
 *
 * @security Allowlist approach: http, https, and Trac-specific schemes only
 *
 * @designdecision Protocol-relative URLs (//example.com) are ALLOWED BY DESIGN
 * Rationale: This is a composition tool for creating Trac content. Trac enforces
 * security when content is published. No security risk in single-user preview
 * context. Blocking would prevent legitimate use cases without security benefit.
 * Security boundary: Trac (publication), not this tool (composition).
 * See: DECISIONS_phase4b_security.md
 */
function isValidUrlScheme(url) {
  // Allowlist of safe URL schemes
  // External: http, https
  // Trac-specific: wiki, ticket, changeset, source, comment
  const allowedSchemes = ['http:', 'https:', 'wiki:', 'ticket:', 'changeset:', 'source:', 'comment:'];

  try {
    // Use URL constructor for proper parsing
    const parsed = new URL(url);
    return allowedSchemes.includes(parsed.protocol);
  } catch (e) {
    // URL constructor doesn't recognize Trac schemes, check manually
    for (const scheme of allowedSchemes) {
      if (url.startsWith(scheme)) {
        return true;
      }
    }
    // If URL parsing fails and it's not a Trac scheme, treat as relative URL (safe)
    // Relative URLs like "/wiki/Page" don't have a protocol
    // Note: This allows protocol-relative URLs (//example.com) - see @designdecision
    return !url.includes(':') || url.startsWith('/');
  }
}

/**
 * Parse links in WikiFormatting text to React elements
 *
 * Handles both external links [url text] and wiki links [[WikiPage]].
 * Validates URL schemes for security.
 *
 * @private
 * @param {string} text - Text that may contain links
 * @param {number} keyOffset - Starting key number for React elements
 * @returns {Array<string|React.Element>} Array of text and React elements
 *
 * @example
 * parseLinks('[https://example.com Example]', 0)
 * // Returns: [<a href="https://example.com">Example</a>]
 *
 * @example
 * parseLinks('[[WikiPage]]', 0)
 * // Returns: [<a href="/wiki/WikiPage">WikiPage</a>]
 *
 * @security
 * - Validates URL schemes (http, https, Trac-specific)
 * - React auto-escapes text content
 * - href attributes are validated before rendering
 */
export function parseLinks(text, keyOffset = 0) {
  const parts = [];
  let keyCounter = keyOffset;

  // Combined regex for external links [url text] and wiki links [[WikiPage]]
  // Non-greedy matching for link content
  const linkRegex = /\[\[([^\]]+)\]\]|\[([^\s\]]+)\s+([^\]]+)\]/g;
  let match;
  let lastIndex = 0;

  while ((match = linkRegex.exec(text)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      const beforeText = text.substring(lastIndex, match.index);
      // Parse inline formatting in the text before the link
      parts.push(...parseInlineFormatting(beforeText));
    }

    if (match[1] !== undefined) {
      // Wiki link: [[WikiPage]]
      const pageName = match[1];

      // User-friendly validation: Reject path traversal sequences in wiki page names
      // Wiki pages use identifiers, not filesystem paths (../ is not valid wiki syntax)
      // This helps catch errors and aligns with Trac behavior
      // See: DECISIONS_phase4b_security.md - Design Decision #2
      if (pageName.includes('../') || pageName.includes('..\\')) {
        // Render as plain text to make invalid page name obvious
        parts.push(`[[${pageName}]]`);
        lastIndex = match.index + match[0].length;
        continue;
      }

      parts.push(
        <a
          key={`wikilink-${keyCounter++}`}
          href={`/wiki/${pageName}`}
        >
          {pageName}
        </a>
      );
    } else if (match[2] !== undefined && match[3] !== undefined) {
      // External link: [url text]
      const url = match[2];
      const linkText = match[3];

      // Validate URL scheme
      if (isValidUrlScheme(url)) {
        // Parse inline formatting in link text (bold/italic)
        const formattedLinkText = parseInlineFormatting(linkText);

        parts.push(
          <a
            key={`link-${keyCounter++}`}
            href={url}
          >
            {formattedLinkText}
          </a>
        );
      } else {
        // Dangerous URL - render as plain text to preserve content but prevent execution
        parts.push(`[${url} ${linkText}]`);
      }
    }

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    const afterText = text.substring(lastIndex);
    parts.push(...parseInlineFormatting(afterText));
  }

  // If no matches found, parse for inline formatting
  return parts.length > 0 ? parts : parseInlineFormatting(text);
}

/**
 * Parse inline WikiFormatting to React elements
 *
 * Handles inline formatting like italic, bold, and bold+italic within text.
 * Supports all WikiFormatting text formatting syntax.
 *
 * @private
 * @param {string} text - Text that may contain WikiFormatting
 * @returns {Array<string|React.Element>} Array of text and React elements
 *
 * @example
 * parseInlineFormatting("About ''this''")
 * // Returns: ['About ', <em key="...">this</em>]
 *
 * @example
 * parseInlineFormatting("Use '''bold''' for emphasis")
 * // Returns: ['Use ', <strong key="...">bold</strong>, ' for emphasis']
 *
 * @example
 * parseInlineFormatting("This is '''''very important'''''")
 * // Returns: ['This is ', <strong key="..."><em>very important</em></strong>]
 *
 * @security All text content is rendered as text nodes by React (auto-escaped)
 */
function parseInlineFormatting(text) {
  // Phase 5b: Added inline code support
  // Phase 3.5: Full text formatting support (bold, italic, bold+italic)
  // Priority order:
  // 1. Inline code (`code`) - processed FIRST to protect content
  // 2. Bold+Italic ('''''text''''')
  // 3. Bold ('''text''')
  // 4. Italic (''text'')

  // First, check if text contains inline code
  if (text.includes('`')) {
    // Render inline code - this will parse backticks and return array of text/code elements
    const inlineCodeParts = renderInlineCode(text, 0);

    // Now process each text part for bold/italic, leaving code elements untouched
    const finalParts = [];
    inlineCodeParts.forEach(part => {
      if (typeof part === 'string') {
        // Text part - process for bold/italic
        const formattedParts = parseTextFormatting(part);
        finalParts.push(...formattedParts);
      } else {
        // React element (code) - keep as-is
        finalParts.push(part);
      }
    });

    return finalParts;
  }

  // No inline code - process for bold/italic only
  return parseTextFormatting(text);
}

/**
 * Parse text for bold/italic formatting only
 * Helper function used by parseInlineFormatting
 *
 * @private
 * @param {string} text - Text to parse for bold/italic
 * @returns {Array<string|React.Element>} Array of text and formatting elements
 */
function parseTextFormatting(text) {
  const parts = [];
  let keyCounter = 0;

  // Combined regex that matches in priority order:
  // 1. Bold+Italic: '''''text'''''
  // 2. Bold: '''text'''
  // 3. Italic: ''text''
  const formattingRegex = /'''''(.+?)'''''|'''(.+?)'''|''(.+?)''/g;
  let match;
  let lastIndex = 0;

  while ((match = formattingRegex.exec(text)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }

    // Determine which group matched and create appropriate element
    if (match[1] !== undefined) {
      // Bold+Italic (group 1): '''''text'''''
      parts.push(
        <strong key={`bold-italic-${keyCounter++}`}>
          <em>{match[1]}</em>
        </strong>
      );
    } else if (match[2] !== undefined) {
      // Bold (group 2): '''text'''
      parts.push(
        <strong key={`bold-${keyCounter++}`}>{match[2]}</strong>
      );
    } else if (match[3] !== undefined) {
      // Italic (group 3): ''text''
      parts.push(
        <em key={`italic-${keyCounter++}`}>{match[3]}</em>
      );
    }

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  // If no matches found, return original text
  return parts.length > 0 ? parts : [text];
}

/**
 * Convert a single WikiFormatting header line to React element
 *
 * Converts WikiFormatting headers (= syntax) to React heading elements.
 * Supports all Trac heading variations.
 *
 * @private
 * @param {string} line - A single line of text that may contain a WikiFormatting header
 * @param {number} lineIndex - Line index for React keys
 * @returns {React.Element|string} React heading element or escaped text
 *
 * @example
 * convertHeaderToReact('= Hello World =', 0)
 * // Returns: <h1 className="section" id="HelloWorld">Hello World<a...>¶</a></h1>
 */
function convertHeaderToReact(line, lineIndex) {
  // Regex to match all heading variations
  const headerRegex = /^(={1,6})\s+(.+?)(?:\s+(={1,6}))?\s*(?:#([\w-]+))?\s*$/;
  const match = line.match(headerRegex);

  if (!match) {
    // Not a header, return as text
    return line;
  }

  const level = match[1].length; // Number of leading = characters
  let headerText = match[2].trim(); // Header text
  const trailingEquals = match[3]; // Trailing = (if present)
  const explicitId = match[4]; // Explicit ID after #

  // Verify trailing equals match leading equals (if present)
  if (trailingEquals && trailingEquals.length !== level) {
    // Mismatched equals, not a valid header
    return line;
  }

  // Generate ID (explicit or auto-generated)
  const headingId = explicitId || generateId(headerText);

  // Parse inline WikiFormatting and links in header text
  const formattedContent = parseLinks(headerText, 0);

  // Create the heading element
  const HeadingTag = `h${level}`;

  return React.createElement(
    HeadingTag,
    {
      key: `header-${lineIndex}`,
      className: 'section',
      id: headingId
    },
    formattedContent,
    <a key="anchor" className="anchor" href={`#${headingId}`}> ¶</a>
  );
}

/**
 * Convert WikiFormatting text to React elements
 *
 * Parses WikiFormatting markup and converts it to React components.
 * Processes line-by-line to handle different syntax elements.
 *
 * Currently supported:
 * - Headers (= syntax → <h1> through <h6>) with all variations
 * - Text formatting (bold, italic, bold+italic) in headers and body text
 *
 * @param {string} wikiText - WikiFormatting text
 * @param {Object} [options] - Rendering options
 * @param {boolean} [options.preserveNewlines=true] - Preserve line breaks
 * @returns {Array<React.Element|string>} Array of React elements
 * @throws {TypeError} If wikiText is not a string
 *
 * @example
 * const elements = convertWikiToReact('= Title =\n\n== Subtitle ==');
 * // Returns: [<h1...>Title</h1>, '', <h2...>Subtitle</h2>]
 *
 * @example
 * const elements = convertWikiToReact("Use '''bold''' and ''italic'' text");
 * // Returns: [<p>['Use ', <strong>bold</strong>, ' and ', <em>italic</em>, ' text']</p>]
 *
 * @security All text content is rendered as React text nodes (auto-escaped)
 */
export function convertWikiToReact(wikiText, options = {}) {
  // Type safety
  if (typeof wikiText !== 'string') {
    throw new TypeError('Expected wikiText to be a string');
  }

  // Default options
  const config = {
    preserveNewlines: true,
    ...options
  };

  // Handle empty input
  if (!wikiText.trim()) {
    return [];
  }

  // Process line by line
  const lines = wikiText.split('\n');
  const elements = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Check if line starts a code block (with optional leading whitespace)
    if (line.trim().startsWith('{{{')) {
      // Extract language if present: {{{#!javascript
      const langMatch = line.match(/^\s*{{{#!(\w+)/);
      const language = langMatch ? langMatch[1] : null;

      // Collect code lines until closing }}}
      // Handle nested code blocks by tracking depth
      const codeLines = [];
      let nestingDepth = 0;
      i++; // Move past opening {{{

      while (i < lines.length) {
        const currentLine = lines[i];

        // Check for nested opening {{{
        if (currentLine.trim().startsWith('{{{')) {
          nestingDepth++;
          codeLines.push(currentLine);
          i++;
          continue;
        }

        // Check for closing }}}
        if (currentLine.trim().startsWith('}}}')) {
          if (nestingDepth > 0) {
            // Nested closing - treat as content
            nestingDepth--;
            codeLines.push(currentLine);
            i++;
            continue;
          } else {
            // Actual closing delimiter for this block
            break;
          }
        }

        // Regular content line
        codeLines.push(currentLine);
        i++;
      }

      // Render code block
      const content = codeLines.join('\n');
      elements.push(renderCodeBlock(content, language, `code-${i}`));

      i++; // Move past closing }}}
      continue;
    }

    // Check if line starts a Discussion Citation blockquote (> marker)
    if (line.trim().startsWith('>')) {
      const { blocks, endIndex } = parseBlockquoteLines(lines, i);
      const grouped = groupBlockquotesByLevel(blocks);

      // Build nested blockquote structure
      const nestedQuotes = buildNestedBlockquotes(grouped, i, parseLinks);
      elements.push(...nestedQuotes);

      i = endIndex + 1;
      continue;
    }

    // Check if line starts a Standard Blockquote (2+ space indent)
    // Must have at least 2 leading spaces and not be empty
    if (line.length >= 2 && line[0] === ' ' && line[1] === ' ' && line.trim() !== '') {
      const { content, endIndex } = parseStandardBlockquoteLines(lines, i);

      // Parse blockquote content (handles code blocks and inline formatting)
      const formattedContent = parseBlockquoteContent(content, `std-quote-${i}`, parseLinks);

      // Render standard blockquote (no citation class)
      const quote = renderStandardBlockquote(formattedContent, `std-quote-${i}`);
      elements.push(quote);

      i = endIndex + 1;
      continue;
    }

    // Check if line starts a table (|| ... ||)
    if (isTableRow(line)) {
      const { rows, endIndex } = parseTable(lines, i);

      // Render table with inline content parsing
      const table = renderTable(rows, (cellContent) => parseLinks(cellContent, 0));
      elements.push(table);

      i = endIndex + 1;
      continue;
    }

    // Check for empty line
    if (line.trim() === '') {
      // Empty line - add a line break element
      elements.push(<br key={`br-${i}`} />);
    } else {
      // Try to convert as header
      const element = convertHeaderToReact(line, i);

      if (typeof element === 'string') {
        // Not a header, add as paragraph with inline formatting and links
        const formattedContent = parseLinks(element, 0);
        elements.push(
          <p key={`p-${i}`}>{formattedContent}</p>
        );
      } else {
        // Is a header React element
        elements.push(element);
      }
    }

    i++;
  }

  return elements;
}
