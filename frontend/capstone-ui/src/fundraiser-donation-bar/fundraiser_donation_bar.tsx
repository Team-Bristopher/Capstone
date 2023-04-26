import { Box, Container, Progress, Text } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { FunctionComponent } from "react";
import { getFundraiserAmount } from "../api/api-calls";
import { formatCurrencyToString } from "../globals/helpers";
import { FundraiserDonationAmountMessage } from "../models/incoming/FundraiserDonationAmountMessage";
import { DonationTimeSort } from "../recent-donations/recent_donations";

interface FundraiserDonationBarProps {
   fundraiserID: string;
   fundraiserGoal: number;
   endDate: Date;
}

export const FundraiserDonationBar: FunctionComponent<FundraiserDonationBarProps> = (props: FundraiserDonationBarProps) => {
   const fetchDonationInformation = async (): Promise<FundraiserDonationAmountMessage> => {
      const response = await getFundraiserAmount(DonationTimeSort.LATEST, props.fundraiserID);

      if (response === undefined) {
         throw new Error("Unable to fetch fundraiser donation");
      }

      return response;
   }

   const { data, isFetching } = useQuery({
      queryKey: ["donation-amount", props.fundraiserID],
      queryFn: fetchDonationInformation,
      refetchOnWindowFocus: false,
   });

   return (
      <>
         <Container
            margin="0"
            padding="0"
            width="100%"
            maxWidth="100%"
            display="flex"
            flexDir="column"
         >
            <Container
               margin="0"
               padding="0"
               width="100%"
               maxWidth="100%"
               display="flex"
               flexDir="row"
               alignContent="center"
               flexWrap="wrap"
            >
               <Progress
                  width="100%"
                  minHeight="1.7em"
                  value={isFetching ? undefined : (((data?.totalAmount ?? 1) / props.fundraiserGoal) * 100)}
                  isAnimated={true}
                  hasStripe={true}
                  isIndeterminate={isFetching}
                  borderRadius="7px"
                  backgroundColor="#D9D9D9"
                  colorScheme="red"
               />
            </Container>
            <Container
               margin="0"
               padding="0"
               width="100%"
               maxWidth="100%"
               display="flex"
               flexDir="row"
               alignContent="space-between"
               flexWrap="wrap"
               marginTop="0.5em"
            >
               <Box
                  padding="0"
                  margin="0"
                  width="65%"
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
                     {formatCurrencyToString((data?.totalAmount ?? 1))}
                  </Text>
                  <Text
                     color="#2B2D42"
                     fontSize="1em"
                     fontWeight="bold"
                     marginRight="0.3em"
                     marginTop="0.5em"
                  >
                     / {formatCurrencyToString(props.fundraiserGoal)}
                  </Text>
               </Box>
               <Box
                  padding="0"
                  margin="0"
                  display="flex"
                  flexDir="row"
                  width="35%"
               >
                  {(new Date(props.endDate) < new Date()) ? (
                     <Text
                        color="#EF233C"
                        fontSize="1em"
                        fontWeight="bold"
                        marginRight="0.3em"
                        marginTop="0.5em"
                        marginLeft="auto"
                     >
                        Expired
                     </Text>
                  ) : (
                     <Text
                        color="#2B2D42"
                        fontSize="1em"
                        fontWeight="bold"
                        marginRight="0.3em"
                        marginTop="0.5em"
                        marginLeft="auto"
                     >
                        Ends {(new Date(props.endDate).toLocaleDateString())}
                     </Text>
                  )}
               </Box>
            </Container>
         </Container>
      </>
   );
}