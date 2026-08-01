/**
 * Blockquotes Converter
 *
 * Converts Markdown blockquote syntax to WikiFormatting citation syntax.
 *
 * Since Markdown and WikiFormatting both use the > marker for blockquotes
 * (WikiFormatting calls them "Discussion Citations"), no actual conversion
 * is needed. This function primarily provides type safety and maintains
 * consistency with the converter pipeline.
 *
 * Supported syntax (identical in both formats):
 * - Single-level blockquotes: > text
 * - Nested blockquotes: >> text, >>> text, etc.
 * - Multi-line blockquotes: consecutive lines starting with >
 *
 * @module converters/blockquotes
 */

/**
 * Convert Markdown blockquotes to WikiFormatting citation syntax
 *
 * Preserves Markdown > syntax as-is since WikiFormatting Discussion Citations
 * use identical syntax. This function provides type validation and pipeline
 * consistency.
 *
 * @param {string} text - Text with Markdown blockquotes
 * @returns {string} Text with WikiFormatting citation syntax (unchanged)
 * @throws {TypeError} If text is not a string
 *
 * @example
 * convertBlockquotes('> Simple quote')
 * // Returns: '> Simple quote'
 *
 * @example
 * convertBlockquotes('> Line 1\n> Line 2')
 * // Returns: '> Line 1\n> Line 2'
 *
 * @example
 * convertBlockquotes('>> Nested\n> Parent')
 * // Returns: '>> Nested\n> Parent'
 *
 * @example
 * convertBlockquotes('> Quote with **bold** text')
 * // Returns: '> Quote with **bold** text'
 *
 * @security
 * - No HTML escaping needed (handled by renderer)
 * - No XSS risk (text-to-text transformation)
 * - Content remains unchanged
 */
export function convertBlockquotes(text) {
  // Type validation
  if (typeof text !== 'string') {
    throw new TypeError('Text must be a string');
  }

  // Pass-through: Markdown > === WikiFormatting Discussion Citation >
  // No conversion needed
  return text;
}
