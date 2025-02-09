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
import TableSortLabel from "@mui/material/TableSortLabel";

const DiscGolfEventsComponent = () => {
  const [discGolfEvents, setDiscGolfEvents] = useState([]);
  const [valueToOrderBy, setValueToOrderBy] = useState("");
  const [orderDirection, setOrderDirection] = useState("");
  const [error, setError] = useState(null);
  const { isLoggedIn } = useContext(AuthContext);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const createSortHandler = (property) => (event) => {
    const isAscending = valueToOrderBy === property && orderDirection === "asc";
    setValueToOrderBy(property);
    setOrderDirection(isAscending ? "desc" : "asc");
  };

  useEffect(() => {
    fetchEvents();
  }, [valueToOrderBy, orderDirection]);

  const fetchEvents = async () => {
    try {
      let url = `http://localhost:24001/api/disc-golf-service/public/events`;
      if (valueToOrderBy) {
        url += `?valueToOrderBy=${valueToOrderBy}`;
        if (orderDirection) {
          url += `&orderDirection=${orderDirection.toUpperCase()}`;
        }
      }

      const response = await fetch(url, {
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
      setDiscGolfEvents(data);
      setError(null);
    } catch (error) {
      console.error("Error fetching events:", error);
      setError(error.message);
    }
  };

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
      const response = await fetch(`http://localhost:24001/api/disc-golf-service/events/${eventId}/register`, {
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
        Disc Golf Events
      </Typography>
      
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="events table">
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={valueToOrderBy === "tournamentDate"}
                  direction={valueToOrderBy === "tournamentDate" ? orderDirection : "asc"}
                  onClick={createSortHandler("tournamentDate")}
                >
                  Tournament Date
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={valueToOrderBy === "pdga"}
                  direction={valueToOrderBy === "pdga" ? orderDirection : "asc"}
                  onClick={createSortHandler("pdga")}
                >
                  PDGA
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={valueToOrderBy === "tournamentTitle"}
                  direction={valueToOrderBy === "tournamentTitle" ? orderDirection : "asc"}
                  onClick={createSortHandler("tournamentTitle")}
                >
                  Tournament Title
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={valueToOrderBy === "region"}
                  direction={valueToOrderBy === "region" ? orderDirection : "asc"}
                  onClick={createSortHandler("region")}
                >
                  Region
                </TableSortLabel>
              </TableCell>
              <TableCell align="left">Registration</TableCell>
              <TableCell align="left">Vacancies</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {discGolfEvents.map((event) => (
              <TableRow
                key={event.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell>{formatDate(event.tournamentDate)}</TableCell>
                <TableCell>{event.pdga}</TableCell>
                <TableCell>{event.tournamentTitle}</TableCell>
                <TableCell>{event.region}</TableCell>
                <TableCell>
                  <span
                    style={{
                      color: event.registration === "OPEN" ? "#16a34a" : "#dc2626",
                    }}
                  >
                    {event.registration}
                  </span>
                </TableCell>
                <TableCell>{event.vacancies}</TableCell>
                <TableCell align="right">
                  {event.isRegistered ? (
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => handleUnregister(event.id)}
                    >
                      Unregister
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() => handleRegister(event.id)}
                      disabled={!isLoggedIn}
                    >
                      Register
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

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
