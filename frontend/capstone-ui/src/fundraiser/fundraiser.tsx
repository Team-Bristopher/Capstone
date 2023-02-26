import { Box, Container, Icon, Popover, PopoverBody, PopoverContent, PopoverTrigger, Text } from "@chakra-ui/react";
import { FunctionComponent } from "react";
import { BsFillEyeFill } from "react-icons/bs";
import { FundraiserDonationBar } from "../fundraiser-donation-bar/fundraiser_donation_bar";

export enum FundraiserType {
   Medical = 0,
   Education = 1,
   Disaster_Relief = 2,
   Environment = 3,
   Animal_Welfare = 4,
   Financial_Assistance = 5,
   Religion = 6,
   Community = 7,
   Political = 8,
}

export interface FundraiserProps {
   ID: string;
   type: FundraiserType;
   title: string;
   description: string;
   views: number;
   target: number;
   createdOn: Date;
   modifiedOn: Date;
   createdByID: string;
   endDate: Date;
}

export const Fundraiser: FunctionComponent<FundraiserProps> = (props: FundraiserProps) => {
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
         >
            <Box
               margin="0"
               padding="0"
               backgroundColor="#D9D9D9"
               minHeight="65%"
               width="100%"
            />
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
                  maxWidth="90%"
                  textOverflow="ellipsis"
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
                     maxHeight="10%"
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