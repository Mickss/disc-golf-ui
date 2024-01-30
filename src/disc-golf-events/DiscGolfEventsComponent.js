import { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const DiscGolfEventsComponent = () => {

  const [discGolfEvents, setDiscGolfEvents] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = () => {
    fetch("http://localhost:8080/events")
      .then((response) => response.json())
      .then((data) => setDiscGolfEvents(data));
  };

  return (
    <>
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
                key={discGolfEvent.id}
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
