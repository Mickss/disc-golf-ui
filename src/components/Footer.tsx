import React from "react";
import { Box, Typography, Link, Container } from "@mui/material";
import { useLanguage } from "../LanguageContext";

function Footer() {
    const { language, t } = useLanguage();

    const privacyLink = language === 'pl'
        ? "https://disc-golf.pl/polityka-prywatnosci/"
        : "https://disc-golf.pl/privacy-policy/";

    return (
        <Box
            component="footer"
            sx={{
                py: 0.5,
                px: 2,
                mt: 'auto',
                backgroundColor: (theme) =>
                    theme.palette.mode === 'light'
                        ? theme.palette.grey[200]
                        : theme.palette.grey[800],
            }}
        >
            <Container maxWidth="lg">
                <Typography variant="body2" color="text.secondary" align="center">
                    {'© '} {new Date().getFullYear()} Disc-Golf.pl | {' '}
                    <Link
                        href={privacyLink}
                        target="_blank"
                        rel="noopener"
                        color="inherit"
                    >
                        {t("privacy_policy_footer")}
                    </Link>
                </Typography>
            </Container>
        </Box>
    );
}

export default Footer;
