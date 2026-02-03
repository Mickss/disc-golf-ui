import { useState } from "react";
import config from '../config';
import { Button, DialogActions, DialogContent, DialogTitle, TextField, Box } from "@mui/material";
import React from "react";

type AddEventProps = {
    onClose: () => void;
    onEventAdded: () => void;
    setSnackbar: (snackbar: { open: boolean; message: string; severity: "success" | "error" }) => void;
};

const AddEventComponent: React.FC<AddEventProps> = ({ onClose, onEventAdded, setSnackbar }) => {
    const [eventData, setEventData] = useState({
        tournamentDateStart: "",
        tournamentDateEnd: "",
        registrationStart: "",
        registrationEnd: "",
        pdga: "",
        tournamentTitle: "",
        region: "",
        externalLink: "",
        tournamentDirector: "",
        capacity: ""
    });

    const [touched, setTouched] = useState<{ tournamentTitle?: boolean }>({});
    const [links, setLinks] = useState<string[]>(['']);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEventData({ ...eventData, [e.target.name]: e.target.value });
    };

    const handleLinkChange = (index: number, value: string) => {
        const newLinks = [...links];
        newLinks[index] = value;
        setLinks(newLinks);
        
        setEventData({
            ...eventData,
            externalLink: newLinks.filter(link => link.trim() !== '').join(';')
        });
    };

    const addLink = () => {
        setLinks([...links, '']);
    };

    const removeLink = (index: number) => {
        const newLinks = links.filter((_, i) => i !== index);
        setLinks(newLinks.length > 0 ? newLinks : ['']);
        
        setEventData({
            ...eventData,
            externalLink: newLinks.filter(link => link.trim() !== '').join(';')
        });
    };

    const handleSubmit = () => {
        if (!eventData.tournamentTitle) {
            setTouched({ ...touched, tournamentTitle: true });
            return;
        }

        const payload = {
            ...eventData,
            capacity: eventData.capacity ? parseInt(eventData.capacity) : null
        };

        fetch(`${config.discGolfServiceUrl}/events`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(payload),
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
                    label="Tournament Start"
                    type="date"
                    fullWidth
                    name="tournamentDateStart"
                    value={eventData.tournamentDateStart}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                />
                <TextField
                    margin="dense"
                    label="Tournament End"
                    type="date"
                    fullWidth
                    name="tournamentDateEnd"
                    value={eventData.tournamentDateEnd}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
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
                    label="Tournament Director"
                    type="text"
                    fullWidth
                    name="tournamentDirector"
                    value={eventData.tournamentDirector}
                    onChange={handleChange}
                />
                <TextField
                    margin="dense"
                    label="Capacity"
                    type="number"
                    fullWidth
                    name="capacity"
                    value={eventData.capacity}
                    onChange={handleChange}
                />
                {links.map((link, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: -1 }}>
                        <TextField
                            margin="dense"
                            label={`External Link ${index + 1}`}
                            type="text"
                            fullWidth
                            value={link}
                            onChange={(e) => handleLinkChange(index, e.target.value)}
                        />
                        {links.length > 1 && (
                            <Button 
                                size="small" 
                                variant="outlined"
                                color="error" 
                                onClick={() => removeLink(index)}
                                sx={{ ml: 1, minWidth: '40px', padding: '4px 8px' }}
                            >
                                ×
                            </Button>
                        )}
                    </Box>
                ))}
                <Button 
                    size="small" 
                    onClick={addLink}
                    sx={{ mt: 1, textTransform: 'none' }}
                >
                    + another link
                </Button>
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
