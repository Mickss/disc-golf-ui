import React, { useState, useRef, useEffect } from 'react';
import {
    Box, Button, TextField, Typography, Paper, Divider,
    Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions
} from '@mui/material';
import { useLanguage } from '../LanguageContext';

interface ReminderEditorProps {
    initialSubject: string;
    initialTemplate: string;
    initialReminderDate: string | null | undefined;
    onSave: (subject: string, template: string, reminderDate: string | null) => void;
}

const EventReminderEditor = ({ initialSubject, initialTemplate, initialReminderDate, onSave }: ReminderEditorProps) => {
    const { t } = useLanguage();

    const formatDateForInput = (dateString?: string | null) => {
        if (!dateString) return '';
        try {
            const d = new Date(dateString);
            d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
            return d.toISOString().slice(0, 16);
        } catch {
            return '';
        }
    };

    const [subject, setSubject] = useState(initialSubject || '');
    const [reminderDate, setReminderDate] = useState(formatDateForInput(initialReminderDate));
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [clearConfirmOpen, setClearConfirmOpen] = useState(false);
    const [activeStyles, setActiveStyles] = useState({
        bold: false,
        italic: false,
        underline: false
    });

    const editorRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (editorRef.current && initialTemplate) {
            editorRef.current.innerHTML = initialTemplate;
        }
    }, [initialTemplate]);

    const checkActiveStyles = () => {
        setActiveStyles({
            bold: document.queryCommandState('bold'),
            italic: document.queryCommandState('italic'),
            underline: document.queryCommandState('underline')
        });
    };

    const execCommand = (command: string, value: string | undefined = undefined) => {
        editorRef.current?.focus();
        document.execCommand(command, false, value);
        checkActiveStyles();
    };

    const handleLoadClick = () => {
        if (editorRef.current && editorRef.current.innerHTML.trim() !== "") {
            setConfirmOpen(true);
        } else {
            applyTemplate();
        }
    };

    const applyTemplate = () => {
        if (editorRef.current) {
            editorRef.current.innerHTML = t('defaultTemplateHtml');
            if (!subject) setSubject(t('defaultSubject'));
            setConfirmOpen(false);
        }
    };

    const handleSave = () => {
        const htmlContent = editorRef.current?.innerHTML || '';
        const formattedDateToSave = reminderDate ? new Date(reminderDate).toISOString() : null;
        onSave(subject, htmlContent, formattedDateToSave);
    };

    const executeClear = () => {
        setSubject('');
        setReminderDate('');
        if (editorRef.current) {
            editorRef.current.innerHTML = '';
        }
        onSave('', '', null);
        setClearConfirmOpen(false);
    };

    return (
        <Paper elevation={2} sx={{ p: 2, mt: 2, border: '1px solid #e0e0e0' }}>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
                {t('reminderConfigTitle')}
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 2 }}>
                <TextField
                    fullWidth
                    label={t('emailSubjectLabel')}
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder={t('emailSubjectPlaceholder')}
                    size="small"
                />
                <TextField
                    type="datetime-local"
                    label={t('reminderDateLabel')}
                    value={reminderDate}
                    onChange={(e) => setReminderDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    size="small"
                    sx={{ minWidth: { sm: '220px' } }}
                />
            </Box>

            <Box sx={{ border: '1px solid #ccc', borderRadius: '4px', overflow: 'hidden' }}>
                <Box sx={{
                    display: 'flex',
                    gap: 1,
                    p: 1,
                    backgroundColor: '#f5f5f5',
                    borderBottom: '1px solid #ccc',
                    alignItems: 'center',
                    flexWrap: 'wrap'
                }}>

                    <Button
                        size="small"
                        variant="text"
                        onClick={() => execCommand('bold')}
                        sx={{
                            fontWeight: 'bold',
                            minWidth: '30px',
                            color: activeStyles.bold ? '#1976d2' : '#333',
                            backgroundColor: activeStyles.bold ? '#e3f2fd' : 'transparent'
                        }}
                    >
                        B
                    </Button>
                    <Button
                        size="small"
                        variant="text"
                        onClick={() => execCommand('italic')}
                        sx={{
                            fontStyle: 'italic',
                            minWidth: '30px',
                            color: activeStyles.italic ? '#1976d2' : '#333',
                            backgroundColor: activeStyles.italic ? '#e3f2fd' : 'transparent'
                        }}
                    >
                        I
                    </Button>
                    <Button
                        size="small"
                        variant="text"
                        onClick={() => execCommand('underline')}
                        sx={{
                            textDecoration: 'underline',
                            minWidth: '30px',
                            color: activeStyles.underline ? '#1925d2' : '#333',
                            backgroundColor: activeStyles.underline ? '#e3f2fd' : 'transparent'
                        }}
                    >
                        U
                    </Button>

                    <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
                    <select
                        onChange={(e) => execCommand('fontSize', e.target.value)}
                        defaultValue="3"
                        style={{ padding: '4px', borderRadius: '4px', border: '1px solid #ccc', cursor: 'pointer' }}
                        title="Font Size"
                    >
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                    </select>

                    <select
                        onChange={(e) => execCommand('fontName', e.target.value)}
                        defaultValue="Arial"
                        style={{ padding: '4px', borderRadius: '4px', border: '1px solid #ccc', cursor: 'pointer', marginLeft: '4px' }}
                        title="Font Family"
                    >
                        <option value="Arial">Arial</option>
                        <option value="Courier New">Courier</option>
                        <option value="Georgia">Georgia</option>
                        <option value="Times New Roman">Times</option>
                        <option value="Verdana">Verdana</option>
                    </select>

                    <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
                    <Typography variant="caption" sx={{ color: '#666' }}></Typography>
                    <input
                        type="color"
                        onChange={(e) => execCommand('foreColor', e.target.value)}
                        style={{ width: '25px', height: '25px', padding: '0', border: 'none', cursor: 'pointer', backgroundColor: 'transparent' }}
                        title="Text Color"
                    />

                    <Button
                        size="small"
                        variant="contained"
                        color="secondary"
                        onClick={handleLoadClick}
                        sx={{ fontSize: '0.75rem', textTransform: 'none', ml: 'auto' }}
                    >
                        {t('loadTemplateBtn')}
                    </Button>

                    <Typography variant="caption" sx={{ ml: { xs: 0, sm: 2 }, color: 'text.secondary', width: { xs: '100%', sm: 'auto' }, textAlign: { xs: 'right', sm: 'left' } }}>
                        {t('availableTagsText')}
                    </Typography>
                </Box>

                <Box
                    ref={editorRef}
                    contentEditable
                    onKeyUp={checkActiveStyles}
                    onMouseUp={checkActiveStyles}
                    sx={{
                        minHeight: '180px',
                        p: 2,
                        outline: 'none',
                        backgroundColor: '#fff',
                        '& b': { fontWeight: 'bold' },
                        '& i': { fontStyle: 'italic' },
                        lineHeight: 1.5
                    }}
                />
            </Box>

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Button variant="outlined" color="error" onClick={() => setClearConfirmOpen(true)}>
                    {t('clearBtn')}
                </Button>

                <Button variant="contained" onClick={handleSave}>
                    {t('saveChangesBtn')}
                </Button>
            </Box>

            <Dialog
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
            >
                <DialogTitle>{t('replaceContentTitle')}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {t('replaceContentDesc')}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmOpen(false)}>{t('cancelBtn')}</Button>
                    <Button onClick={applyTemplate} color="error" variant="contained">
                        {t('replaceBtn')}
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={clearConfirmOpen} onClose={() => setClearConfirmOpen(false)}>
                <DialogTitle>{t('clearConfirmTitle')}</DialogTitle>
                <DialogContent>
                    <DialogContentText>{t('clearConfirmDesc')}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setClearConfirmOpen(false)}>{t('cancelBtn')}</Button>
                    <Button onClick={executeClear} color="error" variant="contained">
                        {t('clearConfirmAction')}
                    </Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
};

export default EventReminderEditor;
