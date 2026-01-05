import React from "react";
import { DiscGolfEvent } from "../disc-golf-events/DiscGolfEvent";
import { getRegistrationStatus, RegistrationStatus as StatusEnum } from "../disc-golf-events/RegistrationUtils";

export const RegistrationStatus = ({ event }: { event: DiscGolfEvent }) => {
    const status = getRegistrationStatus(event);

    const statusStyles = {
        [StatusEnum.OPEN]: { bg: '#d1fae5', color: '#065f46' },
        [StatusEnum.CLOSED]: { bg: '#f3f4f6', color: '#6b7280' },
        [StatusEnum.PASSED]: { bg: '#e5e7eb', color: '#4b5563' },
    };

    const style = statusStyles[status] || statusStyles[StatusEnum.CLOSED];

    return (
        <span style={{
            padding: '4px 6px',
            fontSize: '12px',
            fontWeight: 600,
            borderRadius: '4px',
            backgroundColor: style.bg,
            color: style.color,
            display: 'inline-block',
            textTransform: 'uppercase'
        }}>
            {status}
        </span>
    );
};
