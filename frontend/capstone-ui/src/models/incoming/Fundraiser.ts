export interface UserMessage {
   firstName: string;
   lastName: string;
   profilePictureURL: string;
}

export enum FundrasierCategory {
   Medical = 0,
   Education = 1,
   Disaster_Relief = 2,
   Environment = 3,
   Animal_Welfare = 4,
   Financial_Assistance = 5,
   Religion = 6,
   Community = 7,
   Political = 8,
   Other = 9,
}

export interface Fundraiser {
   id: string;
   type: FundrasierCategory;
   title: string;
   description: string;
   views: number;
   target: number;
   createdOn: Date;
   modifiedOn: Date;
   createdBy: string;
   endDate: Date;
   author: UserMessage;
   commentCount: number;
   donationCount: number;
   imageURLs: Array<string>;
}