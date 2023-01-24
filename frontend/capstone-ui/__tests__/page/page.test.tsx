import React from "react";
import { BrowserRouter } from "react-router-dom";
import { Page } from "../../src/page/page";
import { render } from '@testing-library/react';

it("renders page", () => {
    const page = render(
        <BrowserRouter>
            <Page>
               <div>
                    Testing children
                </div> 
            </Page>
        </BrowserRouter>
    );

    // Children existence.
    expect(page.container.childNodes.length).toBeGreaterThan(0);

    // Children props existence.
    expect(page.getByText("Testing children")).toBeTruthy();

    // Navbar existence by items.
    expect(page.getByLabelText("Settings menu")).toBeTruthy();
});