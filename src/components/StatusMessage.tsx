import { Container, Alert } from '@mui/material';
import React from 'react';

interface StatusMessageProps {
    severity: 'error' | 'warning' | 'info' | 'success';
    message: string;
}

const StatusMessage = ({ severity, message }: StatusMessageProps) => {

    return (
        <Container maxWidth="md" sx={{ mt: 5 }}>
            <Alert severity={severity}>{message}</Alert>
        </Container>
    );
};

export default StatusMessage;
