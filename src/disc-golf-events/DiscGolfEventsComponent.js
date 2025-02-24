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
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import config from "../config";

const DiscGolfEventsComponent = () => {
  const [discGolfEvents, setDiscGolfEvents] = useState([]);
  const [valueToOrderBy, setValueToOrderBy] = useState("");
  const [orderDirection, setOrderDirection] = useState("");
  const [error, setError] = useState(null);
  const { isLoggedIn } = useContext(AuthContext);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [editFormData, setEditFormData] = useState({
    tournamentDate: '',
    pdga: '',
    tournamentTitle: '',
    region: '',
    registration: ''
  });

  const createSortHandler = (property) => (event) => {
    const isAscending = valueToOrderBy === property && orderDirection === "asc";
    setValueToOrderBy(property);
    setOrderDirection(isAscending ? "desc" : "asc");
  };

  useEffect(() => {
    fetchEvents();
  }, [valueToOrderBy, orderDirection]);

  const fetchEvents = () => {
    let url = `${config.discGolfServiceUrl}/public/events`;
    if (valueToOrderBy) {
      url += "?valueToOrderBy=" + valueToOrderBy;
      if (orderDirection) {
        url += "&orderDirection=" + orderDirection.toUpperCase();
      }
    }

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
      });
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

  const handleEdit = (event) => {
    setEditingEvent(event);
    setEditFormData({
      tournamentDate: event.tournamentDate,
      pdga: event.pdga,
      tournamentTitle: event.tournamentTitle,
      region: event.region,
      registration: event.registration
    });
    setEditDialogOpen(true);
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditSubmit = () => {
    fetch(`${config.discGolfServiceUrl}/events/${editingEvent.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(editFormData)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to edit event');
        }
        return response.json();
      })
      .then(() => {
        setSnackbar({
          open: true,
          message: "Successfully edited event",
          severity: "success"
        });
        setEditDialogOpen(false);
        fetchEvents();
      })
      .catch(error => {
        console.error('Error editing event:', error);
        setSnackbar({
          open: true,
          message: "Failed to edit event",
          severity: "error"
        });
      });
  };

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
                <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    onClick={() => handleEdit(event)}
                    sx={{ mr: 1 }}
                  >
                    Edit
                  </Button>
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

      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Edit Event</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Tournament Date"
            type="date"
            fullWidth
            name="tournamentDate"
            value={editFormData.tournamentDate}
            onChange={handleEditFormChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            margin="dense"
            label="PDGA"
            type="text"
            fullWidth
            name="pdga"
            value={editFormData.pdga}
            onChange={handleEditFormChange}
          />
          <TextField
            margin="dense"
            label="Tournament Title"
            type="text"
            fullWidth
            name="tournamentTitle"
            value={editFormData.tournamentTitle}
            onChange={handleEditFormChange}
          />
          <TextField
            margin="dense"
            label="Region"
            type="text"
            fullWidth
            name="region"
            value={editFormData.region}
            onChange={handleEditFormChange}
          />
          <TextField
            margin="dense"
            label="Registration"
            select
            fullWidth
            name="registration"
            value={editFormData.registration}
            onChange={handleEditFormChange}
          >
            <MenuItem value="OPEN">OPEN</MenuItem>
            <MenuItem value="CLOSED">CLOSED</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleEditSubmit} color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

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
