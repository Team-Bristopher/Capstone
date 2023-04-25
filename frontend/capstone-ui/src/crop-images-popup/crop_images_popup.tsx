import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, IconButton, Text } from "@chakra-ui/react";
import { FunctionComponent, useRef, useState } from "react";
import Cropper, { Area, Point, Size } from "react-easy-crop";
import { VscClose } from "react-icons/vsc";
import { getCroppedImg } from "../globals/helpers";
import { Button } from "../input/button";

interface CropImagesPopupProps {
   image: string;
   cropShape: "rect" | "round";
   cropAspectRatio: number;
   cropSize: Size;
   onClose: (result: "success" | "fail" | "manually_cancelled", imageURL: string | undefined) => void;
}

export const CropImagesPopup: FunctionComponent<CropImagesPopupProps> = (props: CropImagesPopupProps) => {
   const [imageCrop, setImageCrop] = useState<Point>({
      x: 0,
      y: 0,
   });

   const [zoom, setZoom] = useState<number>(1);

   const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area>({
      x: 0,
      y: 0,
      width: 0,
      height: 0,
   });

   const cancelRef = useRef(null);

   const handleSuccessClose = async () => {
      try {
         const croppedImage = await getCroppedImg(
            props.image,
            croppedAreaPixels,
            0
         );

         props.onClose("success", croppedImage ?? undefined);
      } catch {
         props.onClose("fail", undefined);
      }
   }

   return (
      <>
         <AlertDialog
            motionPreset="slideInBottom"
            onClose={() => { }}
            isOpen={true}
            leastDestructiveRef={cancelRef}
            isCentered
         >
            <AlertDialogOverlay />
            <AlertDialogContent
               maxWidth="100vw"
               width="50vw"
            >
               <AlertDialogHeader
                  backgroundColor="#2B2D42"
                  color="white"
                  fontSize="1.5em"
                  width="100%"
                  display="flex"
                  flexDir="row"
                  justifyContent="space-between"
               >
                  <Text
                     width="75%"
                  >
                     Please crop image
                  </Text>
                  <IconButton
                     icon={<VscClose />}
                     backgroundColor="transparent"
                     aria-label="Close donation popup button"
                     _hover={{
                        backgroundColor: "transparent",
                        color: "#EF233C"
                     }}
                     size="xl"
                     onClick={() => { props.onClose("manually_cancelled", undefined); }}
                  />
               </AlertDialogHeader>
               <AlertDialogBody
                  padding="0.7em"
                  position="relative"
                  width="100%"
                  maxWidth="100%"
                  height="100%"
                  maxHeight="100%"
                  minH="30em"
               >
                  <Cropper
                     image={props.image}
                     crop={imageCrop}
                     cropShape={props.cropShape}
                     aspect={props.cropAspectRatio}
                     onCropChange={setImageCrop}
                     zoom={zoom}
                     onZoomChange={setZoom}
                     zoomWithScroll={true}
                     style={{
                        containerStyle: {
                           width: "100%",
                           height: "100%",
                        }
                     }}
                     cropSize={props.cropSize}
                     onCropComplete={(croppedArea, croppedAreaPixels) => { setCroppedAreaPixels(croppedAreaPixels); }}
                  />
               </AlertDialogBody>
               <AlertDialogFooter
                  backgroundColor="#2B2D42"
                  color="white"
                  width="100%"
                  display="flex"
                  flexDir="row"
                  alignContent="center"
                  justifyContent="end"
               >
                  <Button
                     label="Finish"
                     ariaLabel="Finish cropping image"
                     onClick={handleSuccessClose}
                     variant="text_only"
                  />
               </AlertDialogFooter>
            </AlertDialogContent>
         </AlertDialog>
      </>
   );
}