import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    DialogContentText,
    Button
} from '@mui/material';

type ConfirmationModalProps = {
    open: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmText?: string;
    cancelText?: string;
    confirmColor?: "inherit" | "primary" | "secondary" | "success" | "error" | "info" | "warning";
};

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    open,
    title,
    message,
    onConfirm,
    onCancel,
    confirmText = "Confirm",
    cancelText = "Cancel",
    confirmColor = "warning"
}) => {
    return (
        <Dialog
            open={open}
            onClose={onCancel}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 2,
                    padding: 1
                }
            }}
        >
            <DialogTitle sx={{ paddingBottom: 1 }}>
                {title}
            </DialogTitle>

            <DialogContent sx={{ paddingTop: 1 }}>
                <DialogContentText sx={{
                    fontSize: '1rem',
                    color: 'text.primary'
                }}>
                    {message}
                </DialogContentText>
            </DialogContent>

            <DialogActions sx={{ padding: 2, gap: 1 }}>
                <Button
                    onClick={onCancel}
                    variant="outlined"
                    color="inherit"
                >
                    {cancelText}
                </Button>
                <Button
                    onClick={onConfirm}
                    variant="contained"
                    color={confirmColor}
                    autoFocus
                >
                    {confirmText}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmationModal;
