import { Container, SimpleGrid, Skeleton } from "@chakra-ui/react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { FunctionComponent, useCallback, useEffect } from "react";
import { getFundraisers } from "../api/api-calls";
import { Fundraiser as FundraiserComponent } from "../fundraiser/fundraiser";
import { Button } from "../input/button";
import { Fundraiser } from "../models/incoming/Fundraiser";

// These props describe filtering options.
interface FundraisersProps {
   search: string | undefined;
   category: number | undefined;
   refresh: number;
}

export const Fundraisers: FunctionComponent<FundraisersProps> = (props: FundraisersProps) => {
   const fetchFundraisers = useCallback(async ({ pageParam = 0 }) => {
      const fundraisers = await getFundraisers(pageParam, props.search, props.category);

      return fundraisers;

      // eslint-disable-next-line
   }, [props]);

   const { data, isFetching, fetchNextPage, hasNextPage, refetch } = useInfiniteQuery<Fundraiser[]>({
      queryKey: ["fundraisers", props.category],
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
            maxW="100%"
            columns={3}
            spacing={50}
            padding="0"
            margin="0"
            maxHeight="none"
            maxWidth="none"
            marginBottom="1em"
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
            width="100%"
            height="auto"
            columns={3}
            spacing={50}
            padding="0"
            margin="0"
            maxHeight="none"
            maxWidth="none"
            marginBottom="1em"
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
                           fundraiserThumbnailImage={fundraiser.imageURLs.length > 0 ? fundraiser.imageURLs[0] : ""}
                        />
                     </>
                  )))}
               </>
            ))}
         </SimpleGrid>
         {hasNextPage && (
            <Container
               maxWidth="100%"
               width="100%"
               display="flex"
               alignContent="center"
               justifyContent="center"
               marginBottom="1em"
            >
               <Button
                  label="Load More"
                  ariaLabel="Load more button"
                  onClick={() => { fetchNextPage(); }}
                  variant="text_only"
               />
            </Container>
         )}
      </>
   );
} 
