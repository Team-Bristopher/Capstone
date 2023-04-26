import { Box, Container, Text, useToast } from "@chakra-ui/react";
import { FunctionComponent, useState } from "react";
import { useForm } from "react-hook-form";
import { BiLogIn } from "react-icons/bi";
import { useLocation, useNavigate } from "react-router-dom";
import { resetPassword } from "../api/api-calls";
import { INVALID_PASSWORD_ERROR, PASSWORDS_DONT_MATCH, PASSWORD_REGEX, PASSWORD_TOO_LONG_ERROR, PASSWORD_TOO_SHORT_ERROR, REQUIRED_FIELD_ERROR } from "../globals/form_globals";
import { Button } from "../input/button";
import { TextInput } from "../input/textinput";
import { LoadingDialog } from "../loading-dialog/loading_dialog";
import { Page } from "../page/page";

enum NewPasswordFormNames {
   password = "password",
   password_confirm = "password_confirm",
}

interface NewPasswordForm {
   password: string;
   password_confirm: string;
}

export const NewPassword: FunctionComponent = () => {
   const location = useLocation();
   const toast = useToast();
   const navigate = useNavigate();

   const [isLoadingOpen, setIsLoadingOpen] = useState<boolean>(false);

   const { register, handleSubmit, formState, getValues, setError } = useForm<NewPasswordForm>({
      criteriaMode: "all",
      reValidateMode: "onSubmit",
   });

   const passwordsDontMatch = (): boolean => {
      const values = getValues();

      return (values.password !== values.password_confirm);
   }

   const onSubmit = async () => {
      if (location.state.authCode === null || location.state.email === null ||
         location.state.authCode === undefined || location.state.email === undefined) {
         toast({
            title: "Your request cannot be processed, please restart the recovery process",
            status: "error",
            duration: 3000,
            isClosable: false,
            position: "top"
         });

         return;
      }

      if (passwordsDontMatch()) {
         setError(NewPasswordFormNames.password, {
            message: PASSWORDS_DONT_MATCH,
         });

         setError(NewPasswordFormNames.password_confirm, {
            message: PASSWORDS_DONT_MATCH,
         });

         return;
      }

      setIsLoadingOpen(true);

      const values = getValues();

      const response = await resetPassword(location.state.authCode, location.state.email, values.password);

      toast({
         title: response.responseMessage,
         status: response.responseType,
         duration: 3000,
         isClosable: false,
         position: "top"
      });

      setIsLoadingOpen(false);

      if (response.responseType === "success") {
         navigate("/login");
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
                           Please enter your new password and confirm it.
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
                     variant="text_only"
                     label="Password"
                     ariaLabel="Password Input Field"
                     hideText={true}
                     formInfo={{
                        name: NewPasswordFormNames.password,
                        registerFn: register,
                        registerOptions: {
                           required: REQUIRED_FIELD_ERROR,
                           pattern: {
                              value: PASSWORD_REGEX,
                              message: INVALID_PASSWORD_ERROR,
                           },
                           minLength: {
                              value: 5,
                              message: PASSWORD_TOO_SHORT_ERROR,
                           },
                           maxLength: {
                              value: 50,
                              message: PASSWORD_TOO_LONG_ERROR,
                           },
                        },
                        errorMessage: formState.errors.password?.message || "",
                     }}
                  />
                  <TextInput
                     variant="text_only"
                     label="Confirm"
                     ariaLabel="Confirm Password Input Field"
                     hideText={true}
                     formInfo={{
                        name: NewPasswordFormNames.password_confirm,
                        registerFn: register,
                        registerOptions: {
                           required: REQUIRED_FIELD_ERROR,
                           pattern: {
                              value: PASSWORD_REGEX,
                              message: INVALID_PASSWORD_ERROR,
                           },
                           minLength: {
                              value: 5,
                              message: PASSWORD_TOO_SHORT_ERROR,
                           },
                           maxLength: {
                              value: 50,
                              message: PASSWORD_TOO_LONG_ERROR,
                           },
                        },
                        errorMessage: formState.errors.password_confirm?.message || "",
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
                     ariaLabel="Send new password button"
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