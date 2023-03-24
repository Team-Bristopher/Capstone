import { Box, Container, Skeleton, Text, useToast } from "@chakra-ui/react";
import { FunctionComponent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { BiCalendar } from "react-icons/bi";
import { IoMdCheckmark } from "react-icons/io";
import { MdOutlineAttachMoney } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import { editFundraiser, getFundraiserDetail } from "../api/api-calls";
import { FUNDRAISER_DESCRIPTION_REGEX, FUNDRAISER_DESCRIPTION_TOO_LONG_ERROR, FUNDRAISER_DESCRIPTION_TOO_SHORT_ERROR, FUNDRAISER_TITLE_REGEX, FUNDRAISER_TITLE_TOO_LONG_ERROR, FUNDRAISER_TITLE_TOO_SHORT_ERROR, GOAL_TOO_SMALL_ERROR, INVALID_FUNDRAISER_DESCRIPTION_ERROR, INVALID_FUNDRAISER_TITLE_ERROR, REQUIRED_FIELD_ERROR } from "../globals/form_globals";
import { Button } from "../input/button";
import { DateInput } from "../input/dateinput";
import { DropdownInput } from "../input/dropdowninput";
import { NumberInput } from "../input/numberinput";
import { TextInput } from "../input/textinput";
import { LoadingDialog } from "../loading-dialog/loading_dialog";
import { Fundraiser } from "../models/incoming/Fundraiser";
import { EditFundraiserMessage } from "../models/outgoing/EditFundraiserMessage";
import { Page } from "../page/page";

enum EditFundraiserFormNames {
   title = "title",
   description = "description",
   fundraiserType = "fundraiserType",
   endDate = "endDate",
   goal = "goal",
}

interface EditFundraiserForm {
   title: string;
   description: string;
   fundraiserType: number;
   goal: number;
   endDate: Date;
}

export const EditFundraiser: FunctionComponent = () => {
   const [isLoadingOpen, setIsLoadingOpen] = useState<boolean>(true);
   const [fundraiserDetail, setFundraiserDetail] = useState<Fundraiser>();
   const [categoryDropdownValue, setCategoryDropdownValue] = useState<string>(fundraiserDetail?.type.toString() ?? "0");

   const params = useParams();

   const toast = useToast();

   const navigate = useNavigate();

   const { register, getValues, formState, handleSubmit } = useForm<EditFundraiserForm>({
      criteriaMode: "all",
      reValidateMode: "onChange",
   });

   const sendGetFundraiserInformationRequest = async () => {
      const response = await getFundraiserDetail(params.fundraiserID || "");

      if (response === undefined) {
         setIsLoadingOpen(false);

         toast({
            title: "An unknown error has occured.",
            status: "error",
            duration: 3000,
            isClosable: false,
         });

         return;
      }

      setFundraiserDetail(response);

      setCategoryDropdownValue(response.type.toString());

      setIsLoadingOpen(false);
   }

   const sendEditFundraiserRequest = async () => {
      const values = getValues();

      const editFundraiserMessage: EditFundraiserMessage = {
         title: values.title,
         description: values.description,
         goal: values.goal,
         expirationDate: values.endDate,
         category: parseInt(categoryDropdownValue),
      };

      const response = await editFundraiser(fundraiserDetail?.id ?? "", editFundraiserMessage);

      toast({
         title: response.message,
         status: response.responseType,
         duration: 3000,
         isClosable: false,
      });

      if (response.responseType === "success") {
         navigate(`/fundraiser/${fundraiserDetail?.id}`);
      }
   }

   const onSubmit = () => {
      setIsLoadingOpen(true);

      sendEditFundraiserRequest();
   }

   useEffect(() => {
      sendGetFundraiserInformationRequest();

      // eslint-disable-next-line
   }, []);

   // TODO: Replace this with an actual page or 
   // redirect.
   if (params?.fundraiserID === undefined) {
      return (
         <>
            No
         </>
      );
   }

   if (fundraiserDetail === undefined) {
      return (
         <>
            <Page>
               <Container
                  display="flex"
                  paddingTop="2em"
                  paddingLeft="8rem"
                  paddingRight="8rem"
                  width="100%"
                  maxWidth="100%"
                  justifyContent="space-between"
               >
                  <Skeleton
                     width="100%"
                     height="3em"
                     speed={1}
                  >
                     This text is not visible but required.
                  </Skeleton>
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
                     marginTop="1em"
                  >
                     <Skeleton
                        width="100%"
                        height="100vh"
                        speed={1}
                     >
                        This text is not visible but required.
                     </Skeleton>
                  </Container>
                  <Container
                     display="flex"
                     flexDir="column"
                     width="30%"
                     maxWidth="30%"
                     alignContent="start"
                     flexWrap="wrap"
                     marginTop="1em"
                  >
                     <Skeleton
                        width="100%"
                        height="100vh"
                        speed={1}
                     >
                        This text is not visible but required.
                     </Skeleton>
                  </Container>
               </Container>
            </Page>
         </>
      );
   }

   return (
      <>
         <Page>
            <LoadingDialog
               open={isLoadingOpen}
            />
            <form onSubmit={handleSubmit(onSubmit)}>
               <Container
                  display="flex"
                  flexWrap="wrap"
                  alignContent="center"
                  height="4em"
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
                     Edit Fundraiser
                  </Text>
                  <Button
                     label="Save"
                     ariaLabel="Save edited fundraiser"
                     variant="icon_text"
                     icon={IoMdCheckmark}
                     style={{
                        "marginLeft": "auto",
                        "width": "8em",
                        "paddingLeft": "0.5em"
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
                           defaultValue={fundraiserDetail?.title}
                           containerStyle={{
                              width: "100%"
                           }}
                           formInfo={{
                              name: EditFundraiserFormNames.title,
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
                        defaultValue={fundraiserDetail?.description}
                        isTopDown={true}
                        containerStyle={{
                           height: "20em",
                        }}
                        style={{
                           height: "20em",
                        }}
                        formInfo={{
                           name: EditFundraiserFormNames.description,
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
                        defaultValue={fundraiserDetail?.target ?? 0}
                        keepWithinRange={true}
                        clampValueOnBlur={true}
                        icon={MdOutlineAttachMoney}
                        formInfo={{
                           name: EditFundraiserFormNames.goal,
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
                           name: EditFundraiserFormNames.endDate,
                           registerFn: register,
                           registerOptions: {
                              required: REQUIRED_FIELD_ERROR,
                           },
                           errorMessage: formState.errors.endDate?.message || "",
                        }}
                        defaultValue={fundraiserDetail.endDate}
                     />
                     <DropdownInput
                        label="Category"
                        ariaLabel="Category of fundraiser input"
                        containerStyle={{
                           width: "100%",
                           marginTop: "0em",
                        }}
                        onChange={(val) => { setCategoryDropdownValue(val); }}
                        defaultValue={fundraiserDetail.type}
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