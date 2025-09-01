import React, { useEffect, useState, useContext, useCallback } from "react";
import { AuthContext } from "../auth/AuthContext";
import { Button, Dialog, DialogContent } from "@mui/material";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import config from "../config";
import ReusableTable from "../components/ReusableTable";
import { useLoading } from "../spinner/LoadingProvider";
import EditEventDialog from "./EditEventDialog.js";
import AddEventComponent from "./AddEventComponent";
import { DiscGolfEvent } from "./DiscGolfEvent";
import { SnackbarState } from "./SnackbarState";
import { Sort } from "./Sort";

const DiscGolfEventsComponent = () => {
  const [discGolfEvents, setDiscGolfEvents] = useState([]);
  const [currentSort, setCurrentSort] = useState<Sort | undefined>();
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState<SnackbarState>({ open: false, message: "", severity: "success" });

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<DiscGolfEvent | null>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [confirmModalConfig, setConfirmModalConfig] = useState<{
    title: string;
    message: string;
    onConfirm: () => void;
    confirmText?: string;
    cancelText?: string;
  } | null>(null);

  const { isLoggedIn, isAdmin } = useContext(AuthContext);
  const { loading, setLoading } = useLoading();

  const createSortHandler = (newSort: Sort) => {
    setCurrentSort({ field: newSort.field, direction: newSort.direction });
  }

  const deleteEvent = async (eventId: string, eventTitle: string) => {
  const confirmed = window.confirm(`Are you sure you want to permanently delete "${eventTitle}"? This action cannot be undone.`);
  if (!confirmed) return;

  try {
    const response = await fetch(`${config.discGolfServiceUrl}/events/${eventId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error('Failed to delete event');
    }

    setSnackbar({
      open: true,
      message: "Event deleted successfully",
      severity: "success"
    });

    fetchEvents();
  } catch (error) {
    console.error('Error deleting event:', error);
    setSnackbar({
      open: true,
      message: "Failed to delete event",
      severity: "error"
    });
  }
};

  const fetchEvents = useCallback(() => {
    let url = `${config.discGolfServiceUrl}/public/events`;
    if (currentSort) {
      url += `?valueToOrderBy=${currentSort.field}`;
      const direction = currentSort.direction.toUpperCase();
      url += `&orderDirection=${direction}`;
    }

    setLoading(true);
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Received invalid response: ${response.status}`);
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
  }, [setLoading, currentSort]);

  useEffect(() => {
    fetchEvents();
  }, [currentSort, fetchEvents]);

  const handleRegister = async (eventId: string) => {
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

  const handleUnregister = async (eventId: string) => {
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

  const formatDate = (dateString: string) => {
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
    { header: "Tournament Date", field: "tournamentDate", visual: (event: DiscGolfEvent) => formatDate(event.tournamentDate) },
    { header: "PDGA", field: "pdga" },
    { header: "Tournament Title", field: "tournamentTitle" },
    { header: "Region", field: "region" },
    {
      header: "Registration", field: "registration", visual: (event: DiscGolfEvent) => <span style={{ color: event.registration === "Open" ? "#16a34a" : "#dc2626" }}>
        {event.registration}
      </span>
    },
    { header: "Vacancies", field: "vacancies" },
  ];

  const handleEdit = (event: DiscGolfEvent) => {
    setEditingEvent(event);
    setEditDialogOpen(true);
  };

  const handleEditSubmit = (event: DiscGolfEvent) => {
    fetch(`${config.discGolfServiceUrl}/events/${event.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(event)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to edit event');
        }
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
          rows={discGolfEvents}
          currentSort={currentSort}
          onSort={createSortHandler}
          renderActions={(row: DiscGolfEvent) => (
            <>
              {isAdmin() && <Button
                variant="outlined"
                color="primary"
                size="small"
                onClick={() => handleEdit(row)}
                sx={{ mr: 1 }}
              >
                Edit
              </Button>}
              {isAdmin() && (
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={() => deleteEvent(row.id, row.tournamentTitle)}
                  sx={{ mr: 1 }}
                >
                  Delete
                </Button>
              )}
              {/*TODO isRegistered is nowhere defined*/}
              {/* {row.isRegistered ? ( */}
              {false ? (
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
              )}
            </>
          )}
        />)
        : (loading === false && <Alert severity="info" sx={{ maxWidth: 600, margin: "20px auto" }}>
          You haven't registered for any events yet.
        </Alert>)
      }
      {isAdmin() && (
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <Button
            variant="contained"
            color="success"
            onClick={() => setAddDialogOpen(true)}
          >
            Add Event
          </Button>
        </div>
      )}

      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogContent>
          <AddEventComponent
            onClose={() => setAddDialogOpen(false)}
            onEventAdded={fetchEvents}
            setSnackbar={setSnackbar}
          />
        </DialogContent>
      </Dialog>

      {editingEvent && <EditEventDialog open={editDialogOpen} event={editingEvent} onSave={handleEditSubmit} onCancel={() => setEditDialogOpen(false)} />}

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
