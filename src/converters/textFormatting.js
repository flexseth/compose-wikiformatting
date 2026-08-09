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

  // Split text into WikiFormatting links and non-links
  // Links: [url text], [[WikiPage]], or Trac links [scheme:value text]
  // Process only non-link parts to avoid mangling URLs with underscores
  const linkPattern = /\[(?:[^\s\]]+)\s+(?:[^\]]+)\]|\[\[[^\]]+\]\]/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = linkPattern.exec(text)) !== null) {
    // Add non-link text before this match (apply formatting)
    if (match.index > lastIndex) {
      const nonLinkText = text.substring(lastIndex, match.index);
      parts.push(applyTextFormatting(nonLinkText));
    }

    // Add the link as-is (no formatting on URLs)
    // But DO format the link text part
    const link = match[0];
    const linkWithFormattedText = formatLinkText(link);
    parts.push(linkWithFormattedText);

    lastIndex = match.index + match[0].length;
  }

  // Add remaining non-link text
  if (lastIndex < text.length) {
    const remainingText = text.substring(lastIndex);
    parts.push(applyTextFormatting(remainingText));
  }

  // If no links found, just apply formatting to whole text
  return parts.length > 0 ? parts.join('') : applyTextFormatting(text);
}

/**
 * Apply text formatting to a string (helper function)
 * @private
 */
function applyTextFormatting(text) {
  // First, protect inline code by extracting it
  const inlineCodePattern = /`([^`]+)`/g;
  const inlineCodeBlocks = [];
  let counter = 0;

  let result = text.replace(inlineCodePattern, (match) => {
    const placeholder = `￿IC${counter}￿`; // Inline Code placeholder
    inlineCodeBlocks.push({ placeholder, content: match });
    counter++;
    return placeholder;
  });

  // Convert bold + italic first (*** or ___) → '''''
  result = result.replace(/\*\*\*(\S(?:.*?\S)?)\*\*\*/g, "'''''$1'''''");
  result = result.replace(/___(\S(?:.*?\S)?)___/g, "'''''$1'''''");

  // Convert bold (**text** or __text__) → '''text'''
  result = result.replace(/\*\*(\S(?:.*?\S)?)\*\*/g, "'''$1'''");
  result = result.replace(/__(\S(?:.*?\S)?)__/g, "'''$1'''");

  // Convert italic (*text* or _text_) → ''text''
  result = result.replace(/\*(\S(?:.*?\S)?)\*/g, "''$1''");
  result = result.replace(/_(\S(?:.*?\S)?)_/g, "''$1''");

  // Restore inline code blocks
  for (const { placeholder, content } of inlineCodeBlocks) {
    result = result.replace(placeholder, content);
  }

  return result;
}

/**
 * Format the text part of a link while preserving the URL
 * @private
 */
function formatLinkText(link) {
  // For external links [url text], format only the text part
  const externalLinkMatch = link.match(/^\[([^\s\]]+)\s+(.+)\]$/);
  if (externalLinkMatch) {
    const url = externalLinkMatch[1];
    const linkText = externalLinkMatch[2];
    return `[${url} ${applyTextFormatting(linkText)}]`;
  }

  // For wiki links [[WikiPage]], no formatting needed
  return link;
}
