import { Box, Icon, InputGroup, InputLeftElement, NumberInput as ChakraNumberInput, NumberInputField, StyleProps, Text } from "@chakra-ui/react";
import { FunctionComponent } from "react";
import { RegisterOptions, UseFormRegister } from "react-hook-form";
import { IconType } from "react-icons/lib";

export interface FormRegisterInfo {
   name: string;
   registerFn: UseFormRegister<any>;
   registerOptions: RegisterOptions;
   errorMessage: string;
}

interface NumberInputProps {
   defaultValue: number;
   keepWithinRange: boolean;
   clampValueOnBlur: boolean;
   containerStyle?: StyleProps;
   style?: StyleProps;
   formInfo?: FormRegisterInfo;
   ariaLabel: string;
   label: string;
   max?: number;
   min?: number;
   icon: IconType;
}

export const NumberInput: FunctionComponent<NumberInputProps> = (props: NumberInputProps) => {
   return (
      <>
         <Box
            minWidth="20em"
            borderRadius="10px"
            backgroundColor="#D9D9D9"
            padding="0.5em"
            marginRight="0"
            marginLeft="0"
            marginTop="1em"
            marginBottom="1em"
            display="flex"
            flexDir="row"
            alignItems="center"
            height="3.5em"
            aria-label={props.ariaLabel}
            {...props.containerStyle}
         >
            <Text
               color="white"
               minWidth="25%"
               fontSize="xl"
               textAlign="center"
            >
               {props.label}
            </Text>
            <InputGroup>
               <InputLeftElement
                  pointerEvents="none"
                  children={
                     <Icon
                        boxSize={7}
                        color="#D9D9D9"
                        as={props.icon as any}
                     />
                  }
               />
               <ChakraNumberInput
                  max={props.max || 10000000}
                  defaultValue={props.defaultValue}
                  min={props.min || 0}
                  keepWithinRange={props.keepWithinRange}
                  clampValueOnBlur={props.clampValueOnBlur}
                  width="100%"
                  maxWidth="100%"
               >
                  <NumberInputField
                     width="100%"
                     maxWidth="100%"
                     backgroundColor="white"
                     _focusWithin={{
                        "border": "2px solid #2B2D42",
                     }}
                     _focusVisible={{
                        "border": "2px solid #2B2D42",
                     }}
                     paddingLeft="2.5em"
                     {...props.formInfo?.registerFn(props.formInfo?.name || '', props.formInfo?.registerOptions)}
                     {...props.style}
                  />
               </ChakraNumberInput>
            </InputGroup>
         </Box>
      </>
   );
}
