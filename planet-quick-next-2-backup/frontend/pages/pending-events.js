import React, { useState, useEffect } from 'react';
import Head from 'next/head';

const PendingEvents = () => {
  const [events, setEvents] = useState([]);
  const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337';

  useEffect(() => {
    fetch(`${STRAPI_URL}/api/events?filters[state][$eq]=pending}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` },
    })
      .then((res) => res.json())
      .then((data) => setEvents(data.data))
      .catch((err) => console.error("Error fetching events:", err));
  }, []);

  return (
    <div className="pending-events-container">
      <Head><title>Pending Events</title></Head>
      <h2>Pending Events</h2>

      <div className="events-list">
        {events.map((event) => (
          <div key={event.id} className="event-tile">
            <div className="event-date">{new Date(event.date).toLocaleDateString()}</div>
            <h3>{event.title}</h3>
            <p>Goal: {event.goal || 'TBD'}</p>
            <img src={event.image || "/default-event.jpg"} alt="Event" />
            <button onClick={() => attachListAndGroup(event.id)}>Add List & Group</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PendingEvents;