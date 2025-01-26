import "./App.css";
import { Routes, Route } from 'react-router-dom';
import AddEventComponent from "./disc-golf-events/AddEventComponent";
import DiscGolfEventsComponent from "./disc-golf-events/DiscGolfEventsComponent";
import EditEventComponent from "./disc-golf-events/EditEventComponent";
import Header from "./Header";
import SignInComponent from "./auth/SignInComponent";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import MyEvents from "./MyEvents";
import React from "react";

export default function App() {

  const theme = createTheme();
  return (
    <ThemeProvider theme={ theme }>
      <CssBaseline />
      <Header />

      <Routes>
        <Route path="/" element={ <DiscGolfEventsComponent /> } />
        <Route path="/sign-in" element={ <SignInComponent /> } />
        <Route path="/5add25" element={ <AddEventComponent /> } />
        <Route path="/5edit35" element={ <EditEventComponent /> } />
        <Route path="/my-events" element={<MyEvents />} />
      </Routes>
    </ThemeProvider>
  );
}
