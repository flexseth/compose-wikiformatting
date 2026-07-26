import { render, screen } from '@testing-library/react';
import Preview from './Preview';

describe('Preview Component', () => {
  test('renders with default title', () => {
    render(<Preview />);
    const title = screen.getByText(/WikiFormatting Output/i);
    expect(title).toBeInTheDocument();
  });

  test('renders with custom title', () => {
    render(<Preview title="Custom Preview" />);
    const title = screen.getByText(/Custom Preview/i);
    expect(title).toBeInTheDocument();
  });

  test('displays WikiFormatting output', () => {
    render(<Preview value="= Header =" />);
    const textarea = screen.getByRole('textbox', { name: /WikiFormatting preview/i });
    expect(textarea).toHaveValue('= Header =');
  });

  test('handles empty value', () => {
    render(<Preview value="" />);
    const textarea = screen.getByRole('textbox', { name: /WikiFormatting preview/i });
    expect(textarea).toHaveValue('');
  });

  test('displays placeholder when empty', () => {
    render(<Preview />);
    const textarea = screen.getByPlaceholderText(/WikiFormatting output will appear here/i);
    expect(textarea).toBeInTheDocument();
  });

  test('textarea is read-only', () => {
    render(<Preview value="test" />);
    const textarea = screen.getByRole('textbox', { name: /WikiFormatting preview/i });
    expect(textarea).toHaveAttribute('readOnly');
  });

  test('has spellcheck disabled', () => {
    render(<Preview />);
    const textarea = screen.getByRole('textbox', { name: /WikiFormatting preview/i });
    expect(textarea).toHaveAttribute('spellCheck', 'false');
  });

  test('has accessible aria-label', () => {
    render(<Preview />);
    const textarea = screen.getByRole('textbox', { name: /WikiFormatting preview/i });
    expect(textarea).toHaveAttribute('aria-label', 'WikiFormatting preview');
  });

  test('displays read-only label', () => {
    render(<Preview />);
    const label = screen.getByText(/Read-only preview/i);
    expect(label).toBeInTheDocument();
  });

  test('displays footer hint', () => {
    render(<Preview />);
    const hint = screen.getByText(/Preview of WikiFormatting syntax/i);
    expect(hint).toBeInTheDocument();
  });

  test('updates when value changes', () => {
    const { rerender } = render(<Preview value="= First =" />);
    const textarea = screen.getByRole('textbox', { name: /WikiFormatting preview/i });
    expect(textarea).toHaveValue('= First =');

    rerender(<Preview value="== Second ==" />);
    expect(textarea).toHaveValue('== Second ==');
  });

  test('handles multi-line content', () => {
    const multiLine = '= Header =\n\nContent\n\n== Subheader ==';
    render(<Preview value={multiLine} />);
    const textarea = screen.getByRole('textbox', { name: /WikiFormatting preview/i });
    expect(textarea).toHaveValue(multiLine);
  });

  test('renders container with correct class', () => {
    const { container } = render(<Preview />);
    const previewContainer = container.querySelector('.preview-container');
    expect(previewContainer).toBeInTheDocument();
  });
});
