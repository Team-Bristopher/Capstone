import { Box, Container, Text, useToast } from "@chakra-ui/react";
import { FunctionComponent, useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AiOutlinePlus } from "react-icons/ai";
import { BiCalendar } from "react-icons/bi";
import { MdOutlineAttachMoney } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { createFundraiser } from "../api/api-calls";
import { AuthContext } from "../globals/auth_context";
import { FUNDRAISER_DESCRIPTION_REGEX, FUNDRAISER_DESCRIPTION_TOO_LONG_ERROR, FUNDRAISER_DESCRIPTION_TOO_SHORT_ERROR, FUNDRAISER_TITLE_REGEX, FUNDRAISER_TITLE_TOO_LONG_ERROR, FUNDRAISER_TITLE_TOO_SHORT_ERROR, GOAL_TOO_SMALL_ERROR, INVALID_FUNDRAISER_DESCRIPTION_ERROR, INVALID_FUNDRAISER_TITLE_ERROR, REQUIRED_FIELD_ERROR } from "../globals/form_globals";
import { Button } from "../input/button";
import { DateInput } from "../input/dateinput";
import { DropdownInput } from "../input/dropdowninput";
import { NumberInput } from "../input/numberinput";
import { TextInput } from "../input/textinput";
import { LoadingDialog } from "../loading-dialog/loading_dialog";
import { CreateFundraiserMessage } from "../models/outgoing/CreateFundraiserMessage";
import { Page } from "../page/page";

enum CreateFundraiserFormNames {
   title = "title",
   description = "description",
   fundraiserType = "fundraiserType",
   endDate = "endDate",
   goal = "goal",
}

interface CreateFundraiserForm {
   title: string;
   description: string;
   fundraiserType: number;
   goal: number;
   endDate: Date;
}

