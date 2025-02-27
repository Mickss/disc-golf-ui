import {createContext, useEffect, useState} from "react";

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const checkSession = async () => {
     const response = await fetch('http://localhost:24001/api/current-session', {
        credentials: 'include',
      });

     setIsLoggedIn(response.ok);
  };

  const login = () => {
    setIsLoggedIn(true);
  };

  const logout = () => {
    setIsLoggedIn(false);
  };

  const value = {
    isLoggedIn,
    login,
    logout,
  };

  useEffect(() => {
    checkSession();
  }, [isLoggedIn])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export { AuthContext, AuthProvider };
