import { Box, Container, Text } from "@chakra-ui/react";
import { FunctionComponent, useContext } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { BiCalendar } from "react-icons/bi";
import { MdOutlineAttachMoney } from "react-icons/md";
import { AuthContext } from "../globals/auth_context";
import { Button } from "../input/button";
import { DateInput } from "../input/dateinput";
import { DropdownInput } from "../input/dropdowninput";
import { NumberInput } from "../input/numberinput";
import { TextInput } from "../input/textinput";
import { Page } from "../page/page";

export const CreateFundraiser: FunctionComponent = () => {
   const authContext = useContext(AuthContext);

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
                  onClick={() => { }}
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
                  />
                  <DateInput
                     label="End Date"
                     ariaLabel="End date of fundraiser input"
                     icon={BiCalendar}
                     containerStyle={{
                        width: "100%",
                        marginTop: "0em",
                     }}
                  />
                  <DropdownInput
                     label="Category"
                     ariaLabel="Category of fundraiser input"
                     containerStyle={{
                        width: "100%",
                        marginTop: "0em",
                     }}
                     onChange={(val) => { }}
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
                  <TextInput
                     label="Category"
                     ariaLabel="Category of fundraiser input"
                     variant="text_only"
                     containerStyle={{
                        width: "100%",
                        marginTop: "0em",
                     }}
                  />
               </Container>
            </Container>
         </Page>
      </>
   );
}