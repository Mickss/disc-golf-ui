import React from "react";
import { Button, TextField, Box, Typography, Alert, Link } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

import config from "../config";

function ForgotPasswordComponent() {
    const [error, setError] = React.useState<string | null>(null);
    const [success, setSuccess] = React.useState(false);

    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        const data = new FormData(event.currentTarget);
        const email = data.get("email") as string;

        if (!email) {
            setError("Email is required.");
            return;
        }

        fetch(`${config.authServiceUrl}/public/auth/password-reset/request`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        })
            .then((response) => {
                if (!response.ok) throw response.status;
                setSuccess(true);
            })
            .catch(() => {
                setSuccess(true);
            });
    };

    return (
        <Box sx={{ marginTop: 8, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Typography component="h1" variant="h5">
                Forgot Password
            </Typography>

            {success ? (
                <Alert severity="success" sx={{ width: "100%", maxWidth: 400, mt: 2 }}>
                    If this email exists in our system, you will receive a reset link shortly.
                </Alert>
            ) : (
                <>
                    {error && (
                        <Alert severity="error" sx={{ width: "100%", maxWidth: 400, mt: 2 }}>
                            {error}
                        </Alert>
                    )}
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, maxWidth: 400, width: "100%" }}>
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
                        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                            Send Reset Link
                        </Button>
                        <Box sx={{ textAlign: "center" }}>
                            <Link component={RouterLink} to="/sign-in" variant="body2">
                                {"Back to Sign In"}
                            </Link>
                        </Box>
                    </Box>
                </>
            )}
        </Box>
    );
}

export default ForgotPasswordComponent;
