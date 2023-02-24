import { Progress } from "@chakra-ui/react";
import { FunctionComponent, useEffect, useState } from "react";

interface FundraiserDonationBarProps {
   fundraiserID: string;
   fundraiserGoal: number;
}

export const FundraiserDonationBar: FunctionComponent<FundraiserDonationBarProps> = (props: FundraiserDonationBarProps) => {
   const [isLoading, setIsLoading] = useState<boolean>(true);
   const [donatedAmount, setDonatedAmount] = useState<number>(1);

   useEffect(() => {

   }, [props]);

   return (
      <>
         <Progress
            width="100%"
            minHeight="1.5em"
            value={isLoading ? undefined : ((props.fundraiserGoal / donatedAmount) * 100)}
            isAnimated={true}
            hasStripe={true}
            isIndeterminate={isLoading}
            borderRadius="7px"
            backgroundColor="#D9D9D9"
            colorScheme="red"
         />
      </>
   );
}