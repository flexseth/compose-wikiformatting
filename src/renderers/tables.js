/**
 * Tables Renderer: WikiFormatting → React Components
 *
 * Renders WikiFormatting table syntax as React <table> elements.
 *
 * WikiFormatting:
 * || '''Header 1''' || '''Header 2''' ||
 * || Cell 1 || Cell 2 ||
 *
 * React Output:
 * <table>
 *   <thead><tr><th>Header 1</th><th>Header 2</th></tr></thead>
 *   <tbody><tr><td>Cell 1</td><td>Cell 2</td></tr></tbody>
 * </table>
 *
 * @module renderers/tables
 */

import React from 'react';

/**
 * Checks if a line is a WikiFormatting table row.
 *
 * @param {string} line - Line to check
 * @returns {boolean} True if line is a table row
 *
 * @example
 * isTableRow('|| Cell ||')  // true
 * isTableRow('Not a table') // false
 */
export function isTableRow(line) {
  return /^\|\|.*\|\|$/.test(line.trim());
}

/**
 * Detects text alignment from WikiFormatting whitespace positioning.
 *
 * Per Trac spec: "if the content of a cell sticks to one side and only one,
 * then the text will be aligned on that side."
 *
 * @param {string} cellContent - Cell content with whitespace
 * @returns {string|null} 'left', 'center', 'right', or null for default
 *
 * @example
 * detectAlignment('text    ')  // 'left' - sticks to left, spaces on right
 * detectAlignment('    text')  // 'right' - spaces on left, sticks to right
 * detectAlignment('  text  ')  // 'center' - spaces on both sides
 * detectAlignment(' text ')    // null - default (single space)
 */
export function detectAlignment(cellContent) {
  // Check for leading/trailing whitespace
  const hasLeadingSpace = /^\s\s+/.test(cellContent); // 2+ leading spaces
  const hasTrailingSpace = /\s\s+$/.test(cellContent); // 2+ trailing spaces

  if (hasLeadingSpace && hasTrailingSpace) {
    return 'center'; // Spaces on both sides
  } else if (hasLeadingSpace) {
    return 'right'; // Spaces on left only
  } else if (hasTrailingSpace) {
    return 'left'; // Spaces on right only
  }

  return null; // Default alignment
}

/**
 * Parses a WikiFormatting table row into cells with alignment detection.
 *
 * Splits row by || delimiter. Preserves whitespace to detect alignment,
 * then trims for content. Detects if row is a header by checking for '''Header''' syntax.
 *
 * @param {string} row - WikiFormatting table row
 * @returns {{cells: Array<{content: string, align: string|null}>, isHeader: boolean}} Parsed cells with alignment
 *
 * @example
 * parseTableRow("|| '''Header'''  ||")
 * // Returns: { cells: [{content: "'''Header'''", align: 'left'}], isHeader: true }
 *
 * @example
 * parseTableRow("||  Cell  ||")
 * // Returns: { cells: [{content: "Cell", align: 'center'}], isHeader: false }
 */
export function parseTableRow(row) {
  // Remove leading/trailing || and split by ||
  const trimmed = row.trim().replace(/^\|\|/, '').replace(/\|\|$/, '');
  const rawCells = trimmed.split('||'); // DON'T trim yet - need whitespace for alignment

  // Parse each cell: detect alignment, then trim content
  const cells = rawCells.map(cell => {
    const align = detectAlignment(cell);
    const content = cell.trim();
    return { content, align };
  });

  // Check if this is a header row (all cells have '''Header''' syntax)
  const isHeader = cells.every(cell =>
    cell.content.startsWith("'''") && cell.content.endsWith("'''")
  );

  return { cells, isHeader };
}

/**
 * Parses consecutive WikiFormatting table rows into a structured table.
 *
 * Groups rows into header and body sections.
 * First row with '''Header''' cells becomes <thead>.
 * Remaining rows become <tbody>.
 *
 * @param {string[]} lines - Array of lines (may contain table rows)
 * @param {number} startIndex - Index to start parsing from
 * @returns {{rows: Array<{cells: string[], isHeader: boolean}>, endIndex: number}} Parsed table data
 *
 * @example
 * const lines = ["|| '''Header''' ||", "|| Cell ||"];
 * parseTable(lines, 0)
 * // Returns: {
 * //   rows: [
 * //     { cells: ["'''Header'''"], isHeader: true },
 * //     { cells: ["Cell"], isHeader: false }
 * //   ],
 * //   endIndex: 1
 * // }
 */
export function parseTable(lines, startIndex) {
  const rows = [];
  let i = startIndex;

  // Parse consecutive table rows
  while (i < lines.length && isTableRow(lines[i])) {
    const parsed = parseTableRow(lines[i]);
    rows.push(parsed);
    i++;
  }

  return {
    rows,
    endIndex: i - 1
  };
}

/**
 * Renders a WikiFormatting table as React <table> element.
 *
 * Creates proper table structure with <thead> and <tbody>.
 * Header rows (with '''Header''' cells) render as <th> in <thead>.
 * Regular rows render as <td> in <tbody>.
 *
 * Cell alignment is detected from whitespace positioning and applied as CSS.
 * Cell content is parsed for inline formatting (bold, italic, links, code).
 *
 * @param {Array<{cells: Array<{content: string, align: string|null}>, isHeader: boolean}>} rows - Parsed table rows
 * @param {Function} parseInlineContent - Function to parse cell content for formatting
 * @returns {React.Element} React table element
 *
 * @example
 * const rows = [
 *   { cells: [{content: "'''Header'''", align: 'left'}], isHeader: true },
 *   { cells: [{content: "Cell", align: 'center'}], isHeader: false }
 * ];
 * renderTable(rows, parseInlineContent)
 * // Returns: <table>...</table>
 */
export function renderTable(rows, parseInlineContent) {
  // Separate header rows from body rows
  const headerRows = rows.filter(row => row.isHeader);
  const bodyRows = rows.filter(row => !row.isHeader);

  return (
    <table key={Math.random()}>
      {headerRows.length > 0 && (
        <thead>
          {headerRows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.cells.map((cell, cellIndex) => (
                <th
                  key={cellIndex}
                  style={cell.align ? { textAlign: cell.align } : undefined}
                >
                  {parseInlineContent(cell.content)}
                </th>
              ))}
            </tr>
          ))}
        </thead>
      )}
      {bodyRows.length > 0 && (
        <tbody>
          {bodyRows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.cells.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  style={cell.align ? { textAlign: cell.align } : undefined}
                >
                  {parseInlineContent(cell.content)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      )}
    </table>
  );
}
