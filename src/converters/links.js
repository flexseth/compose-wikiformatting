/**
 * Links Converter
 *
 * Converts Markdown link syntax to WikiFormatting syntax.
 *
 * Supported conversions:
 * - External links: [text](url) → [url text]
 * - Wiki links: [[WikiPage]] → [[WikiPage]] (no change)
 * - Automatic URLs: http://example.com → http://example.com (no change)
 *
 * @module converters/links
 */

/**
 * Convert Markdown links to WikiFormatting
 *
 * Processes a line of text and converts Markdown link syntax
 * to WikiFormatting syntax. Handles external links and preserves
 * wiki links and automatic URLs.
 *
 * @param {string} text - Text with Markdown links
 * @returns {string} Text with WikiFormatting link syntax
 * @throws {TypeError} If text is not a string
 *
 * @example
 * convertLinks('[Click here](http://example.com)')
 * // Returns: "[http://example.com Click here]"
 *
 * @example
 * convertLinks('See [[WikiPage]] for details')
 * // Returns: "See [[WikiPage]] for details"
 *
 * @example
 * convertLinks('Visit http://example.com directly')
 * // Returns: "Visit http://example.com directly"
 *
 * @security
 * - URL validation handled by renderer (not converter)
 * - Converter only transforms syntax
 * - No HTML injection risk in text-to-text transformation
 */
export function convertLinks(text) {
  // Type check
  if (typeof text !== 'string') {
    throw new TypeError('Text must be a string');
  }

  let result = text;

  // Convert Markdown external links: [text](url) → [url text]
  // Non-greedy matching to handle multiple links per line
  // Matches: [any text](any url)
  // Convert Markdown external links [text](url) → WikiFormatting [url text]
  // Lazy match (.*?) with lookahead for space/punctuation/bracket/end
  // This handles URLs with parentheses (Wikipedia-style) while stopping at the right )
  // Skip conversion if URL is empty (keeps malformed [text]() as-is)
  result = result.replace(/\[([^\]]+)\]\((.+?)\)(?=\s|[,.\]!?;:]|\[|$)/g, '[$2 $1]');

  // Wiki links [[WikiPage]] and automatic URLs are already compatible
  // No conversion needed - they use the same syntax in both formats

  return result;
}
