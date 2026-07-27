/**
 * Text Formatting Converter
 *
 * Converts Markdown text formatting to WikiFormatting syntax.
 *
 * Supported conversions:
 * - Bold: **text** or __text__ → '''text'''
 * - Italic: *text* or _text_ → ''text''
 * - Inline code: `code` → `code` (no change)
 * - Strikethrough: ~~text~~ → ~~text~~ (no change)
 *
 * @module converters/textFormatting
 */

/**
 * Convert Markdown text formatting to WikiFormatting
 *
 * Processes a line of text and converts Markdown formatting markers
 * to WikiFormatting syntax. Handles bold, italic, and combinations.
 *
 * @param {string} text - Text with Markdown formatting
 * @returns {string} Text with WikiFormatting syntax
 * @throws {TypeError} If text is not a string
 *
 * @example
 * convertTextFormatting('This is **bold** text')
 * // Returns: "This is '''bold''' text"
 *
 * @example
 * convertTextFormatting('This is *italic* text')
 * // Returns: "This is ''italic'' text"
 *
 * @example
 * convertTextFormatting('This is ***bold and italic***')
 * // Returns: "This is '''''bold and italic'''''"
 *
 * @security
 * - Does not escape HTML - escaping handled by headers.js
 * - No XSS risk as we're only transforming markers
 */
export function convertTextFormatting(text) {
  // Type check
  if (typeof text !== 'string') {
    throw new TypeError('Text must be a string');
  }

  let result = text;

  // Convert bold + italic first (*** or ___) → '''''
  // Must be before individual bold/italic to avoid double conversion
  // Matches content without leading/trailing spaces (or empty)
  result = result.replace(/\*\*\*(\S(?:.*?\S)?)\*\*\*/g, "'''''$1'''''");
  result = result.replace(/\_\_\_(\S(?:.*?\S)?)\_\_\_/g, "'''''$1'''''");

  // Convert bold (**text** or __text__) → '''text'''
  // Matches content without leading/trailing spaces (or empty)
  result = result.replace(/\*\*(\S(?:.*?\S)?)\*\*/g, "'''$1'''");
  result = result.replace(/\_\_(\S(?:.*?\S)?)\_\_/g, "'''$1'''");

  // Convert italic (*text* or _text_) → ''text''
  // Matches content without leading/trailing spaces (or empty)
  result = result.replace(/\*(\S(?:.*?\S)?)\*/g, "''$1''");
  result = result.replace(/\_(\S(?:.*?\S)?)\_/g, "''$1''");

  return result;
}
