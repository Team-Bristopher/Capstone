import React from "react";
import { BrowserRouter } from "react-router-dom";
import { NotFound } from "../../src/notfound/notfound";
import { render } from '@testing-library/react';

it("renders not found", () => {
    const notFound = render(
        <BrowserRouter>
            <NotFound />
        </BrowserRouter>
    );

    // Children existence.
    expect(notFound.container.childNodes.length).toBeGreaterThan(0);

    // Text existence.
    expect(notFound.getByText("How did you end up here? Page not found.")).toBeTruthy();
});