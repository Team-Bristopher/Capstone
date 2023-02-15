import { Container, Text } from "@chakra-ui/react";
import { FunctionComponent } from "react";
import { Page } from "../page/page";

export const AccessibilityStatement: FunctionComponent = () => {
   return (
      <>
         <Page>
            <Container
               width="100%"
               maxWidth="100vw"
               height="100%"
               display="flex"
               color="#2B2D42"
               flexDir="column"
            >
               <Text
                  fontSize="l"
                  fontWeight="bold"
                  marginBottom="1em"
               >
                  Accessibility Statement
               </Text>
               <Text
                  fontSize="md"
                  marginBottom="1em"
               >
                  At Project ROME, we are committed to making our fundraising software platform accessible to all users, including those with disabilities. We recognize the importance of providing an inclusive and user-friendly experience for all individuals who use our platform.
               </Text>
               <Text
                  fontSize="l"
                  fontWeight="bold"
                  marginBottom="1em"
               >
                  Accessibility Features:
               </Text>
               <Text
                  fontSize="md"
                  marginBottom="1em"
               >
                  Our platform uses a modern UI layout and technologies that are designed to be accessible to users with disabilities. We strive to meet and exceed accessibility standards, including Web Content Accessibility Guidelines (WCAG) 2.0, to ensure that our platform is accessible to as many users as possible.
               </Text>
               <Text
                  fontSize="l"
                  fontWeight="bold"
                  marginBottom="1em"
               >
                  Continuous Improvement:
               </Text>
               <Text
                  fontSize="md"
                  marginBottom="1em"
               >
                  We are committed to continuously improving the accessibility of our platform and welcome feedback from our users. If you encounter any accessibility barriers while using our platform, please contact us at contact@projectROME.org to report the issue and request assistance.
               </Text>
               <Text
                  fontSize="l"
                  fontWeight="bold"
                  marginBottom="1em"
               >
                  Contact Us:
               </Text>
               <Text
                  fontSize="md"
                  marginBottom="1em"
               >
                  If you have any questions or concerns about the accessibility of our platform, please contact us at contact@projectROME.org. We will do our best to respond in a timely and helpful manner.
               </Text>
            </Container>
         </Page>
      </>
   );
}