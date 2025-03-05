import React, { useState } from 'react';

export default function LiveEventModal({ closeModal, pendingEvents, pendingShoppingLists, pendingGroups }) {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedShoppingList, setSelectedShoppingList] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);

  const handleLaunchLiveEvent = () => {
    if (!selectedEvent || !selectedShoppingList || !selectedGroup) {
      alert("Please select an Event, Shopping List, and Group to create a Live Event!");
      return;
    }

    // Send data to backend
    fetch('/api/live-events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventId: selectedEvent,
        shoppingListId: selectedShoppingList,
        groupId: selectedGroup
      })
    }).then(res => res.json()).then(() => {
      alert("🎉 Live Event Created!");
      closeModal();
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>🚀 Create a Live Event</h2>

        <label>📅 Select an Event</label>
        <select onChange={(e) => setSelectedEvent(e.target.value)}>
          <option value="">Choose an Event</option>
          {pendingEvents.map(event => <option key={event.id} value={event.id}>{event.title}</option>)}
        </select>

        <label>🛒 Select a Shopping List</label>
        <select onChange={(e) => setSelectedShoppingList(e.target.value)}>
          <option value="">Choose a Shopping List</option>
          {pendingShoppingLists.map(list => <option key={list.id} value={list.id}>{list.name}</option>)}
        </select>

        <label>🎟 Select a Group</label>
        <select onChange={(e) => setSelectedGroup(e.target.value)}>
          <option value="">Choose a Group</option>
          {pendingGroups.map(group => <option key={group.id} value={group.id}>{group.name}</option>)}
        </select>

        <div className="modal-buttons">
          <button className="cancel-btn" onClick={closeModal}>❌ Cancel</button>
          <button className="launch-btn" onClick={handleLaunchLiveEvent}>🚀 Launch</button>
        </div>
      </div>
    </div>
  );
}