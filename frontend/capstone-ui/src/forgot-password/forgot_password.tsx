import { Box, Container, Text } from "@chakra-ui/react";
import { FunctionComponent, useState } from "react";
import { useForm } from "react-hook-form";
import { BsPerson } from "react-icons/bs";
import { EMAIL_REGEX, EMAIL_TOO_LONG_ERROR, EMAIL_TOO_SHORT_ERROR, INVALID_EMAIL_ERROR, REQUIRED_FIELD_ERROR } from "../globals/form_globals";
import { TextInput } from "../input/textinput";
import { LoadingDialog } from "../loading-dialog/loading_dialog";
import { Page } from "../page/page";

enum ForgotPasswordFormName {
   email = "email"
}

interface ForgotPasswordForm {
   email: string;
}

export const ForgotPassword: FunctionComponent = () => {
   const [isLoadingOpen, setIsLoadingOpen] = useState<boolean>(false);

   const { register, formState } = useForm<ForgotPasswordForm>({
      criteriaMode: "all",
      reValidateMode: "onSubmit",
   });

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
                        Forgot your password? No worries, just enter your email address below and we'll send you a link to reset your password. If you don't receive the email, be sure to check your spam folder.
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
                  icon={BsPerson}
                  ariaLabel="Email Input Field"
                  formInfo={{
                     name: ForgotPasswordFormName.email,
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
            </Container>
         </Page>
      </>
   );
}