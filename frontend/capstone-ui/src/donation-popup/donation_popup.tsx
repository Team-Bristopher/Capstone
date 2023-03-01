import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Checkbox, Container, IconButton, Text } from "@chakra-ui/react";
import { FunctionComponent, useRef } from "react";
import { BiLogIn } from "react-icons/bi";
import { MdOutlineAttachMoney } from "react-icons/md";
import { VscClose } from "react-icons/vsc";
import { Button } from "../input/button";
import { NumberInput } from "../input/numberinput";
import { TextInput } from "../input/textinput";

export interface DonationPopupProps {
   fundraiserTitle: string;
   fundraiserID: string;
   onClose: () => void;
}

export const DonationPopup: FunctionComponent<DonationPopupProps> = (props: DonationPopupProps) => {
   const cancelRef = useRef(null);

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
                     Donate to {props.fundraiserTitle}
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
                     onClick={() => { props.onClose(); }}
                  />
               </AlertDialogHeader>
               <AlertDialogBody
                  padding="0.7em"
               >
                  <NumberInput
                     label="Amount"
                     ariaLabel="End goal of fundraiser input"
                     defaultValue={0}
                     keepWithinRange={true}
                     clampValueOnBlur={true}
                     icon={MdOutlineAttachMoney}
                     containerStyle={{
                        marginTop: "0",
                     }}
                  // formInfo={{
                  //    name: CreateFundraiserFormNames.goal,
                  //    registerFn: register,
                  //    registerOptions: {
                  //       required: REQUIRED_FIELD_ERROR,
                  //       min: {
                  //          message: GOAL_TOO_SMALL_ERROR,
                  //          value: 1,
                  //       },
                  //    },
                  //    errorMessage: formState.errors.goal?.message || "",
                  // }}
                  />
                  <TextInput
                     variant="text_only"
                     label="Add a message (optional)"
                     ariaLabel="Optional donation message"
                     isTopDown={true}
                     containerStyle={{
                        height: "20em",
                        marginBottom: "0",
                     }}
                     style={{
                        height: "20em",
                     }}
                  />
               </AlertDialogBody>
               <AlertDialogFooter
                  padding="0.7em"
                  display="flex"
                  flexDir="column"
               >
                  <Container
                     padding="0px"
                     margin="0px"
                     maxWidth="100%"
                     width="100%"
                     display="flex"
                     flexDir="row"
                     justifyContent="space-between"
                     alignContent="center"
                     flexWrap="wrap"
                  >
                     <Checkbox size="lg" colorScheme="red" isChecked={true}>
                        <Text
                           color="#2B2D42"
                           fontWeight="bold"
                        >
                           Anonymous Donation
                        </Text>
                     </Checkbox>
                     <Button
                        label="Proceed to Payment"
                        icon={BiLogIn}
                        variant="icon_text"
                        ariaLabel="Proceed to payment page button"
                        style={{
                           minWidth: "10em",
                        }}
                     />
                  </Container>
                  <Container
                     padding="0px"
                     margin="0px"
                     maxWidth="100%"
                     width="100%"
                  >
                     <Text
                        color="#2B2D42"
                        fontStyle="italic"
                        marginTop="0.7em"
                     >
                        By clicking “Proceed to Payment”, you consent to sending your donation amount and (optionally)
                        your donation message. Anonymous donations will remove your username from the donation.
                     </Text>
                  </Container>
               </AlertDialogFooter>
            </AlertDialogContent>
         </AlertDialog>
      </>
   );
}