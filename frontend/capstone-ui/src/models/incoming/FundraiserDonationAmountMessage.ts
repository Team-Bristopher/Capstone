import { FundraiserDonationMessage } from "./FundraiserDonationMessage";

export interface FundraiserDonationAmountMessage {
   totalAmount: number;
   recentDonations: Array<FundraiserDonationMessage>;
}