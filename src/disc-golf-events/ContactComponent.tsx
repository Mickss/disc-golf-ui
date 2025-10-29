import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
} from "@mui/material";

const ContactComponent: React.FC = () => {
  return (
    <Box sx={{ p: 4, textAlign: "center" }}>
      <Card sx={{ maxWidth: 600, margin: "0 auto", p: 2, backgroundColor: "hsla(0, 0%, 83%, 1.00)" }}>
        <CardContent>
              <Typography variant="h6" gutterBottom>
                Developed by Michał Guz
              </Typography>
              <Typography>Email: michal.guz.85@gmail.com</Typography>
              <Typography>
                LinkedIn:{" "}
                <a
                  href="https://www.linkedin.com/in/micha%C5%82-guz-190340a2/"
                  target="_blank"
                  rel="noreferrer"
                >
                  linkedin.com/in/michał-guz-190340a2
                </a>
              </Typography>
              <Typography>
                GitHub:{" "}
                <a
                  href="https://github.com/Mickss"
                  target="_blank"
                  rel="noreferrer"
                >
                  https://github.com/Mickss
                </a>
              </Typography>
              <Typography>Phone: +48 607 122 232</Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ContactComponent;
