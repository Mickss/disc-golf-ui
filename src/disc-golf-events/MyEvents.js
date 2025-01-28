import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../auth/AuthContext";

const MyEvents = () => {
  const [myEvents, setMyEvents] = useState([]);
  const [error, setError] = useState(null);
  const { isLoggedIn } = useContext(AuthContext);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:24001/api/disc-golf-service/events/my-events", {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: 'include' 
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setMyEvents(data);
        setError(null);
      } catch (error) {
        console.error("Error fetching my events:", error);
        setError(error.message);
      }
    };

    if (isLoggedIn) {
      fetchEvents();
    }
  }, [isLoggedIn]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  if (!isLoggedIn) {
    return <p>You need to be logged in to view your events.</p>;
  }

  if (error) {
    <div className="p-4 text-center text-red-600">
        Error loading events: {error}
      </div>
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">My Registered Events</h1>
      
      {myEvents.length > 0 ? (
        <div className="space-y-4">
          {myEvents.map((event) => (
            <div 
              key={event.id}
              className="bg-white border rounded-lg p-6 shadow hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold text-blue-600">
                  {event.tournamentTitle}
                </h2>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  PDGA: {event.pdga}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600">
                <div>
                  <span className="font-medium">Date: </span>
                  {formatDate(event.tournamentDate)}
                </div>
                <div>
                  <span className="font-medium">Region: </span>
                  {event.region}
                </div>
                <div>
                  <span className="font-medium">Registration Status: </span>
                  <span className={`${
                    event.registration === 'OPEN' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {event.registration}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Vacancies: </span>
                  {event.vacancies}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-600 p-8 bg-gray-50 rounded-lg">
          <p className="text-lg">You haven't registered for any events yet.</p>
        </div>
      )}
    </div>
  );
};

export default MyEvents;