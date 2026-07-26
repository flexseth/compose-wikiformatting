/**
 * Main Markdown to WikiFormatting converter
 *
 * Orchestrates all individual conversion modules to transform
 * Markdown syntax into WikiFormatting syntax for WordPress Trac.
 *
 * @module converters/markdownToWiki
 */

import { convertHeaders } from './headers.js';

/**
 * Convert Markdown text to WikiFormatting
 *
 * Applies all conversion rules to transform Markdown syntax into
 * WikiFormatting syntax. Conversions are applied in a specific order
 * to prevent conflicts.
 *
 * Currently supported conversions:
 * - Headers (# syntax → = syntax)
 *
 * Future phases will add:
 * - Text formatting (bold, italic, code)
 * - Lists (unordered, ordered, nested)
 * - Links (external, wiki, automatic)
 * - Code blocks (fenced, indented)
 * - Blockquotes
 * - Tables
 * - Images
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

  // Phase 1: Convert headers
  // Must be done line-by-line to avoid conflicts with other syntax
  result = convertHeaders(result);

  // Phase 2+: Additional conversions will be added here as we implement them
  // - Text formatting (bold, italic, code)
  // - Lists
  // - Links
  // - Code blocks
  // - Blockquotes
  // - Tables
  // - Images

  return result;
}
