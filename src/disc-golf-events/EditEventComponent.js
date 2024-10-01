import { useEffect, useState, useRef } from "react";
import config from "../config";

const EditEventComponent = () => {

    const [discGolfEvents, setDiscGolfEvents] = useState([]);
    const [eventIdToEdit, setEventIdToEdit] = useState();
    const [eventToEdit, setEventToEdit] = useState({});

    useEffect(() => {
        fetchEvents();
    }, []);

    useEffect(() => {
        eventIdToEdit && fetchEvent(eventIdToEdit);
    }, eventIdToEdit);

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

    const fetchEvent = (eventId) => {
        fetch(`${config.discGolfServiceUrl}/events/${eventId}`, {
            method: 'GET',
            credentials: 'include',
        })
            .then((response) => response.json())
            .then((data) => setEventToEdit(data));
    };

    const tournamentDateInputRef = useRef();
    const pdgaInputRef = useRef();
    const tournamentTitleInputRef = useRef();
    const regionInputRef = useRef();
    const registrationInputRef = useRef();

    eventToEdit.tournamentDate && (tournamentDateInputRef.current.value = eventToEdit.tournamentDate);
    eventToEdit.pdga && (pdgaInputRef.current.value = eventToEdit.pdga);
    eventToEdit.tournamentTitle && (tournamentTitleInputRef.current.value = eventToEdit.tournamentTitle);
    eventToEdit.region && (regionInputRef.current.value = eventToEdit.region);
    eventToEdit.registration && (registrationInputRef.current.value = eventToEdit.registration);

    const updateEvent = () => {
        const eventData = {
            tournamentDate: tournamentDateInputRef.current.value,
            pdga: pdgaInputRef.current.value,
            tournamentTitle: tournamentTitleInputRef.current.value,
            region: regionInputRef.current.value,
            registration: registrationInputRef.current.value,
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
            <input type="text" id="tournamentDate" ref={tournamentDateInputRef} />
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
            <label htmlFor="registration">Registration </label>
            <input type="text" id="registration" ref={registrationInputRef} />
        </div>
        <button onClick={updateEvent}>Update Event</button>
    </>
}

export default EditEventComponent;
