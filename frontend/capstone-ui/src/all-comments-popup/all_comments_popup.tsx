import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Container, Divider, IconButton, Skeleton, Text, VStack } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { FunctionComponent, useCallback, useContext, useRef, useState } from "react";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { VscClose } from "react-icons/vsc";
import { getAllDonations } from "../api/api-calls";
import { FundraiserContext } from "../fundraiser-detail/fundraiser_detail";
import { formatCurrencyToString, getRelativeTimeText } from "../globals/helpers";
import { RomeDonationIcon } from "../icons/rome_donation_icon";

interface AllCommentsPopupProps {
   onClose: () => void;
   isOpen: boolean;
}

export const AllCommentsPopup: FunctionComponent<AllCommentsPopupProps> = (props: AllCommentsPopupProps) => {
   const [currentPage, setCurrentPage] = useState<number>(0);

   const cancelRef = useRef(null);

   const fundraiserContext = useContext(FundraiserContext);

   const fetchAllDonations = useCallback(async () => {
      if (fundraiserContext === undefined) {
         return [];
      }

      const donationPage = await getAllDonations(fundraiserContext?.fundraiser.id ?? "", currentPage, true);

      return donationPage;

      // eslint-disable-next-line
   }, [fundraiserContext, currentPage]);

   const getTotalComments = (): number => {
      if (fundraiserContext === undefined || fundraiserContext?.fundraiser === undefined) {
         return 0;
      }

      return fundraiserContext.fundraiser.commentCount;
   }

   const { data, isFetching } = useQuery({
      queryFn: fetchAllDonations,
      queryKey: ["all-comments-popup", currentPage],
      refetchOnWindowFocus: false,
   });

   const hasNextPage = (): boolean => {
      if (data === undefined) {
         return false;
      }

      if (Math.floor(getTotalComments() / 6) > currentPage) {
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
               onClose={props.onClose}
               isOpen={props.isOpen}
               leastDestructiveRef={cancelRef}
               isCentered
            >
               <AlertDialogOverlay />
               <AlertDialogContent
                  maxWidth="100vw"
                  width="50vw"
                  minHeight="80vh"
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
                        All comments to {fundraiserContext?.fundraiser.title ?? ""}
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
            isOpen={props.isOpen}
            onCloseComplete={props.onClose}
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
                     All Comments to {fundraiserContext?.fundraiser.title ?? ""}
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
                     width="100%"
                     height="100%"
                     spacing={6}
                     marginBottom="1em"
                  >
                     {(data || []).map((comment, idx) => (
                        <>
                           <Container
                              maxW="100%"
                              w="100%"
                              display="flex"
                              flexDir="row"
                              margin="0"
                              padding="0"
                           >
                              <Container
                                 padding="0"
                                 margin="0"
                                 width="auto"
                              >
                                 <RomeDonationIcon />
                              </Container>
                              <Container
                                 margin="0"
                                 padding="0"
                                 display="flex"
                                 flexDir="column"
                                 maxW="100%"
                                 w="100%"
                              >
                                 <Container
                                    maxW="100%"
                                    w="100%"
                                    display="flex"
                                    flexDir="row"
                                    margin="0"
                                    padding="0"
                                 >
                                    <Container
                                       padding="0"
                                       margin="0"
                                       marginLeft="1em"
                                    >
                                       {comment.firstName + " " + comment.lastName}
                                    </Container>
                                    <Container
                                       padding="0"
                                       margin="0"
                                       marginLeft="auto"
                                       width="auto"
                                    >
                                       {getRelativeTimeText(Date.now(), (new Date(comment.donatedAt)).getTime())}
                                    </Container>
                                 </Container>
                                 <Container
                                    maxW="100%"
                                    w="100%"
                                    display="flex"
                                    flexDir="row"
                                    margin="0"
                                    padding="0"
                                 >
                                    <Container
                                       padding="0"
                                       margin="0"
                                       marginLeft="1em"
                                    >
                                       <Text
                                          fontWeight="bold"
                                       >
                                          {formatCurrencyToString(comment.individualAmount)}
                                       </Text>
                                    </Container>
                                 </Container>
                                 <Container
                                    maxW="100%"
                                    w="100%"
                                    display="flex"
                                    flexDir="row"
                                    margin="0"
                                    padding="0"
                                    maxHeight="2em"
                                    textOverflow="ellipsis"
                                    overflow="hidden"
                                    whiteSpace="nowrap"
                                    marginLeft="1em"
                                 >
                                    {comment.message}
                                 </Container>
                              </Container>
                           </Container>
                           {(idx !== (data?.length || 0) - 1) && (
                              <Divider />
                           )}
                        </>
                     ))}
                  </VStack>
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
                     Page {currentPage} out of {Math.floor(getTotalComments() / 6)}
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