import React from "react";
import { Button, TextField, Box, Typography, Alert } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import config from "../config";

function ResetPasswordComponent() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    const data = new FormData(event.currentTarget);
    const newPassword = data.get("newPassword") as string;
    const confirmPassword = data.get("confirmPassword") as string;

    if (!newPassword || !confirmPassword) {
      setError("All fields are required.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!token) {
      setError("Invalid reset link.");
      return;
    }

    fetch(`${config.authServiceUrl}/public/auth/password-reset/confirm`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, newPassword }),
    })
      .then((response) => {
        if (!response.ok) throw response.status;
        setSuccess(true);
        setTimeout(() => navigate("/sign-in"), 3000);
      })
      .catch((errorStatus) => {
        if (errorStatus === 400) {
          setError("Reset link is invalid or has already been used.");
        } else {
          setError("An unexpected error occurred. Please try again later.");
        }
      });
  };

  return (
    <Box sx={{ marginTop: 8, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Typography component="h1" variant="h5">
        Reset Password
      </Typography>

      {success ? (
        <Alert severity="success" sx={{ width: "100%", maxWidth: 400, mt: 2 }}>
          Password changed successfully! Redirecting to login...
        </Alert>
      ) : (
        <>
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
              name="newPassword"
              label="New Password"
              type="password"
              id="newPassword"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm New Password"
              type="password"
              id="confirmPassword"
            />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              Set New Password
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
}

export default ResetPasswordComponent;
