import { Box, Container, Icon, Input, Select, Text } from "@chakra-ui/react";
import { FunctionComponent, useContext } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { HiMagnifyingGlass } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import { Fundraisers } from "../fundraisers/fundraisers";
import { AuthContext } from "../globals/auth_context";
import { Button } from "../input/button";
import { Page } from "../page/page";

export const Home: FunctionComponent = () => {
  const authContext = useContext(AuthContext);

  const navigate = useNavigate();

  return (
    <>
      <Page>
        <Container
          display="flex"
          paddingLeft="11.45rem"
          paddingRight="8rem"
          width="100%"
          maxWidth="100%"
          justifyContent="space-between"
        >
          <Text
            fontSize="3xl"
            fontWeight="bold"
            color="#2B2D42"
          >
            Dashboard
          </Text>
        </Container>
        <Container
          display="flex"
          flexDir="row"
          padding="2em"
          paddingTop="1em"
          paddingLeft="7rem"
          paddingRight="7.85rem"
          width="100%"
          maxWidth="100%"
        >
          {authContext.loggedInUser !== undefined &&
            <Button
              ariaLabel="Create fundraiser button"
              label="Create Fundraiser"
              variant="icon_text"
              icon={AiOutlinePlus}
              style={{
                width: "18rem",
              }}
              onClick={() => { navigate("fundraiser/create"); }}
            />
          }
          <Box
            margin="0"
            width="100%"
            maxWidth="100%"
            display="flex"
            marginLeft="4.55rem"
            marginRight="2.6rem"
            border="1px solid"
            borderColor="#8D99AE"
            borderRadius="5px"
            alignContent="center"
            flexWrap="wrap"
            padding="5px"
          >
            <Icon
              boxSize="7"
              as={HiMagnifyingGlass}
              color="#8D99AE"
              _hover={{
                "cursor": "pointer",
              }}
              padding="2px"
              marginLeft="0.1rem"
              marginRight="-0.5rem"
              marginTop="0.1rem"
            />
            <Input
              placeholder="Search for fundraisers..."
              aria-label="Fundraiser search bar"
              width="60%"
              border="none"
              height="2rem"
              marginTop="-0.1rem"
              _focusVisible={{
                "border": "0",
                "borderColor": "none",
              }}
            />
            <Select
              marginLeft="auto"
              width="18rem"
              color="white"
              backgroundColor="#8D99AE"
              height="2rem"
              marginRight="0.05rem"
              fontWeight="bold"
            >
              <option value=''>All Categories</option>
              <option value='0'>Medical</option>
              <option value='1'>Education</option>
              <option value='2'>Disaster Relief</option>
              <option value='3'>Environment</option>
              <option value='4'>Animal Welfare</option>
              <option value='5'>Financial Assistance</option>
              <option value='6'>Religion</option>
              <option value='7'>Community</option>
              <option value='8'>Political</option>
            </Select>
          </Box>
        </Container>
        <Container
          display="flex"
          flexDir="row"
          padding="2em"
          paddingLeft="11.55rem"
          paddingRight="8rem"
          width="100%"
          maxWidth="100%"
          marginTop="-2.5rem"
        >
          <Fundraisers />
        </Container>
      </Page>
    </>
  );
};
