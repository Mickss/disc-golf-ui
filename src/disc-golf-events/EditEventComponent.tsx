import React, { useEffect, useState, useRef } from "react";
import config from "../config";

const EditEventComponent = () => {
    const [discGolfEvents, setDiscGolfEvents] = useState<Event[]>([]);
    const [eventIdToEdit, setEventIdToEdit] = useState<string | undefined>();
    
    interface Event {
        id: string;
        tournamentDateStart?: string;
        tournamentDateEnd?: string;
        registrationStart?: string;
        registrationEnd?: string;
        pdga?: string;
        tournamentTitle?: string;
        region?: string;
        externalLink?: string;
        tournamentDirector?: string;
        capacity?: number;
    }
    
    const [eventToEdit, setEventToEdit] = useState<Event>({
        id: "",
        tournamentDateStart: "",
        tournamentDateEnd: "",
        registrationStart: "",
        registrationEnd: "",
        pdga: "",
        tournamentTitle: "",
        region: "",
        externalLink: "",
        tournamentDirector: "",
        capacity: undefined,
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

    const tournamentDateStartInputRef = useRef<HTMLInputElement>(null);
    const tournamentDateEndInputRef = useRef<HTMLInputElement>(null);
    const registrationStartInputRef = useRef<HTMLInputElement>(null);
    const registrationEndInputRef = useRef<HTMLInputElement>(null);
    const pdgaInputRef = useRef<HTMLInputElement>(null);
    const tournamentTitleInputRef = useRef<HTMLInputElement>(null);
    const regionInputRef = useRef<HTMLInputElement>(null);
    const externalLinkInputRef = useRef<HTMLInputElement>(null);
    const tournamentDirectorInputRef = useRef<HTMLInputElement>(null);
    const capacityInputRef = useRef<HTMLInputElement>(null);

    eventToEdit.tournamentDateStart && tournamentDateStartInputRef.current && (tournamentDateStartInputRef.current.value = eventToEdit.tournamentDateStart);
    eventToEdit.tournamentDateEnd && tournamentDateEndInputRef.current && (tournamentDateEndInputRef.current.value = eventToEdit.tournamentDateEnd);
    eventToEdit.registrationStart && registrationStartInputRef.current && (registrationStartInputRef.current.value = eventToEdit.registrationStart);
    eventToEdit.registrationEnd && registrationEndInputRef.current && (registrationEndInputRef.current.value = eventToEdit.registrationEnd);
    eventToEdit.pdga && pdgaInputRef.current && (pdgaInputRef.current.value = eventToEdit.pdga);
    eventToEdit.tournamentTitle && tournamentTitleInputRef.current && (tournamentTitleInputRef.current.value = eventToEdit.tournamentTitle);
    eventToEdit.region && regionInputRef.current && (regionInputRef.current.value = eventToEdit.region);
    eventToEdit.externalLink && externalLinkInputRef.current && (externalLinkInputRef.current.value = eventToEdit.externalLink);
    eventToEdit.tournamentDirector && tournamentDirectorInputRef.current && (tournamentDirectorInputRef.current.value = eventToEdit.tournamentDirector);
    eventToEdit.capacity && capacityInputRef.current && (capacityInputRef.current.value = eventToEdit.capacity.toString());

    const updateEvent = () => {
        const eventData = {
            tournamentDateStart: tournamentDateStartInputRef.current ? tournamentDateStartInputRef.current.value : "",
            tournamentDateEnd: tournamentDateEndInputRef.current ? tournamentDateEndInputRef.current.value : "",
            registrationStart: registrationStartInputRef.current ? registrationStartInputRef.current.value : "",
            registrationEnd: registrationEndInputRef.current ? registrationEndInputRef.current.value : "",
            pdga: pdgaInputRef.current ? pdgaInputRef.current.value : "",
            tournamentTitle: tournamentTitleInputRef.current ? tournamentTitleInputRef.current.value : "",
            region: regionInputRef.current ? regionInputRef.current.value : "",
            externalLink: externalLinkInputRef.current ? externalLinkInputRef.current.value : "",
            tournamentDirector: tournamentDirectorInputRef.current ? tournamentDirectorInputRef.current.value : "",
            capacity: capacityInputRef.current ? parseInt(capacityInputRef.current.value) : null,
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
            <label htmlFor="tournamentDateStart">Tournament Start </label>
            <input type="date" id="tournamentDateStart" ref={tournamentDateStartInputRef} />
        </div>
        <div>
            <label htmlFor="tournamentDateEnd">Tournament End </label>
            <input type="date" id="tournamentDateEnd" ref={tournamentDateEndInputRef} />
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
            <label htmlFor="tournamentDirector">Tournament Director </label>
            <input type="text" id="tournamentDirector" ref={tournamentDirectorInputRef} />
        </div>
        <div>
            <label htmlFor="capacity">Capacity </label>
            <input type="number" id="capacity" ref={capacityInputRef} />
        </div>
        <div>
            <label htmlFor="externalLink">External Link </label>
            <input type="text" id="externalLink" ref={externalLinkInputRef} />
        </div>
        <button onClick={updateEvent}>Update Event</button>
    </>
}

export default EditEventComponent;
