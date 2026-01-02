import React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { DiscGolfEvent } from "../disc-golf-events/DiscGolfEvent";
import { TableColumn } from "../disc-golf-events/TableColumn";

const MobileCardView = ({
    rows,
    columns,
    renderActions,
    getRowStyle,
}: {
    rows: DiscGolfEvent[];
    columns: TableColumn[];
    renderActions?: (row: DiscGolfEvent) => React.ReactElement[];
    getRowStyle?: (row: DiscGolfEvent) => any;
}) => {
    const hasActions = renderActions && rows.some(row => {
        const actions = renderActions(row);
        return actions && actions.length > 0;
    });

    const visibleColumns = columns.filter(col =>
        col.header !== "Registration Start"
    );

    const tournamentDateCol = columns.find(col => col.header === "Tournament Date");
    const titleCol = columns.find(col => col.header === "Tournament Title");

    const otherColumns = visibleColumns.filter(col =>
        col.header !== "Tournament Date" &&
        col.header !== "Tournament Title"
    );

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.15 }}>
            {rows.map((row, rowIndex) => (
                <Paper
                    key={row.id || rowIndex}
                    elevation={1}
                    sx={{
                        ...(getRowStyle ? getRowStyle(row) : {}),
                        transition: 'all 0.2s ease',
                        p: 0.15,
                    }}
                >
                    <Grid container spacing={0.15} alignItems="center">
                        {tournamentDateCol && (
                            <Grid item xs={12}>
                                <Typography
                                    variant="caption"
                                    sx={{
                                        fontWeight: 600,
                                        color: 'text.secondary',
                                        fontSize: '0.7rem',
                                        lineHeight: 1,
                                    }}
                                >
                                    {tournamentDateCol.visual
                                        ? tournamentDateCol.visual(row)
                                        : (row[tournamentDateCol.field as keyof DiscGolfEvent] as React.ReactNode)
                                    }
                                </Typography>
                            </Grid>
                        )}
                        {titleCol && (
                            <Grid item xs={12}>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        fontWeight: 700,
                                        color: 'primary.main',
                                        fontSize: '0.775rem',
                                        lineHeight: 1,
                                    }}
                                >
                                    {titleCol.visual
                                        ? titleCol.visual(row)
                                        : (row[titleCol.field as keyof DiscGolfEvent] as React.ReactNode)
                                    }
                                </Typography>
                            </Grid>
                        )}
                        {otherColumns.map((column, colIndex) => (
                            <Grid
                                item
                                xs={true}
                                key={colIndex}
                            >
                                <Typography
                                    variant="caption"
                                    sx={{
                                        fontWeight: 400,
                                        color: 'text.primary',
                                        fontSize: '0.75rem',
                                        lineHeight: 1,
                                    }}
                                >
                                    {column.visual
                                        ? column.visual(row)
                                        : (row[column.field as keyof DiscGolfEvent] as React.ReactNode)
                                    }
                                </Typography>
                            </Grid>
                        ))}

                        {hasActions && (
                            <Grid item xs="auto">
                                <Box sx={{ display: 'flex', gap: 0.5 }}>
                                    {renderActions(row)}
                                </Box>
                            </Grid>
                        )}
                    </Grid>
                </Paper>
            ))}
        </Box>
    );
};

export default MobileCardView;
