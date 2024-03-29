import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Box, Container, Divider, IconButton, Skeleton, Text, VStack } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { FunctionComponent, useCallback, useContext, useRef, useState } from "react";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { VscClose } from "react-icons/vsc";
import { getAllDonations } from "../api/api-calls";
import { FundraiserContext } from "../fundraiser-detail/fundraiser_detail";
import { formatCurrencyToString, getRelativeTimeText } from "../globals/helpers";
import { RomeDonationIcon } from "../icons/rome_donation_icon";

interface AllDonationsPopupProps {
   onClose: () => void;
}

export const AllDonationsPopup: FunctionComponent<AllDonationsPopupProps> = (props: AllDonationsPopupProps) => {
   const [currentPage, setCurrentPage] = useState<number>(0);

   const cancelRef = useRef(null);

   const fundraiserContext = useContext(FundraiserContext);

   const fetchAllDonations = useCallback(async () => {
      const donationPage = await getAllDonations(fundraiserContext?.fundraiser.id ?? "", currentPage);

      return donationPage;

      // eslint-disable-next-line
   }, [props, currentPage]);

   const getTotalDonations = (): number => {
      if (fundraiserContext === undefined || fundraiserContext.fundraiser === undefined) {
         return 0;
      }

      return fundraiserContext.fundraiser.donationCount;
   }

   const { data, isFetching } = useQuery({
      queryKey: ["all-donations-popup", currentPage],
      queryFn: fetchAllDonations,
      refetchOnWindowFocus: false,
   });

   const hasNextPage = (): boolean => {
      if (data === undefined) {
         return false;
      }

      if (Math.floor(getTotalDonations() / 6) > currentPage) {
         return true;
      }

      return false;
   }

   const hasPreviousPage = (): boolean => {
      if (data === undefined) {
         return false;
      }

      if (currentPage > 0) {
         return true;
      }

      return false;
   }

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
                  {(data || []).map((donation, idx) => (
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
                        {(idx !== (data?.length || 0) - 1) && (
                           <Divider />
                        )}
                     </>
                  ))}
               </AlertDialogBody>
               <AlertDialogFooter
                  backgroundColor="#2B2D42"
                  color="white"
                  width="100%"
                  display="flex"
                  flexDir="row"
                  alignContent="center"
                  justifyContent="center"
               >
                  <IconButton
                     aria-label="Previous page button"
                     icon={<BsChevronLeft />}
                     onClick={() => {
                        setCurrentPage(currentPage - 1);
                     }}
                     backgroundColor="#D90429"
                     isDisabled={!hasPreviousPage()}
                     marginRight="1em"
                     _hover={{
                        backgroundColor: "#EDF2F4",
                        color: "#2B2D42"
                     }}
                  />
                  <Text>
                     Page {currentPage} out of {Math.floor(getTotalDonations() / 6)}
                  </Text>
                  <IconButton
                     marginLeft="1em"
                     aria-label="Next page button"
                     icon={<BsChevronRight />}
                     onClick={() => {
                        setCurrentPage(currentPage + 1);
                     }}
                     backgroundColor="#D90429"
                     isDisabled={!hasNextPage()}
                     _hover={{
                        backgroundColor: "#EDF2F4",
                        color: "#2B2D42"
                     }}
                  />
               </AlertDialogFooter>
            </AlertDialogContent>
         </AlertDialog>
      </>
   );
}