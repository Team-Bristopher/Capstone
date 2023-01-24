import React from "react";
import { BrowserRouter } from "react-router-dom";
import { Settings } from "../../src/settings/settings";
import { render, waitFor, screen } from '@testing-library/react';
import * as api from "../../src/api/api-calls";
import { act } from "react-dom/test-utils";

jest.mock("../../src/api/api-calls");

describe("settings component", () => {
    beforeEach(() => jest.clearAllMocks());

    it("renders settings", async () => {
        const getApiStatusMock = jest.mocked(api.getApiStatus);

        // Verifying the API call mocked function is 
        // properly being mocked.
        expect(jest.isMockFunction(getApiStatusMock)).toBeTruthy();

        getApiStatusMock.mockResolvedValueOnce({
            health: "Operational",
        });

        let component: any;

        await act(async () => {
            component = render(
                <BrowserRouter>
                    <Settings />
                </BrowserRouter>
            );
        });

        // Children existence.
        expect(component!.container.childNodes.length).toBeGreaterThan(0);
    
        // Specific children existence.
        expect(component!.getByText("API Status")).toBeTruthy();
    });

    it("properly renders API status - operational", async () => {
        const getApiStatusMock = jest.mocked(api.getApiStatus);

        // Verifying the API call mocked function is 
        // properly being mocked.
        expect(jest.isMockFunction(getApiStatusMock)).toBeTruthy();

        getApiStatusMock.mockResolvedValueOnce({
            health: "Operational",
        });

        await act(async () => {
            render(
                <BrowserRouter>
                    <Settings />
                </BrowserRouter>
            );
        });

        // Verifying that "Operational" 
        // appears as the API status.
        await waitFor(() => {
            screen.getByText("Operational");
        });
    });

    it("properly renders API status - error", async () => {
        const getApiStatusMock = jest.mocked(api.getApiStatus);

        // Verifying the API call mocked function is 
        // properly being mocked.
        expect(jest.isMockFunction(getApiStatusMock)).toBeTruthy();

        getApiStatusMock.mockResolvedValueOnce(undefined);

        await act(async () => {
            render(
                <BrowserRouter>
                    <Settings />
                </BrowserRouter>
            );
        });

        // Verifying that "Error" 
        // appears as the API status.
        await waitFor(() => {
            screen.getByText("Error");
        });
    });
})

