import { Grid, GridItem } from "@chakra-ui/react";
import { FunctionComponent } from "react";
import { Fundraiser, FundraiserTypes } from "../fundraiser/fundraiser";

// These props describe filtering options.
interface FundraisersProps {
   search?: string;
   category?: number;
}

export const Fundraisers: FunctionComponent<FundraisersProps> = (props: FundraisersProps) => {
   return (
      <>
         <Grid
            templateColumns="repeat(3, 1fr)"
            overflow="auto"
            display="flex"
            width="100%"
            justifyContent="space-between"
         >
            <GridItem
               w="100%"
               h='auto'
            >
               <Fundraiser
                  ID="sajdksajd"
                  type={{
                     ID: "sdja",
                     Type: FundraiserTypes.Animal_Welfare,
                  }}
                  title="This is a title"
                  description="This is description"
                  views={12345}
                  target={125000}
                  createdOn={new Date()}
                  modifiedOn={new Date()}
                  createdByID="2323"
               />
            </GridItem>
            <GridItem
               w="100%"
               h='auto'
            >
               <Fundraiser
                  ID="sajdksajd"
                  type={{
                     ID: "sdja",
                     Type: FundraiserTypes.Animal_Welfare,
                  }}
                  title="This is a title"
                  description="This is description"
                  views={12345}
                  target={125000}
                  createdOn={new Date()}
                  modifiedOn={new Date()}
                  createdByID="2323"
               />
            </GridItem>
            <GridItem
               w="100%"
               h='auto'
            >
               <Fundraiser
                  ID="sajdksajd"
                  type={{
                     ID: "sdja",
                     Type: FundraiserTypes.Animal_Welfare,
                  }}
                  title="This is a title"
                  description="This is description"
                  views={12345}
                  target={125000}
                  createdOn={new Date()}
                  modifiedOn={new Date()}
                  createdByID="2323"
               />
            </GridItem>
         </Grid>
      </>
   );
}