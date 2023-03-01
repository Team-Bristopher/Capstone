import { CreateFundraiserResponseMessage, CreateFundraiserResponseMessageRaw } from "../models/incoming/CreateFundraiserResponseMessage";
import { EditUserMessageResponse } from "../models/incoming/EditUserMessageResponse";
import { Fundraiser } from "../models/incoming/Fundraiser";
import { FundraiserDonationAmountMessage } from "../models/incoming/FundraiserDonationAmountMessage";
import { HealthcheckMessage } from "../models/incoming/HealthcheckResponse";
import { LoggedInUserResponse } from "../models/incoming/LoggedInUserResponse";
import { MyUserResponse } from "../models/incoming/MyUserResponse";
import { RegisterUserResponse } from "../models/incoming/RegisterUserResponse";
import { CreateFundraiserMessage } from "../models/outgoing/CreateFundraiserMessage";
import { EditUserMessage } from "../models/outgoing/EditUserMessage";
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

export const editUserData = (message: EditUserMessage): Promise<EditUserMessageResponse> => {
  const authorization = localStorage.getItem("accessToken");

  return fetch(`${process.env.REACT_APP_API_URL}/api/user/edit`, {
    headers: {
      "Authorization": "Bearer " + (authorization || ""),
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(message),
  })
    .then((resp) => {
      switch (resp.status) {
        case 200:
          return {
            responseType: "success",
            message: "Edited profile sucessfully",
          } as EditUserMessageResponse
        default:
          return {
            responseType: "error",
            message: "An unknown error has occured",
          } as EditUserMessageResponse
      }
    });
}

export const getFundraiserAmount = (fundraiserID: string): Promise<FundraiserDonationAmountMessage | undefined> => {
  return fetch(`${process.env.REACT_APP_API_URL}/api/fundraiser/donation-amount?fundraiserID=${fundraiserID}`)
    .then(async (resp) => {
      switch (resp.status) {
        case 200:
          return await resp.json() as FundraiserDonationAmountMessage;
        default:
          return {
            amount: 0,
          } as FundraiserDonationAmountMessage
      }
    })
}

export const createFundraiser = (createFundraserMessage: CreateFundraiserMessage): Promise<CreateFundraiserResponseMessage> => {
  const authorization = localStorage.getItem("accessToken");

  return fetch(`${process.env.REACT_APP_API_URL}/api/fundraiser/create`, {
    headers: {
      "Authorization": "Bearer " + (authorization || ""),
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(createFundraserMessage),
  })
    .then(async (resp) => {
      switch (resp.status) {
        case 200:
          const responseJson: CreateFundraiserResponseMessageRaw = await resp.json();

          return {
            responseType: "success",
            fundraiserID: responseJson.fundraiserID,
          } as CreateFundraiserResponseMessage
        default:
          return {
            responseType: "error",
            fundraiserID: "",
          } as CreateFundraiserResponseMessage
      }
    })
}

export const getFundraisers = (page: number): Promise<Array<Fundraiser>> => {
  return fetch(`${process.env.REACT_APP_API_URL}/api/fundraiser/`)
    .then(async (resp) => {
      switch (resp.status) {
        case 200:
          const response = await resp.json();

          return response;
        default:
          return [];
      }
    })
}

export const getFundraiserDetail = (fundraiserID: string): Promise<Fundraiser | undefined> => {
  return fetch(`${process.env.REACT_APP_API_URL}/api/fundraiser/detail?fundraiserID=${fundraiserID}`)
    .then(async (resp) => {
      switch (resp.status) {
        case 200:
          return await resp.json();
        default:
          return undefined;
      }
    })
}

export const viewFundraiser = (fundraiserID: string) => {
  const authorization = localStorage.getItem("accessToken");

  return fetch(`${process.env.REACT_APP_API_URL}/api/fundraiser/view?fundraiserID=${fundraiserID}`, {
    headers: {
      "Authorization": "Bearer " + (authorization || ""),
    },
    method: "POST",
  });
}