import { render, screen } from '@testing-library/react';
import { App } from '../src/App';

test('renders main page', () => {
  render(<App />);

  const linkElement = screen.getByText(/capstone project/i);
  
  expect(linkElement).toBeInTheDocument();
});
