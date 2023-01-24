import React from 'react';
import { render } from '@testing-library/react';
import { Navbar } from "../../src/navbar/navbar";
import { BrowserRouter } from 'react-router-dom';

it('renders navbar', () => {
  const navbar = render(
    <BrowserRouter>
      <Navbar />
    </BrowserRouter>
  );

  // Children existence.
  expect(navbar.container.childNodes.length).toBeGreaterThan(0);

  // Settings button existence.
  expect(navbar.getByLabelText("Settings menu")).toBeTruthy();
});
