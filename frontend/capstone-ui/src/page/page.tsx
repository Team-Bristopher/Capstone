import { FunctionComponent, ReactNode } from "react";
import { Container } from "@chakra-ui/react";
import { Navbar } from "../navbar/navbar";

interface PageProps {
  children: ReactNode;
}

export const Page: FunctionComponent<PageProps> = (props: PageProps) => {
    return (
        <>
          <Container width="100vw" height="100vh" margin="0" padding="0" maxWidth="100vw">
            <Navbar />
            <Container width="100vw" height="80vh" margin="0" padding="2rem" maxWidth="100vw">
              {props.children}
            </Container>
          </Container>
        </>
    );
}