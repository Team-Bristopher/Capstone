import { Box, Container, Icon, Text, useToast } from "@chakra-ui/react";
import { FunctionComponent, useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { AiOutlinePlus } from "react-icons/ai";
import { BiCalendar } from "react-icons/bi";
import { BsImage } from "react-icons/bs";
import { MdOutlineAttachMoney } from "react-icons/md";
import ImageUploading from "react-images-uploading";
import { useNavigate } from "react-router-dom";
import { createFundraiser, sendFundraiserImage } from "../api/api-calls";
import { CreateFundraiserImagePreview } from "../create-fundraiser-image-preview/create_fundraiser_image_preview";
import { CropImagesPopup } from "../crop-images-popup/crop_images_popup";
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
   const [imageToCrop, setImageToCrop] = useState<string | undefined>(undefined);
   const [imagesToUpload, setImagesToUpload] = useState<Array<string>>([]);

   const navigate = useNavigate();
   const toast = useToast();

   const authContext = useContext(AuthContext);

   const { register, getValues, formState, handleSubmit } = useForm<CreateFundraiserForm>({
      criteriaMode: "all",
      reValidateMode: "onChange",
   });

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
         position: "top"
      });

      // Redirect to fundraiser detail.
      if (response.responseType === "success") {
         for (let i = 0; i < imagesToUpload.length; i++) {
            const formData = new FormData();

            await fetch(imagesToUpload[i])
               .then(async (resp) => {
                  const blob = await resp.blob();
                  const file = new File([blob], "image.png");

                  formData.append("file", file);
               });

            const imagesResponse = await sendFundraiserImage(response.fundraiserID, formData);

            if (imagesResponse.responseType === "error") {
               toast({
                  title: imagesResponse.message,
                  status: imagesResponse.responseType,
                  duration: 3000,
                  isClosable: false,
                  position: "top"
               });

               setIsLoadingOpen(false);

               return;
            }
         }

         setIsLoadingOpen(false);

         navigate(`/fundraiser/${response.fundraiserID}`);
      }

      setIsLoadingOpen(false);
   }

   const onSubmit = () => {
      setIsLoadingOpen(true);

      sendCreateFundraiserRequest();
   }

   if (!authContext || !authContext.loggedInUser) {
      return (
         <>
            <Page>
               Not allowed
            </Page>
         </>
      )
   }

   const onImageCropEnd = (result: "fail" | "success" | "manually_cancelled", imageURL: string | undefined) => {
      if (result === "manually_cancelled") {
         setImageToCrop(undefined);

         return;
      }

      if (result === "fail" || imageURL === undefined) {
         toast({
            title: "An unknown error has occured, please try again later.",
            status: "error",
            duration: 3000,
            isClosable: false,
            position: "top"
         });

         return;
      }

      if (result === "success") {
         setImageToCrop(undefined);

         setImagesToUpload([...imagesToUpload, imageURL]);
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
                  display="flex"
                  paddingLeft="8rem"
                  paddingRight="8rem"
                  width="100%"
                  maxWidth="100%"
                  justifyContent="space-between"
                  flexWrap="wrap"
                  alignContent="center"
                  height="4em"
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
                     ariaLabel="Create fundraiser button"
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
                     <ImageUploading
                        maxNumber={5}
                        value={[]}
                        onChange={(value) => {
                           setImageToCrop(value.length > 0 ? value[0].dataURL : undefined);
                        }}
                     >
                        {({
                           isDragging,
                           dragProps,
                           onImageUpload
                        }) => (
                           <>
                              <Box
                                 padding="0"
                                 margin="0"
                                 maxWidth="100%"
                                 width="100%"
                                 backgroundColor="#D9D9D9"
                                 height="30em"
                                 borderRadius="10px"
                                 _hover={{
                                    cursor: "pointer",
                                 }}
                                 border={isDragging ? "3px dashed" : undefined}
                                 onClick={() => {
                                    if (imagesToUpload.length < 5) {
                                       onImageUpload();
                                    } else {
                                       toast({
                                          title: "You are not allowed to upload any more images.",
                                          status: "error",
                                          duration: 3000,
                                          isClosable: false,
                                          position: "top"
                                       })
                                    }
                                 }}
                                 display="flex"
                                 flexDir="column"
                                 justifyContent="center"
                                 alignContent="center"
                                 flexWrap="wrap"
                                 {...dragProps}
                              >
                                 <Text
                                    color="white"
                                    fontSize="2xl"
                                    alignSelf="center"
                                 >
                                    Click here to upload images
                                 </Text>
                                 <Icon
                                    as={BsImage}
                                    color="white"
                                    boxSize="7em"
                                    alignSelf="center"
                                 />
                                 <Text
                                    color="white"
                                    fontSize="2xl"
                                 >
                                    {imagesToUpload.length} / 5 images have been uploaded
                                 </Text>
                              </Box>
                              {imageToCrop !== undefined && (
                                 <CropImagesPopup
                                    image={imageToCrop}
                                    onClose={onImageCropEnd}
                                    cropShape="rect"
                                    cropAspectRatio={1 / 2}
                                    cropSize={{
                                       width: 800,
                                       height: 600,
                                    }}
                                 />
                              )}
                           </>
                        )}
                     </ImageUploading>
                     <CreateFundraiserImagePreview
                        imageURLs={imagesToUpload}
                        onImageRemoved={(url: string) => {
                           setImagesToUpload([...imagesToUpload.filter(_url => _url !== url)])
                        }}
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
                           {
                              value: "9",
                              name: "Other",
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