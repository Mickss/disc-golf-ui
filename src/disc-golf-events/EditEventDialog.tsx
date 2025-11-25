import React, {useEffect, useState} from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import {DiscGolfEvent} from "./DiscGolfEvent";

const EditEventDialog = ({ open, event, onSave, onCancel }: {
    open: boolean;
    event: DiscGolfEvent;
    onSave: (event: DiscGolfEvent) => void;
    onCancel: () => void;
}) => {
    const [editedEvent, setEditedEvent] = useState<DiscGolfEvent>({...event});
    const [touched, setTouched] = useState<{ tournamentTitle?: boolean }>({});

    useEffect(() => {
        setEditedEvent({...event});
    }, [event]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditedEvent({
            ...editedEvent,
            [e.target.name]: e.target.value
        });
    };

    const handleSave = () => {
        if (!editedEvent.tournamentTitle) {
            setTouched({ ...touched, tournamentTitle: true });
        return;
        }

        if (editedEvent) {
            onSave(editedEvent);
        }
    };

    return (
        <Dialog open={open} onClose={onCancel}>
            <DialogTitle>Edit Event</DialogTitle>
            <DialogContent>
                <TextField
                    margin="dense"
                    label="Tournament Date"
                    type="date"
                    fullWidth
                    name="tournamentDate"
                    value={editedEvent.tournamentDate}
                    onChange={handleChange}
                />
                <TextField
                    margin="dense"
                    label="PDGA"
                    type="text"
                    fullWidth
                    name="pdga"
                    value={editedEvent.pdga}
                    onChange={handleChange}
                />
                <TextField
                    margin="dense"
                    label="Tournament Title"
                    type="text"
                    required
                    fullWidth
                    name="tournamentTitle"
                    value={editedEvent.tournamentTitle}
                    onChange={handleChange}
                    onBlur={() => setTouched({ ...touched, tournamentTitle: true })}
                    error={touched.tournamentTitle && !editedEvent.tournamentTitle}
                    helperText={touched.tournamentTitle && !editedEvent.tournamentTitle ? "Field is required" : ""}
                />
                <TextField
                    margin="dense"
                    label="Region"
                    type="text"
                    fullWidth
                    name="region"
                    value={editedEvent.region}
                    onChange={handleChange}
                />
                <TextField
                    margin="dense"
                    label="Registration"
                    select
                    fullWidth
                    name="registration"
                    value={editedEvent.registration}
                    onChange={handleChange}
                >
                    <MenuItem value="OPEN">OPEN</MenuItem>
                    <MenuItem value="CLOSED">CLOSED</MenuItem>
                </TextField>
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancel}>Cancel</Button>
                <Button onClick={handleSave} color="primary">
                    Save Changes
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditEventDialog;
