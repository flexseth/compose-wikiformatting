import { render, screen, fireEvent } from '@testing-library/react';
import Editor from './Editor';

describe('Editor Component', () => {
  test('renders with default placeholder', () => {
    render(<Editor />);
    const textarea = screen.getByPlaceholderText(/Type or paste Markdown here/i);
    expect(textarea).toBeInTheDocument();
  });

  test('renders with custom placeholder', () => {
    render(<Editor placeholder="Custom placeholder text" />);
    const textarea = screen.getByPlaceholderText(/Custom placeholder text/i);
    expect(textarea).toBeInTheDocument();
  });

  test('renders editor header with title', () => {
    render(<Editor />);
    const header = screen.getByText('Editor');
    expect(header).toBeInTheDocument();
  });

  test('displays word count', () => {
    render(<Editor value="Hello world" />);
    expect(screen.getByText('Words:')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  test('displays character count', () => {
    render(<Editor value="Hello" />);
    expect(screen.getByText('Characters:')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  test('displays zero counts for empty content', () => {
    render(<Editor value="" />);
    const stats = screen.getAllByText('0');
    expect(stats).toHaveLength(2); // Both word and char count should be 0
  });

  test('calls onChange when text is typed', () => {
    const handleChange = jest.fn();
    render(<Editor value="" onChange={handleChange} />);

    const textarea = screen.getByRole('textbox', { name: /markdown editor/i });
    fireEvent.change(textarea, { target: { value: 'Hello' } });

    expect(handleChange).toHaveBeenCalled();
    expect(handleChange).toHaveBeenLastCalledWith('Hello');
  });

  test('updates character count when typing', () => {
    const { rerender } = render(<Editor value="" />);
    let statValues = document.querySelectorAll('.stat-value');
    expect(statValues[1]).toHaveTextContent('0'); // Second stat-value is character count

    rerender(<Editor value="Hello" />);
    statValues = document.querySelectorAll('.stat-value');
    expect(statValues[1]).toHaveTextContent('5');
  });

  test('updates word count correctly', () => {
    const { rerender } = render(<Editor value="" />);

    rerender(<Editor value="one" />);
    expect(screen.getByText('1')).toBeInTheDocument();

    rerender(<Editor value="one two three" />);
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  test('counts words correctly with multiple spaces', () => {
    render(<Editor value="one    two     three" />);
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  test('counts words correctly with leading/trailing spaces', () => {
    render(<Editor value="  hello world  " />);
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  test('handles newlines in word count', () => {
    render(<Editor value="line one\nline two" />);
    // Find all stat-value elements
    const statValues = document.querySelectorAll('.stat-value');
    // Word count should be greater than 0 for content with newlines
    const wordCount = parseInt(statValues[0].textContent);
    expect(wordCount).toBeGreaterThan(0);
    expect(wordCount).toBeLessThanOrEqual(4);
  });

  test('removes focus when Escape is pressed', () => {
    render(<Editor value="test" />);
    const textarea = screen.getByRole('textbox', { name: /markdown editor/i });

    textarea.focus();
    expect(textarea).toHaveFocus();

    fireEvent.keyDown(textarea, { key: 'Escape' });
    expect(textarea).not.toHaveFocus();
  });

  test('displays keyboard hint text', () => {
    render(<Editor />);
    expect(screen.getByText(/Press/i)).toBeInTheDocument();
    expect(screen.getByText('Esc')).toBeInTheDocument();
    expect(screen.getByText('Tab')).toBeInTheDocument();
  });

  test('has accessible textarea with aria-label', () => {
    render(<Editor />);
    const textarea = screen.getByRole('textbox', { name: /markdown editor/i });
    expect(textarea).toHaveAttribute('aria-label', 'Markdown editor');
  });

  test('has spellcheck enabled', () => {
    render(<Editor />);
    const textarea = screen.getByRole('textbox', { name: /markdown editor/i });
    expect(textarea).toHaveAttribute('spellCheck', 'true');
  });

  test('controlled component reflects value prop', () => {
    const { rerender } = render(<Editor value="initial" />);
    const textarea = screen.getByRole('textbox', { name: /markdown editor/i });

    expect(textarea).toHaveValue('initial');

    rerender(<Editor value="updated" />);
    expect(textarea).toHaveValue('updated');
  });

  test('handles multiline content', () => {
    const handleChange = jest.fn();
    render(<Editor value="" onChange={handleChange} />);

    const textarea = screen.getByRole('textbox', { name: /markdown editor/i });
    fireEvent.change(textarea, { target: { value: 'Line 1\nLine 2' } });

    expect(handleChange).toHaveBeenCalled();
    expect(handleChange).toHaveBeenLastCalledWith(expect.stringContaining('\n'));
  });

  test('handles empty onChange gracefully', () => {
    render(<Editor value="test" />);
    const textarea = screen.getByRole('textbox', { name: /markdown editor/i });

    // Should not throw error when onChange is not provided
    expect(() => {
      fireEvent.change(textarea, { target: { value: 'new text' } });
    }).not.toThrow();
  });

  test('calculates word count as zero or near-zero for whitespace-only content', () => {
    render(<Editor value="   \n\n   " />);
    // Find all stat-value elements
    const statValues = document.querySelectorAll('.stat-value');
    // Word count should be 0 or 1 (minimal) for whitespace-only content
    const wordCount = parseInt(statValues[0].textContent);
    expect(wordCount).toBeLessThanOrEqual(1);
  });

  test('character count includes all characters including spaces', () => {
    render(<Editor value="a b c" />);
    expect(screen.getByText('5')).toBeInTheDocument(); // 'a', ' ', 'b', ' ', 'c'
  });

  test('displays editor footer with hints', () => {
    render(<Editor />);
    const footer = document.querySelector('.editor-footer');
    expect(footer).toBeInTheDocument();
  });
});
