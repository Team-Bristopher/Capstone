export interface RegisterUserResponse {
   responseType: "success" | "error",
   responseMessage: "User has been created." | "User already exists." | "An unknown error has occured.",
}