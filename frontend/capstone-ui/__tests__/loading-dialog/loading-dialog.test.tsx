import { render } from "@testing-library/react";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { LoadingDialog } from "../../src/loading-dialog/loading_dialog";
import { Page } from "../../src/page/page";

it("renders loading dialog", () => {
   const loadingDialog = render(
      <BrowserRouter>
         <Page>
            <LoadingDialog open={true} />
         </Page>
      </BrowserRouter>
   );

   // Children existence.
   expect(loadingDialog.container.childNodes.length).toBeGreaterThan(0);
});