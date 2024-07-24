import { useEffect, useState, useRef } from "react";
import config from '../config';

const AddEventComponent = () => {

    const [discGolfEvents, setDiscGolfEvents] = useState([]);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = () => {
        fetch(`${config.apiUrl}/events`)
            .then((response) => response.json())
            .then((data) => setDiscGolfEvents(data));
    };

    const tournamentDateInputRef = useRef();
    const pdgaInputRef = useRef();
    const tournamentTitleInputRef = useRef();
    const regionInputRef = useRef();
    const registrationInputRef = useRef();

    const createEvent = () => {
        const eventData = {
            tournamentDate: tournamentDateInputRef.current.value,
            pdga: pdgaInputRef.current.value,
            tournamentTitle: tournamentTitleInputRef.current.value,
            region: regionInputRef.current.value,
            registration: registrationInputRef.current.value,
        };

        fetch(`${config.apiUrl}/events`, {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(eventData),
        });
    };

    return <>
        <h1>Add new event</h1>
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
        <button onClick={createEvent}>Create Event</button>
    </>
}

export default AddEventComponent;
