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
 * Parses a WikiFormatting table row into cells.
 *
 * Splits row by || delimiter and trims whitespace.
 * Detects if row is a header by checking for '''Header''' syntax.
 *
 * @param {string} row - WikiFormatting table row
 * @returns {{cells: string[], isHeader: boolean}} Parsed cells and header flag
 *
 * @example
 * parseTableRow("|| '''Header''' ||")
 * // Returns: { cells: ["'''Header'''"], isHeader: true }
 *
 * @example
 * parseTableRow("|| Cell 1 || Cell 2 ||")
 * // Returns: { cells: ["Cell 1", "Cell 2"], isHeader: false }
 */
export function parseTableRow(row) {
  // Remove leading/trailing || and split by ||
  const trimmed = row.trim().replace(/^\|\|/, '').replace(/\|\|$/, '');
  const rawCells = trimmed.split('||').map(cell => cell.trim());

  // Check if this is a header row (all cells have '''Header''' syntax)
  const isHeader = rawCells.every(cell =>
    cell.startsWith("'''") && cell.endsWith("'''")
  );

  // If header, remove the ''' markers (parseInlineFormatting will handle it)
  const cells = rawCells;

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
 * Cell content is parsed for inline formatting (bold, italic, links, code).
 *
 * @param {Array<{cells: string[], isHeader: boolean}>} rows - Parsed table rows
 * @param {Function} parseInlineContent - Function to parse cell content for formatting
 * @returns {React.Element} React table element
 *
 * @example
 * const rows = [
 *   { cells: ["'''Header'''"], isHeader: true },
 *   { cells: ["Cell"], isHeader: false }
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
                <th key={cellIndex}>
                  {parseInlineContent(cell)}
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
                <td key={cellIndex}>
                  {parseInlineContent(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      )}
    </table>
  );
}
