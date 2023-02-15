import { Box, Container, Link, Text, useToast } from "@chakra-ui/react";
import { FunctionComponent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { BiLogIn } from "react-icons/bi";
import { BsEye, BsPerson } from "react-icons/bs";
import { Link as ReactRouterLink, useNavigate } from "react-router-dom";
import { loginUser } from "../api/api-calls";
import { EMAIL_REGEX, EMAIL_TOO_LONG_ERROR, EMAIL_TOO_SHORT_ERROR, INVALID_EMAIL_ERROR, INVALID_PASSWORD_ERROR, PASSWORD_REGEX, PASSWORD_TOO_LONG_ERROR, PASSWORD_TOO_SHORT_ERROR, REQUIRED_FIELD_ERROR } from "../globals/form_globals";
import { Button } from "../input/button";
import { TextInput } from "../input/textinput";
import { LoadingDialog } from "../loading-dialog/loading_dialog";
import { Page } from "../page/page";

enum LoginPageFormNames {
   email = "email",
   password = "password",
}

interface LoginPageForm {
   email: string;
   password: string;
}

export const Login: FunctionComponent = () => {
   const toast = useToast();
   const navigate = useNavigate();

   const [isLoadingOpen, setIsLoadingOpen] = useState<boolean>(false);

   const { register, getValues, formState, handleSubmit, setError } = useForm<LoginPageForm>({
      criteriaMode: "all",
      reValidateMode: "onSubmit",
   });

   const hasErrors = (): boolean => {
      return (
         formState.errors.email !== undefined ||
         formState.errors.password !== undefined
      );
   }

   const sendLoginUserRequest = async () => {
      const values = getValues();

      const response = await loginUser({
         email: values.email,
         password: values.password,
      });

      setIsLoadingOpen(false);

      toast({
         title: response.message,
         status: response.responseType,
         duration: 3000,
         isClosable: false,
      });

      if (response.responseType == "success") {
         window.localStorage.setItem("accessToken", response.accessToken);

         navigate("/");

         window.location.reload();
      }
   }

   useEffect(() => {
      if (!formState.isSubmitting) {
         return;
      }

      if (hasErrors()) {
         return;
      }

      setIsLoadingOpen(true);

      sendLoginUserRequest();
   }, [formState.isSubmitting]);

   return (
      <>
         <LoadingDialog
            open={isLoadingOpen}
         />
         <Page>
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
                        marginRight="0.5em"
                     >
                        Welcome to Project
                     </Text>
                     <Text fontSize="2xl" fontWeight="bold" color="#D90429">R O M E,</Text>
                  </Box>
                  <Text
                     fontSize="l"
                     marginRight="0.5em"
                  >
                     the ultimate fundraising platform designed to help you reach your fundraising goals.
                  </Text>
                  <Text
                     fontSize="l"
                     marginTop="1.5em"
                  >
                     We're here to help, so let's get started!
                  </Text>
               </Container>
            </Container>
            <form onSubmit={handleSubmit(() => { })}>
               <Container
                  width="auto"
                  maxWidth="35em"
                  height="auto"
                  marginTop="0.5em"
               >
                  <TextInput
                     variant="icon_only"
                     icon={BsPerson}
                     ariaLabel="Email Input Field"
                     formInfo={{
                        name: LoginPageFormNames.email,
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
                     variant="icon_only"
                     icon={BsEye}
                     ariaLabel="Password Input Field"
                     hideText={true}
                     formInfo={{
                        name: LoginPageFormNames.password,
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
                     label="Login"
                     icon={BiLogIn}
                     variant="icon_text"
                     ariaLabel="Login Button"
                     style={{
                        minWidth: "10em",
                     }}
                     isFormSubmit={true}
                  />
               </Container>
            </form>
            <Container
               width="auto"
               height="auto"
               marginTop="1em"
               display="flex"
               justifyContent="center"
               flexDir="row"
            >
               <Text>Don't have an account? </Text>
               <Link as={ReactRouterLink} to="/register">
                  <Text color="#D90429" marginLeft="0.5em" fontWeight="bold">Create one here!</Text>
               </Link>
            </Container>
         </Page >
      </>
   );
}