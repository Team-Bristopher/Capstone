import { render } from "@testing-library/react";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { Login } from "../../src/login/login";

describe("test login page", () => {
   it("renders login page", () => {
      const login = render(
         <BrowserRouter>
            <Login />
         </BrowserRouter>
      );

      // Children existence.
      expect(login.container.childNodes.length).toBeGreaterThan(0);
   });
})