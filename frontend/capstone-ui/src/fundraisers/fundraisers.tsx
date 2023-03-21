import { SimpleGrid, Skeleton } from "@chakra-ui/react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { FunctionComponent, useCallback, useEffect } from "react";
import { getFundraisers } from "../api/api-calls";
import { Fundraiser as FundraiserComponent } from "../fundraiser/fundraiser";
import { Fundraiser } from "../models/incoming/Fundraiser";

// These props describe filtering options.
interface FundraisersProps {
   search: string;
   category: number;
   refresh: number;
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
   }, [props.refresh]);

   if (isFetching) {
      return (
         <SimpleGrid
            overflow="auto"
            width="100%"
            columns={3}
            spacing={110}
            padding="0"
            margin="0"
         >

            <Skeleton
               width="25em"
               height="30em"
            />

            <Skeleton
               width="25em"
               height="30em"
            />
            <Skeleton
               width="25em"
               height="30em"
            />
         </SimpleGrid>
      );
   }

   return (
      <>
         <SimpleGrid
            overflow="auto"
            width="100%"
            columns={3}
            spacing={110}
            padding="0"
            margin="0"
         >
            {(data?.pages || []).map((fundraiserPage) => (
               <>
                  {(fundraiserPage.map((fundraiser: Fundraiser) => (
                     <>
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
                     </>
                  )))}
               </>
            ))}
         </SimpleGrid>
      </>
   );
} 
