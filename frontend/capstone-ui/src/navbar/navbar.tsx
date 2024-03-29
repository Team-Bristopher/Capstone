import { Avatar, Box, Button as ChakraButton, Container, Link, Popover, PopoverContent, PopoverTrigger, Text } from "@chakra-ui/react";
import { FunctionComponent, useContext } from "react";
import { MdSettings } from "react-icons/md";
import { Link as ReactRouterLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../globals/auth_context";
import { RomeIcon } from "../icons/rome_icon";
import { Button } from "../input/button";

export const Navbar: FunctionComponent = () => {
  const navigate = useNavigate();

  const authContext = useContext(AuthContext);

  const signOut = () => {
    window.localStorage.setItem("accessToken", "");

    navigate("/login");

    window.location.reload();
  }

  return (
    <>
      <Container
        padding="0"
        margin="0"
        display="flex"
        flexDir="row"
        maxW="100%"
        width="100%"
        height="6em"
      >
        <Container
          margin="0"
          padding="0"
          backgroundColor="#D9D9D9"
          width="8.45em"
          height="5.6em"
        >
          <RomeIcon />
        </Container>
        <Container
          width="100%"
          maxWidth="100%"
          display="flex"
          flexDir="column"
          padding="0"
          margin="0"
        >
          <Container
            width="100%"
            height="62.71%"
            margin="0"
            padding="0"
            maxWidth="100vw"
            display="flex"
            backgroundColor="#D9D9D9"
          >
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
                height="2em"
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
                {authContext.loggedInUser !== undefined && (
                  <Popover
                    placement="bottom"
                  >
                    <PopoverTrigger>
                      <div>
                        {(authContext.loggedInUser.profilePictureURL !== "") ? (
                          <Avatar
                            size="sm"
                            src={authContext.loggedInUser.profilePictureURL}
                            _hover={{
                              cursor: "pointer",
                            }}
                            aria-label="Profile-Icon"
                          />
                        ) : (
                          <Button
                            variant="icon_button"
                            ariaLabel="Settings"
                            icon={MdSettings}
                            style={{
                              width: "1em",
                            }}
                            aria-label="Profile-Icon"
                          />
                        )}
                      </div>
                    </PopoverTrigger>
                    <PopoverContent
                      zIndex="1000"
                      padding="1em"
                      minWidth="1em"
                      width="10em"
                    >
                      <ChakraButton
                        padding="0.5rem"
                        margin="0"
                        width="100%"
                        height="3rem"
                        onClick={() => { navigate("/settings"); }}
                      >
                        Profile
                      </ChakraButton>
                      <ChakraButton
                        padding="0.5rem"
                        margin="0"
                        width="100%"
                        height="3rem"
                        marginTop="1em"
                        onClick={signOut}
                      >
                        Sign Out
                      </ChakraButton>
                    </PopoverContent>
                  </Popover>
                )}
              </Box>
            </Container>
          </Container>
          <Container
            padding="0"
            margin="0"
            maxWidth="100%"
            width="100%"
            height="1.98em"
            backgroundColor="#2B2D42"
          />
        </Container>
      </Container>
    </>
  );
};
