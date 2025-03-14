import React, { useContext } from "react";
import { Button, TextField, Link, Box, Typography } from "@mui/material";
import Grid from '@mui/material/Grid2';
import { AuthContext } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import config from "../config";

function SignInComponent() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const loginData = {
      username: data.get("email"),
      password: data.get("password"),
    };

    fetch(`${config.authServiceUrl}/public/auth/login`, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(loginData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("HTTP error!"); // TODO handle error gracefully
        }
        return response.text();
      })
      .then(() => {
        console.log("User logged in, setting login to true");
        login();
        navigate("/");
      })
      .catch((err) => console.error("Login faild:", err));
  };

  return (
    <Box
      sx={{
        marginTop: 8,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography component="h1" variant="h5">
        Sign in
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          autoFocus
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Sign In
        </Button>
        <Grid container>
          <Grid size="grow">
            <Link href="#" variant="body2">
              Forgot password?
            </Link>
          </Grid>
          <Grid>
            <Link href="#" variant="body2">
              {"Don't have an account? Sign Up"}
            </Link>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default SignInComponent;
