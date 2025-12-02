import React, { useContext } from "react";
import { Button, TextField, Link, Box, Typography, Alert } from "@mui/material";
import Grid from '@mui/material/Grid2';
import { AuthContext } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import config from "../config";

function SignInComponent() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    const data = new FormData(event.currentTarget);
    const loginData = {
      email: data.get("email"),
      password: data.get("password"),
    };

    if (!loginData.email || !loginData.password) {
        setError("Email and password fields are required.");
        return;
    }

    fetch(`${config.authServiceUrl}/public/auth/login`, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(loginData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Bad credentials");
        }
        return response.text();
      })
      .then(() => {
        console.log("User logged in, setting login to true");
        login();
        navigate("/");
      })
      .catch(() => {
        setError("Incorrect email or password.");
      });
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
      {error && (
        <Alert severity="error" sx={{ width: "100%", maxWidth: 400, mt: 2 }}>
          {error}
        </Alert>
      )}
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, maxWidth: 400 }}>
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
            {/* <Link href="#" variant="body2">
              {"Forgot password?"}
            </Link> */}
          </Grid>
          <Grid>
            <Link href="/sign-up" variant="body2">
              {"Don't have an account? Sign Up"}
            </Link>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default SignInComponent;
