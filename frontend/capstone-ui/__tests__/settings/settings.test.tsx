import { render } from "@testing-library/react";
import React from "react";
import { act } from "react-dom/test-utils";
import { BrowserRouter } from "react-router-dom";
import * as api from "../../src/api/api-calls";
import { Settings } from "../../src/settings/settings";

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
  });
});
