import { Grid, GridItem, Skeleton } from "@chakra-ui/react";
import { FunctionComponent, useCallback, useEffect } from "react";
import { useInfiniteQuery } from "react-query";
import { getFundraisers } from "../api/api-calls";
import { Fundraiser as FundraiserComponent } from "../fundraiser/fundraiser";
import { Fundraiser } from "../models/incoming/Fundraiser";

// These props describe filtering options.
interface FundraisersProps {
   search?: string;
   category?: number;
}

export const Fundraisers: FunctionComponent<FundraisersProps> = (props: FundraisersProps) => {
   const fetchFundraisers = useCallback(async ({ pageParam = 0 }) => {
      const fundraisers = await getFundraisers(pageParam);

      return fundraisers;

      // eslint-disable-next-line
   }, [props]);

   const { data, isFetching, refetch } = useInfiniteQuery<Fundraiser[]>({
      queryKey: ["fundraisers"],
      queryFn: fetchFundraisers,
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

   useEffect(() => {
      refetch();

      // eslint-disable-next-line
   }, [props]);

   if (isFetching) {
      return (
         <Grid
            templateColumns="repeat(3, 1fr)"
            overflow="auto"
            display="flex"
            width="100%"
            justifyContent="space-between"
         >
            <GridItem
               w="100%"
               h="auto"
            >
               <Skeleton
                  width="30em"
                  height="35em"
               />
            </GridItem>
            <GridItem
               w="100%"
               h="auto"
            >
               <Skeleton
                  width="30em"
                  height="35em"
               />
            </GridItem>
            <GridItem
               w="100%"
               h="auto"
            >
               <Skeleton
                  width="30em"
                  height="35em"
               />
            </GridItem>
         </Grid>
      );
   }

   return (
      <>
         <Grid
            templateColumns="repeat(3, 1fr)"
            overflow="auto"
            display="flex"
            flexDir="row"
            width="100%"
            justifyContent="space-between"
         >
            {(data?.pages || []).map((fundraiserPage) => (
               <>
                  {(fundraiserPage.map((fundraiser: Fundraiser) => (
                     <>
                        <GridItem
                           w="100%"
                           h="auto"
                           key={fundraiser.id}
                        >
                           <FundraiserComponent
                              ID={fundraiser.id}
                              type={fundraiser.type}
                              title={fundraiser.title}
                              description={fundraiser.description}
                              views={fundraiser.views}
                              target={fundraiser.target}
                              createdByID={fundraiser.createdBy}
                              createdOn={fundraiser.createdOn}
                              modifiedOn={fundraiser.modifiedOn}
                              endDate={fundraiser.endDate}
                           />
                        </GridItem>
                     </>
                  )))}
               </>
            ))}
         </Grid>
      </>
   );
} 
