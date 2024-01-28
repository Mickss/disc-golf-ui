import "./App.css";
import { Routes, Route } from 'react-router-dom';
import AddEventComponent from "./disc-golf-events/AddEventComponent";
import DiscGolfEventsComponent from "./disc-golf-events/DiscGolfEventsComponent";
import EditEventComponent from "./disc-golf-events/EditEventComponent";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<DiscGolfEventsComponent />} />
        <Route path="/5add25" element={<AddEventComponent />} />
        <Route path="/5edit35" element={<EditEventComponent />} />
      </Routes>
    </>
  );
}
