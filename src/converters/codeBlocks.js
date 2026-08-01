/**
 * Code Blocks Converter
 *
 * Converts Markdown code block syntax to WikiFormatting syntax.
 *
 * Supported conversions:
 * - Fenced code blocks: ```lang → {{{#!lang
 * - Generic code blocks: ``` → {{{ / }}}
 * - Inline code: `code` → `code` (no change - same syntax)
 * - Nested blocks: 4+ backticks for outer fence containing inner ```
 *
 * @module converters/codeBlocks
 */

/**
 * Language normalization map
 * Maps common language aliases to their canonical WikiFormatting names
 */
const LANGUAGE_MAP = {
  'js': 'javascript',
  'jsx': 'javascript',
  'ts': 'javascript',
  'typescript': 'javascript',
  'sh': 'bash',
  'shell': 'bash',
  'md': 'markdown',
};

/**
 * Normalize language identifier for WikiFormatting
 *
 * @param {string} lang - Language identifier from Markdown fence
 * @returns {string} Normalized language name
 * @private
 */
function normalizeLanguage(lang) {
  return LANGUAGE_MAP[lang.toLowerCase()] || lang.toLowerCase();
}

/**
 * Extract code blocks and replace with placeholders
 *
 * Extracts all Markdown code blocks, converts them to WikiFormatting,
 * and replaces them with unique placeholders. This protects code block
 * content from being processed by other converters.
 *
 * @param {string} text - Text with Markdown code blocks
 * @returns {{text: string, blocks: Array<{placeholder: string, content: string}>}}
 * @throws {TypeError} If text is not a string
 *
 * @example
 * extractCodeBlocks('```js\ncode\n```')
 * // Returns: { text: '￾￾CODEBLOCK0￾￾', blocks: [{ placeholder: '￾￾CODEBLOCK0￾￾', content: '{{{#!javascript\ncode\n}}}' }] }
 */
export function extractCodeBlocks(text) {
  // Type check
  if (typeof text !== 'string') {
    throw new TypeError('Text must be a string');
  }

  const blocks = [];
  // Use placeholder format that won't trigger other converters:
  // - No # (headers)
  // - No * or _ (text formatting)
  // - No [ ] ( ) (links)
  const placeholderPrefix = '￾￾CODEBLOCK';
  const placeholderSuffix = '￾￾';

  let counter = 0;

  // Regex to find fenced code blocks
  // (?:^|\n) - Either start of string or newline
  // (`{3,}) - Opening backticks (captured for matching closing fence)
  // ([a-zA-Z]*) - Optional language identifier (case-insensitive)
  // \n - Newline after opening fence
  // ([\s\S]*?) - Content (lazy match, any character including newlines, can be empty)
  // (?:\n)? - Optional newline before closing fence (missing in empty blocks)
  // \1 - Closing backticks (same count as opening)
  // (?=\n|$) - Followed by newline or end of string
  const fencePattern = /(?:^|\n)(`{3,})([a-zA-Z]*)\n([\s\S]*?)(?:\n)?\1(?=\n|$)/g;

  const textWithPlaceholders = text.replace(fencePattern, (match, openTicks, lang, content) => {
    // Build WikiFormatting block
    let wikiBlock = '{{{';

    // Add language processor if specified
    if (lang) {
      const normalizedLang = normalizeLanguage(lang);
      wikiBlock += `#!${normalizedLang}`;
    }

    // Add content with appropriate newlines
    // Empty blocks: {{{ \n }}}
    // Non-empty blocks: {{{ \n content \n }}}
    if (content) {
      wikiBlock += '\n' + content + '\n}}}';
    } else {
      wikiBlock += '\n}}}';
    }

    // Create unique placeholder
    const placeholder = `${placeholderPrefix}${counter}${placeholderSuffix}`;
    counter++;

    // Store block with placeholder
    blocks.push({ placeholder, content: wikiBlock });

    // Preserve leading newline if present
    return match[0] === '\n' ? '\n' + placeholder : placeholder;
  });

  return { text: textWithPlaceholders, blocks };
}

/**
 * Restore code blocks from placeholders
 *
 * Replaces placeholders with their corresponding WikiFormatting code blocks.
 *
 * @param {string} text - Text with placeholders
 * @param {Array<{placeholder: string, content: string}>} blocks - Code blocks to restore
 * @returns {string} Text with code blocks restored
 *
 * @example
 * restoreCodeBlocks('￾￾CODEBLOCK0￾￾', [{ placeholder: '￾￾CODEBLOCK0￾￾', content: '{{{#!javascript\ncode\n}}}' }])
 * // Returns: '{{{#!javascript\ncode\n}}}'
 */
export function restoreCodeBlocks(text, blocks) {
  let result = text;

  for (const { placeholder, content } of blocks) {
    // Use a global replace to handle cases where placeholder might appear multiple times
    result = result.split(placeholder).join(content);
  }

  return result;
}

/**
 * Convert Markdown code blocks to WikiFormatting
 *
 * Convenience function that extracts code blocks and immediately restores them.
 * For pipeline use, prefer extractCodeBlocks/restoreCodeBlocks to protect content.
 *
 * @param {string} text - Text with Markdown code blocks
 * @returns {string} Text with WikiFormatting code block syntax
 * @throws {TypeError} If text is not a string
 *
 * @example
 * convertCodeBlocks('```js\nconst x = 1;\n```')
 * // Returns: "{{{#!javascript\nconst x = 1;\n}}}"
 *
 * @deprecated Use extractCodeBlocks/restoreCodeBlocks in conversion pipelines
 */
export function convertCodeBlocks(text) {
  const { text: textWithPlaceholders, blocks } = extractCodeBlocks(text);
  return restoreCodeBlocks(textWithPlaceholders, blocks);
}
