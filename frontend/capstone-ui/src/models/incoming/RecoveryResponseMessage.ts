export interface RecoveryResponseMessage {
   recoveryCodeAuthenticationCode: string;
   message: "Successfully verified recovery code" | "An unknown error has occured";
   responseType: "success" | "error";
}