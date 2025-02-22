import React, {useEffect, useState, useContext, useCallback} from "react";
import { AuthContext } from "../auth/AuthContext";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import ReusableTable from "../components/ReusableTable";
import {useLoading} from "../spinner/LoadingProvider";

const MyEvents = () => {
  const [myEvents, setMyEvents] = useState([]);
  const [error, setError] = useState(null);
  const { isLoggedIn } = useContext(AuthContext);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const { loading, setLoading } = useLoading();

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:24001/api/disc-golf-service/events/my-events", {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setMyEvents(data);
      setError(null);
    } catch (error) {
      console.error("Error fetching my events:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [setLoading]);

  useEffect(() => {
    if (isLoggedIn) {
      fetchEvents();
    }
  }, [isLoggedIn, fetchEvents]);

  const handleUnregister = async (eventId) => {
    try {
      const response = await fetch(`http://localhost:24001/api/disc-golf-service/events/${eventId}/unregister`, {
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
      
      fetchEvents(); // TODO AI says it shouldn't be manually refreshed, row can be just removed from state variable
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

  const columns = [
    { header: "Tournament Title", field: "tournamentTitle" },
    { header: "PDGA", field: "pdga" },
    { header: "Date", field: "tournamentDate" },
    { header: "Region", field: "region" },
    { header: "Registration", field: "registration" },
    { header: "Vacancies", field: "vacancies" },
  ];

  if (!isLoggedIn) {
    return (
      <Alert severity="info" sx={{ maxWidth: 600, margin: "20px auto" }}>
        You need to be logged in to view your events.
      </Alert>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ maxWidth: 600, margin: "20px auto" }}>
        Error loading events: {error}
      </Alert>
    );
  }

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
      <>
        {myEvents.length > 0 ? (<ReusableTable
                title="My Registered Events"
                columns={columns}
                rows={renderVisual(myEvents)}
                renderActions={(row) => (
                    <Button variant="outlined" color="error" size="small" onClick={() => handleUnregister(row.id)}>
                      Unregister
                    </Button>
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
      </>
  );
};

export default MyEvents;