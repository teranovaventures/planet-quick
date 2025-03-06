export default function PendingEventTile({ data }) {
    const { title, date, time, location, state } = data.attributes || data; // ✅ Extract event attributes
  
    return (
      <div className="event-tile">
        <h3>{title || "No Title"}</h3>
        <p>{date ? `📅 ${date}` : "📌 No Date"}</p>
        <p>{time ? `⏰ ${time}` : "⏳ Time TBD"}</p>
        <p>{location ? `📍 ${location}` : "📍 Location TBD"}</p>
        <p>{state === "pending" ? "🟡 Pending" : "✅ Ready"}</p>
      </div>
    );
  }