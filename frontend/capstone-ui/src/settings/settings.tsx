import {
  Card,
  CardBody,
  CardHeader, Container, Heading,
  Skeleton,
  Text
} from "@chakra-ui/react";
import { FunctionComponent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getApiStatus } from "../api/api-calls";
import { Button } from "../input/button";
import { HealthcheckMessage } from "../models/incoming/HealthcheckResponse";
import { Page } from "../page/page";

export const Settings: FunctionComponent = () => {
  const navigate = useNavigate();
  const [isLoadingApiStatus, setIsLoadingApiStatus] = useState<boolean>(true);
  const [apiStatus, setApiStatus] = useState<string>("");

  useEffect(() => {
    setIsLoadingApiStatus(true);

    getApiStatus().then((response: HealthcheckMessage | undefined) => {
      setApiStatus(response === undefined ? "Error" : response.health);
      setIsLoadingApiStatus(false);
    });
  }, []);

  return (
    <>
      <Page>
        <Container
          display="flex"
          flexDir="row"
        >
          <Card maxWidth="15rem" marginRight="2rem">
            <CardHeader>
              <Heading size="md" textAlign="center">
                API Status
              </Heading>
            </CardHeader>
            <CardBody>
              {isLoadingApiStatus ? (
                <Skeleton width="100%" height="3rem" />
              ) : (
                <Container textAlign="center">
                  <Text>{apiStatus}</Text>
                </Container>
              )}
            </CardBody>
          </Card>
          <Card maxWidth="15rem">
            <CardBody>
              <Button
                label="Sign out"
                variant="text_only"
                ariaLabel="Sign out button"
                onClick={() => {
                  window.localStorage.setItem("accessToken", "");

                  navigate("/login");

                  window.location.reload();
                }}
              />
            </CardBody>
          </Card>
        </Container>
      </Page>
    </>
  );
};
