import { faker } from "@faker-js/faker";
import { Fundraiser } from "../../src/models/incoming/Fundraiser";
import { FundraiserDonationMessage } from "../../src/models/incoming/FundraiserDonationMessage";

export const getMockDonationMessage = (amt: number): Array<FundraiserDonationMessage> => {
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

export const generateMockFundraiser = (commentCount?: number): Fundraiser => {
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
         profilePictureURL: "",
      },
      commentCount: commentCount !== undefined ? commentCount : 0,
      donationCount: 0,
      imageURLs: [],
   };
}