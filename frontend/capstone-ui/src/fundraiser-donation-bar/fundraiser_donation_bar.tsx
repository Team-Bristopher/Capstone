import { Box, Container, Progress, Text } from "@chakra-ui/react";
import { FunctionComponent, useEffect, useState } from "react";
import { getFundraiserAmount } from "../api/api-calls";

interface FundraiserDonationBarProps {
   fundraiserID: string;
   fundraiserGoal: number;
   endDate: Date;
}

export const FundraiserDonationBar: FunctionComponent<FundraiserDonationBarProps> = (props: FundraiserDonationBarProps) => {
   const [isLoading, setIsLoading] = useState<boolean>(true);
   const [donatedAmount, setDonatedAmount] = useState<number>(1);

   const sendGetAmountRequest = async () => {
      setIsLoading(true);

      const response = await getFundraiserAmount(props.fundraiserID);

      if (response === undefined) {
         return;
      }

      setDonatedAmount(response.amount);
      setIsLoading(false);
   }

   useEffect(() => {
      sendGetAmountRequest();
   }, [props]);

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
               <Text
                  color="#2B2D42"
                  fontSize="1.2em"
                  fontWeight="bold"
                  marginRight="0.3em"
               >
                  {((donatedAmount / props.fundraiserGoal) * 100)}%
               </Text>
               <Progress
                  width="90%"
                  minHeight="1.7em"
                  value={isLoading ? undefined : ((donatedAmount / props.fundraiserGoal) * 100)}
                  isAnimated={true}
                  hasStripe={true}
                  isIndeterminate={isLoading}
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
                     / ${props.fundraiserGoal}
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
                     Ends {new Date(props.endDate).toDateString()}
                  </Text>
               </Box>
            </Container>
         </Container>
      </>
   );
}