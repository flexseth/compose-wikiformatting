import { render, screen } from '@testing-library/react';
import React from 'react';
import RenderedView from './RenderedView';

describe('RenderedView Component', () => {
  test('renders with default title', () => {
    render(<RenderedView elements={[]} />);
    const title = screen.getByText(/Rendered Output/i);
    expect(title).toBeInTheDocument();
  });

  test('renders with custom title', () => {
    render(<RenderedView elements={[]} title="Custom Preview" />);
    const title = screen.getByText(/Custom Preview/i);
    expect(title).toBeInTheDocument();
  });

  test('displays live preview label', () => {
    render(<RenderedView elements={[]} />);
    const label = screen.getByText(/Live Preview/i);
    expect(label).toBeInTheDocument();
  });

  test('displays placeholder when no elements', () => {
    render(<RenderedView elements={[]} />);
    const placeholder = screen.getByText(/Rendered WikiFormatting will appear here/i);
    expect(placeholder).toBeInTheDocument();
  });

  test('displays placeholder hint', () => {
    render(<RenderedView elements={[]} />);
    const hint = screen.getByText(/Type WikiFormatting in the editor/i);
    expect(hint).toBeInTheDocument();
  });

  test('renders React elements when provided', () => {
    const elements = [
      <h1 key="h1" className="section" id="test">Test Header</h1>
    ];
    render(<RenderedView elements={elements} />);

    const header = screen.getByText(/Test Header/i);
    expect(header).toBeInTheDocument();
    expect(header.tagName).toBe('H1');
  });

  test('renders multiple elements', () => {
    const elements = [
      <h1 key="h1" className="section">Title</h1>,
      <p key="p">Paragraph text</p>,
      <h2 key="h2" className="section">Subtitle</h2>
    ];
    render(<RenderedView elements={elements} />);

    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Paragraph text')).toBeInTheDocument();
    expect(screen.getByText('Subtitle')).toBeInTheDocument();
  });

  test('handles empty elements array', () => {
    render(<RenderedView elements={[]} />);
    const placeholder = screen.getByText(/Rendered WikiFormatting will appear here/i);
    expect(placeholder).toBeInTheDocument();
  });

  test('handles undefined elements prop', () => {
    render(<RenderedView />);
    const placeholder = screen.getByText(/Rendered WikiFormatting will appear here/i);
    expect(placeholder).toBeInTheDocument();
  });

  test('displays footer hint', () => {
    render(<RenderedView elements={[]} />);
    const hint = screen.getByText(/Trac message preview/i);
    expect(hint).toBeInTheDocument();
  });

  test('has correct container class', () => {
    const { container } = render(<RenderedView elements={[]} />);
    const renderedContainer = container.querySelector('.rendered-container');
    expect(renderedContainer).toBeInTheDocument();
  });

  test('hides placeholder when elements are provided', () => {
    const elements = [<h1 key="h1">Test</h1>];
    render(<RenderedView elements={elements} />);

    const placeholder = screen.queryByText(/Rendered WikiFormatting will appear here/i);
    expect(placeholder).not.toBeInTheDocument();
  });

  test('renders elements in rendered-elements container', () => {
    const elements = [<h1 key="h1">Test</h1>];
    const { container } = render(<RenderedView elements={elements} />);

    const renderedElements = container.querySelector('.rendered-elements');
    expect(renderedElements).toBeInTheDocument();
    expect(renderedElements).toContainHTML('<h1>Test</h1>');
  });

  test('no dangerouslySetInnerHTML usage (React-safe)', () => {
    const maliciousElements = [
      <p key="p">{'<script>alert("XSS")</script>'}</p>
    ];
    const { container } = render(<RenderedView elements={maliciousElements} />);

    // React auto-escapes text content
    expect(container.innerHTML).toContain('&lt;script&gt;');
    expect(container.innerHTML).not.toContain('<script>alert');
  });

  test('renders with italic elements safely', () => {
    const elements = [
      <h1 key="h1">Test <em>italic</em> text</h1>
    ];
    const { container } = render(<RenderedView elements={elements} />);

    const em = container.querySelector('em');
    expect(em).toBeInTheDocument();
    expect(em).toHaveTextContent('italic');
  });

  test('renders anchor links correctly', () => {
    const elements = [
      <h1 key="h1" className="section" id="test">
        Title<a className="anchor" href="#test"> ¶</a>
      </h1>
    ];
    const { container } = render(<RenderedView elements={elements} />);

    const anchor = container.querySelector('a.anchor');
    expect(anchor).toBeInTheDocument();
    expect(anchor).toHaveAttribute('href', '#test');
    expect(anchor).toHaveTextContent('¶');
  });
});
