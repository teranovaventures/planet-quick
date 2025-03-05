import React, { useState, useEffect } from 'react';
import LiveEventModal from './LiveEventModal';
import PendingEventTile from './PendingEventTile';

export default function PendingEvents() {
  const [pendingEvents, setPendingEvents] = useState([]);
  const [pendingShoppingLists, setPendingShoppingLists] = useState([]);
  const [pendingGroups, setPendingGroups] = useState([]);
  const [showModal, setShowModal] = useState(false);



  useEffect(() => {
    // Fetch pending events
    fetch('/api/events?state=pending')
      .then(res => res.json())
      .then(data => {
        console.log("📌 Pending Events Fetched:", data);  // Debugging log
        setPendingEvents(data);
      })
      .catch(error => console.error("🚨 Error fetching events:", error));
  
    // Fetch pending shopping lists
    fetch('/api/shoppinglists?state=pending')
      .then(res => res.json())
      .then(data => setPendingShoppingLists(data))
      .catch(error => console.error("🚨 Error fetching shopping lists:", error));
  
    // Fetch pending invitation groups
    fetch('/api/groups?state=pending')
      .then(res => res.json())
      .then(data => setPendingGroups(data))
      .catch(error => console.error("🚨 Error fetching groups:", error));
  }, []);



  return (
    <div className="pending-events-page">
      <h1>Pending Events</h1>
      
      {/* Live Event Button */}
      <button className="launch-event-btn" onClick={() => setShowModal(true)}>🚀 Launch Live Event</button>

      <div className="top-bar">
  <button className="create-live-event-btn" onClick={() => setShowModal(true)}>🚀 Create Live Event</button>
</div>


      {/* 📌 Pending Events Section */}
<section className="pending-section">
  <h2 className="section-title">Pending Events</h2>
  <hr className="section-underline" />
  <div className="carousel">
    {pendingEvents.map(event => (
      <PendingEventTile key={event.id} data={event} />
    ))}
  </div>
</section>

{/* 🛒 Pending Shopping List Section */}
<section className="pending-section">
  <h2 className="section-title">Pending Shopping List</h2>
  <hr className="section-underline" />
  <div className="carousel">
    {pendingShoppingLists.map(list => (
      <PendingEventTile key={list.id} data={list} />
    ))}
  </div>
</section>

{/* 🎟 Pending Invitation List Section */}
<section className="pending-section">
  <h2 className="section-title">Pending Invitation List</h2>
  <hr className="section-underline" />
  <div className="carousel">
    {pendingGroups.map(group => (
      <PendingEventTile key={group.id} data={group} />
    ))}
  </div>
</section>


      

      {/* Live Event Modal */}
      {showModal && <LiveEventModal closeModal={() => setShowModal(false)} pendingEvents={pendingEvents} pendingShoppingLists={pendingShoppingLists} pendingGroups={pendingGroups} />}
    </div>
  );
}