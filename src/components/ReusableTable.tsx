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
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import MobileCardView from "./MobileCardView";

const ReusableTable = ({ title, columns, rows, currentSort, onSort, renderActions, getRowStyle }: {
    title?: string,
    columns: TableColumn[],
    rows: DiscGolfEvent[],
    currentSort?: Sort,
    onSort?: (currentSort: Sort) => void,
    renderActions?: (row: DiscGolfEvent) => React.ReactElement[],
    getRowStyle?: (row: DiscGolfEvent) => any
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const handleSortRequest = async (field: string) => {
        const isAscending = currentSort && currentSort.field === field && currentSort.direction === "asc";
        const newDirection = isAscending ? "desc" : "asc";

        if (onSort) {
            await onSort({ field: field, direction: newDirection });
        }
    };

    const hasActions = renderActions && rows.some(row => {
        const actions = renderActions(row);
        return actions && actions.length > 0;
    });

    return (
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
            {title && (
                <Typography variant="h4" component="h1" sx={{ textAlign: "center", mb: 4 }}>
                    {title}
                </Typography>
            )}

            {isMobile ? (
                <MobileCardView
                    events={rows}
                    renderActions={renderActions}
                    getRowStyle={getRowStyle}
                />
            ) : (
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="reusable table">
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell key={column.header}>
                                        {onSort ? (
                                            <TableSortLabel
                                                active={currentSort && currentSort.field === column.field}
                                                direction={currentSort && currentSort.field === column.field ? currentSort.direction : "asc"}
                                                onClick={() => handleSortRequest(column.field)}
                                            >
                                                {column.header}
                                            </TableSortLabel>
                                        ) : column.header}
                                    </TableCell>
                                ))}
                                {hasActions && <TableCell align="right">Actions</TableCell>}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row, rowIndex) => (
                                <TableRow
                                    key={row.id || rowIndex}
                                    sx={{
                                        "&:last-child td, &:last-child th": { border: 0 },
                                        transition: 'background-color 0.2s ease',
                                        ...(getRowStyle ? getRowStyle(row) : {})
                                    }}
                                >
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
                                    {hasActions && (
                                        <TableCell align="right">
                                            {renderActions(row)}
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </div>
    );
};

export default ReusableTable;
