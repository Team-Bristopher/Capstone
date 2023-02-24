import { Box, Select, StyleProps, Text } from "@chakra-ui/react";
import { FunctionComponent } from "react";

export interface DropdownInputValues {
   name: string;
   value: string;
}

interface DropdownInputProps {
   containerStyle?: StyleProps;
   ariaLabel: string;
   values: Array<DropdownInputValues>;
   label: string;
   onChange: (value: string) => void;
}

export const DropdownInput: FunctionComponent<DropdownInputProps> = (props: DropdownInputProps) => {
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
            <Select
               marginLeft="auto"
               width="18rem"
               color="white"
               backgroundColor="#8D99AE"
               height="2rem"
               marginRight="0.2rem"
               fontWeight="bold"
            >
               {props.values.map((val) => (
                  <option value={val.value}>{val.name}</option>
               ))}
            </Select>
         </Box>
      </>
   );
}

