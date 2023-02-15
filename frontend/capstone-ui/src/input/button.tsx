import { Button as ChakraButton, Icon, StyleProps, Text } from "@chakra-ui/react";
import { FunctionComponent } from "react";
import { IconType } from "react-icons";

interface ButtonProps {
   variant: "icon_button" | "text_only" | "icon_text";
   label?: string;
   icon?: IconType;
   ariaLabel: string;
   style?: StyleProps;
   onClick?: () => void;
   isFormSubmit?: boolean;
}

export const Button: FunctionComponent<ButtonProps> = (props: ButtonProps) => {
   switch (props.variant) {
      case "text_only":
         return (
            <>
               <ChakraButton
                  backgroundColor="#D90429"
                  color="white"
                  onClick={props.onClick}
                  aria-label={props.ariaLabel}
                  _hover={{
                     backgroundColor: "#2B2D42"
                  }}
                  {...props.style}
                  type={props.isFormSubmit !== undefined && props.isFormSubmit ? "submit" : "button"}
               >
                  {props.label}
               </ChakraButton>
            </>
         );
      case "icon_button":
         return (
            <>
               <ChakraButton
                  backgroundColor="#D90429"
                  color="white"
                  aria-label={props.ariaLabel}
                  marginRight="0.5em"
                  borderRadius="20px"
                  display="flex"
                  maxWidth="3em"
                  onClick={props.onClick}
                  _hover={{
                     backgroundColor: "#2B2D42"
                  }}
                  {...props.style}
                  type={props.isFormSubmit !== undefined && props.isFormSubmit ? "submit" : "button"}
               >
                  <Icon
                     boxSize="7"
                     justifySelf="center"
                     as={props.icon}
                  />
               </ChakraButton>
            </>
         )
      case "icon_text":
         return (
            <>
               <ChakraButton
                  aria-label={props.ariaLabel}
                  backgroundColor="#D90429"
                  color="white"
                  display="flex"
                  paddingLeft="0"
                  onClick={props.onClick}
                  _hover={{
                     backgroundColor: "#2B2D42"
                  }}
                  {...props.style}
                  type={props.isFormSubmit !== undefined && props.isFormSubmit ? "submit" : "button"}
               >
                  <Icon
                     color="white"
                     boxSize="9"
                     as={props.icon}
                     justifySelf="start"
                     width="20%"
                     marginLeft="0"
                  />
                  <Text
                     width="80%"
                     fontSize="xl"
                  >
                     {props.label}
                  </Text>
               </ChakraButton>
            </>
         )
   }
}