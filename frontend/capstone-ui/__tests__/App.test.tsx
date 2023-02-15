import React from "react";
import { render } from "@testing-library/react";
import { App } from "../src/App";
import { BrowserRouter } from "react-router-dom";

it("renders main page", () => {
  const mainPage = render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );

  expect(mainPage.container.childNodes.length).toBeGreaterThan(0);
});
