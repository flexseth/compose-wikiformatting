/**
 * Tables Converter: Markdown → WikiFormatting
 *
 * Converts Markdown pipe tables to WikiFormatting table syntax.
 *
 * Markdown:
 * | Header 1 | Header 2 |
 * |----------|----------|
 * | Cell 1   | Cell 2   |
 *
 * WikiFormatting:
 * || '''Header 1''' || '''Header 2''' ||
 * || Cell 1 || Cell 2 ||
 *
 * @module converters/tables
 */

/**
 * Converts Markdown pipe tables to WikiFormatting table syntax.
 *
 * Detects table structure by identifying rows that start/end with `|`.
 * Headers are automatically bolded in WikiFormatting.
 * Separator rows (|---|---| syntax) are removed in WikiFormatting.
 * Alignment syntax (:---, ---:, :---:) is converted to WikiFormatting whitespace positioning.
 *
 * @param {string} markdown - Markdown text that may contain tables
 * @returns {string} WikiFormatting text with converted tables
 * @throws {TypeError} If input is not a string
 *
 * @example
 * // Simple table
 * convertTables('| A | B |\n|---|---|\n| 1 | 2 |')
 * // Returns: "|| '''A''' || '''B''' ||\n|| 1 || 2 ||"
 *
 * @example
 * // Table with alignment
 * convertTables('| Left | Center | Right |\n|:-----|:------:|------:|\n| L | C | R |')
 * // Returns: "|| '''Left'''  ||  '''Center'''  || '''Right'''||\n|| L  ||  C  || R||"
 */
export function convertTables(markdown) {
  if (typeof markdown !== 'string') {
    throw new TypeError('Input must be a string');
  }

  const lines = markdown.split('\n');
  const result = [];
  let inTable = false;
  let isFirstRow = false;
  let columnAlignments = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Check if this line is a table row (starts and ends with |)
    const isTableRow = /^\|.*\|$/.test(line);

    // Check if this is a separator row (|---|---|)
    const isSeparator = /^\|[\s:]*-+[\s:]*(\|[\s:]*-+[\s:]*)*\|$/.test(line);

    if (isTableRow && !isSeparator) {
      if (!inTable) {
        // Starting a new table - first row is header
        inTable = true;
        isFirstRow = true;
        columnAlignments = null;
      }

      // Convert the table row
      const converted = convertTableRow(line, isFirstRow, columnAlignments);
      result.push(converted);

      if (isFirstRow) {
        isFirstRow = false;
      }
    } else if (isSeparator) {
      // Parse alignment from separator row
      columnAlignments = parseAlignment(line);
      // Skip separator rows - WikiFormatting doesn't use them
      continue;
    } else {
      // Not a table row - end table if we were in one
      if (inTable) {
        inTable = false;
        isFirstRow = false;
        columnAlignments = null;
      }
      result.push(line);
    }
  }

  return result.join('\n');
}

/**
 * Parses alignment from a Markdown table separator row.
 *
 * @param {string} separator - Separator row (e.g., "|:---|:---:|---:|")
 * @returns {string[]} Array of alignments: 'left', 'center', 'right'
 *
 * @example
 * parseAlignment('|:---|:---:|---:|')
 * // Returns: ['left', 'center', 'right']
 */
function parseAlignment(separator) {
  // Remove leading/trailing pipes and split by pipe
  const trimmed = separator.trim().replace(/^\|/, '').replace(/\|$/, '');
  const cells = trimmed.split('|');

  return cells.map(cell => {
    const cleaned = cell.trim();
    const hasLeft = cleaned.startsWith(':');
    const hasRight = cleaned.endsWith(':');

    if (hasLeft && hasRight) {
      return 'center';
    } else if (hasRight) {
      return 'right';
    } else if (hasLeft) {
      return 'left';
    } else {
      return null; // No explicit alignment - use default spacing
    }
  });
}

/**
 * Applies WikiFormatting alignment by adding whitespace padding.
 *
 * WikiFormatting uses whitespace positioning for alignment:
 * - Left: text sticks to left separator (||text    ||)
 * - Right: text sticks to right separator (||    text||)
 * - Center: text has equal padding on both sides (||  text  ||)
 *
 * @param {string} text - Cell content
 * @param {string} alignment - 'left', 'center', or 'right'
 * @returns {string} Text with WikiFormatting alignment padding
 *
 * @example
 * applyAlignment('Left', 'left')   // Returns: "Left  "
 * applyAlignment('Center', 'center') // Returns: "  Center  "
 * applyAlignment('Right', 'right')  // Returns: "    Right"
 */
function applyAlignment(text, alignment) {
  // Use consistent padding to make alignment clear
  const padding = 4; // Number of spaces to add

  switch (alignment) {
    case 'left':
      // Text sticks to left separator, spaces on right
      return text + ' '.repeat(padding);
    case 'right':
      // Text sticks to right separator, spaces on left
      return ' '.repeat(padding) + text;
    case 'center':
      // Equal spaces on both sides
      const sidePadding = Math.floor(padding / 2);
      return ' '.repeat(sidePadding) + text + ' '.repeat(sidePadding);
    default:
      // Default: single space on both sides (no alignment)
      return ' ' + text + ' ';
  }
}

/**
 * Converts a single Markdown table row to WikiFormatting.
 *
 * @param {string} row - Markdown table row (e.g., "| Cell 1 | Cell 2 |")
 * @param {boolean} isHeader - Whether this is a header row
 * @param {string[]|null} alignments - Column alignments from separator row
 * @returns {string} WikiFormatting table row
 *
 * @example
 * convertTableRow('| Header |', true, ['left'])
 * // Returns: "|| '''Header'''  ||"
 *
 * @example
 * convertTableRow('| Cell |', false, ['center'])
 * // Returns: "||  Cell  ||"
 */
function convertTableRow(row, isHeader, alignments) {
  // Remove leading/trailing pipes and split by pipe
  const trimmed = row.trim().replace(/^\|/, '').replace(/\|$/, '');
  const cells = trimmed.split('|').map(cell => cell.trim());

  // Convert cells to WikiFormatting
  const wikiCells = cells.map((cell, index) => {
    const alignment = alignments && alignments[index] ? alignments[index] : null;

    if (isHeader) {
      // Bold headers in WikiFormatting
      const boldCell = `'''${cell}'''`;
      return alignment ? applyAlignment(boldCell, alignment) : ` ${boldCell} `;
    } else {
      return alignment ? applyAlignment(cell, alignment) : ` ${cell} `;
    }
  });

  // Join with || and add leading/trailing ||
  return `||${wikiCells.join('||')}||`;
}
