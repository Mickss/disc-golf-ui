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
import ConfirmationModal from "./ConfirmationModal";

export enum RegistrationStatus {
  OPEN = "OPEN",
  CLOSED = "CLOSED",
  PASSED = "PASSED",
}

const DiscGolfEventsComponent = () => {
  const [discGolfEvents, setDiscGolfEvents] = useState([]);
  const [currentSort, setCurrentSort] = useState<Sort>({ 
    field: "tournamentDate", 
    direction: "asc" 
  });
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
    if (newSort.field !== 'registration') {
      setCurrentSort({ field: newSort.field, direction: newSort.direction });
    }
  }

  const deleteEvent = (eventId: string, eventTitle: string) => {
    setConfirmModalConfig({
      title: "Delete Event",
      message: `Are you sure you want to permanently delete "${eventTitle}"? This action cannot be undone.`,
      confirmText: "Delete",
      cancelText: "Cancel",
      onConfirm: async () => {
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
        handleConfirmModalClose();
      }
    });
    setConfirmModalOpen(true);
  };

  const handleConfirmModalClose = () => {
    setConfirmModalOpen(false);
    setConfirmModalConfig(null);
  };

  const fetchEvents = useCallback(() => {
    let url = `${config.discGolfServiceUrl}/public/events`;
      url += `?valueToOrderBy=${currentSort.field}`;
      const direction = currentSort.direction.toUpperCase();
      url += `&orderDirection=${direction}`;

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

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const getRegistrationStatus = (event: DiscGolfEvent): RegistrationStatus => {
    const now = new Date();
    const registrationStart = event.registrationStart ? new Date(event.registrationStart) : null;
    const registrationEnd = event.registrationEnd ? new Date(event.registrationEnd) : null;
    const tournamentDate = event.tournamentDate ? new Date(event.tournamentDate) : null;

      if (tournamentDate && now > tournamentDate) {
        const threeWeeksAfter = new Date(tournamentDate);
        threeWeeksAfter.setDate(threeWeeksAfter.getDate() + 21);
    
        if (now <= threeWeeksAfter) {
          return RegistrationStatus.PASSED;
        }
      }

        if (tournamentDate) {
          const threeWeeksAfter = new Date(tournamentDate);
          threeWeeksAfter.setDate(threeWeeksAfter.getDate() + 21);
    
          if (now > threeWeeksAfter) {
            return RegistrationStatus.CLOSED;
          }
        }

        if (registrationEnd && now > registrationEnd) {
          return RegistrationStatus.CLOSED;
        }

        if (!registrationStart) {
          return RegistrationStatus.CLOSED;
        }

        if (now < registrationStart) {
          return RegistrationStatus.CLOSED;
        }

    return RegistrationStatus.OPEN;
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
  { header: "Registration Start", field: "registrationStart", visual: (event: DiscGolfEvent) => formatDate(event.registrationStart) },
  {
    header: "Registration",
    field: "registration",
    visual: (event: DiscGolfEvent) => {
      const status: RegistrationStatus = getRegistrationStatus(event);
      
      const statusStyles = {
        OPEN: { bg: '#d1fae5', color: '#065f46' },
        CLOSED: { bg: '#f3f4f6', color: '#6b7280' },
        PASSED: { bg: '#e5e7eb', color: '#4b5563' }
      };
      
      const style = statusStyles[status] || statusStyles.CLOSED;
      
      return (
        <span style={{
          padding: '4px 8px',
          fontSize: '12px',
          fontWeight: 600,
          borderRadius: '4px',
          backgroundColor: style.bg,
          color: style.color
        }}>
          {status}
        </span>
      );
    }
  },
  { header: "PDGA", field: "pdga" },
  { header: "Tournament Title", field: "tournamentTitle" },
  { header: "Region", field: "region" },
  { header: "Link", field: "externalLink", visual: (event: DiscGolfEvent) => {
      function goToPage(externalLink?: string) {
        if (externalLink) {
          window.open(externalLink, '_blank');
        }
      }

      return <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={() => goToPage(event.externalLink)}
          sx={{ mr: 1 }}>
        Link
      </Button>
    }
  },
];

  const handleEdit = (event: DiscGolfEvent) => {
    setEditingEvent(event);
    setEditDialogOpen(true);
  };

  const handleExport = async () => {
  try {
    const response = await fetch(`${config.discGolfServiceUrl}/events/export`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`Export failed: ${response.status}`);
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "events.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    setSnackbar({
      open: true,
      message: "Export successful",
      severity: "success",
    });
  } catch (error) {
    console.error("Export error:", error);
    setSnackbar({
      open: true,
      message: "Failed to export events",
      severity: "error",
    });
  }
};

const handleImport = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  setLoading(true);

  try {
    const response = await fetch(`${config.discGolfServiceUrl}/events/import`, {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`Import failed: ${response.status}`);
    }

    setSnackbar({
      open: true,
      message: "Import successful",
      severity: "success",
    });
    fetchEvents();
  } catch (error) {
    console.error("Import error:", error);
    setSnackbar({
      open: true,
      message: "Failed to import events",
      severity: "error",
    });
  } finally {
    setLoading(false);
  }
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

  const openEvents = discGolfEvents.filter(event => 
    getRegistrationStatus(event) === RegistrationStatus.OPEN
  );
  const otherEvents = discGolfEvents.filter(event => 
    getRegistrationStatus(event) !== RegistrationStatus.OPEN
  );

  const sortedDiscGolfEvents = [...openEvents, ...otherEvents];

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
    {isAdmin() && (
      <div style={{ marginBottom: "20px", textAlign: "right" }}>
        <Button
          variant="contained"
          color="primary"
          sx={{ mr: 2 }}
          onClick={handleExport}
        >
          Export Events
        </Button>
        <input
          type="file"
          accept=".xlsx"
          onChange={(e) => {
            if (e.target.files?.length) {
              handleImport(e.target.files[0]);
            }
          }}
          style={{ display: "none" }}
          id="import-input"
        />
        <label htmlFor="import-input">
          <Button
            variant="contained"
            component="span"
            color="secondary"
          >
            Import Events
          </Button>
        </label>
      </div>
    )}
      {discGolfEvents.length > 0
        ? (<ReusableTable
          title="Disc Golf Events"
          columns={columns}
          rows={sortedDiscGolfEvents}
          currentSort={currentSort}
          onSort={createSortHandler}
          getRowStyle={(row: DiscGolfEvent) => {
            const status = getRegistrationStatus(row);
            
            if (status === RegistrationStatus.OPEN) {
              return {
                backgroundColor: 'inherit',
                opacity: 1,
                '&:hover': {
                  backgroundColor: '#f9fafb'
                }
              };
            }
            
            return {
              backgroundColor: '#f3f4f6',
              opacity: 0.6,
              '&:hover': {
                backgroundColor: '#e5e7eb'
              }
            };
          }}

          renderActions={(row: DiscGolfEvent) => {
            return (
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
              </>
            );
          }}
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

      {confirmModalConfig && (
        <ConfirmationModal
          open={confirmModalOpen}
          title={confirmModalConfig.title}
          message={confirmModalConfig.message}
          onConfirm={confirmModalConfig.onConfirm}
          onCancel={handleConfirmModalClose}
          confirmText={confirmModalConfig.confirmText}
          cancelText={confirmModalConfig.cancelText}
          confirmColor="error"
        />
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

export default DiscGolfEventsComponent;
