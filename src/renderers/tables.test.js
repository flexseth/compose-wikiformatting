/**
 * Tests for Tables Renderer (WikiFormatting → React)
 *
 * @jest-environment jsdom
 */

import React from 'react';
import { render } from '@testing-library/react';
import {
  isTableRow,
  parseTableRow,
  parseTable,
  renderTable
} from './tables.js';

// ============================================================================
// Helper: Simple inline content parser (for testing)
// ============================================================================
const simpleParser = (content) => {
  // Simple parser that just returns text content
  // In real app, this would be parseInlineFormatting from wikiToReact
  return content.replace(/'''/g, '').replace(/''/g, '');
};

// ============================================================================
// isTableRow Tests
// ============================================================================
describe('isTableRow', () => {
  test('identifies valid table row', () => {
    expect(isTableRow('|| Cell ||')).toBe(true);
    expect(isTableRow("|| '''Header''' ||")).toBe(true);
    expect(isTableRow('|| A || B || C ||')).toBe(true);
  });

  test('rejects non-table lines', () => {
    expect(isTableRow('Normal text')).toBe(false);
    expect(isTableRow('# Header')).toBe(false);
    expect(isTableRow('> Blockquote')).toBe(false);
    expect(isTableRow('|| Incomplete')).toBe(false);
    expect(isTableRow('Incomplete ||')).toBe(false);
  });

  test('handles whitespace', () => {
    expect(isTableRow('  || Cell ||  ')).toBe(true);
    expect(isTableRow('\t|| Cell ||\t')).toBe(true);
  });
});

// ============================================================================
// parseTableRow Tests
// ============================================================================
describe('parseTableRow', () => {
  test('parses simple row', () => {
    const result = parseTableRow('|| Cell 1 || Cell 2 ||');
    expect(result.cells).toEqual(['Cell 1', 'Cell 2']);
    expect(result.isHeader).toBe(false);
  });

  test('identifies header row', () => {
    const result = parseTableRow("|| '''Header 1''' || '''Header 2''' ||");
    expect(result.cells).toEqual(["'''Header 1'''", "'''Header 2'''"]);
    expect(result.isHeader).toBe(true);
  });

  test('identifies non-header row with some bold cells', () => {
    const result = parseTableRow("|| '''Bold''' || Normal ||");
    expect(result.cells).toEqual(["'''Bold'''", "Normal"]);
    expect(result.isHeader).toBe(false);
  });

  test('parses single cell row', () => {
    const result = parseTableRow('|| Cell ||');
    expect(result.cells).toEqual(['Cell']);
    expect(result.isHeader).toBe(false);
  });

  test('handles empty cells', () => {
    const result = parseTableRow('||  || Data ||');
    expect(result.cells).toEqual(['', 'Data']);
    expect(result.isHeader).toBe(false);
  });

  test('handles cells with extra whitespace', () => {
    const result = parseTableRow('||   Cell 1   ||   Cell 2   ||');
    expect(result.cells).toEqual(['Cell 1', 'Cell 2']);
  });

  test('preserves inline formatting markers', () => {
    const result = parseTableRow("|| ''italic'' || `code` ||");
    expect(result.cells).toEqual(["''italic''", "`code`"]);
    expect(result.isHeader).toBe(false);
  });

  test('preserves link syntax', () => {
    const result = parseTableRow('|| [https://example.com Link] || Text ||');
    expect(result.cells).toEqual(['[https://example.com Link]', 'Text']);
  });
});

// ============================================================================
// parseTable Tests
// ============================================================================
describe('parseTable', () => {
  test('parses simple table', () => {
    const lines = [
      "|| '''Header''' ||",
      "|| Cell ||"
    ];
    const result = parseTable(lines, 0);

    expect(result.rows).toHaveLength(2);
    expect(result.rows[0].isHeader).toBe(true);
    expect(result.rows[1].isHeader).toBe(false);
    expect(result.endIndex).toBe(1);
  });

  test('parses table with multiple rows', () => {
    const lines = [
      "|| '''A''' || '''B''' ||",
      "|| 1 || 2 ||",
      "|| 3 || 4 ||",
      "|| 5 || 6 ||"
    ];
    const result = parseTable(lines, 0);

    expect(result.rows).toHaveLength(4);
    expect(result.rows[0].isHeader).toBe(true);
    expect(result.rows[1].isHeader).toBe(false);
    expect(result.endIndex).toBe(3);
  });

  test('stops at non-table line', () => {
    const lines = [
      "|| '''Header''' ||",
      "|| Cell ||",
      "Not a table",
      "|| '''Another''' ||"
    ];
    const result = parseTable(lines, 0);

    expect(result.rows).toHaveLength(2);
    expect(result.endIndex).toBe(1);
  });

  test('handles table starting mid-document', () => {
    const lines = [
      "# Header",
      "Some text",
      "|| '''Table''' ||",
      "|| Cell ||"
    ];
    const result = parseTable(lines, 2);

    expect(result.rows).toHaveLength(2);
    expect(result.endIndex).toBe(3);
  });

  test('handles table with no header', () => {
    const lines = [
      "|| Cell 1 || Cell 2 ||",
      "|| Cell 3 || Cell 4 ||"
    ];
    const result = parseTable(lines, 0);

    expect(result.rows).toHaveLength(2);
    expect(result.rows.every(row => !row.isHeader)).toBe(true);
  });

  test('handles single row table', () => {
    const lines = [
      "|| '''Header''' ||"
    ];
    const result = parseTable(lines, 0);

    expect(result.rows).toHaveLength(1);
    expect(result.rows[0].isHeader).toBe(true);
    expect(result.endIndex).toBe(0);
  });
});

// ============================================================================
// renderTable Tests
// ============================================================================
describe('renderTable', () => {
  test('renders simple table with header', () => {
    const rows = [
      { cells: ["'''Header 1'''", "'''Header 2'''"], isHeader: true },
      { cells: ['Cell 1', 'Cell 2'], isHeader: false }
    ];

    const { container } = render(renderTable(rows, simpleParser));
    const table = container.querySelector('table');
    const thead = table.querySelector('thead');
    const tbody = table.querySelector('tbody');

    expect(table).toBeInTheDocument();
    expect(thead).toBeInTheDocument();
    expect(tbody).toBeInTheDocument();

    // Header cells
    const thCells = thead.querySelectorAll('th');
    expect(thCells).toHaveLength(2);
    expect(thCells[0]).toHaveTextContent('Header 1');
    expect(thCells[1]).toHaveTextContent('Header 2');

    // Body cells
    const tdCells = tbody.querySelectorAll('td');
    expect(tdCells).toHaveLength(2);
    expect(tdCells[0]).toHaveTextContent('Cell 1');
    expect(tdCells[1]).toHaveTextContent('Cell 2');
  });

  test('renders table with multiple body rows', () => {
    const rows = [
      { cells: ["'''Header'''"], isHeader: true },
      { cells: ['Row 1'], isHeader: false },
      { cells: ['Row 2'], isHeader: false },
      { cells: ['Row 3'], isHeader: false }
    ];

    const { container } = render(renderTable(rows, simpleParser));
    const tbody = container.querySelector('tbody');
    const rows_rendered = tbody.querySelectorAll('tr');

    expect(rows_rendered).toHaveLength(3);
    expect(rows_rendered[0].querySelector('td')).toHaveTextContent('Row 1');
    expect(rows_rendered[1].querySelector('td')).toHaveTextContent('Row 2');
    expect(rows_rendered[2].querySelector('td')).toHaveTextContent('Row 3');
  });

  test('renders table with no header', () => {
    const rows = [
      { cells: ['Cell 1', 'Cell 2'], isHeader: false },
      { cells: ['Cell 3', 'Cell 4'], isHeader: false }
    ];

    const { container } = render(renderTable(rows, simpleParser));
    const table = container.querySelector('table');
    const thead = table.querySelector('thead');
    const tbody = table.querySelector('tbody');

    expect(thead).not.toBeInTheDocument();
    expect(tbody).toBeInTheDocument();

    const rows_rendered = tbody.querySelectorAll('tr');
    expect(rows_rendered).toHaveLength(2);
  });

  test('renders table with single column', () => {
    const rows = [
      { cells: ["'''Header'''"], isHeader: true },
      { cells: ['Cell 1'], isHeader: false },
      { cells: ['Cell 2'], isHeader: false }
    ];

    const { container } = render(renderTable(rows, simpleParser));
    const thead = container.querySelector('thead');
    const tbody = container.querySelector('tbody');

    expect(thead.querySelectorAll('th')).toHaveLength(1);
    expect(tbody.querySelectorAll('tr')).toHaveLength(2);
    expect(tbody.querySelectorAll('td')).toHaveLength(2);
  });

  test('renders table with many columns', () => {
    const rows = [
      { cells: ["'''A'''", "'''B'''", "'''C'''", "'''D'''"], isHeader: true },
      { cells: ['1', '2', '3', '4'], isHeader: false }
    ];

    const { container } = render(renderTable(rows, simpleParser));
    const thead = container.querySelector('thead');
    const tbody = container.querySelector('tbody');

    expect(thead.querySelectorAll('th')).toHaveLength(4);
    expect(tbody.querySelectorAll('td')).toHaveLength(4);
  });

  test('renders empty cells correctly', () => {
    const rows = [
      { cells: ["'''Header 1'''", "'''Header 2'''"], isHeader: true },
      { cells: ['', 'Data'], isHeader: false }
    ];

    const { container } = render(renderTable(rows, simpleParser));
    const tbody = container.querySelector('tbody');
    const cells = tbody.querySelectorAll('td');

    expect(cells[0]).toHaveTextContent('');
    expect(cells[1]).toHaveTextContent('Data');
  });

  test('handles header-only table', () => {
    const rows = [
      { cells: ["'''Header 1'''", "'''Header 2'''"], isHeader: true }
    ];

    const { container } = render(renderTable(rows, simpleParser));
    const table = container.querySelector('table');
    const thead = table.querySelector('thead');
    const tbody = table.querySelector('tbody');

    expect(thead).toBeInTheDocument();
    expect(tbody).not.toBeInTheDocument();

    const thCells = thead.querySelectorAll('th');
    expect(thCells).toHaveLength(2);
  });
});

// ============================================================================
// Security Tests
// ============================================================================
describe('Security', () => {
  test('cell content is passed to parser (not rendered directly)', () => {
    const rows = [
      { cells: ['<script>alert("xss")</script>'], isHeader: false }
    ];

    // Parser should escape content
    const escapingParser = (content) => {
      return content; // React will auto-escape when rendered
    };

    const { container } = render(renderTable(rows, escapingParser));
    const td = container.querySelector('td');

    // React auto-escapes, so script tag should appear as text
    expect(td).toHaveTextContent('<script>alert("xss")</script>');

    // Should NOT create actual script element
    const script = td.querySelector('script');
    expect(script).not.toBeInTheDocument();
  });

  test('malicious link in cell is passed to parser', () => {
    const rows = [
      { cells: ['[javascript:alert("xss") Click]'], isHeader: false }
    ];

    const { container } = render(renderTable(rows, simpleParser));
    const td = container.querySelector('td');

    // Content passed to parser - parser should handle link security
    expect(td).toHaveTextContent('[javascript:alert("xss") Click]');
  });

  test('HTML entities in cells are preserved as text', () => {
    const rows = [
      { cells: ['&lt;div&gt;'], isHeader: false }
    ];

    const { container } = render(renderTable(rows, simpleParser));
    const td = container.querySelector('td');

    expect(td).toHaveTextContent('&lt;div&gt;');
  });
});

// ============================================================================
// Real-World Examples
// ============================================================================
describe('Real-World Examples', () => {
  test('WordPress compatibility table', () => {
    const rows = [
      { cells: ["'''WordPress'''", "'''PHP'''", "'''MySQL'''"], isHeader: true },
      { cells: ['6.4', '7.4+', '5.7+'], isHeader: false },
      { cells: ['6.3', '7.4+', '5.7+'], isHeader: false }
    ];

    const { container } = render(renderTable(rows, simpleParser));
    const thead = container.querySelector('thead');
    const tbody = container.querySelector('tbody');

    // Header
    const thCells = thead.querySelectorAll('th');
    expect(thCells[0]).toHaveTextContent('WordPress');
    expect(thCells[1]).toHaveTextContent('PHP');
    expect(thCells[2]).toHaveTextContent('MySQL');

    // Body rows
    const rows_rendered = tbody.querySelectorAll('tr');
    expect(rows_rendered).toHaveLength(2);

    const row1Cells = rows_rendered[0].querySelectorAll('td');
    expect(row1Cells[0]).toHaveTextContent('6.4');
    expect(row1Cells[1]).toHaveTextContent('7.4+');
    expect(row1Cells[2]).toHaveTextContent('5.7+');
  });

  test('bug tracking table', () => {
    const rows = [
      { cells: ["'''Component'''", "'''Status'''", "'''Priority'''"], isHeader: true },
      { cells: ['Editor', 'Open', 'High'], isHeader: false },
      { cells: ['REST API', 'Closed', 'Low'], isHeader: false }
    ];

    const { container } = render(renderTable(rows, simpleParser));
    const tbody = container.querySelector('tbody');
    const rows_rendered = tbody.querySelectorAll('tr');

    expect(rows_rendered).toHaveLength(2);

    const row1 = rows_rendered[0].querySelectorAll('td');
    expect(row1[0]).toHaveTextContent('Editor');
    expect(row1[1]).toHaveTextContent('Open');
    expect(row1[2]).toHaveTextContent('High');

    const row2 = rows_rendered[1].querySelectorAll('td');
    expect(row2[0]).toHaveTextContent('REST API');
    expect(row2[1]).toHaveTextContent('Closed');
    expect(row2[2]).toHaveTextContent('Low');
  });
});
