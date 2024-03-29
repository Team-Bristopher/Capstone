import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { App } from "../src/App";

it("renders main page", () => {
  const queryClient = new QueryClient();

  const mainPage = render(
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </BrowserRouter>
  );

  expect(mainPage.container.childNodes.length).toBeGreaterThan(0);
});
