import React, { useContext } from "react";
import { Button, TextField, Link, Box, Typography, Alert } from "@mui/material";
import Grid from '@mui/material/Grid2';
import { AuthContext } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import config from "../config";
import { useLanguage } from "../LanguageContext";

function SignInComponent() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    const data = new FormData(event.currentTarget);
    const loginData = {
      email: data.get("email") as string,
      password: data.get("password") as string,
    };

    if (!loginData.email || !loginData.password) {
        setError(t('authSignInReq'));
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
          throw response.status; 
        }
        return response.text();
      })
      .then(() => {
        console.log("User logged in, setting login to true");
        login();
        navigate("/");
      })
      .catch((errorStatus) => {
        
        if (errorStatus === 401) {
          setError(t('authSignInIncorrect'));
        } else {
          setError(t('authGenError'));
          console.error("Login failed:", errorStatus);
        }
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
        {t('authSignInTitle')}
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
          label={t('email_label')}
          name="email"
          autoComplete="email"
          autoFocus
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label={t('password_label')}
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
          {t('authSignInTitle')}
        </Button>
        <Grid container>
          <Grid size="grow">
            <Link href="/forgot-password" variant="body2">
              {t('authForgotLink')}
            </Link>
          </Grid>
          <Grid>
            <Link href="/sign-up" variant="body2">
              {t('authNoAccountLink')}
            </Link>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default SignInComponent;
