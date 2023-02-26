export interface CreateFundraiserMessage {
   title: string;
   description: string;
   goal: number;
   category: number;
   expirationDate: Date;
}