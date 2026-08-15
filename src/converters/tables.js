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
 * Alignment syntax (:---, ---:, :---:) is preserved but not rendered.
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
 * // Returns: "|| '''Left''' || '''Center''' || '''Right''' ||\n|| L || C || R ||"
 */
export function convertTables(markdown) {
  if (typeof markdown !== 'string') {
    throw new TypeError('Input must be a string');
  }

  const lines = markdown.split('\n');
  const result = [];
  let inTable = false;
  let isFirstRow = false;

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
      }

      // Convert the table row
      const converted = convertTableRow(line, isFirstRow);
      result.push(converted);

      if (isFirstRow) {
        isFirstRow = false;
      }
    } else if (isSeparator) {
      // Skip separator rows - WikiFormatting doesn't use them
      continue;
    } else {
      // Not a table row - end table if we were in one
      if (inTable) {
        inTable = false;
        isFirstRow = false;
      }
      result.push(line);
    }
  }

  return result.join('\n');
}

/**
 * Converts a single Markdown table row to WikiFormatting.
 *
 * @param {string} row - Markdown table row (e.g., "| Cell 1 | Cell 2 |")
 * @param {boolean} isHeader - Whether this is a header row
 * @returns {string} WikiFormatting table row
 *
 * @example
 * convertTableRow('| Header |', true)
 * // Returns: "|| '''Header''' ||"
 *
 * @example
 * convertTableRow('| Cell |', false)
 * // Returns: "|| Cell ||"
 */
function convertTableRow(row, isHeader) {
  // Remove leading/trailing pipes and split by pipe
  const trimmed = row.trim().replace(/^\|/, '').replace(/\|$/, '');
  const cells = trimmed.split('|').map(cell => cell.trim());

  // Convert cells to WikiFormatting
  const wikiCells = cells.map(cell => {
    if (isHeader) {
      // Bold headers in WikiFormatting
      return ` '''${cell}''' `;
    } else {
      return ` ${cell} `;
    }
  });

  // Join with || and add leading/trailing ||
  return `||${wikiCells.join('||')}||`;
}
