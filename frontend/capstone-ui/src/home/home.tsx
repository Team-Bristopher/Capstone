import { Box, Container, Icon, Input, Select, Text } from "@chakra-ui/react";
import { FunctionComponent, useContext, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { HiMagnifyingGlass } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import { Fundraisers } from "../fundraisers/fundraisers";
import { AuthContext } from "../globals/auth_context";
import { Button } from "../input/button";
import { Page } from "../page/page";

export const Home: FunctionComponent = () => {
  const [searchValue, setSearchValue] = useState<string>();
  const [categorySearch, setCategorySearch] = useState<number>();
  const [filterRefresh, setFilterRefresh] = useState<number>();

  const authContext = useContext(AuthContext);

  const navigate = useNavigate();

  return (
    <>
      <Page>
        <Container
          display="flex"
          paddingLeft="8rem"
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
          marginTop="1em"
          marginBottom="1em"
          paddingLeft="8rem"
          paddingRight="8rem"
          width="100%"
          maxWidth="100%"
          justifyContent="space-between"
        >
          {authContext.loggedInUser !== undefined &&
            <Button
              ariaLabel="Create fundraiser button"
              label="Create Fundraiser"
              variant="icon_text"
              icon={AiOutlinePlus}
              style={{
                width: "16%",
              }}
              onClick={() => { navigate("fundraiser/create"); }}
            />
          }
          <Box
            margin="0"
            width={(authContext.loggedInUser !== undefined) ? "80%" : "100%"}
            maxWidth={(authContext.loggedInUser !== undefined) ? "80%" : "100%"}
            display="flex"
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
              marginTop="0.1rem"
              onClick={() => { setFilterRefresh(Date.now()); }}
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
              onChange={(event) => { setSearchValue(event.target.value); }}
            />
            <Select
              marginLeft="auto"
              width="18rem"
              color="white"
              backgroundColor="#8D99AE"
              height="2rem"
              marginRight="0.05rem"
              fontWeight="bold"
              onChange={(event) => { setCategorySearch(parseInt(event.target.value)); }}
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
        <Fundraisers search={searchValue ?? ""} category={categorySearch ?? 0} refresh={filterRefresh ?? 0} />
      </Page>
    </>
  );
};
