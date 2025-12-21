import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Paper, Button } from '@mui/material';
import { DiscGolfEvent } from './DiscGolfEvent';
import { useLoading } from '../spinner/LoadingProvider';
import StatusMessage from '../components/StatusMessage';
import { EventService } from '../services/EventService';

const DiscGolfEventDetails = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { setLoading } = useLoading();
    const [event, setEvent] = useState<DiscGolfEvent | null>(null);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const fetchEventDetails = async () => {
            if (!id) return;

            setLoading(true);
            setError('');
            try {
                const data = await EventService.getEventById(id);
                setEvent(data);
            } catch (err: any) {
                console.error('Tournament fetching error:', err);
                setError(err.message || 'The tournament data could not be fetched.');
            } finally {
                setLoading(false);
            }
        };

        fetchEventDetails();
    }, [id, setLoading]);

    if (error) {
        return <StatusMessage severity="error" message={error} />;
    }

    return (
        <>
            {event && (
                <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
                    <Button
                        variant="outlined"
                        onClick={() => navigate('/events')}
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
                                {event.externalLink.split(';').map((link, index, array) => (
                                    <Typography key={index} variant="body2" sx={{ mt: 1 }}>
                                        <a
                                            href={link}
                                            target="_blank"
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
            )}
        </>
    );
};

export default DiscGolfEventDetails;
