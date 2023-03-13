import { Box, Container, StackDivider, Text, VStack } from "@chakra-ui/react";
import { FunctionComponent, useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { AllDonationsPopup } from "../all-donations-popup/all_donations_popup";
import { getRelativeTimeText } from "../globals/helpers";
import { RomeDonationIcon } from "../icons/rome_donation_icon";
import { Button } from "../input/button";
import { FundraiserDonationMessage } from "../models/incoming/FundraiserDonationMessage";

interface RecentDonationsProps {
   recentDonations: Array<FundraiserDonationMessage>;
   onTimeSortChanged: (sortOption: DonationTimeSort) => void;
   timeSortOption: DonationTimeSort;
}

export enum DonationTimeSort {
   LATEST = 0,
   OLDEST = 1,
}

export const RecentDonations: FunctionComponent<RecentDonationsProps> = (props: RecentDonationsProps) => {
   const [isSeeAllDonationDialogOpen, setIsSeeAllDonationDialogOpen] = useState<boolean>(false);

   const allDonationsPopupOnClose = () => {
      setIsSeeAllDonationDialogOpen(false);
   }

   return (
      <>
         {isSeeAllDonationDialogOpen && (
            <AllDonationsPopup
               onClose={allDonationsPopupOnClose}
            />
         )}
         <VStack
            divider={<StackDivider borderColor='gray.200' />}
            spacing={1}
            align="stretch"
            height="32em"
            maxHeight="32em"
            overflow="hidden"
         >
            {props.recentDonations.map((donation) => (
               <>
                  <Box h='auto' display="flex" flexDir="row" padding="0.3em">
                     <Container width="10%" padding="0" margin="0">
                        <RomeDonationIcon />
                     </Container>
                     <Container width="90%" padding="0" margin="0" display="flex" flexDir="column">
                        <Container width="100%" padding="0" margin="0">
                           <Text color="#2B2D42">
                              {donation.firstName + " " + donation.lastName}
                           </Text>
                        </Container>
                        <Container width="100%" padding="0" margin="0" maxWidth="100%" display="flex" flexDir="row" justifyContent="space-between">
                           <Text color="#2B2D42" fontWeight="bold">
                              ${donation.individualAmount}
                           </Text>
                           <Text color="#2B2D42">
                              {getRelativeTimeText(Date.now(), (new Date(donation.donatedAt)).getTime())}
                           </Text>
                        </Container>
                     </Container>
                  </Box>
               </>
            ))}
         </VStack>
         <Container
            maxWidth="100%"
            width="100%"
            padding="0"
            margin="0"
            display="flex"
            justifyContent="space-between"
         >
            <Button
               label="See All"
               ariaLabel="See all donations"
               variant="text_only"
               style={{
                  width: "30%"
               }}
               onClick={() => { setIsSeeAllDonationDialogOpen(true); }}
            />
            {(props.timeSortOption === DonationTimeSort.LATEST) ? (
               <Button
                  label="Latest"
                  ariaLabel="Latest filter"
                  variant="icon_text"
                  icon={FiChevronUp}
                  style={{
                     width: "50%"
                  }}
                  onClick={() => { props.onTimeSortChanged(DonationTimeSort.OLDEST); }}
               />
            ) : (
               <Button
                  label="Oldest"
                  ariaLabel="Oldest filter"
                  variant="icon_text"
                  icon={FiChevronDown}
                  style={{
                     width: "50%"
                  }}
                  onClick={() => { props.onTimeSortChanged(DonationTimeSort.LATEST); }}
               />
            )}
         </Container>
      </>
   );
}