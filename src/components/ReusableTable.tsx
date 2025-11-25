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
import { Sort } from "../disc-golf-events/Sort";
import { DiscGolfEvent } from "../disc-golf-events/DiscGolfEvent";
import { TableColumn } from "../disc-golf-events/TableColumn";

const ReusableTable = ({ title, columns, rows, currentSort, onSort, renderActions }: { 
    title?: string, 
    columns: TableColumn[], 
    rows: DiscGolfEvent[], 
    currentSort?: Sort, 
    onSort?: (currentSort: Sort) => void, 
    renderActions?: (row: DiscGolfEvent) => any }
) => {
    const sortHandler = (field: string) => async () => {
        const isAscending = currentSort && currentSort.field === field && currentSort.direction === "asc";
        const newDirection = isAscending ? "desc" : "asc";

        if (onSort) {
            await onSort({field: field, direction: newDirection});
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
                                        active={currentSort && currentSort.field === column.field}
                                        direction={currentSort && currentSort.field === column.field ? currentSort.direction : "asc"}
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
                                    <TableCell
                                        key={colIndex}
                                        component="th"
                                        scope="row"
                                        align={column.align || "left"}
                                        sx={{
                                            whiteSpace: "normal",
                                            overflowWrap: "break-word",
                                            maxWidth: 250,
                                        }}
                                    >
                                        {column.visual ? column.visual(row) : row[column.field as keyof DiscGolfEvent]}
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