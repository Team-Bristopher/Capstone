import { Box, Icon, Input, Popover, PopoverBody, PopoverContent, PopoverTrigger, StyleProps, Text } from "@chakra-ui/react";
import React, { FunctionComponent } from "react";
import { RegisterOptions, UseFormRegister } from "react-hook-form";
import { BiError } from "react-icons/bi";
import { IconType } from "react-icons/lib";

export interface FormRegisterInfo {
   name: string;
   registerFn: UseFormRegister<any>;
   registerOptions: RegisterOptions;
   errorMessage: string;
}

interface TextInputProps {
   variant: "text_only" | "icon_only";
   label?: string;
   icon?: IconType;
   onChange?: (newInput: string) => void;
   ariaLabel: string;
   formInfo?: FormRegisterInfo;
   hideText?: boolean;
   style?: StyleProps;
   containerStyle?: StyleProps;
   placeholder?: string;
   isTopDown?: boolean;
   defaultValue?: string;
}

export const TextInput: FunctionComponent<TextInputProps> = (props: TextInputProps) => {
   const onInputChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (props.onChange) {
         props.onChange(e.target.value);
      }
   }

   const hasError = (): boolean => {
      return props.formInfo?.errorMessage !== undefined && props.formInfo.errorMessage.length > 0;
   }

   if (props.isTopDown !== undefined && props.isTopDown) {
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
               flexDir="column"
               alignItems="center"
               aria-label={props.ariaLabel}
               {...props.containerStyle}
            >
               <Text
                  color="white"
                  minWidth="100%"
                  fontSize="xl"
                  textAlign="start"
                  marginBottom="0.2em"
                  display="flex"
               >
                  {props.label}
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
                        <PopoverContent zIndex="1000">
                           <PopoverBody textAlign="center">
                              {props.formInfo?.errorMessage || ""}
                           </PopoverBody>
                        </PopoverContent>
                     </Popover>
                  }
               </Text>
               <Input
                  backgroundColor="white"
                  aria-label={props.ariaLabel}
                  _focusWithin={{
                     "border": "2px solid #2B2D42",
                  }}
                  _focusVisible={{
                     "border": "2px solid #2B2D42",
                  }}
                  onChange={onInputChanged}
                  type={props.hideText ? "password" : undefined}
                  {...props.formInfo?.registerFn(props.formInfo?.name || '', props.formInfo?.registerOptions)}
                  {...props.style}
                  placeholder={props.placeholder}
                  defaultValue={props.defaultValue ?? ""}
               />
            </Box>
         </>
      );
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
            aria-label={props.ariaLabel}
            {...props.containerStyle}
         >
            {props.variant === "icon_only" &&
               <Icon
                  as={props.icon as any}
                  marginRight="0.5em"
                  backgroundColor="#D9D9D9"
                  color="#2B2D42"
                  boxSize="6"
               />
            }
            {props.variant === "text_only" && props.label !== undefined &&
               <Text
                  color="white"
                  minWidth="25%"
                  fontSize="xl"
                  textAlign="center"
               >
                  {props.label}
               </Text>
            }
            <Input
               backgroundColor="white"
               aria-label={props.ariaLabel}
               _focusWithin={{
                  "border": "2px solid #2B2D42",
               }}
               _focusVisible={{
                  "border": "2px solid #2B2D42",
               }}
               onChange={onInputChanged}
               type={props.hideText ? "password" : undefined}
               {...props.formInfo?.registerFn(props.formInfo?.name || '', props.formInfo?.registerOptions)}
               {...props.style}
               placeholder={props.placeholder}
               _placeholder={{
                  fontWeight: "bold",
                  color: "#D9D9D9",
               }}
               defaultValue={props.defaultValue ?? ""}
            />
            {hasError() &&
               <Popover placement="top" trigger="hover">
                  <PopoverTrigger>
                     <div>
                        <Icon
                           as={BiError}
                           boxSize="8"
                           color="#D90429"
                           margin="0.2em"
                        />
                     </div>
                  </PopoverTrigger>
                  <PopoverContent zIndex="1000">
                     <PopoverBody textAlign="center">
                        {props.formInfo?.errorMessage || ""}
                     </PopoverBody>
                  </PopoverContent>
               </Popover>
            }
         </Box>
      </>
   );
}
