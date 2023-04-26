export interface ImageUploadResponseMessage {
   message: "Image(s) successfully uploaded." | "An unknown error has occured while uploading image(s).";
   responseType: "success" | "error";
}
