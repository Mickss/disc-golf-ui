import { useEffect, useState, useRef } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const DiscGolfEventsComponent = () => {
  const tournamentDateInputRef = useRef();
  const pdgaInputRef = useRef();
  const tournamentTitleInputRef = useRef();
  const regionInputRef = useRef();
  const registrationInputRef = useRef();

  const [discGolfEvents, setDiscGolfEvents] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = () => {
    fetch("http://localhost:8080/events")
      .then((response) => response.json())
      .then((data) => setDiscGolfEvents(data));
  };

  const createEvent = () => {
    const eventData = {
      tournamentDate: tournamentDateInputRef.current.value,
      pdga: pdgaInputRef.current.value,
      tournamentTitle: tournamentTitleInputRef.current.value,
      region: regionInputRef.current.value,
      registration: registrationInputRef.current.value,
    };

    fetch("http://localhost:8080/events", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(eventData),
    });
  };

  return (
    <>
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

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="left">Tournament date</TableCell>
              <TableCell align="left">PDGA</TableCell>
              <TableCell align="left">Tournament title</TableCell>
              <TableCell align="left">Region</TableCell>
              <TableCell align="left">Registration</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {discGolfEvents.map((discGolfEvent) => (
              <TableRow
                key={discGolfEvent.name}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                <TableCell align="left">{discGolfEvent.tournamentDate}</TableCell>
                <TableCell align="left">{discGolfEvent.pdga}</TableCell>
                <TableCell align="left">{discGolfEvent.tournamentTitle}</TableCell>
                <TableCell align="left">{discGolfEvent.region}</TableCell>
                <TableCell align="left">{discGolfEvent.registration}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default DiscGolfEventsComponent;
