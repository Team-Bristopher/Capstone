import { Container, Text } from "@chakra-ui/react";
import { FunctionComponent } from "react";
import { Page } from "../page/page";

export const TermsOfUse: FunctionComponent = () => {
   return (
      <>
         <Page>
            <Container
               width="100%"
               height="100%"
               maxWidth="100vw"
               display="flex"
               justifyContent="start"
               color="#2B2D42"
               flexDir="column"
               overflow="auto"
            >
               <Text
                  fontSize="l"
                  fontWeight="bold"
                  marginBottom="1em"
               >
                  Terms and Conditions
               </Text>
               <Text
                  fontSize="md"
                  marginBottom="1em"
               >
                  Welcome to Project ROME's fundraising software platform. By accessing and using our platform, you agree to be bound by the following terms and conditions (“Terms”). If you do not agree to these Terms, please do not use our platform.
               </Text>
               <Text
                  fontSize="l"
                  fontWeight="bold"
                  marginBottom="1em"
               >
                  Use of Platform:
               </Text>
               <Text
                  fontSize="md"
                  marginBottom="1em"
               >
                  You may only use our platform for lawful purposes and in accordance with these Terms. You agree not to use our platform to:

                  Engage in any illegal or unethical activity
                  Transmit any harmful, harassing, or offensive content
                  Infringe upon the intellectual property rights of others
                  Use the platform for any commercial purposes without our prior written consent.
               </Text>
               <Text
                  fontSize="l"
                  fontWeight="bold"
                  marginBottom="1em"
               >
                  Account Information:
               </Text>
               <Text
                  fontSize="md"
                  marginBottom="1em"
               >
                  You are responsible for maintaining the accuracy and security of your account information and for all activities that occur under your account. You agree to immediately notify us of any unauthorized use of your account.
               </Text>
               <Text
                  fontSize="l"
                  fontWeight="bold"
                  marginBottom="1em"
               >
                  Intellectual Property Rights:
               </Text>
               <Text
                  fontSize="md"
                  marginBottom="1em"
               >
                  All intellectual property rights in our platform and its content are owned by us or our licensors. You may not use our platform or its content in any way that infringes these rights.
               </Text>
               <Text
                  fontSize="l"
                  fontWeight="bold"
                  marginBottom="1em"
               >
                  Modifications to Platform:
               </Text>
               <Text
                  fontSize="md"
                  marginBottom="1em"
               >
                  We reserve the right to modify or discontinue our platform, in whole or in part, at any time, with or without notice. We will not be liable to you or any third party for any such modification, suspension, or discontinuance.
               </Text>
               <Text
                  fontSize="l"
                  fontWeight="bold"
                  marginBottom="1em"
               >
                  Warranties and Representations:
               </Text>
               <Text
                  fontSize="md"
                  marginBottom="1em"
               >
                  Our platform is provided "as is" and we make no representations or warranties of any kind, express or implied, as to the operation of our platform or the accuracy or completeness of its content.
               </Text>
               <Text
                  fontSize="l"
                  fontWeight="bold"
                  marginBottom="1em"
               >
                  Limitation of Liability:
               </Text>
               <Text
                  fontSize="md"
                  marginBottom="1em"
               >
                  In no event will we be liable for any damages arising from the use of our platform, including but not limited to, indirect, incidental, special, or consequential damages.
               </Text>
               <Text
                  fontSize="l"
                  fontWeight="bold"
                  marginBottom="1em"
               >
                  Indemnification:
               </Text>
               <Text
                  fontSize="md"
                  marginBottom="1em"
               >
                  You agree to indemnify and hold us harmless from any claims, damages, losses, and expenses (including legal fees) arising from your use of our platform or any violation of these Terms.
               </Text>
            </Container>
         </Page>
      </>
   );
}