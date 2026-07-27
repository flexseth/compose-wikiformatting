/**
 * Main Markdown to WikiFormatting converter
 *
 * Orchestrates all individual conversion modules to transform
 * Markdown syntax into WikiFormatting syntax for WordPress Trac.
 *
 * @module converters/markdownToWiki
 */

import { convertHeaders } from './headers.js';
import { convertTextFormatting } from './textFormatting.js';
import { convertLinks } from './links.js';

/**
 * Convert Markdown text to WikiFormatting
 *
 * Applies all conversion rules to transform Markdown syntax into
 * WikiFormatting syntax. Conversions are applied in a specific order
 * to prevent conflicts.
 *
 * Currently supported conversions:
 * - Headers (# syntax → = syntax)
 * - Text formatting (bold, italic)
 * - Links (external, wiki)
 *
 * Future phases will add:
 * - Code blocks (fenced, indented)
 * - Blockquotes
 * - Tables
 * - Images
 * - Lists (unordered, ordered, nested)
 *
 * @param {string} markdown - Markdown formatted text
 * @param {Object} [options] - Conversion options
 * @param {boolean} [options.preserveNewlines=true] - Preserve original newlines
 * @returns {string} WikiFormatting text
 * @throws {TypeError} If markdown is not a string
 *
 * @example
 * const result = convertMarkdownToWiki('# Hello\n## World');
 * // Returns: '= Hello =\n== World =='
 *
 * @example
 * const md = '# Title\n\nSome content\n\n## Subtitle';
 * const wiki = convertMarkdownToWiki(md);
 * // Returns: '= Title =\n\nSome content\n\n== Subtitle =='
 *
 * @security All conversions include HTML entity escaping to prevent XSS
 */
export function convertMarkdownToWiki(markdown, options = {}) {
  // Type safety
  if (typeof markdown !== 'string') {
    throw new TypeError('Expected markdown to be a string');
  }

  // Default options
  const config = {
    preserveNewlines: true,
    ...options
  };

  let result = markdown;

  // Phase 1: Convert headers (# → =)
  // Must be done line-by-line to avoid conflicts with other syntax
  result = convertHeaders(result);

  // Phase 4: Convert links FIRST (before text formatting)
  // This prevents text formatting from mangling URLs with underscores
  // Example: Object-oriented_programming would become Object-oriented''programming''
  result = result.split('\n').map(line => convertLinks(line)).join('\n');

  // Phase 3: Convert text formatting (bold, italic)
  // Applied AFTER links so formatting can be applied to link text
  // Links are now in WikiFormatting [url text] format, safe from underscore conversion
  result = result.split('\n').map(line => convertTextFormatting(line)).join('\n');

  // Future phases: Additional conversions will be added here
  // - Code blocks
  // - Blockquotes
  // - Tables
  // - Images
  // - Lists (moved to last - most complex)

  return result;
}
