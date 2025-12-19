import "./App.css";
import { Routes, Route } from 'react-router-dom';
import AddEventComponent from "./disc-golf-events/AddEventComponent";
import DiscGolfEventsComponent from "./disc-golf-events/DiscGolfEventsComponent";
import EditEventComponent from "./disc-golf-events/EditEventComponent";
import Header from "./Header";
import SignInComponent from "./auth/SignInComponent";
import SignUpComponent from "./auth/SignUpComponent";
import UsersComponent from "./auth/UsersComponent";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import MyEvents from "./disc-golf-events/MyEvents";
import ContactComponent from "./disc-golf-events/ContactComponent";
import React from "react";
import GlobalLoading from "./spinner/GlobalLoading";
import DiscGolfEventDetails from "./disc-golf-events/DiscGolfEventDetails";

export default function App() {

  const theme = createTheme();
  return (
    <ThemeProvider theme={ theme }>
      <CssBaseline />
      <GlobalLoading />
      <Header />

      <Routes>
        <Route path="/details/:id" element={ <DiscGolfEventDetails /> } />
        <Route path="/" element={ <DiscGolfEventsComponent /> } />
        <Route path="/sign-in" element={ <SignInComponent /> } />
        <Route path="/5add25" element={ <AddEventComponent /> } />
        <Route path="/5edit35" element={ <EditEventComponent /> } />
        <Route path="/my-events" element={<MyEvents />} />
        <Route path="/sign-up" element={<SignUpComponent />} />
        <Route path="/users" element={<UsersComponent />} />
        <Route path="/contact" element={<ContactComponent />} />
      </Routes>
    </ThemeProvider>
  );
}
