import { Container, Text } from "@chakra-ui/react";
import { FunctionComponent } from "react";
import { Page } from "../page/page";

export const PrivacyPolicy: FunctionComponent = () => {
   return (
      <>
         <Page>
            <Container
               width="100%"
               height="auto"
               maxWidth="100vw"
               display="flex"
               justifyContent="center"
               overflow="auto"
               color="#2B2D42"
               flexDir="column"
            >
               <Text
                  fontSize="l"
                  fontWeight="bold"
                  marginBottom="1em"
               >
                  Privacy Policy
               </Text>
               <Text
                  fontSize="md"
                  marginBottom="1em"
               >
                  At Project ROME, we are committed to protecting the privacy of our users. This Privacy Policy outlines the information that we collect and how we use it. By using our fundraising platform, you agree to the terms of this Privacy Policy.
               </Text>
               <Text
                  fontSize="l"
                  fontWeight="bold"
                  marginBottom="1em"
               >
                  Information We Collect
               </Text>
               <Text
                  fontSize="md"
                  marginBottom="1em"
               >
                  Project ROME collects only the information that is necessary to provide our services. This includes authentication information, which is collected when you create an account. Our authentication system is built in-house and uses state-of-the-art cryptography to ensure the security of your data.
               </Text>
               <Text
                  fontSize="l"
                  fontWeight="bold"
                  marginBottom="1em"
               >
                  How We Use Your Information
               </Text>
               <Text
                  fontSize="md"
                  marginBottom="1em"
               >
                  The information we collect is used solely for the purpose of providing our services. This includes verifying your identity and providing access to the fundraising platform.
               </Text>
               <Text
                  fontSize="l"
                  fontWeight="bold"
                  marginBottom="1em"
               >
                  PCI Compliance
               </Text>
               <Text
                  fontSize="md"
                  marginBottom="1em"
               >
                  Project ROME is committed to maintaining the security of all transactions made through our platform. While we follow the guidelines set forth by the Payment Card Industry Data Security Standards (PCI DSS) to ensure the protection of your payment information, please note that this is a demo application and therefore we cannot legally claim to be 100% PCI compliant. We take your security seriously and are constantly working to improve our platform's security measures.
               </Text>
               <Text
                  fontSize="l"
                  fontWeight="bold"
                  marginBottom="1em"
               >
                  Data Security
               </Text>
               <Text
                  fontSize="md"
                  marginBottom="1em"
               >
                  Project ROME takes the security of your data very seriously. We use industry-standard security measures to protect against unauthorized access, alteration, or destruction of your information.
               </Text>
               <Text
                  fontSize="l"
                  fontWeight="bold"
                  marginBottom="1em"
               >
                  Changes to This Privacy Policy
               </Text>
               <Text
                  fontSize="md"
                  marginBottom="1em"
               >
                  We may update this Privacy Policy from time to time to reflect changes in our practices or services. We will notify you of any changes by posting the updated Privacy Policy on our website. Your continued use of the platform following any updates indicates your acceptance of the new terms.               </Text>
            </Container>
         </Page>
      </>
   );
}