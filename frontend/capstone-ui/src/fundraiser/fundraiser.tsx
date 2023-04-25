import { Box, Container, Icon, Image, Popover, PopoverBody, PopoverContent, PopoverTrigger, Text } from "@chakra-ui/react";
import { FunctionComponent } from "react";
import { BsFillEyeFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { FundraiserDonationBar } from "../fundraiser-donation-bar/fundraiser_donation_bar";
import { FundrasierCategory } from "../models/incoming/Fundraiser";

export interface FundraiserProps {
   ID: string;
   type: FundrasierCategory;
   title: string;
   description: string;
   views: number;
   target: number;
   createdOn: Date;
   modifiedOn: Date;
   createdByID: string;
   endDate: Date;
   fundraiserThumbnailImage: string;
}

export const Fundraiser: FunctionComponent<FundraiserProps> = (props: FundraiserProps) => {
   const navigate = useNavigate();

   return (
      <>
         <Container
            width="25em"
            height="30em"
            border="1px solid #D9D9D9"
            borderRadius="5px"
            padding="10px"
            display="flex"
            flexDir="column"
            _hover={{
               "cursor": "pointer"
            }}
            onClick={() => { navigate(`fundraiser/${props.ID}`); }}
         >
            {(props.fundraiserThumbnailImage.length > 0) ? (
               <Image
                  minHeight="65%"
                  width="100%"
                  borderRadius="10px"
                  src={props.fundraiserThumbnailImage}
               />
            ) : (
               <Box
                  margin="0"
                  padding="0"
                  backgroundColor="#D9D9D9"
                  minHeight="65%"
                  width="100%"
               />
            )}
            <Box
               margin="0"
               padding="0"
               minHeight="5%"
               width="100%"
               display="flex"
               flexDir="row"
            >
               <Text
                  marginRight="auto"
                  fontSize="1.2rem"
                  fontWeight="bold"
                  marginTop="0.5em"
                  maxWidth="80%"
                  overflow="hidden"
                  textOverflow="ellipsis"
                  whiteSpace="nowrap"
               >
                  {props.title}
               </Text>
               <Box
                  marginLeft="auto"
                  width="auto"
                  display="flex"
                  alignContent="end"
                  flexWrap="wrap"
               >
                  <Icon
                     boxSize="7"
                     as={BsFillEyeFill}
                     marginRight="0.5em"
                  />
                  <Text
                     fontSize="1.1em"
                     fontWeight="bold"
                  >
                     {props.views}
                  </Text>
               </Box>
            </Box>
            <Popover placement="top" trigger="hover">
               <PopoverTrigger>
                  <Box
                     margin="0"
                     padding="0"
                     minHeight="10%"
                     width="100%"
                     display="flex"
                     flexDir="row"
                     marginTop="0.3em"
                  >
                     <Text
                        textOverflow="ellipsis"
                        overflow="hidden"
                        maxWidth="100%"
                        maxHeight="20px"
                        whiteSpace="nowrap"
                     >
                        {props.description}
                     </Text>
                  </Box>
               </PopoverTrigger>
               <PopoverContent zIndex="1000">
                  <PopoverBody textAlign="center">
                     {props.description}
                  </PopoverBody>
               </PopoverContent>
            </Popover>
            <Box
               margin="0"
               padding="0"
               minHeight="5%"
               width="100%"
               display="flex"
               flexDir="row"
            >
               <FundraiserDonationBar
                  fundraiserGoal={props.target}
                  fundraiserID={props.ID}
                  endDate={props.endDate}
               />
            </Box>
         </Container>
      </>
   );
}