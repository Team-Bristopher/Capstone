import { Area } from "react-easy-crop";
import { IconType } from "react-icons";
import { BsQuestionCircleFill } from "react-icons/bs";
import { FaCity, FaClinicMedical, FaMoneyBillWave, FaPray } from "react-icons/fa";
import { GiEarthAmerica, GiEarthCrack, GiSittingDog } from "react-icons/gi";
import { GoLaw } from "react-icons/go";
import { IoSchoolSharp } from "react-icons/io5";
import { FundrasierCategory } from "../models/incoming/Fundraiser";

export const getRelativeTimeText = (current: number, previous: number): string => {
   const msPerMinute = 60 * 1000;
   const msPerHour = msPerMinute * 60;
   const msPerDay = msPerHour * 24;
   const msPerMonth = msPerDay * 30;
   const msPerYear = msPerDay * 365;

   const elapsed = current - previous;

   if (elapsed < msPerMinute) {
      return Math.round(elapsed / 1000) + " seconds ago";
   }

   else if (elapsed < msPerHour) {
      return Math.round(elapsed / msPerMinute) + " minutes ago";
   }

   else if (elapsed < msPerDay) {
      return Math.round(elapsed / msPerHour) + " hours ago";
   }

   else if (elapsed < msPerMonth) {
      return "~" + Math.round(elapsed / msPerDay) + " days ago";
   }

   else if (elapsed < msPerYear) {
      return "~" + Math.round(elapsed / msPerMonth) + " months ago";
   }

   else {
      return "~" + Math.round(elapsed / msPerYear) + " years ago";
   }
}

export const getFormattedDateString = (date: Date): string => {
   const year = date.getFullYear();
   const day = date.getDay();
   const month = date.getMonth();

   return `${day}/${month}/${year}`;
}

export const formatCurrencyToString = (amount: number): string => {
   const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      compactDisplay: "short",
   });

   const formattedString = formatter.format(amount);

   // Removing empty cents.
   return formattedString.replace(".00", "");
}

export const createImage = (url: string): Promise<HTMLImageElement> =>
   new Promise((resolve, reject) => {
      const image = new Image()
      image.addEventListener('load', () => resolve(image))
      image.addEventListener('error', (error) => reject(error))
      image.setAttribute('crossOrigin', 'anonymous')
      image.src = url
   })

export function getRadianAngle(degreeValue: number) {
   return (degreeValue * Math.PI) / 180
}

/**
 * Returns the new bounding area of a rotated rectangle.
 */
export function rotateSize(width: number, height: number, rotation: number) {
   const rotRad = getRadianAngle(rotation)

   return {
      width:
         Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
      height:
         Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
   }
}

/**
 * This function was adapted from the one in the README of https://github.com/DominicTobias/react-image-crop
 */
export const getCroppedImg = async (
   imageSrc: string,
   pixelCrop: Area,
   rotation = 0,
   flip = { horizontal: false, vertical: false }
): Promise<string | null> => {
   const image = await createImage(imageSrc);
   const canvas = document.createElement("canvas");
   const ctx = canvas.getContext("2d");

   if (!ctx) {
      return Promise.reject(null);
   }

   const rotRad = getRadianAngle(rotation);

   // calculate bounding box of the rotated image
   const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
      image.width,
      image.height,
      rotation
   );

   // set canvas size to match the bounding box
   canvas.width = bBoxWidth;
   canvas.height = bBoxHeight;

   // translate canvas context to a central location to allow rotating and flipping around the center
   ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
   ctx.rotate(rotRad);
   ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);
   ctx.translate(-image.width / 2, -image.height / 2);

   // draw rotated image
   ctx.drawImage(image, 0, 0);

   // croppedAreaPixels values are bounding box relative
   // extract the cropped image using these values
   const data = ctx.getImageData(
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height
   );

   // set canvas width to final desired crop size - this will clear existing context
   canvas.width = pixelCrop.width;
   canvas.height = pixelCrop.height;

   // paste generated rotate image at the top left corner
   ctx.putImageData(data, 0, 0);

   // As Base64 string
   // return canvas.toDataURL('image/jpeg');

   // As a blob
   return new Promise((resolve, reject) => {
      canvas.toBlob((file) => {
         if (file === null) {
            reject();
            return;
         }

         resolve(URL.createObjectURL(file))
      }, "image/jpeg")
   })
}

export const getCategoryIcon = (category: FundrasierCategory | undefined): [string, IconType] => {
   switch (category) {
      case FundrasierCategory.Medical:
         return ["Medical", FaClinicMedical]
      case FundrasierCategory.Education:
         return ["Education", IoSchoolSharp]
      case FundrasierCategory.Disaster_Relief:
         return ["Disaster Relief", GiEarthCrack]
      case FundrasierCategory.Environment:
         return ["Environment", GiEarthAmerica]
      case FundrasierCategory.Animal_Welfare:
         return ["Animal Welfare", GiSittingDog]
      case FundrasierCategory.Financial_Assistance:
         return ["Financial Assistance", FaMoneyBillWave]
      case FundrasierCategory.Religion:
         return ["Religion", FaPray]
      case FundrasierCategory.Community:
         return ["Community", FaCity]
      case FundrasierCategory.Political:
         return ["Political", GoLaw]
      default:
         return ["Other", BsQuestionCircleFill]
   }
}