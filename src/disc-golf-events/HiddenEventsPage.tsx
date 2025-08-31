import React, { useEffect, useState, useCallback } from "react";
import { Button, Alert } from "@mui/material";
import config from "../config";
import ReusableTable from "../components/ReusableTable";
import { useLoading } from "../spinner/LoadingProvider";
import { DiscGolfEvent } from "./DiscGolfEvent";

const HiddenEventsPage: React.FC = () => {
  const [allEvents, setAllEvents] = useState<DiscGolfEvent[]>([]);
  const [hiddenEvents, setHiddenEvents] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { loading, setLoading } = useLoading();

  useEffect(() => {
    const saved = localStorage.getItem('hiddenEvents');
    if (saved) {
      setHiddenEvents(JSON.parse(saved));
    }
  }, []);

  const fetchAllEvents = useCallback(() => {
    const url = `${config.discGolfServiceUrl}/public/events`;
    setLoading(true);
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Server error (${response.status})`);
        }
        return response.json();
      })
      .then((data) => setAllEvents(data))
      .catch((error) => {
        console.error("Error while fetching events", error);
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [setLoading]);

  useEffect(() => {
    fetchAllEvents();
  }, [fetchAllEvents]);

  const showEvent = (eventId: string) => {
    const newHiddenEvents = hiddenEvents.filter(id => id !== eventId);
    setHiddenEvents(newHiddenEvents);
    localStorage.setItem('hiddenEvents', JSON.stringify(newHiddenEvents));
  };

  const showAllEvents = () => {
    if (window.confirm("Show all hidden events?")) {
      setHiddenEvents([]);
      localStorage.removeItem('hiddenEvents');
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  if (error) {
    return (
      <Alert severity="error" sx={{ maxWidth: 600, margin: "20px auto" }}>
        Error loading events: {error}
      </Alert>
    );
  }

  const hiddenEventsList = allEvents.filter(event => hiddenEvents.includes(event.id));

  const columns = [
    { header: "Tournament Date", field: "tournamentDate", visual: (event: DiscGolfEvent) => formatDate(event.tournamentDate) },
    { header: "PDGA", field: "pdga" },
    { header: "Tournament Title", field: "tournamentTitle" },
    { header: "Region", field: "region" },
    {
      header: "Registration",
      field: "registration",
      visual: (event: DiscGolfEvent) => (
        <span style={{ color: event.registration === "OPEN" ? "#16a34a" : "#dc2626" }}>
          {event.registration}
        </span>
      )
    },
  ];

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
      {hiddenEventsList.length > 0 ? (
        <>
          <div style={{ marginBottom: "20px", textAlign: "center" }}>
            <Button
              variant="contained"
              color="success"
              onClick={showAllEvents}
            >
              Show All Events ({hiddenEvents.length})
            </Button>
          </div>

          <ReusableTable
            title="Hidden Events"
            columns={columns}
            rows={hiddenEventsList}
            renderActions={(row: DiscGolfEvent) => (
              <Button
                variant="contained"
                color="success"
                size="small"
                onClick={() => showEvent(row.id)}
              >
                Show
              </Button>
            )}
          />
        </>
      ) : (
        <Alert severity="info" sx={{ maxWidth: 600, margin: "20px auto" }}>
          No hidden events.
        </Alert>
      )}
    </div>
  );
};

export default HiddenEventsPage;
