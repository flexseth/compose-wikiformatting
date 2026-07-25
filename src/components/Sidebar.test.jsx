import { render, screen, fireEvent } from '@testing-library/react';
import Sidebar from './Sidebar';

describe('Sidebar Component', () => {
  test('renders sidebar with title', () => {
    render(<Sidebar />);
    const title = screen.getByText(/WikiFormatting Docs/i);
    expect(title).toBeInTheDocument();
  });

  test('renders description when sidebar is open', () => {
    render(<Sidebar />);
    const description = screen.getByText(/Quick reference for Trac WikiFormatting syntax/i);
    expect(description).toBeInTheDocument();
  });

  test('renders all section categories', () => {
    render(<Sidebar />);
    expect(screen.getByText('Basics')).toBeInTheDocument();
    expect(screen.getByText('Lists & Structure')).toBeInTheDocument();
    expect(screen.getByText('Text Formatting')).toBeInTheDocument();
    expect(screen.getByText('Links & References')).toBeInTheDocument();
    expect(screen.getByText('Advanced Features')).toBeInTheDocument();
  });

  test('toggles sidebar open/closed', () => {
    render(<Sidebar />);
    const sidebar = document.querySelector('.sidebar');
    const toggleButton = screen.getByRole('button', { name: /close sidebar/i });

    // Sidebar should be open by default
    expect(sidebar).toHaveClass('open');

    // Click to close
    fireEvent.click(toggleButton);
    expect(sidebar).toHaveClass('closed');

    // Click to open
    fireEvent.click(toggleButton);
    expect(sidebar).toHaveClass('open');
  });

  test('expands and collapses section when clicked', () => {
    render(<Sidebar />);
    const basicsSection = screen.getByRole('button', { name: /Basics/i });

    // Section should be collapsed by default
    expect(basicsSection).toHaveAttribute('aria-expanded', 'false');

    // Click to expand
    fireEvent.click(basicsSection);
    expect(basicsSection).toHaveAttribute('aria-expanded', 'true');

    // Links should now be visible
    expect(screen.getByText('Common Wiki Markup')).toBeInTheDocument();
    expect(screen.getByText('Font Styles')).toBeInTheDocument();

    // Click to collapse
    fireEvent.click(basicsSection);
    expect(basicsSection).toHaveAttribute('aria-expanded', 'false');
  });

  test('renders documentation links with correct URLs', () => {
    render(<Sidebar />);
    const basicsSection = screen.getByRole('button', { name: /Basics/i });

    // Expand the section
    fireEvent.click(basicsSection);

    // Check that links have correct hrefs
    const fontStylesLink = screen.getByText('Font Styles').closest('a');
    expect(fontStylesLink).toHaveAttribute(
      'href',
      'https://trac.ffmpeg.org/wiki/WikiFormatting#FontStyles'
    );
    expect(fontStylesLink).toHaveAttribute('target', '_blank');
    expect(fontStylesLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  test('renders full documentation link', () => {
    render(<Sidebar />);
    const fullDocsLink = screen.getByText(/View Full Documentation/i).closest('a');

    expect(fullDocsLink).toHaveAttribute(
      'href',
      'https://trac.ffmpeg.org/wiki/WikiFormatting'
    );
    expect(fullDocsLink).toHaveAttribute('target', '_blank');
    expect(fullDocsLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  test('can expand multiple sections simultaneously', () => {
    render(<Sidebar />);
    const basicsSection = screen.getByRole('button', { name: /Basics/i });
    const listsSection = screen.getByRole('button', { name: /Lists & Structure/i });

    // Expand both sections
    fireEvent.click(basicsSection);
    fireEvent.click(listsSection);

    // Both should be expanded
    expect(basicsSection).toHaveAttribute('aria-expanded', 'true');
    expect(listsSection).toHaveAttribute('aria-expanded', 'true');

    // Links from both sections should be visible
    expect(screen.getByText('Font Styles')).toBeInTheDocument();
    expect(screen.getByText('Lists')).toBeInTheDocument();
    expect(screen.getByText('Tables')).toBeInTheDocument();
  });

  test('hides content when sidebar is closed', () => {
    render(<Sidebar />);
    const toggleButton = screen.getByRole('button', { name: /close sidebar/i });

    // Close the sidebar
    fireEvent.click(toggleButton);

    // Description should not be visible
    expect(screen.queryByText(/Quick reference/i)).not.toBeInTheDocument();

    // Section buttons should not be visible
    expect(screen.queryByText('Basics')).not.toBeInTheDocument();
  });

  test('renders all links in Advanced Features section', () => {
    render(<Sidebar />);
    const advancedSection = screen.getByRole('button', { name: /Advanced Features/i });

    // Expand the section
    fireEvent.click(advancedSection);

    // Check all links are present
    expect(screen.getByText('Images')).toBeInTheDocument();
    expect(screen.getByText('Macros')).toBeInTheDocument();
    expect(screen.getByText('Processors')).toBeInTheDocument();
    expect(screen.getByText('Comments')).toBeInTheDocument();
    expect(screen.getByText('Miscellaneous')).toBeInTheDocument();
  });

  test('all documentation links point to correct anchors', () => {
    render(<Sidebar />);

    // Expand all sections and verify anchor IDs
    const sections = [
      'Basics',
      'Lists & Structure',
      'Text Formatting',
      'Links & References',
      'Advanced Features'
    ];

    sections.forEach(sectionName => {
      const section = screen.getByRole('button', { name: new RegExp(sectionName, 'i') });
      fireEvent.click(section);
    });

    // Check specific anchor IDs
    const headingsLink = screen.getByText('Headings').closest('a');
    expect(headingsLink).toHaveAttribute('href', expect.stringContaining('#Headings'));

    const tablesLink = screen.getByText('Tables').closest('a');
    expect(tablesLink).toHaveAttribute('href', expect.stringContaining('#Tables'));

    const macrosLink = screen.getByText('Macros').closest('a');
    expect(macrosLink).toHaveAttribute('href', expect.stringContaining('#Macros'));
  });
});
