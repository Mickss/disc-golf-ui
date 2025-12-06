import React, {useEffect, useState} from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Box} from "@mui/material";
import {DiscGolfEvent} from "./DiscGolfEvent";

const EditEventDialog = ({ open, event, onSave, onCancel }: {
    open: boolean;
    event: DiscGolfEvent;
    onSave: (event: DiscGolfEvent) => void;
    onCancel: () => void;
}) => {
    const [editedEvent, setEditedEvent] = useState<DiscGolfEvent>({...event});
    const [touched, setTouched] = useState<{ tournamentTitle?: boolean }>({});
    const [links, setLinks] = useState<string[]>([]);

    useEffect(() => {
        setEditedEvent({...event});
    const linkArray = event.externalLink 
            ? event.externalLink.split(';').filter(link => link.trim() !== '')
            : [];
        setLinks(linkArray.length > 0 ? linkArray : ['']);
    }, [event]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditedEvent({
            ...editedEvent,
            [e.target.name]: e.target.value
        });
    };

    const handleLinkChange = (index: number, value: string) => {
        const newLinks = [...links];
        newLinks[index] = value;
        setLinks(newLinks);
        
        setEditedEvent({
            ...editedEvent,
            externalLink: newLinks.filter(link => link.trim() !== '').join(';')
        });
    };

    const addLink = () => {
        setLinks([...links, '']);
    };

    const removeLink = (index: number) => {
        const newLinks = links.filter((_, i) => i !== index);
        setLinks(newLinks.length > 0 ? newLinks : ['']);
        
        setEditedEvent({
            ...editedEvent,
            externalLink: newLinks.filter(link => link.trim() !== '').join(';')
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
        <Dialog open={open} onClose={onCancel} maxWidth="sm" fullWidth>
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
                    InputLabelProps={{ shrink: true }}
                />
                <TextField
                    margin="dense"
                    label="Registration Start"
                    type="date"
                    fullWidth
                    name="registrationStart"
                    value={editedEvent.registrationStart}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                />
                <TextField
                    margin="dense"
                    label="Registration End"
                    type="date"
                    fullWidth
                    name="registrationEnd"
                    value={editedEvent.registrationEnd}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
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
                <Button onClick={onCancel}>Cancel</Button>
                <Button onClick={handleSave} color="primary">
                    Save Changes
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditEventDialog;
