import { Avatar, Container, Text, useToast } from "@chakra-ui/react";
import { FunctionComponent, useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { HiOutlinePencil } from "react-icons/hi";
import { editUserData } from "../api/api-calls";
import { AuthContext } from "../globals/auth_context";
import { INVALID_NAME_ERROR, NAME_REGEX, NAME_TOO_LONG_ERROR, NAME_TOO_SHORT_ERROR, REQUIRED_FIELD_ERROR } from "../globals/form_globals";
import { Button } from "../input/button";
import { TextInput } from "../input/textinput";
import { LoadingDialog } from "../loading-dialog/loading_dialog";
import { EditUserMessage } from "../models/outgoing/EditUserMessage";
import { Page } from "../page/page";

enum EditProfileFormNames {
   first_name = "firstName",
   last_name = "lastName",
}

interface EditProfileForm {
   firstName: string;
   lastName: string;
}

export const SettingsEdit: FunctionComponent = () => {
   const [isLoadingOpen, setIsLoadingOpen] = useState<boolean>(false);

   const authContext = useContext(AuthContext);
   const toast = useToast();

   const { register, getValues, formState, handleSubmit, setValue } = useForm<EditProfileForm>({
      criteriaMode: "all",
      reValidateMode: "onChange",
   });

   const hasErrors = (): boolean => {
      return (
         formState.errors.firstName !== undefined ||
         formState.errors.lastName !== undefined
      );
   }

   const sendUpdateProfileRequest = async () => {
      const values = getValues();

      const message: EditUserMessage = {
         firstName: values.firstName,
         lastName: values.lastName,
      };

      const response = await editUserData(message);

      setIsLoadingOpen(false);

      if (response.responseType === "success") {
         window.location.reload();
      }

      toast({
         title: response.message,
         status: response.responseType,
         duration: 3000,
         isClosable: false,
      });
   }

   useEffect(() => {
      // Populating values.
      setValue(EditProfileFormNames.first_name, authContext.loggedInUser?.firstName || "");
      setValue(EditProfileFormNames.last_name, authContext.loggedInUser?.lastName || "");

      // eslint-disable-next-line
   }, [authContext]);

   useEffect(() => {
      if (!formState.isSubmitting) {
         return;
      }

      if (hasErrors()) {
         return;
      }

      setIsLoadingOpen(true);

      sendUpdateProfileRequest();

      // eslint-disable-next-line
   }, [formState.isSubmitting]);

   return (
      <>
         <Page>
            <LoadingDialog
               open={isLoadingOpen}
            />
            <form onSubmit={handleSubmit(() => { })}>
               <Container
                  display="flex"
                  padding="2em"
                  paddingLeft="8rem"
                  paddingRight="8rem"
                  width="100%"
                  maxWidth="100%"
                  justifyContent="space-between"
               >
                  <Text
                     fontSize="3xl"
                     fontWeight="bold"
                     color="#2B2D42"
                  >
                     Settings
                  </Text>
                  <Button
                     label="Save"
                     variant="icon_text"
                     icon={HiOutlinePencil}
                     ariaLabel="Save changes button"
                     style={{
                        padding: "1em"
                     }}
                     isFormSubmit={true}
                  />
               </Container>
               <Container
                  display="flex"
                  flexDir="row"
                  padding="2em"
                  paddingLeft="8rem"
                  paddingRight="8rem"
                  width="100%"
                  maxWidth="100%"
               >
                  <Avatar
                     name={authContext.loggedInUser?.firstName + " " + authContext.loggedInUser?.lastName}
                     size="2xl"
                  />
                  <Container
                     margin="0"
                     display="flex"
                     flexDirection="column"
                     width="50em"
                  >
                     <Container
                        margin="0"
                        padding="0.5em"
                        display="flex"
                        flexDir="row"
                        width="100%"
                     >
                        <TextInput
                           label="First Name"
                           variant="text_only"
                           ariaLabel="First name input"
                           style={{
                              width: "50em",
                           }}
                           containerStyle={{
                              marginTop: "0.2em",
                              marginBottom: "0.2em",
                           }}
                           formInfo={{
                              name: EditProfileFormNames.first_name,
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
                     </Container>
                     <Container
                        margin="0"
                        padding="0.5em"
                        display="flex"
                        flexDir="row"
                        width="100%"
                     >
                        <TextInput
                           label="Last Name"
                           variant="text_only"
                           ariaLabel="Last name input"
                           style={{
                              width: "50em",
                           }}
                           containerStyle={{
                              marginTop: "0.2em",
                              marginBottom: "0.2em",
                           }}
                           formInfo={{
                              name: EditProfileFormNames.last_name,
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
                     </Container>
                  </Container>
               </Container>
            </form>
         </Page>
      </>
   );
};
