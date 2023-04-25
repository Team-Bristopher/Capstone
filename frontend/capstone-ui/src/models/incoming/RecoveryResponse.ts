export interface RecoveryResponse {
   message: "An email has been sent for recovery" | "An unknown error has occured";
   responseType: "success" | "error";
}