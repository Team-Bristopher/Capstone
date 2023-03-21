import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogHeader, AlertDialogOverlay, Box, Container, Divider, IconButton, Skeleton, Text, VStack } from "@chakra-ui/react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { FunctionComponent, useCallback, useContext, useRef } from "react";
import { VscClose } from "react-icons/vsc";
import { getAllDonations } from "../api/api-calls";
import { FundraiserContext } from "../fundraiser-detail/fundraiser_detail";
import { formatCurrencyToString, getRelativeTimeText } from "../globals/helpers";
import { RomeDonationIcon } from "../icons/rome_donation_icon";
import { FundraiserDonationMessage } from "../models/incoming/FundraiserDonationMessage";

interface AllDonationsPopupProps {
   onClose: () => void;
}

export const AllDonationsPopup: FunctionComponent<AllDonationsPopupProps> = (props: AllDonationsPopupProps) => {
   const cancelRef = useRef(null);

   const fundraiserContext = useContext(FundraiserContext);

   const fetchAllDonations = useCallback(async ({ pageParam = 0 }) => {
      const donationPage = await getAllDonations(fundraiserContext?.fundraiser.id ?? "", pageParam);

      return donationPage;

      // eslint-disable-next-line
   }, [props]);

   const { data, isFetching } = useInfiniteQuery<FundraiserDonationMessage[]>({
      queryKey: ["all-donations"],
      queryFn: fetchAllDonations,
      refetchOnWindowFocus: false,
      getNextPageParam: (lastPage, pages) => {
         if (lastPage === undefined) {
            return undefined;
         }

         return (lastPage.length < 6)
            ? undefined
            : pages.length
      },
   });

   if (isFetching) {
      return (
         <>
            <AlertDialog
               motionPreset="slideInBottom"
               onClose={() => { }}
               isOpen={true}
               leastDestructiveRef={cancelRef}
               isCentered
            >
               <AlertDialogOverlay />
               <AlertDialogContent
                  maxWidth="100vw"
                  width="50vw"
               >
                  <AlertDialogHeader
                     backgroundColor="#2B2D42"
                     color="white"
                     fontSize="1.5em"
                     width="100%"
                     display="flex"
                     flexDir="row"
                     justifyContent="space-between"
                  >
                     <Text
                        width="75%"
                     >
                        All Donations to {fundraiserContext?.fundraiser.title ?? ""}
                     </Text>
                     <IconButton
                        icon={<VscClose />}
                        backgroundColor="transparent"
                        aria-label="Close donation popup button"
                        _hover={{
                           backgroundColor: "transparent",
                           color: "#EF233C"
                        }}
                        size="xl"
                        onClick={() => { props.onClose(); }}
                     />
                  </AlertDialogHeader>
                  <AlertDialogBody
                     padding="0.7em"
                  >
                     <VStack
                        spacing={3}
                        align="center"
                        overflow="hidden"
                     >
                        <Skeleton
                           width="50%"
                           height="5em"
                        />
                        <Skeleton
                           width="50%"
                           height="5em"
                        />
                        <Skeleton
                           width="50%"
                           height="5em"
                        />
                     </VStack>
                  </AlertDialogBody>
               </AlertDialogContent>
            </AlertDialog>
         </>
      );
   }

   return (
      <>
         <AlertDialog
            motionPreset="slideInBottom"
            onClose={() => { }}
            isOpen={true}
            leastDestructiveRef={cancelRef}
            isCentered
         >
            <AlertDialogOverlay />
            <AlertDialogContent
               maxWidth="100vw"
               width="50vw"
            >
               <AlertDialogHeader
                  backgroundColor="#2B2D42"
                  color="white"
                  fontSize="1.5em"
                  width="100%"
                  display="flex"
                  flexDir="row"
                  justifyContent="space-between"
               >
                  <Text
                     width="75%"
                  >
                     All Donations to {fundraiserContext?.fundraiser.title ?? ""}
                  </Text>
                  <IconButton
                     icon={<VscClose />}
                     backgroundColor="transparent"
                     aria-label="Close donation popup button"
                     _hover={{
                        backgroundColor: "transparent",
                        color: "#EF233C"
                     }}
                     size="xl"
                     onClick={() => { props.onClose(); }}
                  />
               </AlertDialogHeader>
               <AlertDialogBody
                  padding="0.7em"
               >
                  {(data?.pages || []).map((donationPage => (
                     <>
                        {(donationPage.map((donation, idx) => (
                           <>
                              <Box h='auto' display="flex" flexDir="row" padding="0.3em" maxW="100%" width="100%">
                                 <Container width="10%" padding="0" margin="0">
                                    <RomeDonationIcon />
                                 </Container>
                                 <Container width="100%" maxWidth="100%" padding="0" margin="0" display="flex" flexDir="column">
                                    <Container width="100%" padding="0" margin="0">
                                       <Text color="#2B2D42">
                                          {donation.firstName + " " + donation.lastName}
                                       </Text>
                                    </Container>
                                    <Container width="100%" padding="0" margin="0" maxWidth="100%" display="flex" flexDir="row" justifyContent="space-between">
                                       <Text color="#2B2D42" fontWeight="bold">
                                          {formatCurrencyToString(donation.individualAmount)}
                                       </Text>
                                       <Text color="#2B2D42">
                                          {getRelativeTimeText(Date.now(), (new Date(donation.donatedAt)).getTime())}
                                       </Text>
                                    </Container>
                                 </Container>
                              </Box>
                              {(idx !== donationPage.length - 1) && (
                                 <Divider />
                              )}
                           </>
                        )))}
                     </>
                  )))}
               </AlertDialogBody>
            </AlertDialogContent>
         </AlertDialog>
      </>
   );
}