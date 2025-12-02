import { useState } from "react";
import config from '../config';
import { Button, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import React from "react";

type AddEventProps = {
    onClose: () => void;
    onEventAdded: () => void;
    setSnackbar: (snackbar: { open: boolean; message: string; severity: "success" | "error" }) => void;
};

const AddEventComponent: React.FC<AddEventProps> = ({ onClose, onEventAdded, setSnackbar }) => {
    const [eventData, setEventData] = useState({
        tournamentDate: "",
        registrationStart: "",
        registrationEnd: "",
        pdga: "",
        tournamentTitle: "",
        region: "",
        externalLink: ""
    });

    const [touched, setTouched] = useState<{ tournamentTitle?: boolean }>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEventData({ ...eventData, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        if (!eventData.tournamentTitle) {
            setTouched({ ...touched, tournamentTitle: true });
            return;
        }

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
                />
                <TextField
                    margin="dense"
                    label="Registration Start"
                    type="date"
                    fullWidth
                    name="registrationStart"
                    value={eventData.registrationStart}
                    onChange={handleChange}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <TextField
                    margin="dense"
                    label="Registration End"
                    type="date"
                    fullWidth
                    name="registrationEnd"
                    value={eventData.registrationEnd}
                    onChange={handleChange}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <TextField
                    margin="dense"
                    label="Tournament Title"
                    type="text"
                    required
                    fullWidth
                    name="tournamentTitle"
                    value={eventData.tournamentTitle}
                    onChange={handleChange}
                    onBlur={() => setTouched({ ...touched, tournamentTitle: true })}
                    error={touched.tournamentTitle && !eventData.tournamentTitle}
                    helperText={
                        touched.tournamentTitle && !eventData.tournamentTitle
                            ? "Field is required" : ""
                    }
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
                    label="Region"
                    type="text"
                    fullWidth
                    name="region"
                    value={eventData.region}
                    onChange={handleChange}
                />
                <TextField
                    margin="dense"
                    label="External Link"
                    type="text"
                    fullWidth
                    name="externalLink"
                    value={eventData.externalLink}
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
