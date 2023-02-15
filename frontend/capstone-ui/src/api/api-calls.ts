import { HealthcheckMessage } from "../models/incoming/HealthcheckResponse";
import { LoggedInUserResponse } from "../models/incoming/LoggedInUserResponse";
import { MyUserResponse } from "../models/incoming/MyUserResponse";
import { RegisterUserResponse } from "../models/incoming/RegisterUserResponse";
import { LoginUserMessage } from "../models/outgoing/LoginUserMessage";
import { RegisterUserMessage } from "../models/outgoing/RegisterUserMessage";

export const getApiStatus = (): Promise<HealthcheckMessage | undefined> => {
  const authorization = localStorage.getItem("accessToken");

  return fetch(`${process.env.REACT_APP_API_URL}/api/main/healthcheck`, {
    headers: {
      "Authorization": "Bearer " + (authorization || "")
    }
  })
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
};

export const registerUser = (message: RegisterUserMessage): Promise<RegisterUserResponse> => {
  return fetch(`${process.env.REACT_APP_API_URL}/api/auth/register`,
    {
      method: "POST",
      body: JSON.stringify(message),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((resp) => {
      switch (resp.status) {
        case 200:
          return {
            responseType: "success",
            responseMessage: "User has been created."
          } as RegisterUserResponse;
        case 409:
          return {
            responseType: "error",
            responseMessage: "User already exists."
          } as RegisterUserResponse;
        default:
          return {
            responseType: "error",
            responseMessage: "An unknown error has occured."
          } as RegisterUserResponse;
      }
    })
}

export const loginUser = (message: LoginUserMessage): Promise<LoggedInUserResponse> => {
  return fetch(`${process.env.REACT_APP_API_URL}/api/auth/login`,
    {
      method: "POST",
      body: JSON.stringify(message),
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then(async (resp) => {
      switch (resp.status) {
        case 200:
          return {
            message: "Logged in successfully",
            responseType: "success",
            accessToken: await resp.text(),
          } as LoggedInUserResponse
        case 401:
          return {
            message: "Invalid information",
            responseType: "error",
            accessToken: "",
          } as LoggedInUserResponse
        case 400:
          return {
            message: "User not found",
            responseType: "error",
            accessToken: "",
          } as LoggedInUserResponse
        default:
          return {
            message: "An unknown error has occured",
            responseType: "error",
            accessToken: "",
          } as LoggedInUserResponse
      }
    })
}

export const getUserData = (): Promise<MyUserResponse> => {
  const authorization = localStorage.getItem("accessToken");

  return fetch(`${process.env.REACT_APP_API_URL}/api/auth/me`, {
    headers: {
      "Authorization": "Bearer " + (authorization || "")
    },
  })
    .then(async (resp) => {
      switch (resp.status) {
        case 200:
          return {
            message: "Success",
            responseType: "success",
            myUser: await resp.json(),
          } as MyUserResponse
        case 401:
        case 403:
        default:
          return {
            message: "An unknown error has occured",
            responseType: "error",
            myUser: undefined,
          } as MyUserResponse
      }
    })
}