import { Card, CardBody, CardHeader, Heading, Skeleton, Text, Container } from "@chakra-ui/react";
import { FunctionComponent, useEffect, useState } from "react";
import { HealthcheckMessage } from "../models/incoming/HealthcheckMessage";
import { getApiStatus } from "../api/api-calls";
import { Page } from "../page/page";

export const Settings: FunctionComponent = () => {
    const [isLoadingApiStatus, setIsLoadingApiStatus] = useState<boolean>(true);
    const [apiStatus, setApiStatus] = useState<string>("");

    useEffect(() => {
        setIsLoadingApiStatus(true);
        
        getApiStatus()
            .then((response: HealthcheckMessage | undefined) => {
                setApiStatus(response == undefined ? "Error" : response.health);
                setIsLoadingApiStatus(false);
            });
    }, []);
    
    return (
        <>
            <Page>
                <Card maxWidth="15rem">
                    <CardHeader>
                        <Heading size="md" textAlign="center">API Status</Heading>
                    </CardHeader>
                    <CardBody>
                        {isLoadingApiStatus ? 
                            <Skeleton width="100%" height="3rem" /> 
                            :
                            <Container textAlign="center">
                                <Text>{apiStatus}</Text>
                            </Container>
                        }
                    </CardBody>
                </Card>
            </Page>
        </>
    );
}