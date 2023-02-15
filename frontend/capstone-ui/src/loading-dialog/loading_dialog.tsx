import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogOverlay, Box, Icon, Progress, useDisclosure } from "@chakra-ui/react";
import { FunctionComponent, useEffect, useRef } from "react";
import { GiGreatPyramid } from "react-icons/gi";

interface LoadingDialogProps {
   open: boolean;
}

export const LoadingDialog: FunctionComponent<LoadingDialogProps> = (props: LoadingDialogProps) => {
   const { isOpen, onOpen, onClose } = useDisclosure();
   const cancelRef = useRef(null);

   useEffect(() => {
      if (props.open) {
         onOpen();
      } else {
         onClose();
      }
   }, [props.open, onClose, onOpen]);

   return (
      <>
         <AlertDialog
            motionPreset="slideInBottom"
            onClose={onClose}
            isOpen={isOpen}
            leastDestructiveRef={cancelRef}
            isCentered
         >
            <AlertDialogOverlay />
            <AlertDialogContent backgroundColor="transparent">
               <AlertDialogBody display="flex" justifyContent="center" padding="2em" flexDir="column" backgroundColor="transparent">
                  <Box
                     width="100%"
                     height="auto"
                     display="flex"
                     justifyContent="center"
                     backgroundColor="transparent"
                  >
                     <Icon
                        as={GiGreatPyramid}
                        boxSize="10"
                        width="10em"
                        height="10em"
                        color="#D90429"
                     />
                  </Box>
                  <Progress
                     size="lg"
                     isIndeterminate
                     width="100%"
                     marginTop="2em"
                     colorScheme="red"
                  />
               </AlertDialogBody>
            </AlertDialogContent>
         </AlertDialog>
      </>
   );
}