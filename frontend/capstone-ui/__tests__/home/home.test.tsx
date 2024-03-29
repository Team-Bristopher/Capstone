import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { Home } from "../../src/home/home";

it("renders home", () => {
  const queryClient = new QueryClient();

  const home = render(
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <Home />
      </QueryClientProvider>
    </BrowserRouter>
  );

  // Children existence.
  expect(home.container.childNodes.length).toBeGreaterThan(0);
});
