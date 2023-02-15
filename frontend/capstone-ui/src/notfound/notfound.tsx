// This is our default 404 endpoint component.
// This component is rendered when the user reaches
// a path we dont have a component for.

import { FunctionComponent } from "react";
import { Container } from "@chakra-ui/react";

export const NotFound: FunctionComponent = () => {
  return (
    <>
      <Container
        width="100%"
        height="100%"
        padding="0"
        margin="0"
        maxWidth="100%"
        fontSize="5em"
        justifyContent="center"
        alignContent="center"
        display="flex"
      >
        How did you end up here? Page not found.
      </Container>
    </>
  );
};
