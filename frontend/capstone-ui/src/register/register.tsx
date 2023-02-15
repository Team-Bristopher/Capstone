import { Box, Container, Text, useToast } from "@chakra-ui/react";
import { FunctionComponent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { BiLogIn } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/api-calls";
import { EMAIL_REGEX, EMAIL_TOO_LONG_ERROR, EMAIL_TOO_SHORT_ERROR, INVALID_EMAIL_ERROR, INVALID_NAME_ERROR, INVALID_PASSWORD_ERROR, NAME_REGEX, NAME_TOO_LONG_ERROR, NAME_TOO_SHORT_ERROR, PASSWORDS_DONT_MATCH, PASSWORD_REGEX, PASSWORD_TOO_LONG_ERROR, PASSWORD_TOO_SHORT_ERROR, REQUIRED_FIELD_ERROR } from "../globals/form_globals";
import { Button } from "../input/button";
import { TextInput } from "../input/textinput";
import { LoadingDialog } from "../loading-dialog/loading_dialog";
import { Page } from "../page/page";


enum RegisterPageFormNames {
   first_name = "firstName",
   last_name = "lastName",
   email = "email",
   password = "password",
   password_confirm = "password_confirm",
}

interface RegisterPageForm {
   firstName: string;
   lastName: string;
   email: string;
   password: string;
   password_confirm: string;
}

export const RegisterPage: FunctionComponent = () => {
   const toast = useToast();
   const navigate = useNavigate();
   const [isLoadingOpen, setIsLoadingOpen] = useState<boolean>(false);

   const { register, getValues, formState, handleSubmit, setError } = useForm<RegisterPageForm>({
      criteriaMode: "all",
      reValidateMode: "onSubmit",
   });

   const hasErrors = (): boolean => {
      return (
         formState.errors.firstName !== undefined ||
         formState.errors.lastName !== undefined ||
         formState.errors.password !== undefined ||
         formState.errors.password_confirm !== undefined
      );
   }

   const passwordsDontMatch = (): boolean => {
      const values = getValues();

      return (values.password !== values.password_confirm);
   }

   const sendRegisterRequest = async () => {
      const values = getValues();

      const response = await registerUser({
         firstName: values.firstName,
         lastName: values.lastName,
         emailAddress: values.email,
         password: values.password,
      });

      toast({
         title: response.responseMessage,
         status: response.responseType,
         duration: 3000,
         isClosable: false,
      });

      setIsLoadingOpen(false);

      if (response.responseType == "success") {
         navigate("/login");
      }
   }

   useEffect(() => {
      if (!formState.isSubmitting) {
         return;
      }

      if (hasErrors()) {
         return;
      }

      if (passwordsDontMatch()) {
         setError(RegisterPageFormNames.password, {
            message: PASSWORDS_DONT_MATCH,
         });

         setError(RegisterPageFormNames.password_confirm, {
            message: PASSWORDS_DONT_MATCH,
         });

         return;
      }

      setIsLoadingOpen(true);

      sendRegisterRequest();

   }, [formState.isSubmitting]);

   return (
      <>
         <Page>
            <LoadingDialog
               open={isLoadingOpen}
            />
            <Container
               textAlign="center"
               display="flex"
               alignItems="center"
               justifyContent="center"
               width="100%"
               minHeight="7em"
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
                        Sign up for free to unlock the full potential of Project
                     </Text>
                     <Text
                        fontSize="xl"
                        marginRight="0.5em"
                        fontWeight="bold"
                        color="#D90429"
                     >
                        ROME
                     </Text>
                  </Box>
               </Container>
            </Container>
            <form onSubmit={handleSubmit(() => { })}>
               <Container
                  width="auto"
                  maxWidth="35em"
                  height="auto"
                  marginTop="0"
               >
                  <TextInput
                     variant="text_only"
                     label="First Name"
                     ariaLabel="First Name Input Field"
                     formInfo={{
                        name: RegisterPageFormNames.first_name,
                        registerFn: register,
                        registerOptions: {
                           required: REQUIRED_FIELD_ERROR,
                           pattern: {
                              value: NAME_REGEX,
                              message: INVALID_NAME_ERROR,
                           },
                           minLength: {
                              value: 3,
                              message: NAME_TOO_SHORT_ERROR,
                           },
                           maxLength: {
                              value: 15,
                              message: NAME_TOO_LONG_ERROR,
                           },
                        },
                        errorMessage: formState.errors.firstName?.message || "",
                     }}
                  />
                  <TextInput
                     variant="text_only"
                     label="Last Name"
                     ariaLabel="Last Name Input Field"
                     formInfo={{
                        name: RegisterPageFormNames.last_name,
                        registerFn: register,
                        registerOptions: {
                           required: REQUIRED_FIELD_ERROR,
                           pattern: {
                              value: NAME_REGEX,
                              message: INVALID_NAME_ERROR,
                           },
                           minLength: {
                              value: 3,
                              message: NAME_TOO_SHORT_ERROR,
                           },
                           maxLength: {
                              value: 15,
                              message: NAME_TOO_LONG_ERROR,
                           },
                        },
                        errorMessage: formState.errors.lastName?.message || "",
                     }}
                  />
                  <TextInput
                     variant="text_only"
                     label="Email"
                     ariaLabel="Email Input Field"
                     formInfo={{
                        name: RegisterPageFormNames.email,
                        registerFn: register,
                        registerOptions: {
                           required: REQUIRED_FIELD_ERROR,
                           pattern: {
                              value: EMAIL_REGEX,
                              message: INVALID_EMAIL_ERROR,
                           },
                           minLength: {
                              value: 3,
                              message: EMAIL_TOO_SHORT_ERROR,
                           },
                           maxLength: {
                              value: 25,
                              message: EMAIL_TOO_LONG_ERROR,
                           },
                        },
                        errorMessage: formState.errors.email?.message || "",
                     }}
                  />
                  <TextInput
                     variant="text_only"
                     label="Password"
                     ariaLabel="Password Input Field"
                     hideText={true}
                     formInfo={{
                        name: RegisterPageFormNames.password,
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
                        name: RegisterPageFormNames.password_confirm,
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
                     label="Register"
                     icon={BiLogIn}
                     variant="icon_text"
                     ariaLabel="Register Button"
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