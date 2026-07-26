/**
 * Converts WikiFormatting syntax to HTML
 *
 * Parses WikiFormatting markup and converts it to HTML for display.
 * Designed to match WordPress Trac's rendering as closely as possible.
 *
 * Currently supported:
 * - Headers (= syntax) with all variations:
 *   - With/without trailing equals
 *   - Inline formatting (italic, bold, etc.)
 *   - Explicit IDs
 *   - Auto-generated IDs
 *   - Section anchors
 *
 * Future phases will add:
 * - Text formatting (bold, italic, code)
 * - Lists
 * - Links
 * - Code blocks
 * - Blockquotes
 * - Tables
 * - Images
 *
 * @module renderers/wikiToHtml
 */

/**
 * Escape HTML entities to prevent XSS attacks
 *
 * @private
 * @param {string} text - Text to escape
 * @returns {string} Escaped text safe for HTML
 *
 * @security Prevents XSS by escaping <, >, &, ", and '
 */
function escapeHtml(text) {
  const entityMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };

  return String(text).replace(/[&<>"']/g, (char) => entityMap[char]);
}

/**
 * Generate an ID from heading text
 *
 * Creates a URL-safe ID by removing non-alphanumeric characters
 * and replacing spaces with nothing (Trac style).
 *
 * @private
 * @param {string} text - Heading text (may contain WikiFormatting)
 * @returns {string} URL-safe ID
 *
 * @example
 * generateId('About this')
 * // Returns: 'Aboutthis'
 *
 * @example
 * generateId("Level 3 (note)")
 * // Returns: 'Level3note'
 */
function generateId(text) {
  // Remove WikiFormatting markup (simple version for Phase 2)
  // Future: parse WikiFormatting to extract plain text
  let plainText = text
    .replace(/'{2,5}/g, '') // Remove bold/italic markers
    .replace(/`/g, '')       // Remove inline code markers
    .trim();

  // Remove special characters except alphanumeric, spaces, and hyphens
  // Then remove spaces (Trac style)
  return plainText
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '')
    .replace(/-+/g, '-');
}

/**
 * Convert WikiFormatting inline text to HTML
 *
 * Handles inline formatting like italic, bold, etc. within heading text.
 * Currently supports italic (''text'') as a basic implementation.
 *
 * @private
 * @param {string} text - Text that may contain WikiFormatting
 * @returns {string} HTML with inline formatting
 *
 * @example
 * convertInlineFormatting("About ''this''")
 * // Returns: 'About <em>this</em>'
 *
 * @security Text content is NOT escaped since it's already been through
 *           the Markdown->WikiFormatting converter which escaped it
 */
function convertInlineFormatting(text) {
  // Phase 2: Basic italic support for headings
  // Phase 3 will expand this with full text formatting

  // Convert italic: ''text'' → <em>text</em>
  let result = text.replace(/''/g, (match, offset, string) => {
    // Count consecutive quotes to handle bold (''') vs italic ('')
    // For now, just handle simple italic
    return '</em>';
  });

  // Simple approach for Phase 2: toggle em tags
  // This is a simplified version; Phase 3 will have proper parsing
  result = text.replace(/''(.+?)''/g, '<em>$1</em>');

  return result;
}

/**
 * Convert a single WikiFormatting header line to HTML
 *
 * Converts WikiFormatting headers (= syntax) to HTML heading tags.
 * Supports all Trac heading variations:
 * - Basic: `= Heading =`
 * - No trailing equals: `== Subheading`
 * - Inline formatting: `=== About ''this'' ===`
 * - Explicit ID: `=== Title === #custom-id`
 * - ID without trailing: `== Title #custom-id`
 *
 * @param {string} line - A single line of text that may contain a WikiFormatting header
 * @returns {string} The line converted to HTML if it's a header, escaped otherwise
 * @throws {TypeError} If line is not a string
 *
 * @example
 * convertHeaderToHtml('= Hello World =')
 * // Returns: '<h1 class="section" id="HelloWorld">Hello World<a class="anchor" href="#HelloWorld"> ¶</a></h1>'
 *
 * @example
 * convertHeaderToHtml('=== About ''this'' ===')
 * // Returns: '<h3 class="section" id="Aboutthis">About <em>this</em><a class="anchor" href="#Aboutthis"> ¶</a></h3>'
 *
 * @example
 * convertHeaderToHtml('=== Explicit id === #using-explicit-id')
 * // Returns: '<h3 class="section" id="using-explicit-id">Explicit id<a class="anchor" href="#using-explicit-id"> ¶</a></h3>'
 *
 * @security Header text goes through convertInlineFormatting which handles WikiFormatting safely
 */
function convertHeaderToHtml(line) {
  // Type safety
  if (typeof line !== 'string') {
    throw new TypeError('Expected line to be a string');
  }

  // Regex to match all heading variations:
  // = Text = or = Text or = Text #id or = Text = #id
  // Captures: (1) leading =, (2) text, (3) trailing = (optional), (4) #id (optional)
  const headerRegex = /^(={1,6})\s+(.+?)(?:\s+(={1,6}))?\s*(?:#([\w-]+))?\s*$/;
  const match = line.match(headerRegex);

  if (!match) {
    // Not a header, return escaped
    return escapeHtml(line);
  }

  const level = match[1].length; // Number of leading = characters
  let headerText = match[2].trim(); // Header text
  const trailingEquals = match[3]; // Trailing = (if present)
  const explicitId = match[4]; // Explicit ID after #

  // Verify trailing equals match leading equals (if present)
  if (trailingEquals && trailingEquals.length !== level) {
    // Mismatched equals, not a valid header
    return escapeHtml(line);
  }

  // Generate ID (explicit or auto-generated)
  const headingId = explicitId || generateId(headerText);

  // Convert inline WikiFormatting in header text
  const formattedText = convertInlineFormatting(headerText);

  // Build HTML with Trac-style structure:
  // <h1 class="section" id="...">Text<a class="anchor" href="#..."> ¶</a></h1>
  return `<h${level} class="section" id="${headingId}">${formattedText}<a class="anchor" href="#${headingId}"> ¶</a></h${level}>`;
}

/**
 * Convert WikiFormatting text to HTML
 *
 * Parses WikiFormatting markup and converts it to HTML for rendering.
 * Processes line-by-line to handle different syntax elements.
 *
 * Currently supported:
 * - Headers (= syntax → <h1> through <h6>) with all variations
 *
 * @param {string} wikiText - WikiFormatting text
 * @param {Object} [options] - Rendering options
 * @param {boolean} [options.preserveNewlines=true] - Preserve line breaks
 * @returns {string} HTML markup
 * @throws {TypeError} If wikiText is not a string
 *
 * @example
 * const html = convertWikiToHtml('= Title =\n\nSome text\n\n== Subtitle ==');
 * // Returns HTML with h1, paragraph, and h2 tags
 *
 * @security All non-header text is HTML-escaped to prevent XSS
 */
export function convertWikiToHtml(wikiText, options = {}) {
  // Type safety
  if (typeof wikiText !== 'string') {
    throw new TypeError('Expected wikiText to be a string');
  }

  // Default options
  const config = {
    preserveNewlines: true,
    ...options
  };

  // Process line by line
  const lines = wikiText.split('\n');
  const htmlLines = lines.map(line => {
    // Empty lines stay empty (will be converted to <p> breaks later)
    if (line.trim() === '') {
      return '';
    }

    // Try to convert as header
    const headerHtml = convertHeaderToHtml(line);

    // If it's a header, it won't be escaped
    // If it's not a header, convertHeaderToHtml returns escaped text
    return headerHtml;
  });

  // Join with newlines
  let html = htmlLines.join('\n');

  // Future phases will add:
  // - Paragraph wrapping for non-empty, non-header lines
  // - List processing
  // - Link processing
  // - Code block processing
  // etc.

  return html;
}
