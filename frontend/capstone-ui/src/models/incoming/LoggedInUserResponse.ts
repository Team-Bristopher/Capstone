export interface LoggedInUserResponse {
   message: "Logged in successfully" | "User not found" | "Invalid information" | "An unknown error has occured";
   responseType: "success" | "error";
   accessToken: string;
}