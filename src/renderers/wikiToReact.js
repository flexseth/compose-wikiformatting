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
 *
 * Future phases will add:
 * - Lists
 * - Links
 * - Code blocks
 * - Blockquotes
 * - Tables
 * - Images
 *
 * @module renderers/wikiToReact
 */

import React from 'react';

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
  // Phase 3.5: Full text formatting support (bold, italic, bold+italic)
  // Order matters: Must check bold+italic (5 quotes) BEFORE bold (3) or italic (2)

  const parts = [];
  let remaining = text;
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

  // Parse inline WikiFormatting in header text
  const formattedContent = parseInlineFormatting(headerText);

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

  lines.forEach((line, index) => {
    if (line.trim() === '') {
      // Empty line - add a line break element
      elements.push(<br key={`br-${index}`} />);
    } else {
      // Try to convert as header
      const element = convertHeaderToReact(line, index);

      if (typeof element === 'string') {
        // Not a header, add as paragraph with inline formatting
        const formattedContent = parseInlineFormatting(element);
        elements.push(
          <p key={`p-${index}`}>{formattedContent}</p>
        );
      } else {
        // Is a header React element
        elements.push(element);
      }
    }
  });

  return elements;
}
