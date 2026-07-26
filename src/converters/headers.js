/**
 * Converts Markdown ATX-style headers to WikiFormatting headers
 *
 * Supports headers from level 1 (# ) to level 6 (###### )
 * Handles trailing # characters (optional in Markdown)
 * Includes security measures to prevent XSS attacks
 *
 * @module converters/headers
 */

/**
 * Escape HTML entities to prevent XSS attacks
 *
 * @private
 * @param {string} text - Text to escape
 * @returns {string} Escaped text safe for display
 *
 * @security Prevents XSS by escaping <, >, &, and "
 * @note Single quotes (') are NOT escaped because they're valid WikiFormatting
 *       syntax for italic (''). React handles attribute escaping automatically.
 */
function escapeHtml(text) {
  const entityMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;'
  };

  return String(text).replace(/[&<>"]/g, (char) => entityMap[char]);
}

/**
 * Convert a single Markdown header line to WikiFormatting
 *
 * Converts ATX-style headers (# syntax) to WikiFormatting (= syntax).
 * Supports levels 1-6. Non-header lines are returned unchanged.
 *
 * @param {string} line - A single line of text that may contain a Markdown header
 * @returns {string} The line converted to WikiFormatting if it's a header, unchanged otherwise
 * @throws {TypeError} If line is not a string
 *
 * @example
 * convertHeader('# Hello World')
 * // Returns: '= Hello World ='
 *
 * @example
 * convertHeader('### Heading with trailing ###')
 * // Returns: '=== Heading with trailing ==='
 *
 * @example
 * convertHeader('Not a header')
 * // Returns: 'Not a header'
 *
 * @security Escapes HTML entities in header text to prevent XSS
 */
export function convertHeader(line) {
  // Type safety
  if (typeof line !== 'string') {
    throw new TypeError('Expected line to be a string');
  }

  // Match ATX-style headers: # Header or # Header # or # Header#
  // Must have space after opening # to be valid Markdown
  // Trailing # characters are optional and may or may not have space before them
  const headerRegex = /^(#{1,6})\s+(.+?)(?:\s*#+)?$/;
  const match = line.match(headerRegex);

  if (!match) {
    // Not a header, return unchanged
    return line;
  }

  const level = match[1].length; // Number of # characters
  let headerText = match[2].trim(); // Header text without # characters

  // Remove any trailing # characters that weren't caught by the regex
  headerText = headerText.replace(/#+$/, '').trim();

  // Security: Escape HTML entities in header text
  const safeText = escapeHtml(headerText);

  // Create WikiFormatting header with matching number of = signs
  const wikiEquals = '='.repeat(level);
  return `${wikiEquals} ${safeText} ${wikiEquals}`;
}

/**
 * Convert all Markdown headers in a multi-line string to WikiFormatting
 *
 * Processes each line and converts any ATX-style headers to WikiFormatting.
 * Non-header lines are preserved unchanged. Line endings are preserved.
 *
 * @param {string} markdown - Multi-line Markdown text
 * @returns {string} Text with all headers converted to WikiFormatting
 * @throws {TypeError} If markdown is not a string
 *
 * @example
 * const md = `# Title\nSome text\n## Subtitle`;
 * convertHeaders(md);
 * // Returns: '= Title =\nSome text\n== Subtitle =='
 *
 * @example
 * const md = '### Level 3\n\nParagraph\n\n#### Level 4';
 * convertHeaders(md);
 * // Returns: '=== Level 3 ===\n\nParagraph\n\n==== Level 4 ===='
 *
 * @security Each header is individually escaped to prevent XSS
 */
export function convertHeaders(markdown) {
  // Type safety
  if (typeof markdown !== 'string') {
    throw new TypeError('Expected markdown to be a string');
  }

  // Split into lines, convert each, rejoin
  return markdown
    .split('\n')
    .map(line => convertHeader(line))
    .join('\n');
}
