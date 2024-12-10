import React, { useContext } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";
import { AuthContext } from "./auth/AuthContext";

const Header = () => {
  const { logout, isLoggedIn } = useContext(AuthContext);

  const handleLogout = () => {
    fetch("http://localhost:24001/api/axion-auth-service/public/auth/logout", {
      method: "post",
      credentials: "include",
      body: {},
    })
      .then(() => {
        console.log("User logged out, setting isLoggedIn to false");
        logout();
      })
      .catch((err) => console.error("Logout failed", err));
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Box sx={{ flexGrow: 1, display: "flex", gap: 2 }}>
          <Button color="inherit" component={Link} to="/">
            Home
          </Button>
          <Button color="inherit">My tournaments</Button>
          <Button color="inherit">Contact</Button>
        </Box>

        {!isLoggedIn && (
          <Button color="inherit" component={Link} to="/sign-in">
            Sign in
          </Button>
        )}
        {isLoggedIn && (
          <Button variant="inherit" color="inherit" onClick={handleLogout}>
            Log Out
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
