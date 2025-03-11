import React, {createContext, useEffect, useState} from "react";
import config from "../config";

const AuthContext = createContext({
  isLoggedIn: false,
  isAdmin: () => false,
  login: () => {},
  logout: () => {},
});

import { ReactNode } from "react";

function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userSession, setUserSession] = useState<any>({});

  const checkSession = async () => {
    const currentSessionResponse = await fetch(`${config.apiUrl}/current-session`, {
      credentials: 'include',
    });

    const responseString = await currentSessionResponse.text();
    setIsLoggedIn(currentSessionResponse.ok);
    setUserSession(currentSessionResponse.ok ? JSON.parse(responseString) : null);
  };

  const login = () => {
    setIsLoggedIn(true);
  };

  const logout = () => {
    setIsLoggedIn(false);
  };

  const isAdmin = () => {
    return userSession && userSession.role === "ADMIN";
  }

  const value = {
    isLoggedIn,
    isAdmin,
    login,
    logout,
  };

  useEffect(() => {
    checkSession();
  }, [isLoggedIn])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export { AuthContext, AuthProvider };
