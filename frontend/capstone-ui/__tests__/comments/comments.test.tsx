import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import * as api from "../../src/api/api-calls";
import { Comments } from "../../src/comments/comments";
import { FundraiserContext } from "../../src/fundraiser-detail/fundraiser_detail";
import { FundraiserDonationMessage } from "../../src/models/incoming/FundraiserDonationMessage";
import { generateMockFundraiser, getMockDonationMessage } from "../jest-helpers/jest-helpers";

jest.mock("../../src/api/api-calls");

let mockDonationMessages: FundraiserDonationMessage[] | undefined = undefined
let getAllDonationsMock: jest.MockedFn<(fundraiserID: string, page: number, onlyComments?: boolean) => Promise<FundraiserDonationMessage[]>> | undefined = undefined

describe("comments tests", () => {
   beforeAll(() => {
      jest.clearAllMocks();

      getAllDonationsMock = jest.mocked(api.getAllDonations);

      // Verifying the API call mocked function is
      // properly being mocked.
      expect(jest.isMockFunction(getAllDonationsMock)).toBeTruthy();

      mockDonationMessages = getMockDonationMessage(6);

      getAllDonationsMock.mockResolvedValue(mockDonationMessages);
   });

   it("renders without fundraiser context properly", async () => {
      const queryClient = new QueryClient();

      const component = render(
         <BrowserRouter>
            <QueryClientProvider client={queryClient}>
               <FundraiserContext.Provider value={undefined}>
                  <Comments />
               </FundraiserContext.Provider>
            </QueryClientProvider>
         </BrowserRouter >
      );

      expect(mockDonationMessages).toBeTruthy();

      mockDonationMessages!.forEach(async (message) => {
         expect(await component.findByText(message.message)).toBeUndefined();
      })
   })

   it("renders comments properly", async () => {
      const queryClient = new QueryClient();

      const mockFundraiser = generateMockFundraiser(6);

      const component = render(
         <BrowserRouter>
            <QueryClientProvider client={queryClient}>
               <FundraiserContext.Provider value={{ fundraiser: mockFundraiser }}>
                  <Comments />
               </FundraiserContext.Provider>
            </QueryClientProvider>
         </BrowserRouter >
      );

      expect(mockDonationMessages).toBeTruthy();

      mockDonationMessages!.forEach(async (message) => {
         expect(await component.findByText(message.message)).toBeTruthy();
      })
   })

   it("renders see all button properly", async () => {
      const queryClient = new QueryClient();

      const mockFundraiser = generateMockFundraiser(12);

      expect(getAllDonationsMock).toBeTruthy();

      getAllDonationsMock!.mockResolvedValue(getMockDonationMessage(12));

      const component = render(
         <BrowserRouter>
            <QueryClientProvider client={queryClient}>
               <FundraiserContext.Provider value={{ fundraiser: mockFundraiser }}>
                  <Comments />
               </FundraiserContext.Provider>
            </QueryClientProvider>
         </BrowserRouter >
      );

      expect(mockDonationMessages).toBeTruthy();

      expect(await component.findByText("See all")).toBeTruthy();
   })
});