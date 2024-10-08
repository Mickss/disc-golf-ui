import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Box sx={ {flexGrow: 1, display: 'flex', gap: 2} }>
          <Button color="inherit" component={ Link } to="/">Home</Button>
          <Button color="inherit">My tournaments</Button>
          <Button color="inherit">Contact</Button>
        </Box>

        <Button color="inherit" component={ Link } to="/sign-in">Sign in</Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
