import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function LiveEvent() {
  const router = useRouter();
  const { id } = router.query; // Event ID from URL
  const [event, setEvent] = useState(null);
  const [shoppingList, setShoppingList] = useState(null);
  const [invitation, setInvitation] = useState(null);
  const [error, setError] = useState('');
  const [isCoordinator, setIsCoordinator] = useState(false); // Placeholder for coordinator check

  useEffect(() => {
    if (!id) return;

    const fetchLiveEvent = async () => {
      try {
        const eventRes = await fetch(`/api/events/${id}`);
        const eventData = await eventRes.json();
        setEvent(eventData);

        // Fetch related shopping list and invitation
        const shoppingListRes = await fetch('/api/shoppinglists');
        const shoppingLists = await shoppingListRes.json();
        const relatedShoppingList = shoppingLists.find(sl => sl.event.toString() === id);
        setShoppingList(relatedShoppingList);

        const invitationRes = await fetch('/api/invitations');
        const invitations = await invitationRes.json();
        const relatedInvitation = invitations.find(inv => inv.event.toString() === id);
        setInvitation(relatedInvitation);
      } catch (err) {
        setError('Failed to load event');
      }
    };
    fetchLiveEvent();
  }, [id]);

  const handleBuyItem = async (item) => {
    // Placeholder for item purchase logic
    alert(`Purchased ${item.name} for $${item.price}. Please send payment to coordinator via Venmo/Zelle/Cash App.`);
    // Logic for sending email and updating item status would go here
  };

  if (!event || !shoppingList || !invitation) return <div>Loading...</div>;

  return (
    <div style={{ background: 'linear-gradient(90deg, rgb(192, 36, 37) 0%, rgba(240, 134, 53, 0.04) 100%)', minHeight: '100vh', padding: '20px' }}>
      <h1>{event.eventName}</h1>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div style={{ width: '30%' }}>
          <h2>Volunteers</h2>
          {invitation.volunteersNeeded > 0 ? (
            <>
              <p>{invitation.volunteerDescription}</p>
              <p>Duration: {invitation.volunteerDuration}</p>
              <button>Volunteer</button>
            </>
          ) : (
            <p>No volunteers needed.</p>
          )}
        </div>
        <div style={{ width: '30%', textAlign: 'center' }}>
          <h2>Team Goal Contributions</h2>
          <p>Goal: $78.94</p>
          <p>Contributions: $20.99</p>
          <p>Only This Much to Go! $56.64</p>
          {/* Add bar chart here if needed */}
        </div>
        <div style={{ width: '30%' }}>
          <h2>Shopping List</h2>
          <table style={{ width: '100%' }}>
            <thead>
              <tr>
                <th>Item</th>
                <th>Price</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Chips', price: 9.99 },
                { name: 'Coke Mini', price: 11.00 },
                { name: 'Gummy Bears', price: 8.99 },
                { name: 'Snickers', price: 13.99 },
                { name: 'Napkins', price: 8.99 },
                { name: 'Water Bottles', price: 12.99 },
              ].map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>${item.price}</td>
                  <td>
                    <button onClick={() => handleBuyItem(item)}>Buy</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p>Subtotal: $78.94</p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button>Venmo</button>
            <button>Zelle</button>
            <button>Cash App</button>
            <button>Checkout</button>
          </div>
        </div>
      </div>
      {isCoordinator && (
        <div>
          <h2>Admin Controls</h2>
          <button>Edit Guests</button>
          <button>Change Inventory</button>
          <button>Request Volunteers</button>
          <button>Cancel Event</button>
          <button>Change Date/Time</button>
        </div>
      )}
    </div>
  );
}