
export interface Fundraiser {
   id: string;
   type: number;
   title: string;
   description: string;
   views: number;
   target: number;
   createdOn: Date;
   modifiedOn: Date;
   createdBy: string;
   endDate: Date;
}