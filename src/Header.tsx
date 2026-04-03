import React, { useContext } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";
import { AuthContext } from "./auth/AuthContext";
import config from "./config";
import { useLanguage } from "./LanguageContext";

const Header: React.FC = () => {
  const { logout, isLoggedIn, isAdmin } = useContext(AuthContext);
  const { t, language, setLanguage } = useLanguage();

  const handleLogout = () => {
    fetch(`${config.authServiceUrl}/public/auth/logout`, {
      method: "post",
      credentials: "include",
      body: JSON.stringify({}),
    })
      .then(() => {
        console.log("User logged out, setting isLoggedIn to false");
        logout();
      })
      .catch((err) => console.error("Logout failed", err));
  };

  return (
    <AppBar position="static">
      <Toolbar sx={{
        flexDirection: { xs: 'column', sm: 'row' },
        py: { xs: 1, sm: 0 },
        gap: { xs: 1, sm: 0 }
      }}>
        <Box sx={{ flexGrow: 1, display: "flex", gap: { xs: 0.5, sm: 2 }, }}>
          <Button color="inherit" component={Link} to="/">{t('navHome')}</Button>
          {isAdmin() && (
            <Button color="inherit" component={Link} to="/users">{t('navUsers')}</Button>
          )}
          <Button color="inherit" component={Link} to="/contact">{t('navContact')}</Button>
        </Box>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Box sx={{ display: 'flex', gap: 1, mr: 2, alignItems: 'center' }}>
            <Button
              color="inherit"
              sx={{
                minWidth: 'auto',
                p: 0.5,
                opacity: language === 'pl' ? 1 : 0.4,
                transition: 'opacity 0.2s',
                '&:hover': { opacity: 0.8 }
              }}
              onClick={() => setLanguage('pl')}
              title="Polski"
            >
              <img
                src="https://flagcdn.com/pl.svg"
                alt="PL"
                style={{ width: '24px', height: '18px', borderRadius: '4px', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.2)' }}
              />
            </Button>
            <Button
              color="inherit"
              sx={{
                minWidth: 'auto',
                p: 0.5,
                opacity: language === 'en' ? 1 : 0.4,
                transition: 'opacity 0.2s',
                '&:hover': { opacity: 0.8 }
              }}
              onClick={() => setLanguage('en')}
              title="English"
            >
              <img
                src="https://flagcdn.com/gb.svg"
                alt="ENG"
                style={{ width: '24px', height: '18px', borderRadius: '4px', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.2)' }}
              />
            </Button>
          </Box>
          {isLoggedIn && (
            <Button color="inherit" onClick={handleLogout}>
              {t('navLogout')}
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
