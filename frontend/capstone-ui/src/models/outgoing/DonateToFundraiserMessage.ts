export interface DonateToFundraiserMessage {
   fundraiserID: string;
   message: string;
   amount: number;
   userID: string | undefined;
   isSavingPaymentInformation: boolean;
   firstName: string;
   lastName: string;
   cardNumber: string;
   expirationDate: string;
   securityCode: string;
   isAnonymous: boolean;
}