import { Box, Icon, Input, InputGroup, InputLeftElement, Popover, PopoverBody, PopoverContent, PopoverTrigger, StyleProps, Text } from "@chakra-ui/react";
import { FunctionComponent } from "react";
import { RegisterOptions, UseFormRegister } from "react-hook-form";
import { IconType } from "react-icons";
import { BiError } from "react-icons/bi";

export interface FormRegisterInfo {
   name: string;
   registerFn: UseFormRegister<any>;
   registerOptions: RegisterOptions;
   errorMessage: string;
}

interface DateInputProps {
   icon: IconType;
   ariaLabel: string;
   style?: StyleProps;
   containerStyle?: StyleProps;
   label: string;
   formInfo?: FormRegisterInfo;
   defaultValue?: Date;
}

export const DateInput: FunctionComponent<DateInputProps> = (props: DateInputProps) => {
   const hasError = (): boolean => {
      return props.formInfo?.errorMessage !== undefined && props.formInfo.errorMessage.length > 0;
   }

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
               <Input
                  width="100%"
                  maxWidth="100%"
                  backgroundColor="white"
                  type="date"
                  min={(new Date()).toISOString().substring(0, 10)}
                  _focusWithin={{
                     "border": "2px solid #2B2D42",
                  }}
                  _focusVisible={{
                     "border": "2px solid #2B2D42",
                  }}
                  paddingLeft="2.5em"
                  {...props.formInfo?.registerFn(props.formInfo?.name || '', props.formInfo?.registerOptions)}
                  {...props.style}
                  defaultValue={props.defaultValue !== undefined ? new Date(props.defaultValue).toISOString().substring(0, 10) : undefined}
               />
               {hasError() &&
                  <Popover placement="top" trigger="hover">
                     <PopoverTrigger>
                        <div>
                           <Icon
                              as={BiError}
                              boxSize="8"
                              color="#D90429"
                              marginLeft="0.2em"
                           />
                        </div>
                     </PopoverTrigger>
                     <PopoverContent zIndex="1000" width="auto" minWidth="0">
                        <PopoverBody textAlign="center">
                           {props.formInfo?.errorMessage || ""}
                        </PopoverBody>
                     </PopoverContent>
                  </Popover>
               }
            </InputGroup>
         </Box>
      </>
   );
}