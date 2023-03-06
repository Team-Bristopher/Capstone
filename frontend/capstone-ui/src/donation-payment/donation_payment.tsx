import { Box, Checkbox, Container, Icon, Popover, PopoverBody, PopoverContent, PopoverTrigger, Text, useToast } from "@chakra-ui/react";
import { DevTool } from "@hookform/devtools";
import { FunctionComponent, useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { BiCreditCardFront } from "react-icons/bi";
import { BsInfoCircle } from "react-icons/bs";
import { useLocation, useNavigate } from "react-router-dom";
import { donateToFundraiser } from "../api/api-calls";
import { AuthContext } from "../globals/auth_context";
import { CARDHOLDER_NAME_INVALID, CARDHOLDER_NAME_REGEX, CARDHOLDER_NAME_REQUIRED, CREDIT_CARD_INVALID, CREDIT_CARD_NUMBER_REGEX, CREDIT_CARD_NUMBER_REQUIRED, EXPIRATION_DATE_INVALID, EXPIRATION_DATE_REGEX, EXPIRATION_DATE_REQUIRED_ERROR, INVALID_EXPIRATION_DATE_ERROR, LONG_CARDHOLDER_NAME_ERROR, SECURITY_CODE_REGEX, SECURITY_CODE_REQUIRED_ERROR, SHORT_CARDHOLDER_NAME_ERROR } from "../globals/form_globals";
import { Button } from "../input/button";
import { TextInput } from "../input/textinput";
import { LoadingDialog } from "../loading-dialog/loading_dialog";
import { DonateToFundraiserResponse } from "../models/incoming/DonateToFundraiserResponse";
import { DonateToFundraiserMessage } from "../models/outgoing/DonateToFundraiserMessage";
import { Page } from "../page/page";

enum PaymentPageFormNames {
   cardholderName = "cardholderName",
   cardNumber = "cardNumber",
   expirationDate = "expirationDate",
   securityCode = "securityCode",
}

interface PaymentPageForm {
   cardholderName: string;
   cardNumber: string;
   expirationDate: string;
   securityCode: string;
}

export const DonationPayment: FunctionComponent = () => {
   const location = useLocation();
   const authContext = useContext(AuthContext);
   const toast = useToast();

   const navigate = useNavigate();

   const [isLoading, setIsLoading] = useState<boolean>(false);

   const { register, getValues, formState, handleSubmit, control } = useForm<PaymentPageForm>({
      criteriaMode: "all",
      reValidateMode: "onSubmit",
   });

   const sendDonateToFundraiserRequest = async () => {
      const values = getValues();

      const message: DonateToFundraiserMessage = {
         fundraiserID: location.state.fundraiserID,
         amount: location.state.donationAmount,
         userID: authContext.loggedInUser?.ID === "" ? undefined : authContext.loggedInUser?.ID,
         isSavingPaymentInformation: false, // TODO
         firstName: values.cardholderName.split(" ")[0],
         lastName: values.cardholderName.split(" ")[1],
         cardNumber: values.cardNumber,
         expirationDate: values.expirationDate,
         securityCode: values.securityCode,
      };

      const response: DonateToFundraiserResponse = await donateToFundraiser(message);

      setIsLoading(false);

      if (response.responseType === "success") {
         navigate(`/fundraiser/${location.state.fundraiserID}`);
      }

      toast({
         title: response.message,
         status: response.responseType,
         duration: 3000,
         isClosable: false,
      });
   }

   const onSubmit = () => {
      setIsLoading(true);

      sendDonateToFundraiserRequest();
   }

   if (location.state === undefined) {
      return (
         <>
            <Page>
               Not allowed.
            </Page>
         </>
      );
   }

   return (
      <>
         <Page>
            <LoadingDialog
               open={isLoading}
            />
            <form onSubmit={handleSubmit(onSubmit)}>
               <Container
                  textAlign="center"
                  display="flex"
                  flexDir="row"
                  alignItems="center"
                  justifyContent="center"
                  width="100%"
                  minHeight="5em"
                  marginBottom="1em"
               >

                  <Text
                     fontSize="2xl"
                     marginRight="0.5em"
                  >
                     Donating
                  </Text>
                  <Text fontSize="2xl" fontWeight="bold" color="#D90429">${location.state.donationAmount}</Text>
                  <Text
                     fontSize="2xl"
                     marginLeft="0.5em"
                  >
                     to
                  </Text>
                  <Text
                     fontSize="2xl"
                     marginLeft="0.5em"
                     fontWeight="bold"
                  >
                     {location.state.fundraiserTitle}
                  </Text>
               </Container>
               <Container
                  textAlign="center"
                  display="flex"
                  flexDir="row"
                  alignItems="center"
                  justifyContent="center"
                  width="100%"
                  marginBottom="0"
               >
                  <Text
                     fontSize="l"
                  >
                     Your donation will make a difference. Please enter your payment information to complete your donation and join us in making a positive impact on our community.
                  </Text>
               </Container>
               <Container
                  textAlign="center"
                  display="flex"
                  flexDir="column"
                  alignItems="center"
                  width="100%"
                  marginBottom="0"
                  maxWidth="  100%"
                  marginTop="1em"
               >
                  <TextInput
                     label="Cardholder Name"
                     ariaLabel="Cardholder name input field"
                     variant="text_only"
                     containerStyle={{
                        width: "50em",
                     }}
                     formInfo={{
                        name: PaymentPageFormNames.cardholderName,
                        registerFn: register,
                        registerOptions: {
                           pattern: {
                              value: CARDHOLDER_NAME_REGEX,
                              message: CARDHOLDER_NAME_INVALID,
                           },
                           required: CARDHOLDER_NAME_REQUIRED,
                           max: {
                              value: 50,
                              message: LONG_CARDHOLDER_NAME_ERROR,
                           },
                           min: {
                              value: 3,
                              message: SHORT_CARDHOLDER_NAME_ERROR,
                           },
                        },
                        errorMessage: formState.errors.cardholderName?.message || "",
                     }}
                  />
                  <TextInput
                     label="Card Number"
                     ariaLabel="Card number input field"
                     variant="text_only"
                     containerStyle={{
                        width: "50em",
                        marginTop: "1em",
                        marginBottom: "1em",
                     }}
                     formInfo={{
                        name: PaymentPageFormNames.cardNumber,
                        registerFn: register,
                        registerOptions: {
                           pattern: {
                              value: CREDIT_CARD_NUMBER_REGEX,
                              message: CREDIT_CARD_INVALID,
                           },
                           required: CREDIT_CARD_NUMBER_REQUIRED,
                        },
                        errorMessage: formState.errors.cardNumber?.message || "",
                     }}
                  />
                  <TextInput
                     label="Expiration Date"
                     ariaLabel="Card expiration date input field"
                     variant="text_only"
                     containerStyle={{
                        width: "50em",
                     }}
                     placeholder="MM/YY"
                     formInfo={{
                        name: PaymentPageFormNames.expirationDate,
                        registerFn: register,
                        registerOptions: {
                           pattern: {
                              value: EXPIRATION_DATE_REGEX,
                              message: EXPIRATION_DATE_INVALID,
                           },
                           required: EXPIRATION_DATE_REQUIRED_ERROR,
                           max: {
                              value: 5,
                              message: INVALID_EXPIRATION_DATE_ERROR,
                           },
                           min: {
                              value: 5,
                              message: INVALID_EXPIRATION_DATE_ERROR,
                           },
                        },
                        errorMessage: formState.errors.expirationDate?.message || "",
                     }}
                  />
                  <TextInput
                     label="Security Code"
                     ariaLabel="Card security code input field"
                     variant="text_only"
                     containerStyle={{
                        width: "50em",
                     }}
                     placeholder="CVV"
                     formInfo={{
                        name: PaymentPageFormNames.securityCode,
                        registerFn: register,
                        registerOptions: {
                           pattern: SECURITY_CODE_REGEX,
                           required: SECURITY_CODE_REQUIRED_ERROR,
                        },
                        errorMessage: formState.errors.securityCode?.message || "",
                     }}
                  />
               </Container>
               {authContext.loggedInUser !== undefined && (
                  <Container
                     textAlign="center"
                     display="flex"
                     flexDir="row"
                     width="100%"
                     marginBottom="0"
                     maxWidth="100%"
                     marginTop="1em"
                     justifyContent="center"
                  >
                     <Box
                        padding="0"
                        margin="0"
                        width="50em"
                        display="flex"
                        flexDir="row"
                        justifyContent="start"
                        alignContent="center"
                     >
                        <Checkbox
                           size="lg"
                           colorScheme="red"
                        // {...register(DonationPopupFormNames.anonymousDonation)}
                        >
                           <Text
                              color="#2B2D42"
                              fontWeight="bold"
                           >
                              Save payment information
                           </Text>
                        </Checkbox>
                        <Popover placement="top" trigger="hover">
                           <PopoverTrigger>
                              <div>
                                 <Icon
                                    as={BsInfoCircle}
                                    boxSize="6"
                                    color="#2B2D42"
                                    marginLeft="0.5em"
                                 />
                              </div>
                           </PopoverTrigger>
                           <PopoverContent>
                              <PopoverBody textAlign="center">
                                 By checking “Save Payment Information”, your payment information will be stored on this site.
                                 Future payments will automatically use this (you can edit this in Settings {"->"} Payment Information).
                              </PopoverBody>
                           </PopoverContent>
                        </Popover>
                     </Box>
                  </Container>
               )}
               <Container
                  textAlign="center"
                  display="flex"
                  flexDir="row"
                  width="100%"
                  marginBottom="0"
                  maxWidth="100%"
                  marginTop="1em"
                  justifyContent="center"
               >
                  <Button
                     label="Submit"
                     ariaLabel="Submit payment button"
                     variant="icon_text"
                     icon={BiCreditCardFront}
                     isFormSubmit={true}
                     style={{
                        minWidth: "10em",
                     }}
                  />
               </Container>
               <DevTool control={control} />
            </form>
         </Page >
      </>
   );
}