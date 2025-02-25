import React, {useEffect, useState, useContext, useCallback} from "react";
import { AuthContext } from "../auth/AuthContext";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import config from "../config";
import ReusableTable from "../components/ReusableTable";
import {useLoading} from "../spinner/LoadingProvider";

const DiscGolfEventsComponent = () => {
  const [discGolfEvents, setDiscGolfEvents] = useState([]);
  const [currentSort, setCurrentSort] = useState({});
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
      {discGolfEvents.length > 0
          ? (<ReusableTable
              title="Disc Golf Events"
              columns={columns}
              rows={renderVisual(discGolfEvents)}
              currentSort={currentSort}
              onSort={createSortHandler}
              renderActions={(row) => (
                  <>
                      <Button
                          variant="outlined"
                          color="primary"
                          size="small"
                          onClick={() => handleEdit(event)}
                          sx={{ mr: 1 }}
                      >
                          Edit
                      </Button>
                  // TODO isRegistered is nowhere defined
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
                  </>
              )}
          />)
          : (loading === false && <Alert severity="info" sx={{maxWidth: 600, margin: "20px auto"}}>
            You haven't registered for any events yet.
          </Alert>)
      }

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
