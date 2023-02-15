import { render } from "@testing-library/react";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { Page } from "../../src/page/page";

it("renders page", () => {
  const page = render(
    <BrowserRouter>
      <Page>
        <div>Testing children</div>
      </Page>
    </BrowserRouter>
  );

  // Children existence.
  expect(page.container.childNodes.length).toBeGreaterThan(0);

  // Children props existence.
  expect(page.getByText("Testing children")).toBeTruthy();
});
