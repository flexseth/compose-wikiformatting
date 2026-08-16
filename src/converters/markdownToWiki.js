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
import { extractCodeBlocks, restoreCodeBlocks } from './codeBlocks.js';
import { convertBlockquotes } from './blockquotes.js';
import { convertTables } from './tables.js';

/**
 * Convert Markdown text to WikiFormatting
 *
 * Applies all conversion rules to transform Markdown syntax into
 * WikiFormatting syntax. Conversions are applied in a specific order
 * to prevent conflicts.
 *
 * Currently supported conversions:
 * - Code blocks (fenced, language-specific)
 * - Tables (pipe tables → || syntax)
 * - Headers (# syntax → = syntax)
 * - Blockquotes (> syntax, identical in both formats)
 * - Text formatting (bold, italic)
 * - Links (external, wiki)
 *
 * Future phases will add:
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

  // Phase 5: Extract code blocks FIRST (protect content with placeholders)
  // CRITICAL: Code content must NOT be processed by other converters
  // Placeholders prevent headers, links, text formatting from touching code block content
  const { text: textWithPlaceholders, blocks: codeBlocks } = extractCodeBlocks(result);
  result = textWithPlaceholders;

  // Phase 7: Convert tables (| → ||)
  // Must be done before text formatting so formatting in cells gets converted
  // Headers in table cells won't be converted because they don't start at line beginning
  result = convertTables(result);

  // Phase 1: Convert headers (# → =)
  // Must be done line-by-line to avoid conflicts with other syntax
  result = convertHeaders(result);

  // Phase 6: Convert blockquotes (> → >, pass-through)
  // Markdown and WikiFormatting use identical syntax (Discussion Citations)
  // This maintains pipeline consistency and provides type validation
  result = convertBlockquotes(result);

  // Phase 4: Convert links (before text formatting)
  // This prevents text formatting from mangling URLs with underscores
  // Example: Object-oriented_programming would become Object-oriented''programming''
  result = result.split('\n').map(line => convertLinks(line)).join('\n');

  // Phase 3: Convert text formatting (bold, italic)
  // Applied AFTER links so formatting can be applied to link text
  // Links are now in WikiFormatting [url text] format, safe from underscore conversion
  result = result.split('\n').map(line => convertTextFormatting(line)).join('\n');

  // Phase 5 (final): Restore code blocks from placeholders
  // Code blocks now contain original content, converted to WikiFormatting but unmodified
  result = restoreCodeBlocks(result, codeBlocks);

  // Future phases: Additional conversions will be added here
  // - Images
  // - Lists (moved to last - most complex)

  return result;
}
