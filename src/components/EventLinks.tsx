import React from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { DiscGolfEvent } from "../disc-golf-events/DiscGolfEvent";

export const EventLinks = ({ event }: { event: DiscGolfEvent }) => {
    if (!event.externalLink) return null;

    const links = event.externalLink.split(';').filter(link => link.trim() !== "");

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            {links.map((link, index) => (
                <Button
                    key={index}
                    href={link.trim()}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="contained"
                    size="small"
                    sx={{
                        height: 24,
                        fontSize: '0.7rem',
                        minWidth: '60px',
                        fontWeight: 700,
                        px: 1,
                        backgroundColor: '#1976d2'
                    }}
                >
                    LINK {links.length > 1 ? index + 1 : ''}
                </Button>
            ))}
        </Box>
    );
};
