import { render } from "@testing-library/react";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { Navbar } from "../../src/navbar/navbar";

it("renders navbar", () => {
  const navbar = render(
    <BrowserRouter>
      <Navbar />
    </BrowserRouter>
  );

  // Children existence.
  expect(navbar.container.childNodes.length).toBeGreaterThan(0);

  // Login button existence.
  expect(navbar.getByText("Log In")).toBeTruthy();
});
