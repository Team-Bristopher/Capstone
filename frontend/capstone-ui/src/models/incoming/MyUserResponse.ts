export interface MyUserResponseSuccess {
   id: string;
   firstName: string;
   lastName: string;
   email: string;
   role: string;
}

export interface MyUserResponse {
   message: "Success" | "An unknown error has occured";
   responseType: "success" | "error";
   myUser: MyUserResponseSuccess | undefined;
}