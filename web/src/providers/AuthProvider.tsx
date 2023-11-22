"use client";

import { Role } from "@/types";
import { post } from "@/utils/helper";
import Cookies from "js-cookie";
import React, { useContext, useEffect, useState } from "react";

interface ContextInterface {
  signIn(userName: string, password: string): Promise<string>;
  signOut(): void;
  signUp(userName: string, password: string, role: Role): Promise<string>;
  isLoggedIn: boolean;
}

const AuthContext = React.createContext<ContextInterface>(
  {} as ContextInterface
);

const AuthProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const [isLoggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    if (Cookies.get("token")) {
      setLoggedIn(true);
    }
  }, []);

  async function signIn(userName: string, password: string): Promise<string> {
    const { status, error, data } = await post("/user/login", {
      userName,
      password,
    });

    if (status === 201) {
      Cookies.set("token", data.accessToken);
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }

    return error;
  }

  function signOut() {
    Cookies.remove("token");
    setLoggedIn(false);
  }

  async function signUp(
    userName: string,
    password: string,
    role: Role
  ): Promise<string> {
    const { status, error } = await post("/user", {
      userName,
      password,
      role,
    });

    return error;
  }

  const values = {
    isLoggedIn,
    signIn,
    signOut,
    signUp,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (context == null) {
    throw new Error("useAuth() called outside of a Provider?");
  }
  return context;
};

export { AuthProvider, useAuth };
