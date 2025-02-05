import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../auth/AuthContext";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";

const MyEvents = () => {
  const [myEvents, setMyEvents] = useState([]);
  const [error, setError] = useState(null);
  const { isLoggedIn } = useContext(AuthContext);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    if (isLoggedIn) {
      fetchEvents();
    }
  }, [isLoggedIn]);

  const fetchEvents = async () => {
    try {
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
    }
  };

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

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
      <Typography
        variant="h4"
        component="h1"
        sx={{ textAlign: "center", mb: 4 }}
      >
        My Registered Events
      </Typography>
      
      {myEvents.length > 0 ? (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="my events table">
            <TableHead>
              <TableRow>
                <TableCell>Tournament Title</TableCell>
                <TableCell align="left">PDGA</TableCell>
                <TableCell align="left">Date</TableCell>
                <TableCell align="left">Region</TableCell>
                <TableCell align="left">Registration</TableCell>
                <TableCell align="left">Vacancies</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {myEvents.map((event) => (
                <TableRow
                  key={event.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {event.tournamentTitle}
                  </TableCell>
                  <TableCell align="left">{event.pdga}</TableCell>
                  <TableCell align="left">
                    {formatDate(event.tournamentDate)}
                  </TableCell>
                  <TableCell align="left">{event.region}</TableCell>
                  <TableCell align="left">
                    <span
                      style={{
                        color:
                          event.registration === "OPEN" ? "#16a34a" : "#dc2626",
                      }}
                    >
                      {event.registration}
                    </span>
                  </TableCell>
                  <TableCell align="left">{event.vacancies}</TableCell>
                  <TableCell align="right">
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => handleUnregister(event.id)}
                    >
                      Unregister
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Alert severity="info" sx={{ maxWidth: 600, margin: "20px auto" }}>
          You haven't registered for any events yet.
        </Alert>
      )}
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

export default MyEvents;
