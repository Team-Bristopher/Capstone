import { FunctionComponent } from "react";
import { Container, IconButton } from "@chakra-ui/react";
import { SettingsIcon } from "@chakra-ui/icons";
import { Link as ReactRouterLink } from "react-router-dom";
import { Link } from "@chakra-ui/react";

export const Navbar: FunctionComponent = () => {
    return (
        <>
            <Container width="100%" height="10vh" backgroundColor="#8D99AE" margin="0" padding="0" maxWidth="100vw" display="flex">
                <Container width="20%" height="100%" margin="0" padding="1rem" maxWidth="100vw" marginLeft="auto" display="flex" justifyContent="right" alignItems="center">
                    <Link as={ReactRouterLink} to="/settings">
                        <IconButton
                            icon={<SettingsIcon />}
                            aria-label="Settings menu"
                        />
                    </Link>
                </Container>
            </Container>
        </>
    )
}