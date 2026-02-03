import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Paper, Button, Box } from '@mui/material';
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

    const formatDate = (dateString?: string) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('pl-PL');
    };

    if (error) {
        return <StatusMessage severity="error" message={error} />;
    }

    const rowStyle = {
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        mb: 1.5,
        alignItems: { sm: 'center' }
    };

    const labelStyle = {
        minWidth: '220px',
        fontWeight: 'bold',
        color: '#333'
    };

    return (
        <>
            {event && (
                <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
                    <Button
                        variant="outlined"
                        onClick={() => navigate('/')}
                        sx={{ mb: 2 }}
                    >
                        ⬅️ Back to Events
                    </Button>

                    <Paper elevation={3} sx={{ p: 4 }}>

                        <Box sx={{ borderLeft: '5px solid #3f6dcf', pl: 2, mb: 4 }}>
                            <Typography variant="h4" component="h1">
                                {event.tournamentTitle}
                            </Typography>
                        </Box>

                        <Box sx={{ pl: { md: 1 } }}>

                            <Box sx={rowStyle}>
                                <Typography sx={labelStyle}>Tournament date start</Typography>
                                <Typography>{formatDate(event.tournamentDateStart)}</Typography>
                            </Box>

                            <Box sx={rowStyle}>
                                <Typography sx={labelStyle}>Tournament date end</Typography>
                                <Typography>{formatDate(event.tournamentDateEnd)}</Typography>
                            </Box>

                            <Box sx={rowStyle}>
                                <Typography sx={labelStyle}>PDGA</Typography>
                                <Typography>{event.pdga || '-'}</Typography>
                            </Box>

                            <Box sx={rowStyle}>
                                <Typography sx={labelStyle}>Region</Typography>
                                <Typography>{event.region}</Typography>
                            </Box>

                            <Box sx={rowStyle}>
                                <Typography sx={labelStyle}>Registration start</Typography>
                                <Typography>{formatDate(event.registrationStart)}</Typography>
                            </Box>

                            <Box sx={rowStyle}>
                                <Typography sx={labelStyle}>Registration end</Typography>
                                <Typography>{formatDate(event.registrationEnd)}</Typography>
                            </Box>

                            <Box sx={rowStyle}>
                                <Typography sx={labelStyle}>Tournament director</Typography>
                                <Typography>{event.tournamentDirector || '-'}</Typography>
                            </Box>

                            <Box sx={rowStyle}>
                                <Typography sx={labelStyle}>Capacity</Typography>
                                <Typography>{event.capacity ? event.capacity : '-'}</Typography>
                            </Box>

                            {event.externalLink && (
                                <Box sx={{ mt: 3, ...rowStyle }}>
                                    <Typography sx={labelStyle}>External Link</Typography>
                                    <Box>
                                        {event.externalLink.split(';').map((link, index, array) => (
                                            <Typography key={index} variant="body1">
                                                <a
                                                    href={link}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    style={{ color: '#1976d2', textDecoration: 'none' }}
                                                >
                                                    Tournament website{array.length > 1 ? ` ${index + 1}` : ''} ➡️
                                                </a>
                                            </Typography>
                                        ))}
                                    </Box>
                                </Box>
                            )}
                        </Box>

                    </Paper>
                </Container>
            )}
        </>
    );
};

export default DiscGolfEventDetails;
