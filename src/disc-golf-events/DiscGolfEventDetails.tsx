import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Paper, CircularProgress, Alert, Button } from '@mui/material';
import config from '../config';

interface DiscGolfEvent {
    id: string;
    tournamentTitle: string;
    tournamentDate: string;
    region: string;
    pdga?: string;
    externalLink?: string;
}

const DiscGolfEventDetails = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [event, setEvent] = useState<DiscGolfEvent | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');

    const fetchEventDetails = useCallback(() => {
        if (!id) {
            setError('No tournament ID');
            setLoading(false);
            return;
        }

        setLoading(true);
        setError('');

        const url = `${config.discGolfServiceUrl}/public/events/${id}`;

        fetch(url, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error(`No tournament found (status: ${res.status})`);
                }
                return res.json();
            })
            .then((data: DiscGolfEvent) => {
                setEvent(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Tournament download error:', err);
                setError(err.message || 'The tournament data could not be downloaded.');
                setLoading(false);
            });
    }, [id]);

    useEffect(() => {
        fetchEventDetails();
    }, [fetchEventDetails]);

    if (loading) {
        return (
            <Container maxWidth="md" sx={{ mt: 5, display: 'flex', justifyContent: 'center' }}>
                <CircularProgress />
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="md" sx={{ mt: 5 }}>
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }

    if (!event) {
        return (
            <Container maxWidth="md" sx={{ mt: 5 }}>
                <Alert severity="warning">Tournament not found</Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Button
                variant="outlined"
                onClick={() => navigate('/')}
                sx={{ mb: 2 }}
            >
                ⬅️ Back to Events
            </Button>

            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h4" gutterBottom>
                    {event.tournamentTitle}
                </Typography>

                <Typography variant="h6" gutterBottom>
                    Region: {event.region}
                </Typography>

                <Typography variant="body1" sx={{ mt: 2 }}>
                    Tournament date: <strong>{new Date(event.tournamentDate).toLocaleDateString('pl-PL')}</strong>
                </Typography>

                {event.pdga && (
                    <Typography variant="body1" sx={{ mt: 2 }}>
                        PDGA: {event.pdga}
                    </Typography>
                )}

                {event.externalLink && (
                    <div style={{ marginTop: '16px' }}>
                        {event.externalLink.split(';').filter(link => link.trim() !== '').map((link, index, array) => (
                            <Typography key={index} variant="body2" sx={{ mt: 1 }}>
                                <a
                                    href={link.trim()}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ color: '#1976d2', textDecoration: 'none' }}
                                >
                                    Tournament website{array.length > 1 ? ` ${index + 1}` : ''} ➡️
                                </a>
                            </Typography>
                        ))}
                    </div>
                )}
            </Paper>
        </Container>
    );
};

export default DiscGolfEventDetails;
