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
 * Convert Markdown code blocks to WikiFormatting
 *
 * Processes text and converts fenced code blocks from Markdown syntax
 * to WikiFormatting syntax. Handles nested code blocks by matching
 * backtick counts (outer fence must have more backticks than inner).
 *
 * Key features:
 * - Variable backtick counts (3, 4, 5+ backticks)
 * - Language-specific blocks with #! processor notation
 * - Preserves inline code (single backticks) unchanged
 * - Protects code content from other converters
 *
 * @param {string} text - Text with Markdown code blocks
 * @returns {string} Text with WikiFormatting code block syntax
 * @throws {TypeError} If text is not a string
 *
 * @example
 * convertCodeBlocks('```js\nconst x = 1;\n```')
 * // Returns: "{{{#!javascript\nconst x = 1;\n}}}"
 *
 * @example
 * convertCodeBlocks('```\ngeneric code\n```')
 * // Returns: "{{{\ngeneric code\n}}}"
 *
 * @example
 * convertCodeBlocks('````\n```\nnested\n```\n````')
 * // Returns: "{{{\n```\nnested\n```\n}}}"
 *
 * @security
 * - Code content is NOT processed by other converters (headers, links, text formatting)
 * - This converter must run FIRST in the pipeline
 * - Content between {{{ and }}} is treated as verbatim by WikiFormatting
 */
export function convertCodeBlocks(text) {
  // Type check
  if (typeof text !== 'string') {
    throw new TypeError('Text must be a string');
  }

  // Strategy: Find all code fences, match opening/closing by backtick count
  // Process from longest backtick count to shortest (outermost to innermost)

  let result = text;

  // Regex to find fenced code blocks
  // Matches: opening backticks (3+), optional language, newline, optional content, closing backticks
  // (?:^|\n) - Either start of string or newline
  // (`{3,}) - Opening backticks (captured for matching closing fence)
  // ([a-z]*) - Optional language identifier
  // \n - Newline after opening fence
  // ([\s\S]*?) - Content (lazy match, any character including newlines, can be empty)
  // (?:\n)? - Optional newline before closing fence (missing in empty blocks)
  // \1 - Closing backticks (same count as opening)
  // (?=\n|$) - Followed by newline or end of string
  const fencePattern = /(?:^|\n)(`{3,})([a-z]*)\n([\s\S]*?)(?:\n)?\1(?=\n|$)/g;

  result = result.replace(fencePattern, (match, openTicks, lang, content) => {
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

    // If match started with newline, preserve it
    return match[0] === '\n' ? '\n' + wikiBlock : wikiBlock;
  });

  return result;
}
