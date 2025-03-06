"use client";
import React, { useState, useEffect } from "react";

export default function TestDataPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      setError("🚨 No authenticated user found. Please log in.");
      setLoading(false);
      return;
    }

    const user = JSON.parse(storedUser);
    console.log("👤 Authenticated User:", user);

    // ✅ DEBUG: Log the actual API URL before making a request
    const apiUrl = `http://localhost:1337/api/events?filters[state][$eq]=pending&filters[userId][$eq]=${user.id}`;
                console.log("🔍 Fetching events from:", apiUrl);

    // ✅ Fetch Events
    fetch(apiUrl)
  .then((res) => {
    console.log("🔍 API Response Status:", res.status); // ✅ Log response status
    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
    return res.json();
  })
  .then((data) => {
    console.log("📌 Events API Response:", data); // ✅ Log full response
    setEvents(data.data || []);
  })
  .catch((err) => {
    console.error("🚨 Error fetching events:", err);
    setError(`Error fetching events: ${err.message}`);
  });
  }, []);

  return (
    <div style={styles.container}>
      <h1>🔎 Test Data Fetch</h1>

      {loading && <p>Loading data...</p>}
      {error && <p style={styles.error}>{error}</p>}

      {/* ✅ Events Section */}
      <section>
        <h2>📌 Pending Events</h2>
        {events.length > 0 ? (
          <ul>
            {events.map((event) => (
              <li key={event.id}>
                <strong>{event.title || "No Title"}</strong> — {event.date || "No Date"} @ {event.time || "No Time"}
              </li>
            ))}
          </ul>
        ) : (
          <p>No pending events found.</p>
        )}
      </section>
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  error: {
    color: "red",
    fontWeight: "bold",
  },
};