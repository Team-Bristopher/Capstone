import { render } from "@testing-library/react";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { Footer } from "../../src/footer/footer";

it("renders footer", () => {
   const footer = render(
      <BrowserRouter>
         <Footer />
      </BrowserRouter>
   );

   // Children existence.
   expect(footer.container.childNodes.length).toBeGreaterThan(0);

   // Text existence.
   expect(footer.getByText("Privacy Policy")).toBeTruthy();
   expect(footer.getByText("Accessibility Statement")).toBeTruthy();
   expect(footer.getByText("Terms of Use")).toBeTruthy();
});