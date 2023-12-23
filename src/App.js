import "./App.css";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

function createData(date, league, pdga, title, registration, state) {
  return { date, league, pdga, title, registration, state };
}

const rows = [
  createData("05/03/2024", 159, "-", "Fire Disk", "Phase 1", '22 / 22'),
  createData("15/06/2024", 237, "-", "Spin Around", "Phase 1", '0 / 30'),
  createData("04/08/2024", 262, "-", "Golf Basket", "Phase 1", '33 / 45'),
  createData("09/10/2024", 305, "-", "Flaying plates", "Phase 1", '20 / 25'),
  createData("11/11/2024", 356, "-", "Team Disk", "Phase 1", '22 / 26'),
];

export default function BasicTable() {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="left">Turnament date</TableCell>
            <TableCell align="left">League</TableCell>
            <TableCell align="left">PDGA</TableCell>
            <TableCell align="left">Turnament title</TableCell>
            <TableCell align="left">Registration</TableCell>
            <TableCell align="left">State</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.name}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell align="left">{row.date}</TableCell>
              <TableCell align="left">{row.league}</TableCell>
              <TableCell align="left">{row.pdga}</TableCell>
              <TableCell align="left">{row.title}</TableCell>
              <TableCell align="left">{row.registration}</TableCell>
              <TableCell align="left">{row.state}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
