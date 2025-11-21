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

    const CHAR_LIMITS = {
        pdga: 50,
        tournamentTitle: 100,
        region: 50,
        vacancies: 20
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name in CHAR_LIMITS) {
            const limit = CHAR_LIMITS[name as keyof typeof CHAR_LIMITS];
            if (value.length <= limit) {
                setEventData({ ...eventData, [name]: value });
            }
        } else {
            setEventData({ ...eventData, [name]: value });
        }
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
                    multiline
                    maxRows={4}
                    name="pdga"
                    value={eventData.pdga}
                    onChange={handleChange}
                    helperText={`${eventData.pdga.length}/${CHAR_LIMITS.pdga}`}
                    sx={{
                        "& textarea": {
                            wordBreak: "break-all",
                            overflowWrap: "break-word",
                            whiteSpace: "normal",
                        },
                    }}
                />
                <TextField
                    margin="dense"
                    label="Tournament Title"
                    type="text"
                    fullWidth
                    multiline
                    maxRows={4}
                    name="tournamentTitle"
                    value={eventData.tournamentTitle}
                    onChange={handleChange}
                    helperText={`${eventData.tournamentTitle.length}/${CHAR_LIMITS.tournamentTitle}`}
                    sx={{
                        "& textarea": {
                            wordBreak: "break-all",
                            overflowWrap: "break-word",
                            whiteSpace: "normal",
                        },
                    }}
                />
                <TextField
                    margin="dense"
                    label="Region"
                    type="text"
                    fullWidth
                    multiline
                    maxRows={4}
                    name="region"
                    value={eventData.region}
                    onChange={handleChange}
                    helperText={`${eventData.region.length}/${CHAR_LIMITS.region}`}
                    sx={{
                        "& textarea": {
                            wordBreak: "break-all",
                            overflowWrap: "break-word",
                            whiteSpace: "normal",
                        },
                    }}
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
                    multiline
                    maxRows={4}
                    name="vacancies"
                    value={eventData.vacancies}
                    onChange={handleChange}
                    helperText={`${eventData.vacancies.length}/${CHAR_LIMITS.vacancies}`}
                    sx={{
                        "& textarea": {
                            wordBreak: "break-all",
                            overflowWrap: "break-word",
                            whiteSpace: "normal",
                        },
                    }}
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
