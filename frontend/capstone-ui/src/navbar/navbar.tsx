import { Box, Container, Link, Text } from "@chakra-ui/react";
import { FunctionComponent, useContext } from "react";
import { MdSettings } from "react-icons/md";
import { Link as ReactRouterLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../globals/auth_context";
import { Button } from "../input/button";

export const Navbar: FunctionComponent = () => {
  const navigate = useNavigate();

  const authContext = useContext(AuthContext);

  return (
    <>
      <Container
        width="100%"
        height="6rem"
        margin="0"
        padding="0"
        maxWidth="100vw"
        display="flex"
        style={{
          "background": "linear-gradient(0deg, rgba(43,45,66,1) 36%, rgba(217,217,217,1) 36%)",
        }}
      >
        <img
          src="/rome_logo.png"
          width="123px"
          height="123px"
          style={{
            "position": "absolute"
          }}
        />
        <Container
          width="122px"
          height="35px"
          padding="0"
          marginRight="0"
          marginLeft="0"
          marginTop="auto"
          style={{
            "background": "linear-gradient(270deg, rgba(43,45,66,1) 20%, rgba(217,217,217,1) 20%)",
          }}
        />
        <Container
          width="auto"
          marginLeft="1rem"
          padding="0"
          margin="0"
          height="100%"
          display="flex"
        >
          <Text
            fontSize="4xl"
            color="#D90429"
            fontWeight="bold"
            marginTop="0.2em"
            onClick={() => { navigate("/"); }}
            _hover={{
              "cursor": "pointer",
            }}
          >
            R O M E
          </Text>
        </Container>
        <Container
          width="20%"
          height="100%"
          margin="0"
          paddingRight="1em"
          maxWidth="100vw"
          marginLeft="auto"
          display="flex"
          flexDir="row"
          justifyContent="right"
        >
          <Box
            width="auto"
            padding="0"
            marginLeft="0"
            marginRight="0"
            marginBottom="0"
            marginTop="0.75em"
            display="flex"
            flexDir="row"
            alignItems="top"
          >
            {authContext.loggedInUser === undefined &&
              <Link as={ReactRouterLink} to="/login">
                <Button
                  label="Log In"
                  variant="text_only"
                  ariaLabel="Log on button"
                  style={{
                    marginRight: "1em",
                  }}
                />
              </Link>
            }
            {authContext.loggedInUser !== undefined &&
              (
                <Container
                  margin="0"
                  padding="0"
                  height="2.5em"
                  display="flex"
                  alignItems="center"
                  marginRight="1em"
                >
                  <Text
                    color="#2B2D42"
                    fontWeight="bold"
                  >
                    Welcome, {authContext.loggedInUser.firstName} {authContext.loggedInUser.lastName}
                  </Text>
                </Container>
              )
            }

            <Link as={ReactRouterLink} to="/settings">
              <Button
                variant="icon_button"
                ariaLabel="Settings"
                icon={MdSettings}
                style={{
                  width: "1em",
                }}
              />
            </Link>
          </Box>
        </Container>
      </Container>
    </>
  );
};
