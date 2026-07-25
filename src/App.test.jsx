import { render, screen } from '@testing-library/react';
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
});
