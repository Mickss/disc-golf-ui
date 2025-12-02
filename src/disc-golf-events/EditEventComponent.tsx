import React, { useEffect, useState, useRef } from "react";
import config from "../config";

const EditEventComponent = () => {

    const [discGolfEvents, setDiscGolfEvents] = useState<Event[]>([]);
    const [eventIdToEdit, setEventIdToEdit] = useState<string | undefined>();
    interface Event {
        id: string;
        tournamentDate?: string;
        registrationStart?: string;
        registrationEnd?: string;
        pdga?: string;
        tournamentTitle?: string;
        region?: string;
        externalLink?: string;
    }
    
    const [eventToEdit, setEventToEdit] = useState<Event>({
        id: "",
        tournamentDate: "",
        registrationStart: "",
        registrationEnd: "",
        pdga: "",
        tournamentTitle: "",
        region: "",
        externalLink: "",
    });

    useEffect(() => {
        fetchEvents();
    }, []);

    useEffect(() => {
        eventIdToEdit && fetchEvent(eventIdToEdit);
    }, [eventIdToEdit]);

    const fetchEvents = () => {
        fetch(`${config.discGolfServiceUrl}/events`, {
            method: 'GET',
            credentials: 'include',
        })
            .then((response) => response.json())
            .then((data) => {
                setDiscGolfEvents(data);
                if (data.length > 0) {
                    setEventIdToEdit(data[0].id);
                }
            });
    };

    const fetchEvent = (eventId: any) => {
        fetch(`${config.discGolfServiceUrl}/events/${eventId}`, {
            method: 'GET',
            credentials: 'include',
        })
            .then((response) => response.json())
            .then((data) => setEventToEdit(data));
    };

    const tournamentDateInputRef = useRef<HTMLInputElement>(null);
    const registrationStartInputRef = useRef<HTMLInputElement>(null);
    const registrationEndInputRef = useRef<HTMLInputElement>(null);
    const pdgaInputRef = useRef<HTMLInputElement>(null);
    const tournamentTitleInputRef = useRef<HTMLInputElement>(null);
    const regionInputRef = useRef<HTMLInputElement>(null);
    const externalLinkInputRef = useRef<HTMLInputElement>(null);

    eventToEdit.tournamentDate && tournamentDateInputRef.current && (tournamentDateInputRef.current.value = eventToEdit.tournamentDate);
    eventToEdit.registrationStart && registrationStartInputRef.current && (registrationStartInputRef.current.value = eventToEdit.registrationStart);
    eventToEdit.registrationEnd && registrationEndInputRef.current && (registrationEndInputRef.current.value = eventToEdit.registrationEnd);
    eventToEdit.pdga && pdgaInputRef.current && (pdgaInputRef.current.value = eventToEdit.pdga);
    eventToEdit.tournamentTitle && tournamentTitleInputRef.current && (tournamentTitleInputRef.current.value = eventToEdit.tournamentTitle);
    eventToEdit.region && regionInputRef.current && (regionInputRef.current.value = eventToEdit.region);
    eventToEdit.externalLink && externalLinkInputRef.current && (externalLinkInputRef.current.value = eventToEdit.externalLink);

    const updateEvent = () => {
        const eventData = {
            tournamentDate: tournamentDateInputRef.current ? tournamentDateInputRef.current.value : "",
            registrationStart: registrationStartInputRef.current ? registrationStartInputRef.current.value : "",
            registrationEnd: registrationEndInputRef.current ? registrationEndInputRef.current.value : "",
            pdga: pdgaInputRef.current ? pdgaInputRef.current.value : "",
            tournamentTitle: tournamentTitleInputRef.current ? tournamentTitleInputRef.current.value : "",
            region: regionInputRef.current ? regionInputRef.current.value : "",
            externalLink: externalLinkInputRef.current ? externalLinkInputRef.current.value : "",
        };

        fetch(`${config.discGolfServiceUrl}/events/${eventIdToEdit}`, {
            method: "put",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: 'include',
            body: JSON.stringify(eventData),
        });
    };

    return <>
        <h1>Edit event</h1>
        <select
            value={eventIdToEdit}
            onChange={e => setEventIdToEdit(e.target.value)}
        >
            {discGolfEvents.map(dgEvent => <option key={dgEvent.id} value={dgEvent.id}>{dgEvent.tournamentTitle}</option>)}
        </select>
        <div>
            <label htmlFor="tournamentDate">Tournament Date </label>
            <input type="date" id="tournamentDate" ref={tournamentDateInputRef} />
        </div>
        <div>
            <label htmlFor="registrationStart">Registration Start </label>
            <input type="date" id="registrationStart" ref={registrationStartInputRef} />
        </div>
        <div>
            <label htmlFor="registrationEnd">Registration End </label>
            <input type="date" id="registrationEnd" ref={registrationEndInputRef} />
        </div>
        <div>
            <label htmlFor="pdga">PDGA </label>
            <input type="text" id="pdga" ref={pdgaInputRef} />
        </div>
        <div>
            <label htmlFor="tournamentTitle">Tournament Title </label>
            <input type="text" id="tournamentTitle" ref={tournamentTitleInputRef} />
        </div>
        <div>
            <label htmlFor="region">Region </label>
            <input type="text" id="region" ref={regionInputRef} />
        </div>
        <div>
            <label htmlFor="externalLink">External Link </label>
            <input type="url" id="externalLink" ref={externalLinkInputRef} />
        </div>
        <button onClick={updateEvent}>Update Event</button>
    </>
}

export default EditEventComponent;
