import { Box, Container, Text, useToast } from "@chakra-ui/react";
import { FunctionComponent, useState } from "react";
import { useForm } from "react-hook-form";
import { BiLogIn } from "react-icons/bi";
import { MdOutlinePassword } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyRecoveryCode } from "../api/api-calls";
import { ACCOUNT_RECOVERY_CODE_REGEX, INVALID_RECOVERY_CODE_ERROR, REQUIRED_FIELD_ERROR } from "../globals/form_globals";
import { Button } from "../input/button";
import { TextInput } from "../input/textinput";
import { LoadingDialog } from "../loading-dialog/loading_dialog";
import { Page } from "../page/page";

enum RecoverAccountFormNames {
   code = "code",
}

interface RecoverAccountForm {
   code: string;
}

export const Recovery: FunctionComponent = () => {
   const toast = useToast();
   const location = useLocation();
   const navigate = useNavigate();

   // eslint-disable-next-line
   const [isLoadingOpen, setIsLoadingOpen] = useState<boolean>(false);

   const { register, handleSubmit, formState, getValues } = useForm<RecoverAccountForm>({
      criteriaMode: "all",
      reValidateMode: "onSubmit",
   });

   const onSubmit = async () => {
      const emailAddress = location.state.email;

      if (emailAddress === undefined || emailAddress === null) {
         toast({
            title: "Your request cannot be processed, please restart the recovery process",
            status: "error",
            duration: 3000,
            isClosable: false,
            position: "top"
         });

         return;
      }

      const values = getValues();

      setIsLoadingOpen(true);

      const response = await verifyRecoveryCode(values.code, emailAddress);

      toast({
         title: response.message,
         status: response.responseType,
         duration: 3000,
         isClosable: false,
         position: "top"
      });

      if (response.responseType === "success") {
         navigate("/new-password", {
            state: {
               authCode: response.recoveryCodeAuthenticationCode,
               email: emailAddress,
            },
         });
      }
   }

   return (
      <>
         <Page>
            <LoadingDialog
               open={isLoadingOpen}
            />
            <form onSubmit={handleSubmit(onSubmit)}>
               <Container
                  textAlign="center"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  width="100%"
                  minHeight="15em"
                  marginBottom="0"
               >
                  <Container
                     width="auto"
                     height="auto"
                     margin="0"
                  >
                     <Box
                        margin="0"
                        padding="0"
                        display="flex"
                        flexDir="row"
                        alignItems="baseline"
                        justifyContent="center"
                     >
                        <Text
                           fontSize="l"
                           marginRight="0.3em"
                        >
                           A recovery code has been sent to the email address provided. Note that the email can take a few minutes to arrive.
                        </Text>
                     </Box>
                  </Container>
               </Container>
               <Container
                  width="auto"
                  maxWidth="35em"
                  height="auto"
                  marginTop="0.5em"
               >
                  <TextInput
                     variant="icon_only"
                     icon={MdOutlinePassword}
                     ariaLabel="Recovery Code Input Field"
                     formInfo={{
                        name: RecoverAccountFormNames.code,
                        registerFn: register,
                        registerOptions: {
                           required: REQUIRED_FIELD_ERROR,
                           pattern: {
                              value: ACCOUNT_RECOVERY_CODE_REGEX,
                              message: INVALID_RECOVERY_CODE_ERROR,
                           },
                           minLength: {
                              value: 6,
                              message: INVALID_RECOVERY_CODE_ERROR,
                           },
                           maxLength: {
                              value: 6,
                              message: INVALID_RECOVERY_CODE_ERROR,
                           },
                        },
                        errorMessage: formState.errors.code?.message || "",
                     }}
                  />
               </Container>
               <Container
                  width="auto"
                  maxWidth="10em"
                  height="auto"
                  marginTop="2em"
                  display="flex"
                  justifyContent="center"
               >
                  <Button
                     label="Submit"
                     icon={BiLogIn}
                     variant="icon_text"
                     ariaLabel="Send recovery code button"
                     style={{
                        minWidth: "10em",
                     }}
                     isFormSubmit={true}
                  />
               </Container>
            </form>
         </Page>
      </>
   );
}