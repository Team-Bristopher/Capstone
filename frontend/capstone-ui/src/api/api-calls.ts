import { CreateFundraiserResponseMessage, CreateFundraiserResponseMessageRaw } from "../models/incoming/CreateFundraiserResponseMessage";
import { DonateToFundraiserResponse } from "../models/incoming/DonateToFundraiserResponse";
import { EditFundraiserResponse } from "../models/incoming/EditFundraiserResponse";
import { EditUserMessageResponse } from "../models/incoming/EditUserMessageResponse";
import { Fundraiser } from "../models/incoming/Fundraiser";
import { FundraiserDonationAmountMessage } from "../models/incoming/FundraiserDonationAmountMessage";
import { FundraiserDonationMessage } from "../models/incoming/FundraiserDonationMessage";
import { HealthcheckMessage } from "../models/incoming/HealthcheckResponse";
import { ImageUploadResponseMessage } from "../models/incoming/ImageUploadResponseMessage";
import { LoggedInUserResponse } from "../models/incoming/LoggedInUserResponse";
import { MyUserResponse } from "../models/incoming/MyUserResponse";
import { RecoveryResponse } from "../models/incoming/RecoveryResponse";
import { RecoveryResponseMessage } from "../models/incoming/RecoveryResponseMessage";
import { RegisterUserResponse } from "../models/incoming/RegisterUserResponse";
import { RemoveFundraiserImagesResponse } from "../models/incoming/RemoveFundraiserImagesResponse";
import { ResetPasswordResponse } from "../models/incoming/ResetPasswordResponse";
import { CreateFundraiserMessage } from "../models/outgoing/CreateFundraiserMessage";
import { DonateToFundraiserMessage } from "../models/outgoing/DonateToFundraiserMessage";
import { EditFundraiserMessage } from "../models/outgoing/EditFundraiserMessage";
import { EditUserMessage } from "../models/outgoing/EditUserMessage";
import { LoginUserMessage } from "../models/outgoing/LoginUserMessage";
import { RegisterUserMessage } from "../models/outgoing/RegisterUserMessage";
import { DonationTimeSort } from "../recent-donations/recent_donations";

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

export const getFundraiserAmount = (donationTimeSort: DonationTimeSort, fundraiserID: string): Promise<FundraiserDonationAmountMessage | undefined> => {
  return fetch(`${process.env.REACT_APP_API_URL}/api/fundraiser/donation-amount?fundraiserID=${fundraiserID}&timeSortOption=${donationTimeSort}`)
    .then(async (resp) => {
      switch (resp.status) {
        case 200:
          return await resp.json() as FundraiserDonationAmountMessage;
        default:
          return {
            totalAmount: 0,
            recentDonations: [],
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
            message: "Fundraiser was successfully created",
            fundraiserID: responseJson.fundraiserID,
          } as CreateFundraiserResponseMessage
        default:
          return {
            responseType: "error",
            fundraiserID: "",
            message: "An unknown error has occured",
          } as CreateFundraiserResponseMessage
      }
    })
}

