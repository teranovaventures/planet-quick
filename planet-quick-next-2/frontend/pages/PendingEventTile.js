export default function PendingEventTile({ data, onClick, isSelecting, isSelected, isGreyedOut }) {
  const { title, date, time, location, state } = data.attributes || data;
  const tileStyle = {
    width: '250px',
    height: '150px',
    background: isSelected ? '#1263a1' : isGreyedOut ? '#D3D3D3' : 'white',
    padding: '20px',
    borderRadius: '46px',
    boxShadow: '5px 5px 10px rgba(0, 0, 0, 0.15)',
    transform: isSelecting && !isSelected && !isGreyedOut ? 'rotate(-2deg)' : 'none',
    transition: '0.3s ease-in-out',
    cursor: isSelecting && !isGreyedOut ? 'pointer' : 'default',
    color: isSelected ? 'white' : isGreyedOut ? '#A0A0A0' : 'black',
  };

  return (
    <div
      className="event-tile"
      style={tileStyle}
      onClick={() => isSelecting && !isGreyedOut && onClick()}
    >
      <h3>{title || "No Title"}</h3>
      <p>{date ? `📅 ${date}` : "📌 No Date"}</p>
      <p>{time ? `⏰ ${time}` : "⏳ Time TBD"}</p>
      <p>{location ? `📍 ${location}` : "📍 Location TBD"}</p>
      <p>{state === "pending" ? "🟡 Pending" : "✅ Ready"}</p>
    </div>
  );
}