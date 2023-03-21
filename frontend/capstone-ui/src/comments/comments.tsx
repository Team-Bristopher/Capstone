import { Container, Skeleton, Text, VStack } from "@chakra-ui/react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { FunctionComponent, useCallback, useContext } from "react";
import { getAllDonations } from "../api/api-calls";
import { FundraiserContext } from "../fundraiser-detail/fundraiser_detail";
import { getRelativeTimeText } from "../globals/helpers";
import { RomeDonationIcon } from "../icons/rome_donation_icon";
import { FundraiserDonationMessage } from "../models/incoming/FundraiserDonationMessage";

export const Comments: FunctionComponent = () => {
   const fundraiserContext = useContext(FundraiserContext);

   const fetchAllDonations = useCallback(async ({ pageParam = 0 }) => {
      if (fundraiserContext === undefined) {
         return [];
      }

      const donationPage = await getAllDonations(fundraiserContext?.fundraiser.id ?? "", pageParam, true);

      return donationPage;

      // eslint-disable-next-line
   }, [fundraiserContext]);

   const { data, isFetching } = useInfiniteQuery<FundraiserDonationMessage[]>({
      queryKey: ["all-donations-with-comments", fundraiserContext?.fundraiser.id],
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
            <VStack
               spacing={3}
               maxW="100%"
               w="100%"
               align="start"
            >
               <Skeleton width="60%" height="3em" />
               <Skeleton width="60%" height="3em" />
               <Skeleton width="60%" height="3em" />
            </VStack>
         </>
      );
   }

   return (
      <>
         {(data?.pages || []).map(commentPage => (
            <>
               <VStack
                  width="100%"
                  height="100%"
                  spacing={6}
               >
                  {(commentPage.map((comment) => (

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
                                    ${comment.individualAmount}
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
                  )))}
               </VStack>
            </>
         ))}
      </>
   );
}