import { Container, Image, Text } from "@chakra-ui/react";
import { FunctionComponent } from "react";

interface CreateFundraiserImagePreviewProps {
   imageURLs: Array<string>;
   onImageRemoved: (url: string) => void;
}

export const CreateFundraiserImagePreview: FunctionComponent<CreateFundraiserImagePreviewProps> = (props: CreateFundraiserImagePreviewProps) => {
   return (
      <>
         <Container
            maxW="100%"
            w="100%"
            height="10em"
            padding="1em"
            overflow="hidden"
            backgroundColor="#D9D9D9"
            marginTop="1em"
            borderRadius="10px"
            display="flex"
            flexDir="row"
            alignContent="center"
            flexWrap="wrap"
         >
            {(props.imageURLs.length === 0) && (
               <Text
                  color="white"
                  fontSize="xl"
               >
                  Uploaded images will go here
               </Text>
            )}
            {props.imageURLs.map((url) => (
               <>
                  <Image
                     src={url}
                     alt="User uploaded image for a fundraiser"
                     boxSize="120px"
                     borderRadius="5px"
                     _hover={{
                        "border": "3px solid",
                        "borderColor": "#D90429",
                        "transition": "0.1s ease",
                     }}
                     marginRight="1em"
                     cursor="pointer"
                     objectFit="cover"
                     onClick={() => {
                        props.onImageRemoved(url);
                     }}
                  />
               </>
            ))}
         </Container>
      </>
   );
}