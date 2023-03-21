import { Container } from "@chakra-ui/react";
import { FunctionComponent, ReactNode } from "react";
import { Footer } from "../footer/footer";
import { Navbar } from "../navbar/navbar";

interface PageProps {
  children: ReactNode;
}

export const Page: FunctionComponent<PageProps> = (props: PageProps) => {
  return (
    <>
      <Container
        width="100vw"
        height="100vh"
        padding="0"
        maxWidth="100vw"
        display="flex"
        flexDir="column"
      >
        <Navbar />
        <Container
          width="100vw"
          height="95vh"
          padding="1rem"
          maxWidth="100vw"
          overflow="auto"
        >
          {props.children}
        </Container>
        <Footer />
      </Container>
    </>
  );
};
