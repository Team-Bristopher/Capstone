export interface CreateFundraiserResponseMessageRaw {
   fundraiserID: string;
}

export interface CreateFundraiserResponseMessage {
   responseType: "success" | "error";
   message: "Fundraiser was successfully created" | "An unknown error has occured";
   fundraiserID: string;
}