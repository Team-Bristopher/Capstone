import { faker } from "@faker-js/faker";
import { act, render, RenderResult } from "@testing-library/react";
import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter } from "react-router-dom";
import { AllDonationsPopup } from "../../src/all-donations-popup/all_donations_popup";
import * as api from "../../src/api/api-calls";
import { Home } from "../../src/home/home";
import { FundraiserDonationMessage } from "../../src/models/incoming/FundraiserDonationMessage";

jest.mock("../../src/api/api-calls");

const getMockDonationMessage = (amt: number): Array<FundraiserDonationMessage> => {
   let donations: Array<FundraiserDonationMessage> = [];

   for (let i = 0; i < amt; i++) {
      donations.push({
         firstName: faker.name.firstName(),
         lastName: faker.name.lastName(),
         individualAmount: Number(faker.finance.amount()),
         donatedAt: faker.date.recent(),
         message: faker.random.words(),
      });
   }

   return donations;
}

describe("all donations popup tests", () => {
   beforeEach(() => jest.clearAllMocks());

   it("renders all donations popup", () => {
      const queryClient = new QueryClient();

      const all_donations_popup = render(
         <BrowserRouter>
            <QueryClientProvider client={queryClient}>
               <Home />
            </QueryClientProvider>
         </BrowserRouter>
      );

      // Children existence.
      expect(all_donations_popup.container.childNodes.length).toBeGreaterThan(0);
   });

   it("renders comments properly", async () => {
      const queryClient = new QueryClient();

      const getAllDonationsMock = jest.mocked(api.getAllDonations);

      // Verifying the API call mocked function is
      // properly being mocked.
      expect(jest.isMockFunction(getAllDonationsMock)).toBeTruthy();

      const mockDonationMessages = getMockDonationMessage(25);

      getAllDonationsMock.mockResolvedValueOnce(mockDonationMessages);

      let component: RenderResult;

      await act(async () => {
         component = render(
            <BrowserRouter>
               <QueryClientProvider client={queryClient}>
                  <AllDonationsPopup onClose={() => { }} />
               </QueryClientProvider>
            </BrowserRouter>
         );
      });

      // Expect to find all donation messages
      // in the component listed. Only up to 25 since 
      // we allow a max page of 25 results.
      mockDonationMessages.forEach((message) => {
         expect(component.findByText(message.message)).toBeTruthy()
      });
   });
});