import React, {useEffect, useState, useContext, useCallback} from "react";
import { AuthContext } from "../auth/AuthContext";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import config from "../config";
import ReusableTable from "../components/ReusableTable";
import {useLoading} from "../spinner/LoadingProvider";

const DiscGolfEventsComponent = () => {
  const [discGolfEvents, setDiscGolfEvents] = useState([]);
  const [currentSort, setCurrentSort] = useState({});
  const [error, setError] = useState(null);
  const { isLoggedIn } = useContext(AuthContext);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const { loading, setLoading } = useLoading();

  const createSortHandler = async (sortField, sortDirection) => {
    setCurrentSort({field: sortField, direction: sortDirection})
  }

  const fetchEvents = useCallback((valueToOrderBy, orderDirection) => {
    let url = `${config.discGolfServiceUrl}/public/events`;
    if (valueToOrderBy) {
      url += "?valueToOrderBy=" + valueToOrderBy;
      if (orderDirection) {
        url += "&orderDirection=" + orderDirection.toUpperCase();
      }
    }

    setLoading(true);
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Received invalid response", response.status);
        }
        return response.json();
      })
      .then((data) => setDiscGolfEvents(data))
      .catch((error) => {
        console.error("Error while fetching events", error);
        setError(error.message);
      }).finally(() => {
        setLoading(false);
      });
  }, [setLoading]);

  useEffect(() => {
    fetchEvents(currentSort.field, currentSort.direction);
  }, [currentSort, fetchEvents]);

  const handleRegister = async (eventId) => {
    if (!isLoggedIn) {
      setSnackbar({
        open: true,
        message: "Please log in to register for events",
        severity: "warning"
      });
      return;
    }

    try {
      const response = await fetch(`${config.discGolfServiceUrl}/events/${eventId}/register`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({}),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to register for event');
      }

      setSnackbar({
        open: true,
        message: "Successfully registered for event",
        severity: "success"
      });
      
      fetchEvents();
    } catch (error) {
      console.error("Error registering:", error);
      setSnackbar({
        open: true,
        message: "Failed to register for event",
        severity: "error"
      });
    }
  };

  const handleUnregister = async (eventId) => {
    try {
      const response = await fetch(`${config.discGolfServiceUrl}/events/${eventId}/unregister`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to unregister from event');
      }

      setSnackbar({
        open: true,
        message: "Successfully unregistered from event",
        severity: "success"
      });
      
      fetchEvents();
    } catch (error) {
      console.error('Error unregistering:', error);
      setSnackbar({
        open: true,
        message: "Failed to unregister from event",
        severity: "error"
      });
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (error) {
    return (
      <Alert severity="error" sx={{ maxWidth: 600, margin: "20px auto" }}>
        Error loading events: {error}
      </Alert>
    );
  }

  const columns = [
    { header: "Tournament Date", field: "tournamentDate" },
    { header: "PDGA", field: "pdga" },
    { header: "Tournament Title", field: "tournamentTitle" },
    { header: "Region", field: "region" },
    { header: "Registration", field: "registration" },
    { header: "Vacancies", field: "vacancies" },
  ];

  const renderVisual = (myEvents) => {
    return myEvents.map((event) => {
      return {...event,
        tournamentDate: formatDate(event.tournamentDate),
        registration: <span style={{ color: event.registration === "Open" ? "#16a34a" : "#dc2626" }}>
          {event.registration}
        </span>};
    })
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
      {discGolfEvents.length > 0
          ? (<ReusableTable
              title="Disc Golf Events"
              columns={columns}
              rows={renderVisual(discGolfEvents)}
              currentSort={currentSort}
              onSort={createSortHandler}
              renderActions={(row) => (
                  // TODO isRegistered is nowwhere defined
                  row.isRegistered ? (
                      <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          onClick={() => handleUnregister(row.id)}
                      >
                        Unregister
                      </Button>
                  ) : (
                      <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={() => handleRegister(row.id)}
                          disabled={!isLoggedIn}
                      >
                        Register
                      </Button>
                  )
              )}
          />)
          : (loading === false && <Alert severity="info" sx={{maxWidth: 600, margin: "20px auto"}}>
            You haven't registered for any events yet.
          </Alert>)
      }

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default DiscGolfEventsComponent;
