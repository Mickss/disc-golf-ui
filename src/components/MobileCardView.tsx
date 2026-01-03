import React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import Paper from "@mui/material/Paper";
import { DiscGolfEvent } from "../disc-golf-events/DiscGolfEvent";
import { RegistrationStatus } from "./RegistrationStatus";
import { EventLinks } from "./EventLinks";

interface MobileCardViewProps {
    events: DiscGolfEvent[];
    renderActions?: (event: DiscGolfEvent) => React.ReactElement[];
    getRowStyle?: (event: DiscGolfEvent) => any;
}

const MobileCardView = ({ events, renderActions, getRowStyle }: MobileCardViewProps) => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {events.map((event, index) => (
                <Paper
                    key={event.id || index}
                    elevation={2}
                    sx={{
                        ...(getRowStyle ? getRowStyle(event) : {}),
                        p: 0.25,
                    }}
                >
                    <Grid container spacing={0.5}>
                        <Grid size={12}>
                            <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary', fontSize: '0.8rem' }}>
                                {new Date(event.tournamentDate).toLocaleDateString('pl-PL')}
                            </Typography>
                        </Grid>
                        <Grid size={12}>
                            <Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.main', fontSize: '0.85rem' }}>
                                {event.tournamentTitle}
                            </Typography>
                        </Grid>
                        <Grid size={12}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                    {event.pdga && (
                                        <Typography variant="caption" sx={{ fontSize: '0.75rem' }}>
                                            {event.pdga}
                                        </Typography>
                                    )}
                                    <RegistrationStatus event={event} />
                                    <Typography variant="caption" sx={{ fontSize: '0.75rem' }}>
                                        {event.region}
                                    </Typography>
                                </Box>
                                <EventLinks event={event} />
                            </Box>
                        </Grid>
                        {renderActions && (
                            <Grid size={12}>
                                <Box sx={{ display: 'flex', gap: 0.35, mt: 0.25 }}>
                                    {renderActions(event)}
                                </Box>
                            </Grid>
                        )}
                    </Grid>
                </Paper>
            ))}
        </Box>
    );
};

export default MobileCardView;
