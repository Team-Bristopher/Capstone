import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, waitFor } from "@testing-library/react";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { AllDonationsPopup } from "../../src/all-donations-popup/all_donations_popup";
import * as api from "../../src/api/api-calls";
import { FundraiserContext } from "../../src/fundraiser-detail/fundraiser_detail";
import { FundraiserDonationMessage } from "../../src/models/incoming/FundraiserDonationMessage";
import { generateMockFundraiser, getMockDonationMessage } from "../jest-helpers/jest-helpers";

jest.mock("../../src/api/api-calls");

let mockDonationMessages: FundraiserDonationMessage[] | undefined = undefined
let getAllDonationsMock: jest.MockedFn<(fundraiserID: string, page: number, onlyComments?: boolean) => Promise<FundraiserDonationMessage[]>> | undefined = undefined

describe("all donations popup tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();

      getAllDonationsMock = jest.mocked(api.getAllDonations);

      // Verifying the API call mocked function is
      // properly being mocked.
      expect(jest.isMockFunction(getAllDonationsMock)).toBeTruthy();

      mockDonationMessages = getMockDonationMessage(6);

      getAllDonationsMock.mockResolvedValue(mockDonationMessages);
   });

   it("renders name of fundraiser properly", async () => {
      const queryClient = new QueryClient();

      const mockFundraiser = generateMockFundraiser();

      const component = render(
         <BrowserRouter>
            <QueryClientProvider client={queryClient}>
               <FundraiserContext.Provider value={{ fundraiser: mockFundraiser }}>
                  <AllDonationsPopup onClose={() => { }} />
               </FundraiserContext.Provider>
            </QueryClientProvider>
         </BrowserRouter >
      );

      expect(component.findByText(`All donations to ${mockFundraiser.title}`)).toBeTruthy();
   });

   it("renders donations properly", async () => {
      const queryClient = new QueryClient();

      const component = render(
         <BrowserRouter>
            <QueryClientProvider client={queryClient}>
               <AllDonationsPopup onClose={() => { }} />
            </QueryClientProvider>
         </BrowserRouter>
      );

      expect(mockDonationMessages).toBeTruthy();

      mockDonationMessages!.forEach((message) => {
         expect(component.findByText(message.individualAmount)).toBeTruthy()
      });
   });

   it("renders donation pages properly", () => {
      const queryClient = new QueryClient();

      const mockFundraiser = generateMockFundraiser();

      const component = render(
         <BrowserRouter>
            <QueryClientProvider client={queryClient}>
               <FundraiserContext.Provider value={{ fundraiser: mockFundraiser }}>
                  <AllDonationsPopup onClose={() => { }} />
               </FundraiserContext.Provider>
            </QueryClientProvider>
         </BrowserRouter >
      );

      expect(mockDonationMessages).toBeTruthy();

      expect(component.findByText("Page 0 out of 2")).toBeTruthy();
   });

   it("handles no fundraiser context properly", () => {
      const queryClient = new QueryClient();

      const component = render(
         <BrowserRouter>
            <QueryClientProvider client={queryClient}>
               <FundraiserContext.Provider value={undefined}>
                  <AllDonationsPopup onClose={() => { }} />
               </FundraiserContext.Provider>
            </QueryClientProvider>
         </BrowserRouter >
      );

      expect(mockDonationMessages).toBeTruthy();

      mockDonationMessages!.forEach(async (message) => {
         expect(await component.findByText(message.individualAmount)).toBeUndefined();
      });
   });

   it("renders no donations properly", async () => {
      expect(getAllDonationsMock).toBeTruthy();

      getAllDonationsMock!.mockResolvedValue([]);

      const queryClient = new QueryClient();

      const mockFundraiser = generateMockFundraiser();

      const component = render(
         <BrowserRouter>
            <QueryClientProvider client={queryClient}>
               <FundraiserContext.Provider value={{ fundraiser: mockFundraiser }}>
                  <AllDonationsPopup onClose={() => { }} />
               </FundraiserContext.Provider>
            </QueryClientProvider>
         </BrowserRouter >
      );

      await waitFor(async () => {
         expect(await component.findByText("Page 0 out of 0")).toBeTruthy();
         expect((await component.getByLabelText("Next page button")).outerHTML).toContain("disabled");
         expect((await component.getByLabelText("Previous page button")).outerHTML).toContain("disabled");
      });
   });
});