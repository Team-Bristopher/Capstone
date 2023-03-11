import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Checkbox, Container, IconButton, Text } from "@chakra-ui/react";
import { FunctionComponent, useContext, useRef } from "react";
import { useForm } from "react-hook-form";
import { BiLogIn } from "react-icons/bi";
import { MdOutlineAttachMoney } from "react-icons/md";
import { VscClose } from "react-icons/vsc";
import { useNavigate } from "react-router-dom";
import { FundraiserContext } from "../fundraiser-detail/fundraiser_detail";
import { DONATION_MESSAGE_TOO_LONG, DONATION_TOO_SMALL_ERROR, REQUIRED_FIELD_ERROR } from "../globals/form_globals";
import { Button } from "../input/button";
import { NumberInput } from "../input/numberinput";
import { TextInput } from "../input/textinput";

enum DonationPopupFormNames {
   message = "message",
   amount = "amount",
   anonymousDonation = "anonymousDonation",
}

interface DonationPopupForm {
   message: string;
   amount: number;
   anonymousDonation: boolean;
}

export interface DonationPopupProps {
   onClose: () => void;
}

export const DonationPopup: FunctionComponent<DonationPopupProps> = (props: DonationPopupProps) => {
   const cancelRef = useRef(null);

   const navigate = useNavigate();

   const { register, getValues, formState, handleSubmit } = useForm<DonationPopupForm>({
      criteriaMode: "all",
      reValidateMode: "onSubmit",
   });

   const fundraiser = useContext(FundraiserContext);

   const onSubmit = () => {
      const values = getValues();

      navigate("/fundraiser/donate/payment", {
         state: {
            isAnonymous: values.anonymousDonation,
            donationAmount: values.amount,
            donationMessage: values.message,
            fundraiserTitle: fundraiser?.fundraiser.title ?? "",
            fundraiserID: fundraiser?.fundraiser.id ?? "",
         }
      });
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
                     Donate to {fundraiser?.fundraiser.title ?? ""}
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
               <form onSubmit={handleSubmit(onSubmit)}>
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
                        formInfo={{
                           name: DonationPopupFormNames.amount,
                           registerFn: register,
                           registerOptions: {
                              required: REQUIRED_FIELD_ERROR,
                              min: {
                                 message: DONATION_TOO_SMALL_ERROR,
                                 value: 1,
                              },
                           },
                           errorMessage: formState.errors.amount?.message || "",
                        }}
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
                        formInfo={{
                           name: DonationPopupFormNames.message,
                           registerFn: register,
                           registerOptions: {
                              max: {
                                 value: 500,
                                 message: DONATION_MESSAGE_TOO_LONG,
                              }
                           },
                           errorMessage: formState.errors.message?.message || "",
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
                        <Checkbox
                           size="lg"
                           colorScheme="red"
                           defaultChecked={true}
                           {...register(DonationPopupFormNames.anonymousDonation)}
                        >
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
                           isFormSubmit={true}
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
               </form>
            </AlertDialogContent>
         </AlertDialog>
      </>
   );
}