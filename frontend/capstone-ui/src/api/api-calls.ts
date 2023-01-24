import { HealthcheckMessage } from "../models/incoming/HealthcheckMessage";

export const getApiStatus = (): Promise<HealthcheckMessage | undefined> => {
    return fetch(`${process.env.REACT_APP_API_URL}/api/main/healthcheck}`)
        .then((resp) => {
            if (resp.status === 200) {
                return resp.json();
            }
            
            return undefined;
        })
        .then((responseJson) => {
            if (responseJson === undefined) {
                return undefined;
            }

            return responseJson as HealthcheckMessage;
        });
}