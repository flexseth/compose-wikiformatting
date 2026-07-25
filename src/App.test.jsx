import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('App Component', () => {
  test('renders application title', () => {
    render(<App />);
    const titleElement = screen.getByText(/Compose WikiFormatting/i);
    expect(titleElement).toBeInTheDocument();
  });

  test('renders application description', () => {
    render(<App />);
    const descriptionElement = screen.getByText(/Convert Markdown to WikiFormatting for WordPress Trac/i);
    expect(descriptionElement).toBeInTheDocument();
  });

  test('renders Editor component', () => {
    render(<App />);
    const editor = screen.getByRole('textbox', { name: /markdown editor/i });
    expect(editor).toBeInTheDocument();
  });

  test('renders Sidebar component', () => {
    render(<App />);
    const sidebarTitle = screen.getByText(/WikiFormatting Docs/i);
    expect(sidebarTitle).toBeInTheDocument();
  });

  test('manages editor content state', async () => {
    const user = userEvent.setup();
    render(<App />);

    const editor = screen.getByRole('textbox', { name: /markdown editor/i });

    // Type each character with a small delay to avoid act warnings
    await user.type(editor, 'T');
    expect(editor).toHaveValue('T');

    await user.clear(editor);
    await user.type(editor, 'Test');
    expect(editor).toHaveValue('Test');
  });
});