export const getFundraisers = (page: number, fundraiserTitle: string | undefined, fundraiserCategory: number | undefined): Promise<Array<Fundraiser>> => {
  let queryParams: string = `page=${page}`;

  if (fundraiserTitle !== undefined) {
    queryParams += `&fundraiserTitle=${fundraiserTitle}`;
  }

  if (fundraiserCategory !== undefined && !isNaN(fundraiserCategory)) {
    queryParams += `&category=${fundraiserCategory}`;
  }

  return fetch(`${process.env.REACT_APP_API_URL}/api/fundraiser?${queryParams}`)
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

export const donateToFundraiser = (message: DonateToFundraiserMessage): Promise<DonateToFundraiserResponse> => {
  const authorization = localStorage.getItem("accessToken");

  return fetch(`${process.env.REACT_APP_API_URL}/api/fundraiser/donate`, {
    headers: {
      "Authorization": "Bearer " + (authorization || ""),
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(message),
  })
    .then((response) => {
      switch (response.status) {
        case 200:
          return {
            message: "Thank you for your donation!",
            responseType: "success",
          } as DonateToFundraiserResponse
        default:
          return {
            message: "An unknown error has occured",
            responseType: "error",
          } as DonateToFundraiserResponse
      }
    });
}

export const getAllDonations = (fundraiserID: string, page: number, onlyComments: boolean = false): Promise<Array<FundraiserDonationMessage>> => {
  return fetch(`${process.env.REACT_APP_API_URL}/api/fundraiser/donations?fundraiserID=${fundraiserID}&page=${page}&onlyComments=${onlyComments}`)
    .then((resp) => {
      switch (resp.status) {
        case 200:
          return resp.json()
        default:
          return []
      }
    })
}

export const editFundraiser = (fundraiserID: string, message: EditFundraiserMessage): Promise<EditFundraiserResponse> => {
  const authorization = localStorage.getItem("accessToken");

  return fetch(`${process.env.REACT_APP_API_URL}/api/fundraiser/edit?fundraiserID=${fundraiserID}`, {
    headers: {
      "Authorization": "Bearer " + (authorization || ""),
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(message)
  })
    .then((resp) => {
      switch (resp.status) {
        case 200:
          return {
            message: "Edited fundraiser sucessfully",
            responseType: "success",
          } as EditFundraiserResponse
        default:
          return {
            message: "An unknown error has occured",
            responseType: "error",
          } as EditFundraiserResponse
      }
    })
}

export const sendProfilePicture = (imageFile: File): Promise<ImageUploadResponseMessage> => {
  const authorization = localStorage.getItem("accessToken");
  const formData = new FormData();

  formData.append("file", imageFile);

  return fetch(`${process.env.REACT_APP_API_URL}/api/user/image-upload`, {
    headers: {
      "Authorization": "Bearer " + (authorization || ""),
    },
    method: "POST",
    body: formData,
  }).then((resp) => {
    switch (resp.status) {
      case 200:
        return {
          message: "Image(s) successfully uploaded.",
          responseType: "success",
        } as ImageUploadResponseMessage
      default:
        return {
          message: "An unknown error has occured while uploading image(s).",
          responseType: "error",
        } as ImageUploadResponseMessage
    }
  });
}

export const sendFundraiserImage = (fundraiserID: string, formData: FormData): Promise<ImageUploadResponseMessage> => {
  const authorization = localStorage.getItem("accessToken");

  return fetch(`${process.env.REACT_APP_API_URL}/api/fundraiser/image-upload?fundraiserID=${fundraiserID}`, {
    headers: {
      "Authorization": "Bearer " + (authorization || ""),
    },
    method: "POST",
    body: formData,
  }).then((resp) => {
    switch (resp.status) {
      case 200:
        return {
          message: "Image(s) successfully uploaded.",
          responseType: "success",
        } as ImageUploadResponseMessage
      default:
        return {
          message: "An unknown error has occured while uploading image(s).",
          responseType: "error",
        } as ImageUploadResponseMessage
    }
  });
}

export const sendRecoverAccountRequest = (emailAddress: string): Promise<RecoveryResponse> => {
  return fetch(`${process.env.REACT_APP_API_URL}/api/auth/recovery?emailAddress=${emailAddress}`, {
    method: "POST",
  }).then((resp) => {
    switch (resp.status) {
      case 200:
        return {
          message: "An email has been sent for recovery",
          responseType: "success",
        } as RecoveryResponse
      default:
        return {
          message: "An unknown error has occured",
          responseType: "error"
        } as RecoveryResponse
    }
  });
}

export const verifyRecoveryCode = (recoveryCode: string, emailAddress: string): Promise<RecoveryResponseMessage> => {
  return fetch(`${process.env.REACT_APP_API_URL}/api/auth/recovery-confirm?recoveryCode=${recoveryCode}&emailAddress=${emailAddress}`, {
    method: "POST",
  }).then(async (resp) => {
    switch (resp.status) {
      case 200:
        const response: RecoveryResponseMessage = await resp.json();

        return {
          recoveryCodeAuthenticationCode: response.recoveryCodeAuthenticationCode,
          message: "Successfully verified recovery code",
          responseType: "success"
        } as RecoveryResponseMessage
      default:
        return {
          recoveryCodeAuthenticationCode: "",
          message: "An unknown error has occured",
          responseType: "error"
        } as RecoveryResponseMessage
    }
  });
}

export const resetPassword = (authCode: string, emailAddress: string, newPassword: string): Promise<ResetPasswordResponse> => {
  return fetch(`${process.env.REACT_APP_API_URL}/api/auth/password-reset?authCode=${authCode}&emailAddress=${emailAddress}`, {
    method: "POST",
    body: JSON.stringify({
      newPassword: newPassword,
    }),
    headers: {
      "Content-Type": "application/json",
    }
  }).then(async (resp) => {
    switch (resp.status) {
      case 200:
        return {
          responseMessage: "Password has been reset",
          responseType: "success"
        } as ResetPasswordResponse
      default:
        return {
          responseMessage: "An unknown error has occured.",
          responseType: "error"
        } as ResetPasswordResponse
    }
  });
}

export const removeFundraiserImages = (fundraiserID: string): Promise<RemoveFundraiserImagesResponse> => {
  const authorization = localStorage.getItem("accessToken");

  return fetch(`${process.env.REACT_APP_API_URL}/api/fundraiser/remove-images?fundraiserID=${fundraiserID}`, {
    method: "DELETE",
    headers: {
      "Authorization": "Bearer " + (authorization || ""),
    },
  }).then((resp) => {
    switch (resp.status) {
      case 200:
        return {
          responseMessage: "Uploading images...",
          responseType: "success"
        } as RemoveFundraiserImagesResponse
      default:
        return {
          responseMessage: "An unknown error has occured.",
          responseType: "error"
        } as RemoveFundraiserImagesResponse
    }
  })
}