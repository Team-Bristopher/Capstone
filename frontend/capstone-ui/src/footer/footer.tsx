import { Container, Link, Text } from "@chakra-ui/react";
import { FunctionComponent } from "react";
import { Link as ReactRouterLink } from "react-router-dom";

export const Footer: FunctionComponent = () => {
   return (
      <>
         <Container
            width="100%"
            maxWidth="100vw"
            height="5vh"
            backgroundColor="#D9D9D9"
            display="flex"
            flexDir="row"
            marginTop="auto"
            marginLeft="0"
            marginRight="0"
            alignItems="center"
         >
            <Link
               as={ReactRouterLink}
               to="/privacy-policy"
               marginRight="2em"
            >
               <Text
                  color="#2B2D42"
                  fontWeight="bold"
               >
                  Privacy Policy
               </Text>
            </Link>
            <Link
               as={ReactRouterLink}
               to="/accessibility-statement"
               marginRight="2em"
            >
               <Text
                  color="#2B2D42"
                  fontWeight="bold"
               >
                  Accessibility Statement
               </Text>
            </Link>
            <Link
               as={ReactRouterLink}
               to="/terms-of-use"
               marginRight="2em"
            >
               <Text
                  color="#2B2D42"
                  fontWeight="bold"
               >
                  Terms of Use
               </Text>
            </Link>
         </Container>
      </>
   );
}