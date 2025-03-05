import React from 'react';

export default function PendingEventTile({ data }) {
  return (
    <div className="event-tile">
      <h3>{data.title || data.name}</h3>
      <p>{data.date ? `📅 ${data.date}` : '📌 Pending Details'}</p>
      {data.image && <img src={data.image} alt={data.title} className="event-image" />}
      <button className="view-btn">🔍 View Details</button>
    </div>
  );
}