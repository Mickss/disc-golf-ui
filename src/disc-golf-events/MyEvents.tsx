import React, { useEffect, useState, useContext, useCallback } from "react";
import { AuthContext } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import ReusableTable from "../components/ReusableTable";
import { useLoading } from "../spinner/LoadingProvider";
import config from "../config";
import { DiscGolfEvent } from "./DiscGolfEvent";
import { TableColumn } from "./TableColumn";
import { RegistrationStatus as RegistrationStatusComponent } from "../components/RegistrationStatus";
import { getRegistrationStatus, RegistrationStatus as StatusEnum } from "./RegistrationUtils";
import { EventLinks } from "../components/EventLinks";
import { formatDate } from "../utils/dateUtils";
import { useLanguage } from "../LanguageContext";

const MyEvents = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [myEvents, setMyEvents] = useState<DiscGolfEvent[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { isLoggedIn } = useContext(AuthContext);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" as "success" | "error" });
  const { loading, setLoading } = useLoading();

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${config.discGolfServiceUrl}/events/my-events`, {
        credentials: 'include'
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setMyEvents(data);
      setError(null);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [setLoading]);

  useEffect(() => {
    if (isLoggedIn) fetchEvents();
  }, [isLoggedIn, fetchEvents]);

  const handleRemoveFavorite = async (eventId: string) => {
    try {
      const response = await fetch(`${config.discGolfServiceUrl}/events/${eventId}/favorite`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to remove from favorites');
      setMyEvents(prev => prev.filter(e => String(e.id) !== String(eventId)));
      setSnackbar({ open: true, message: "Removed from favorites", severity: "success" });
    } catch (error) {
      setSnackbar({ open: true, message: "Failed to remove from favorites", severity: "error" });
    }
  };

  const columns: TableColumn[] = [
    {
      header: t('colStart'),
      field: "tournamentDateStart",
      width: "140px",
      visual: (event: DiscGolfEvent) => formatDate(event.tournamentDateStart)
    },
    {
      header: t('colTitle'),
      field: "tournamentTitle",
      minWidth: "200px",
    },
    {
      header: t('colPdga'),
      field: "pdga",
      width: "80px"
    },
    {
      header: t('colRegistration'),
      field: "registration",
      width: "140px",
      visual: (event: DiscGolfEvent) => <RegistrationStatusComponent event={event} />
    },
    {
      header: t('colRegion'),
      field: "region",
      width: "20%"
    },
    {
      header: t('colRegStart'),
      field: "registrationStart",
      width: "140px",
      visual: (event: DiscGolfEvent) => formatDate(event.registrationStart)
    },
    {
      header: t('colLink'),
      field: "externalLink",
      width: "100px",
      visual: (event: DiscGolfEvent) => <EventLinks event={event} />
    }
  ];

  if (!isLoggedIn) {
    return (
      <Alert severity="info" sx={{ maxWidth: 600, margin: "20px auto" }}>
        {t('loginRequiredFavorites')}
      </Alert>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ maxWidth: 600, margin: "20px auto" }}>
        Error loading favorites: {error}
      </Alert>
    );
  }

  return (
    <>
      {myEvents.length > 0 ? (
        <ReusableTable
          title="My Favorites"
          columns={columns}
          rows={myEvents}
          getRowStyle={(row: DiscGolfEvent) => {
            const status = getRegistrationStatus(row);
            if (status === StatusEnum.OPEN) {
              return { backgroundColor: 'inherit', opacity: 1, '&:hover': { backgroundColor: '#f9fafb' } };
            }
            return { backgroundColor: '#f3f4f6', opacity: 0.6, '&:hover': { backgroundColor: '#e5e7eb' } };
          }}
          renderActions={(row: DiscGolfEvent) => [
            <Box key="action-container" sx={{ display: 'flex', alignItems: 'center' }}>
              <Button
                key="remove"
                variant="text"
                size="small"
                onClick={() => handleRemoveFavorite(String(row.id))}
                sx={{ fontSize: '1.2rem', minWidth: 'auto' }}
              >
                ⭐
              </Button>
              <Button
                key="details"
                variant="outlined"
                color="info"
                size="small"
                onClick={() => navigate(`/events/${row.id}`)}
                sx={{ ml: 1 }}
              >
                {t('detailsBtn')}
              </Button>
            </Box>
          ]}
        />
      ) : (
        loading === false && (
          <Alert severity="info" sx={{ maxWidth: 600, margin: "20px auto" }}>
            {t('noFavorites')}
          </Alert>
        )
      )}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default MyEvents;
