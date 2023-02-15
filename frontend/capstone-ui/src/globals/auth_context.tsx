import { createContext, useEffect, useRef, useState } from "react";
import { getUserData } from "../api/api-calls";
import { MyUserResponseSuccess } from "../models/incoming/MyUserResponse";

export const AuthContext = createContext<AuthContextState>({});

export interface AuthContextState {
   loggedInUser?: MyUserResponseSuccess | undefined;
}

interface AuthContextProps {
   children: React.ReactNode;
}

export const AuthContextProvider = (props: AuthContextProps) => {
   const authContext = useRef<AuthContextState>({});
   const [, setRefresh] = useState<number>(Date.now());

   const sendGetUserDataRequest = async () => {
      const response = await getUserData();

      if (response.responseType === "success") {
         authContext.current = {
            loggedInUser: response.myUser,
         };
      } else {
         authContext.current = {
            loggedInUser: undefined,
         };
      }

      setRefresh(Date.now());
   }

   useEffect(() => {
      let accessToken = localStorage.getItem("accessToken");

      if (accessToken === null || accessToken === "") {
         return;
      }

      if (authContext.current.loggedInUser === undefined) {
         sendGetUserDataRequest();
      }
   }, []);

   return (
      <AuthContext.Provider value={authContext.current}>
         {props.children}
      </AuthContext.Provider>
   );
}