import { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TableSortLabel from "@mui/material/TableSortLabel";

const DiscGolfEventsComponent = () => {

  const [discGolfEvents, setDiscGolfEvents] = useState([]);
  const [valueToOrderBy, setValueToOrderBy] = useState("");
  const [orderDirection, setOrderDirection] = useState("");

  const createSortHandler = (property) => (event) => {
    handleRequestSort(event, property);
  };

  const handleRequestSort = (event, property) => {
    const isAscending = valueToOrderBy === property && orderDirection === "asc";
    setValueToOrderBy(property);
    setOrderDirection(isAscending ? "desc" : "asc");
  };

  useEffect(() => {
    fetchEvents();
  }, [valueToOrderBy, orderDirection]);

  const fetchEvents = () => {
    let url = "http://localhost:8080/events";
    if (valueToOrderBy) {
      url += "?valueToOrderBy=" + valueToOrderBy;
      if (orderDirection) {
        url += "&orderDirection=" + orderDirection.toUpperCase();
      }
    }

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Received invalid response", response.status);
        }
        return response.json();
      })
      .then((data) => setDiscGolfEvents(data))
      .catch((error) => {
        console.error("Error while fetching events", error);
      });
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="left">
                Tournament date
                <TableSortLabel
                  active={valueToOrderBy === "tournamentDate"}
                  direction={
                    valueToOrderBy == "tournamentDate" ? orderDirection : "asc"
                  }
                  onClick={createSortHandler("tournamentDate")}
                ></TableSortLabel>
              </TableCell>
              <TableCell align="left">
                PDGA
                <TableSortLabel
                  active={valueToOrderBy === "pdga"}
                  direction={valueToOrderBy == "pdga" ? orderDirection : "asc"}
                  onClick={createSortHandler("pdga")}
                ></TableSortLabel>
              </TableCell>
              <TableCell align="left">
                Tournament title
                <TableSortLabel
                  active={valueToOrderBy === "tournamentTitle"}
                  direction={
                    valueToOrderBy == "tournamentTitle" ? orderDirection : "asc"
                  }
                  onClick={createSortHandler("tournamentTitle")}
                ></TableSortLabel>
              </TableCell>
              <TableCell align="left">
                Region
                <TableSortLabel
                  active={valueToOrderBy === "region"}
                  direction={
                    valueToOrderBy == "region" ? orderDirection : "asc"
                  }
                  onClick={createSortHandler("region")}
                ></TableSortLabel>
              </TableCell>
              <TableCell align="left">
                Registration
                <TableSortLabel
                  active={valueToOrderBy === "registration"}
                  direction={
                    valueToOrderBy == "registration" ? orderDirection : "asc"
                  }
                  onClick={createSortHandler("registration")}
                ></TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {discGolfEvents.map((discGolfEvent) => (
              <TableRow
                key={discGolfEvent.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell align="left">
                  {discGolfEvent.tournamentDate}
                </TableCell>
                <TableCell align="left">{discGolfEvent.pdga}</TableCell>
                <TableCell align="left">
                  {discGolfEvent.tournamentTitle}
                </TableCell>
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
