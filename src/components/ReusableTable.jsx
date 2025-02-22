import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TableSortLabel from "@mui/material/TableSortLabel";

const ReusableTable = ({ title, columns, rows, currentSort, onSort, renderActions }) => {
    const sortHandler = (field) => async () => {
        const isAscending = currentSort.field === field && currentSort.direction === "asc";
        const newDirection = isAscending ? "desc" : "asc";

        if (onSort) {
            await onSort(field, newDirection);
        }
    };

    return (
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
            {title && (
                <Typography variant="h4" component="h1" sx={{ textAlign: "center", mb: 4 }}>
                    {title}
                </Typography>
            )}
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="reusable table">
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell key={column.header}>
                                    {onSort ? <TableSortLabel
                                        active={currentSort.field === column.field}
                                        direction={currentSort.field === column.field ? currentSort.direction : "asc"}
                                        onClick={sortHandler(column.field)}
                                    >
                                        {column.header}
                                    </TableSortLabel>
                                    : column.header}
                                </TableCell>
                            ))}
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row, rowIndex) => (
                            <TableRow key={row.id || rowIndex} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                {columns.map((column, colIndex) => (
                                    <TableCell key={colIndex} component="th" scope="row" align={column.align || "left"}>
                                        {row[column.field]}
                                    </TableCell>
                                ))}
                                {renderActions && (
                                    <TableCell align="right">
                                        {renderActions(row)}
                                    </TableCell>
                                )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default ReusableTable;