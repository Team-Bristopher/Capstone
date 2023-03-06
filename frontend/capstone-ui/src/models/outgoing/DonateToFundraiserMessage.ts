export interface DonateToFundraiserMessage {
   fundraiserID: string;
   amount: number;
   userID: string | undefined;
   isSavingPaymentInformation: boolean;
   firstName: string;
   lastName: string;
   cardNumber: string;
   expirationDate: string;
   securityCode: string;
}