export const CreateFundraiser: FunctionComponent = () => {
   const [isLoadingOpen, setIsLoadingOpen] = useState<boolean>(false);
   const [categoryDropdownValue, setCategoryDropdownValue] = useState<string>("0");

   const navigate = useNavigate();
   const toast = useToast();

   const authContext = useContext(AuthContext);

   const { register, getValues, formState, handleSubmit, setValue } = useForm<CreateFundraiserForm>({
      criteriaMode: "all",
      reValidateMode: "onChange",
   });

   const hasErrors = (): boolean => {
      return (
         formState.errors.title !== undefined ||
         formState.errors.description !== undefined ||
         formState.errors.endDate !== undefined ||
         formState.errors.fundraiserType !== undefined
      );
   }

   const sendCreateFundraiserRequest = async () => {
      const values = getValues();

      const message: CreateFundraiserMessage = {
         title: values.title,
         description: values.description,
         goal: values.goal,
         category: parseInt(categoryDropdownValue),
         expirationDate: values.endDate,
      };

      const response = await createFundraiser(message);

      toast({
         title: response.message,
         status: response.responseType,
         duration: 3000,
         isClosable: false,
      });

      if (response.responseType === "success") {
         // Redirect to fundraiser detail.
         navigate(`fundraiser/${response.fundraiserID}`);
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

      sendCreateFundraiserRequest();

      // eslint-disable-next-line
   }, [formState.isSubmitting]);

   if (!authContext || !authContext.loggedInUser) {
      return (
         <>
            <Page>
               Not allowed
            </Page>
         </>
      )
   }

   return (
      <>
         <Page>
            <LoadingDialog
               open={isLoadingOpen}
            />
            <form onSubmit={handleSubmit(() => { })}>
               <Container
                  display="flex"
                  paddingTop="2em"
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
                     Create Fundraiser
                  </Text>
                  <Button
                     label="Create"
                     variant="icon_text"
                     icon={AiOutlinePlus}
                     ariaLabel="Edit profile button"
                     style={{
                        padding: "1em"
                     }}
                     isFormSubmit={true}
                  />
               </Container>
               <Container
                  display="flex"
                  flexDir="row"
                  width="100%"
                  maxWidth="100%"
                  paddingLeft="7rem"
                  paddingRight="7rem"
               >
                  <Container
                     display="flex"
                     flexDir="column"
                     width="70%"
                     maxWidth="70%"
                     alignContent="start"
                     flexWrap="wrap"
                  >
                     <Box
                        padding="0"
                        margin="0"
                        maxWidth="100%"
                        width="100%"
                     >
                        <TextInput
                           label="Fundraiser Name"
                           ariaLabel="Fundraiser name input"
                           variant="text_only"
                           containerStyle={{
                              width: "100%"
                           }}
                           formInfo={{
                              name: CreateFundraiserFormNames.title,
                              registerFn: register,
                              registerOptions: {
                                 required: REQUIRED_FIELD_ERROR,
                                 pattern: {
                                    value: FUNDRAISER_TITLE_REGEX,
                                    message: INVALID_FUNDRAISER_TITLE_ERROR,
                                 },
                                 minLength: {
                                    value: 3,
                                    message: FUNDRAISER_TITLE_TOO_SHORT_ERROR,
                                 },
                                 maxLength: {
                                    value: 256,
                                    message: FUNDRAISER_TITLE_TOO_LONG_ERROR,
                                 },
                              },
                              errorMessage: formState.errors.title?.message || "",
                           }}
                        />
                     </Box>
                     <Box
                        padding="0"
                        margin="0"
                        maxWidth="100%"
                        width="100%"
                        backgroundColor="#D9D9D9"
                        height="30em"
                     />
                     <TextInput
                        variant="text_only"
                        label="Description"
                        ariaLabel="Description of fundraiser input"
                        isTopDown={true}
                        containerStyle={{
                           height: "20em",
                        }}
                        style={{
                           height: "20em",
                        }}
                        formInfo={{
                           name: CreateFundraiserFormNames.description,
                           registerFn: register,
                           registerOptions: {
                              required: REQUIRED_FIELD_ERROR,
                              pattern: {
                                 value: FUNDRAISER_DESCRIPTION_REGEX,
                                 message: INVALID_FUNDRAISER_DESCRIPTION_ERROR,
                              },
                              minLength: {
                                 value: 3,
                                 message: FUNDRAISER_DESCRIPTION_TOO_SHORT_ERROR,
                              },
                              maxLength: {
                                 value: 5026,
                                 message: FUNDRAISER_DESCRIPTION_TOO_LONG_ERROR,
                              },
                           },
                           errorMessage: formState.errors.description?.message || "",
                        }}
                     />
                  </Container>
                  <Container
                     display="flex"
                     flexDir="column"
                     width="30%"
                     maxWidth="30%"
                     alignContent="start"
                     flexWrap="wrap"
                  >
                     <NumberInput
                        label="End Goal"
                        ariaLabel="End goal of fundraiser input"
                        defaultValue={0}
                        keepWithinRange={true}
                        clampValueOnBlur={true}
                        icon={MdOutlineAttachMoney}
                        formInfo={{
                           name: CreateFundraiserFormNames.goal,
                           registerFn: register,
                           registerOptions: {
                              required: REQUIRED_FIELD_ERROR,
                              min: {
                                 message: GOAL_TOO_SMALL_ERROR,
                                 value: 1,
                              },
                           },
                           errorMessage: formState.errors.goal?.message || "",
                        }}
                     />
                     <DateInput
                        label="End Date"
                        ariaLabel="End date of fundraiser input"
                        icon={BiCalendar}
                        containerStyle={{
                           width: "100%",
                           marginTop: "0em",
                        }}
                        formInfo={{
                           name: CreateFundraiserFormNames.endDate,
                           registerFn: register,
                           registerOptions: {
                              required: REQUIRED_FIELD_ERROR,
                           },
                           errorMessage: formState.errors.endDate?.message || "",
                        }}
                     />
                     <DropdownInput
                        label="Category"
                        ariaLabel="Category of fundraiser input"
                        containerStyle={{
                           width: "100%",
                           marginTop: "0em",
                        }}
                        onChange={(val) => { setCategoryDropdownValue(val); }}
                        values={[
                           {
                              value: "0",
                              name: "Medical",
                           },
                           {
                              value: "1",
                              name: "Education",
                           },
                           {
                              value: "2",
                              name: "Disaster Relief",
                           },
                           {
                              value: "3",
                              name: "Environment",
                           },
                           {
                              value: "4",
                              name: "Animal Welfare",
                           },
                           {
                              value: "5",
                              name: "Financial Assistance",
                           },
                           {
                              value: "6",
                              name: "Religion",
                           },
                           {
                              value: "7",
                              name: "Community",
                           },
                           {
                              value: "8",
                              name: "Political",
                           },
                        ]}
                     />
                  </Container>
               </Container>
            </form>
         </Page>
      </>
   );
}