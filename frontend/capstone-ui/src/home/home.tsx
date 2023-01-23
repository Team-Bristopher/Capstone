import { FunctionComponent } from "react";
import { Container } from "@chakra-ui/react";
import { Navbar } from "../navbar/navbar";

export const Home: FunctionComponent = () => {
    return (
        <>
          <Container width="100vw" height="100vh" margin="0" padding="0" maxWidth="100vw">
            <Navbar />
          </Container>
        </>
    );
}