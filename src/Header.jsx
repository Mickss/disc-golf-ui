import React, { useContext } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";
import { AuthContext } from "./auth/AuthContext";
import config from "./config";

const Header = () => {
  const { logout, isLoggedIn } = useContext(AuthContext);

  const handleLogout = () => {
    fetch(`${config.authServiceUrl}/public/auth/logout`, {
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
          <Button color="inherit" component={Link} to="/my-events">My Events</Button>
          <Button color="inherit">Contact</Button>
        </Box>
        <Box>
          {isLoggedIn ? (
            <Button color="inherit" onClick={handleLogout}>
              Log out
            </Button>
          ) : (
            <Button color="inherit" component={Link} to="/sign-in">
              Sign in
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
