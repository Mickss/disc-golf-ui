import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { Button, TextField, Box, Typography, Alert, Link, FormControlLabel, Checkbox } from "@mui/material";
import Grid from "@mui/material/Grid2";
import config from "../config";
import { useLanguage } from "../LanguageContext";

function SignUpComponent() {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [error, setError] = useState<string | null>(null);
  const [accepted, setAccepted] = React.useState(false);

  const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get("email");
    const password = data.get("password");
    const repeatPassword = data.get("repeatPassword");

    if (!accepted) {
      setError(t("error_accept_policy")); 
      return;
    }

    if (password !== repeatPassword) {
      setError("Passwords do not match");
      return;
    }

    const registerData = {
      email: email,
      password: password,
    };

    fetch(`${config.authServiceUrl}/public/auth/register`, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(registerData),
    })
      .then((response) => {
        if (!response.ok) {
          return response.text().then((text) => {
            throw new Error(text || "HTTP error!");
          });
        }
        return response.text();
      })
      .then(() => {
        navigate("/sign-in");
      })
      .catch((err) => {
        console.error("Register failed:", err);
        setError("Registration failed: " + err.message);
      });
  };

  return (
    <Box sx={{ marginTop: 8, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Typography component="h1" variant="h5">
        {t("sign_up_title")}
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, maxWidth: 400 }}>
        {error && <Alert severity="error">{error}</Alert>}
        <TextField
          margin="normal"
          required
          fullWidth
          label="Email Address"
          name="email"
          autoComplete="email"
          autoFocus
        />
        <TextField
          margin="normal"
          required
          fullWidth
          label="Password"
          type={"password"}
          name="password"
          autoComplete="new-password"
        />
        <TextField
          margin="normal"
          required
          fullWidth
          label="Repeat Password"
          type={"password"}
          name="repeatPassword"
        />
          <FormControlLabel
            control={
              <Checkbox 
                checked={accepted} 
                onChange={(e) => setAccepted(e.target.checked)} 
                color="primary" 
              />
            }
            label={
              <Typography variant="body2">
                {t("accept_policy_prefix")}{" "}
                <Link 
                  href={language === 'pl' ? "https://disc-golf.pl/polityka-prywatnosci/" : "https://disc-golf.pl/privacy-policy/"} 
                  target="_blank"
                >
                  {t("privacy_policy_link")}
                </Link>
              </Typography>
            }
        />
          <Button 
          type="submit" 
          fullWidth 
          variant="contained" 
          disabled={!accepted} 
          sx={{ mt: 3, mb: 2 }}
        >
          {t("sign_up_button")}
        </Button>
        <Grid container justifyContent="flex-end">
          <Grid>
            <Link href="/sign-in" variant="body2">
            {"Already have an account? Sign in"}
            </Link>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default SignUpComponent;
