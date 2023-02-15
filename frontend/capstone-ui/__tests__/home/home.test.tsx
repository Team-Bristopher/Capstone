import React from "react";
import { BrowserRouter } from "react-router-dom";
import { Home } from "../../src/home/home";
import { render } from "@testing-library/react";

it("renders home", () => {
  const home = render(
    <BrowserRouter>
      <Home />
    </BrowserRouter>
  );

  // Children existence.
  expect(home.container.childNodes.length).toBeGreaterThan(0);
});
