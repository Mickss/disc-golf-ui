import { useEffect, useState, useRef } from "react";

const EditEventComponent = () => {

    const [discGolfEvents, setDiscGolfEvents] = useState([]);
    const [eventIdToEdit, setEventIdToEdit] = useState();
    const [eventToEdit, setEventToEdit] = useState({});

    useEffect(() => {
        fetchEvents();
    }, []);

    useEffect(() => {
        fetchEvent(eventIdToEdit);
    }, eventIdToEdit);

    const fetchEvents = () => {
        fetch("http://localhost:8080/events")
            .then((response) => response.json())
            .then((data) => setDiscGolfEvents(data));
    };

    const fetchEvent = (eventId) => {
        fetch(`http://localhost:8080/events/${eventId}`)
            .then((response) => response.json())
            .then((data) => setEventToEdit(data));
    };

    const tournamentDateInputRef = useRef();
    const pdgaInputRef = useRef();
    const tournamentTitleInputRef = useRef();
    const regionInputRef = useRef();
    const registrationInputRef = useRef();

    const updateEvent = (eventId) => {
        const eventData = {
            tournamentDate: tournamentDateInputRef.current.value,
            pdga: pdgaInputRef.current.value,
            tournamentTitle: tournamentTitleInputRef.current.value,
            region: regionInputRef.current.value,
            registration: registrationInputRef.current.value,
        };

        fetch(`http://localhost:8080/events/${eventId}`, {
            method: "put",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(eventData),
        });
    };

    return <>

        <h1>Edit event</h1>
        <select
            value={eventIdToEdit}
            onChange={e => setEventIdToEdit(e.target.value)}
        >
            {discGolfEvents.map(dgEvent => <option value={dgEvent.id}>{dgEvent.tournamentTitle}</option>)}
        </select>
        <p>Your favorite fruit: {eventIdToEdit}</p>
        <div>
            <label htmlFor="tournamentDate">Tournament Date </label>
            <input type="text" id="tournamentDate" ref={tournamentDateInputRef} value={eventToEdit.tournamentDate} />
        </div>
        <div>
            <label htmlFor="pdga">PDGA </label>
            <input type="text" id="pdga" ref={pdgaInputRef} value={eventToEdit.pdga} />
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
