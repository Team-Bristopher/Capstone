import { Box, Container, Divider, HStack, Icon, Progress, Skeleton, Text, useToast } from "@chakra-ui/react";
import { createContext, FunctionComponent, useContext, useEffect, useRef, useState } from "react";
import { AiOutlineFrown } from "react-icons/ai";
import { BsFillEyeFill, BsFillPersonFill } from "react-icons/bs";
import { MdInsertComment } from "react-icons/md";
import { RiPencilFill } from "react-icons/ri";
import { useParams } from "react-router-dom";
import { getFundraiserAmount, getFundraiserDetail, viewFundraiser } from "../api/api-calls";
import { DonationPopup } from "../donation-popup/donation_popup";
import { AuthContext } from "../globals/auth_context";
import { Button } from "../input/button";
import { Fundraiser } from "../models/incoming/Fundraiser";
import { FundraiserDonationMessage } from "../models/incoming/FundraiserDonationMessage";
import { Page } from "../page/page";
import { DonationTimeSort, RecentDonations } from "../recent-donations/recent_donations";

export interface FundraiserContextProps {
   fundraiser: Fundraiser;
}

export const FundraiserContext = createContext<FundraiserContextProps | undefined>(undefined);

export const FundraiserDetail: FunctionComponent = () => {
   const [isLoading, setIsLoading] = useState<boolean>(true);
   const [fundraiserDetail, setFundraiserDetail] = useState<Fundraiser>();
   const [donatedAmount, setDonatedAmount] = useState<number>(1);
   const [recentDonations, setRecentDonations] = useState<Array<FundraiserDonationMessage>>([]);
   const [isDonationDialogOpen, setIsDonationDialogOpen] = useState<boolean>(false);
   const [donationTimeSort, setDonationTimeSort] = useState<DonationTimeSort>(DonationTimeSort.OLDEST);

   const fundraiserContext = useRef<FundraiserContextProps | undefined>(undefined);

   const authContext = useContext(AuthContext);

   const params = useParams();

   const toast = useToast();

   const sendGetAmountRequest = async () => {
      setIsLoading(true);

      const response = await getFundraiserAmount(donationTimeSort, params.fundraiserID || "");

      if (response === undefined) {
         setIsLoading(false);

         toast({
            title: "An unknown error has occured.",
            status: "error",
            duration: 3000,
            isClosable: false,
         });

         return;
      }

      setDonatedAmount(response.totalAmount);
      setRecentDonations(response.recentDonations);

      setIsLoading(false);
   }

   const sendGetFundraiserInformationRequest = async () => {
      const response = await getFundraiserDetail(params.fundraiserID || "");

      if (response === undefined) {
         setIsLoading(false);

         toast({
            title: "An unknown error has occured.",
            status: "error",
            duration: 3000,
            isClosable: false,
         });

         return;
      }

      setFundraiserDetail(response);

      fundraiserContext.current = {
         fundraiser: response,
      };

      setIsLoading(false);
   }

   const getFundraiserDonationCalculation = (): string => {
      return ((donatedAmount / (fundraiserDetail?.target ?? 1)) * 100).toFixed(1);
   }

   useEffect(() => {
      setIsLoading(true);

      sendGetFundraiserInformationRequest();
      sendGetAmountRequest();

      // eslint-disable-next-line
   }, [params, donationTimeSort]);

   useEffect(() => {
      // Telling the API that we viewed the fundraiser.
      if (authContext?.loggedInUser !== undefined && params?.fundraiserID !== undefined && !isLoading) {
         viewFundraiser(params?.fundraiserID ?? "");
      }

      // eslint-disable-next-line
   }, [authContext?.loggedInUser, isLoading]);

   const onDonationTimeSortChanged = (timeOption: DonationTimeSort) => {
      setDonationTimeSort(timeOption);
   }

   if (isLoading) {
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
            <FundraiserContext.Provider value={fundraiserContext.current}>
               {isDonationDialogOpen && (
                  <DonationPopup
                     onClose={() => { setIsDonationDialogOpen(false); }}
                  />
               )}
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
                     <Container
                        display="flex"
                        flexDir="row"
                        padding="0"
                        margin="0"
                        width="100%"
                        maxWidth="100%"
                        justifyContent="space-between"
                        alignContent="baseline"
                        flexWrap="wrap"
                     >
                        <Text
                           fontSize="3xl"
                           fontWeight="bold"
                           color="#2B2D42"
                        >
                           {fundraiserDetail?.title}
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
                              {fundraiserDetail?.views}
                           </Text>
                        </Box>
                     </Container>
                     <Container
                        display="flex"
                        flexDir="row"
                        padding="0"
                        margin="0"
                        width="100%"
                        maxWidth="100%"
                        marginTop="1.2em"
                     >
                        <Box
                           width="100%"
                           maxWidth="100%"
                           height="40em"
                           backgroundColor="#D9D9D9"
                        />
                     </Container>
                     <Container
                        display="flex"
                        flexDir="row"
                        padding="0"
                        margin="0"
                        width="100%"
                        maxWidth="100%"
                        marginTop="1.2em"
                        justifyContent="space-between"
                     >
                        <Box
                           margin="0"
                           padding="0"
                           width="50%"
                           display="flex"
                           flexDir="row"
                        >
                           <Icon
                              as={BsFillPersonFill}
                              boxSize={8}
                              color="#2B2D42"
                              marginRight="0.5em"
                           />
                           <Text
                              width="100%"
                              height="auto"
                              fontSize="1.2rem"
                              fontWeight="bold"
                           >
                              {fundraiserDetail?.author.firstName} {fundraiserDetail?.author.lastName}
                           </Text>
                        </Box>
                     </Container>
                     <Divider
                        marginTop="0.5em"
                        backgroundColor="#D9D9D9"
                        height="0.1em"
                     />
                     <Container
                        display="flex"
                        flexDir="row"
                        padding="0"
                        margin="0"
                        width="100%"
                        maxWidth="100%"
                        marginTop="1.2em"
                     >
                        <Text
                           width="100%"
                           textOverflow="ellipsis"
                           fontSize="1.2rem"
                           maxHeight="15em"
                           height="auto"
                           overflow="hidden"
                           whiteSpace="nowrap"
                        >
                           {fundraiserDetail?.description}
                        </Text>
                     </Container>
                     <Divider
                        marginTop="1em"
                        backgroundColor="#D9D9D9"
                        height="0.1em"
                     />
                     <Container
                        display="flex"
                        flexDir="row"
                        padding="0"
                        margin="0"
                        width="100%"
                        maxWidth="100%"
                        marginTop="1.2em"
                     >
                        <Box
                           margin="0"
                           padding="0"
                           width="50%"
                           display="flex"
                           flexDir="row"
                        >
                           <Icon
                              as={MdInsertComment}
                              boxSize={8}
                              color="#2B2D42"
                              marginRight="0.5em"
                           />
                           <Text
                              width="100%"
                              height="auto"
                              fontSize="1.2rem"
                              fontWeight="bold"
                           >
                              Comments
                           </Text>
                        </Box>
                     </Container>
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
                     <Container
                        display="flex"
                        flexDir="row"
                        padding="0"
                        margin="0"
                        width="100%"
                        maxWidth="100%"
                        marginTop="1.2em"
                     >
                        {(authContext.loggedInUser !== undefined) && (
                           <Button
                              label="Edit"
                              ariaLabel="Edit fundraiser button"
                              variant="icon_text"
                              icon={RiPencilFill}
                              style={{
                                 "marginLeft": "auto",
                                 "width": "8em",
                                 "paddingLeft": "0.5em"
                              }}
                           />
                        )}
                     </Container>
                     <Container
                        display="flex"
                        flexDir="row"
                        padding="0"
                        margin="0"
                        width="100%"
                        maxWidth="100%"
                        marginTop="1.2em"
                     >
                        <Box
                           padding="0"
                           margin="0"
                           width="50%"
                           display="flex"
                           flexDir="row"
                        >
                           <Text
                              color="#EF233C"
                              fontSize="1em"
                              fontWeight="bold"
                              marginRight="0.3em"
                              marginTop="0.5em"
                           >
                              ${donatedAmount}
                           </Text>
                           <Text
                              color="#2B2D42"
                              fontSize="1em"
                              fontWeight="bold"
                              marginRight="0.3em"
                              marginTop="0.5em"
                           >
                              / ${fundraiserDetail?.target}
                           </Text>
                        </Box>
                        <Box
                           padding="0"
                           margin="0"
                           display="flex"
                           flexDir="row"
                           width="50%"
                        >
                           <Text
                              color="#2B2D42"
                              fontSize="1em"
                              fontWeight="bold"
                              marginRight="0.3em"
                              marginTop="0.5em"
                              marginLeft="auto"
                           >
                              Ends {new Date(fundraiserDetail?.endDate || "").toDateString()}
                           </Text>
                        </Box>
                     </Container>
                     <Container
                        display="flex"
                        flexDir="row"
                        padding="0"
                        margin="0"
                        width="100%"
                        maxWidth="100%"
                        marginTop="1.2em"
                     >
                        <Progress
                           width="100%"
                           minHeight="1.7em"
                           value={isLoading ? undefined : Number(getFundraiserDonationCalculation())}
                           isAnimated={true}
                           hasStripe={true}
                           isIndeterminate={isLoading}
                           borderRadius="7px"
                           backgroundColor="#D9D9D9"
                           colorScheme="red"
                        />
                     </Container>
                     <Container
                        display="flex"
                        flexDir="row"
                        padding="0"
                        margin="0"
                        width="100%"
                        maxWidth="100%"
                        marginTop="1.2em"
                     >
                        <Button
                           label="Donate"
                           ariaLabel="Donate to fundraiser button"
                           variant="text_only"
                           style={{
                              "width": "100%",
                              "height": "2em",
                              "fontSize": "xl",
                           }}
                           onClick={() => { setIsDonationDialogOpen(true); }}
                        />
                     </Container>
                     <Divider
                        marginTop="1em"
                        backgroundColor="#D9D9D9"
                        height="0.1em"
                     />
                     {donatedAmount === 0 ? (
                        <HStack
                           maxW="100%"
                           w="100%"
                           mt="1em"
                           align="center"
                           justify="center"
                        >
                           <Icon
                              as={AiOutlineFrown}
                              boxSize={8}
                           />
                           <Text>
                              No donations yet. Consider donating?
                           </Text>
                        </HStack>
                     ) : (
                        <RecentDonations
                           recentDonations={recentDonations}
                           onTimeSortChanged={onDonationTimeSortChanged}
                           timeSortOption={donationTimeSort}
                        />
                     )}
                  </Container>
               </Container>
            </FundraiserContext.Provider>
         </Page>
      </>
   );
}