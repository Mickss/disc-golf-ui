import React from "react";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import { DiscGolfEvent } from "../disc-golf-events/DiscGolfEvent";
import { RegistrationStatus } from "./RegistrationStatus";
import { EventLinks } from "./EventLinks";
import { formatDate } from "../utils/dateUtils";

const MobileCardView = ({ events, renderActions, getRowStyle }: {
    events: DiscGolfEvent[];
    renderActions?: (event: DiscGolfEvent) => React.ReactElement[];
    getRowStyle?: (event: DiscGolfEvent) => any;
}) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {events.map((event) => (
                <Paper
                    key={event.id}
                    sx={{
                        ...(getRowStyle ? getRowStyle(event) : {}),
                        padding: '8px',
                    }}
                >
                    <div style={{ marginBottom: '2px' }}>
                        <Typography
                            sx={{
                                fontWeight: 600,
                                color: 'text.secondary',
                                fontSize: '0.7rem',
                            }}
                        >
                            {formatDate(event.tournamentDateStart)}
                        </Typography>
                    </div>

                    <div style={{ marginBottom: '4px' }}>
                        <Typography
                            sx={{
                                fontWeight: 700,
                                color: 'primary.main',
                                fontSize: '0.875rem',
                            }}
                        >
                            {event.tournamentTitle}
                        </Typography>
                    </div>

                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                            {event.pdga && (
                                <Typography sx={{ fontSize: '0.75rem' }}>
                                    {event.pdga}
                                </Typography>
                            )}
                            <RegistrationStatus event={event} />
                            <Typography sx={{ fontSize: '0.75rem' }}>
                                {event.region}
                            </Typography>
                        </div>

                        <div style={{ flexShrink: 0 }}>
                            <EventLinks event={event} />
                        </div>
                    </div>

                    {renderActions && (
                        <div style={{
                            display: 'flex',
                            gap: '8px',
                            marginTop: '8px',
                            justifyContent: 'flex-start'
                        }}>
                            {renderActions(event)}
                        </div>
                    )}
                </Paper>
            ))}
        </div>
    );
};

export default MobileCardView;
