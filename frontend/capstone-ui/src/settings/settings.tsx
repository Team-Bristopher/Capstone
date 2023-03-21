import { Avatar, Container, Text } from "@chakra-ui/react";
import { FunctionComponent, useContext } from "react";
import { HiOutlinePencil } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../globals/auth_context";
import { Button } from "../input/button";
import { Page } from "../page/page";

export const Settings: FunctionComponent = () => {
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
            Settings
          </Text>
          <Button
            label="Edit"
            variant="icon_text"
            icon={HiOutlinePencil}
            ariaLabel="Edit profile button"
            style={{
              padding: "1em"
            }}
            onClick={() => { navigate("/settings/edit"); }}
          />
        </Container>
        <Container
          display="flex"
          flexDir="row"
          padding="2em"
          paddingLeft="8rem"
          paddingRight="8rem"
          width="100%"
          maxWidth="100%"
        >
          <Avatar
            name={authContext.loggedInUser?.firstName + " " + authContext.loggedInUser?.lastName}
            size="2xl"
          />
          <Container
            margin="0"
            display="flex"
            flexDirection="column"
            width="11em"
          >
            <Container
              margin="0"
              padding="0.5em"
              display="flex"
              flexDir="row"
              width="15em"
            >
              <Text
                fontSize="lg"
                fontWeight="bold"
              >
                First Name
              </Text>
            </Container>
            <Container
              margin="0"
              padding="0.5em"
              display="flex"
              flexDir="row"
              width="15em"
            >
              <Text
                fontSize="lg"
                fontWeight="bold"
              >
                Last Name
              </Text>
            </Container>
            <Container
              margin="0"
              padding="0.5em"
              display="flex"
              flexDir="row"
              width="15em"
            >
              <Text
                fontSize="lg"
                fontWeight="bold"
              >
                Email Address
              </Text>
            </Container>
          </Container>
          <Container
            margin="0"
            display="flex"
            flexDirection="column"
          >
            <Container
              margin="0"
              padding="0.5em"
              display="flex"
              flexDir="row"
              width="15em"
            >
              <Text
                fontSize="lg"
              >
                {authContext.loggedInUser?.firstName}
              </Text>
            </Container>
            <Container
              margin="0"
              padding="0.5em"
              display="flex"
              flexDir="row"
              width="15em"
            >
              <Text
                fontSize="lg"
              >
                {authContext.loggedInUser?.lastName}
              </Text>
            </Container>
            <Container
              margin="0"
              padding="0.5em"
              display="flex"
              flexDir="row"
              width="15em"
            >
              <Text
                fontSize="lg"
              >
                {authContext.loggedInUser?.email}
              </Text>
            </Container>
          </Container>
        </Container>
      </Page>
    </>
  );
};
