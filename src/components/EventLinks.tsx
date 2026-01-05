import React from "react";
import Button from "@mui/material/Button";
import { DiscGolfEvent } from "../disc-golf-events/DiscGolfEvent";

export const EventLinks = ({ event }: { event: DiscGolfEvent }) => {
    if (!event.externalLink) return null;

    const links = event.externalLink.split(';').filter(link => link !== '');

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {links.map((link, index) => (
                <Button
                    key={index}
                    href={link}
                    target="_blank"
                    variant="contained"
                    size="small"
                >
                    {links.length > 1 ? `Link ${index + 1}` : 'Link'}
                </Button>
            ))}
        </div>
    );
};
