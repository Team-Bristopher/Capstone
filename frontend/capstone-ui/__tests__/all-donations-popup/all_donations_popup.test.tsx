import { faker } from "@faker-js/faker";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, render, RenderResult } from "@testing-library/react";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { AllDonationsPopup } from "../../src/all-donations-popup/all_donations_popup";
import * as api from "../../src/api/api-calls";
import { FundraiserContext } from "../../src/fundraiser-detail/fundraiser_detail";
import { Fundraiser } from "../../src/models/incoming/Fundraiser";
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

const generateMockFundraiser = (): Fundraiser => {
   return {
      id: faker.finance.bitcoinAddress(),
      type: 0,
      title: faker.random.words(),
      description: faker.random.words(),
      views: faker.datatype.number(),
      target: faker.datatype.number(),
      createdOn: new Date(),
      createdBy: faker.name.fullName(),
      modifiedOn: new Date(),
      endDate: new Date(),
      author: {
         firstName: faker.name.firstName(),
         lastName: faker.name.lastName(),
      },
      commentCount: 0,
   };
}

describe("all donations popup tests", () => {
   beforeEach(() => jest.clearAllMocks());

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

      expect(component.findByText(mockFundraiser.title)).toBeTruthy();
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