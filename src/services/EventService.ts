import config from '../config';
import { DiscGolfEvent } from '../disc-golf-events/DiscGolfEvent';

export const EventService = {
    getEventById: async (id: string): Promise<DiscGolfEvent> => {
        const response = await fetch(`${config.discGolfServiceUrl}/public/events/${id}`, {
            method: 'GET',
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error(`Server responded with status: ${response.status}`);
        }

        return response.json();
    },

    updateEvent: async (id: string, eventData: DiscGolfEvent): Promise<void> => {
        const response = await fetch(`${config.discGolfServiceUrl}/events/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(eventData),
        });

        if (!response.ok) {
            throw new Error(`Update failed with status: ${response.status}`);
        }
    }
};
