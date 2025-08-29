import { useState } from "react";
import config from '../config';
import { Button, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import React from "react";

type AddEventProps = {
    onClose: () => void;
    onEventAdded: () => void;
    setSnackbar: (snackbar: { open: boolean; message: string; severity: "success" | "error" }) => void;
};

const AddEventComponent: React.FC<AddEventProps> = ({ onClose, onEventAdded, setSnackbar }) => {
    const [eventData, setEventData] = useState({
        tournamentDate: "",
        pdga: "",
        tournamentTitle: "",
        region: "",
        registration: "OPEN",
        vacancies: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEventData({ ...eventData, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        fetch(`${config.discGolfServiceUrl}/events`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(eventData),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to create event");
                }
                setSnackbar({
                    open: true,
                    message: "Event created successfully!",
                    severity: "success",
                });
                onEventAdded();
                onClose();
            })
            .catch((error) => {
                console.error("Error creating event:", error);
                setSnackbar({
                    open: true,
                    message: "Failed to create event",
                    severity: "error",
                });
            });
    };

    return (
        <>
            <DialogTitle>Add New Event</DialogTitle>
            <DialogContent>
                <TextField
                    margin="dense"
                    label="Tournament Date"
                    type="date"
                    fullWidth
                    name="tournamentDate"
                    value={eventData.tournamentDate}
                    onChange={handleChange}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    inputProps={{
                        placeholder: ""
                    }}
                />
                <TextField
                    margin="dense"
                    label="PDGA"
                    type="text"
                    fullWidth
                    name="pdga"
                    value={eventData.pdga}
                    onChange={handleChange}
                />
                <TextField
                    margin="dense"
                    label="Tournament Title"
                    type="text"
                    fullWidth
                    name="tournamentTitle"
                    value={eventData.tournamentTitle}
                    onChange={handleChange}
                />
                <TextField
                    margin="dense"
                    label="Region"
                    type="text"
                    fullWidth
                    name="region"
                    value={eventData.region}
                    onChange={handleChange}
                />
                <TextField
                    margin="dense"
                    label="Registration"
                    select
                    fullWidth
                    name="registration"
                    value={eventData.registration}
                    onChange={handleChange}
                >
                    <MenuItem value="OPEN">OPEN</MenuItem>
                    <MenuItem value="CLOSED">CLOSED</MenuItem>
                </TextField>
                <TextField
                    margin="dense"
                    label="Vacancies"
                    type="text"
                    fullWidth
                    name="vacancies"
                    value={eventData.vacancies}
                    onChange={handleChange}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit} color="primary" variant="contained">
                    Create Event
                </Button>
            </DialogActions>
        </>
    );
};

export default AddEventComponent;
