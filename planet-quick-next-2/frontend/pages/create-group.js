import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import confetti from 'canvas-confetti';

const RocketAnimation = () => (
  <div style={{ position: 'relative', width: '100px', height: '100px', margin: '0 auto' }}>
    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '40px' }}>🚀</div>
  </div>
);

export default function CreateGroupPage({ user }) {
  const [eventSearchQuery, setEventSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [guests, setGuests] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [manualGuest, setManualGuest] = useState({ firstName: '', lastName: '', email: '', phone: '' });
  const [volunteerRequest, setVolunteerRequest] = useState('');
  const [volunteerQuantity, setVolunteerQuantity] = useState(1);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editData, setEditData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [showManualAddModal, setShowManualAddModal] = useState(false);
  const [showVolunteerModal, setShowVolunteerModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const router = useRouter();

  const STRAPI_API_URL = 'http://localhost:1337/api';
  const STRAPI_API_TOKEN = '76e1da1b6c27d1c452b2de5248d6432e1a83ebd112ded6abc3773a0f80244dc865054434af3067cd4c9e18c658ac4815f8b12dfaf91ae9cc545afd4c001ee6007d7ce3e63b712a9a10b6968669276b0cd69b6b7118be8a0d122f322eeaa5391107a2856181dfd4bd58fb9984da48f7c5c241352b8a67724bb916e982e4af8b19';

  useEffect(() => {
    if (!user || !user.id) {
      setErrorMessage('Please log in to create an invitation.');
      router.push('/sign-in');
    }
  }, [user, router]);

  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  const fetchSuggestions = async (query) => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }
    const jwt = localStorage.getItem('jwt');
    if (!jwt) {
      setErrorMessage('No authentication token found. Please log in again.');
      return;
    }
    try {
      const res = await fetch(
        `${STRAPI_API_URL}/pqevents?filters[pqeventname][$containsi]=${encodeURIComponent(query)}&filters[pqcoordinator][id][$eq]=${user.id}&populate[pqinvitationlist]=*`,
        { headers: { Authorization: `Bearer ${jwt}` } }
      );
      if (!res.ok) throw new Error(`Failed to fetch events: ${res.status}`);
      const data = await res.json();
      const events = data.data.map(event => ({
        id: event.id,
        name: event.attributes.pqeventname,
        guests: event.attributes.pqinvitationlist?.data.map(inv => ({
          firstName: inv.attributes.pqfirstname,
          lastName: inv.attributes.pqlastname,
          email: inv.attributes.pqemail,
          phone: inv.attributes.pqphone || '',
        })) || [],
      }));
      setSuggestions(events);
    } catch (error) {
      setErrorMessage('Failed to fetch past events.');
      console.error(error);
    }
  };
  const debouncedFetchSuggestions = debounce(fetchSuggestions, 300);

  const handleSelectEvent = (event) => {
    const newGuests = event.guests.filter(guest => 
      guest.firstName && guest.lastName && guest.email && 
      !guests.some(g => g.email === guest.email)
    );
    setGuests([...guests, ...newGuests]);
    setEventSearchQuery('');
    setSuggestions([]);
  };

  const handleAddManualGuest = () => {
    const { firstName, lastName, email, phone } = manualGuest;
    if (!firstName || !lastName || !email) {
      setErrorMessage('First name, last name, and email are required.');
      return;
    }
    if (guests.some(g => g.email === email)) {
      setErrorMessage('This email is already added.');
      return;
    }
    setGuests([...guests, { firstName, lastName, email, phone }]);
    setManualGuest({ firstName: '', lastName: '', email: '', phone: '' });
    setShowManualAddModal(false);
  };

  const handleAddVolunteer = () => {
    if (!volunteerRequest) {
      setErrorMessage('Please describe the volunteer request.');
      return;
    }
    setVolunteers([...volunteers, { description: volunteerRequest, quantity: volunteerQuantity }]);
    setVolunteerRequest('');
    setVolunteerQuantity(1);
    setShowVolunteerModal(false);
  };

  const adjustVolunteerQuantity = (index, delta) => {
    const newVolunteers = [...volunteers];
    newVolunteers[index].quantity = Math.max(1, newVolunteers[index].quantity + delta);
    setVolunteers(newVolunteers);
  };

  const startEditing = (index, type) => {
    setEditingIndex(index);
    setEditData(type === 'guest' ? { ...guests[index] } : { description: volunteers[index].description, quantity: volunteers[index].quantity });
  };

  const saveEdit = (type) => {
    if (type === 'guest') {
      if (!editData.firstName || !editData.lastName || !editData.email) {
        setErrorMessage('First name, last name, and email are required.');
        return;
      }
      const newGuests = [...guests];
      newGuests[editingIndex] = editData;
      setGuests(newGuests);
    } else {
      if (!editData.description) {
        setErrorMessage('Volunteer description is required.');
        return;
      }
      const newVolunteers = [...volunteers];
      newVolunteers[editingIndex] = editData;
      setVolunteers(newVolunteers);
    }
    setEditingIndex(null);
    setEditData(null);
  };

  const removeItem = (index, type) => {
    if (type === 'guest') {
      setGuests(guests.filter((_, i) => i !== index));
    } else {
      setVolunteers(volunteers.filter((_, i) => i !== index));
    }
  };

  const handleCreateInvitation = async () => {
    if (guests.length === 0 && volunteers.length === 0) {
      setErrorMessage('Add at least one guest or volunteer.');
      return;
    }

    const jwt = localStorage.getItem('jwt');
    if (!jwt) {
      setErrorMessage('No authentication token found. Please log in again.');
      return;
    }

    try {
      // Fetch latest pending event
      const eventRes = await fetch(
        `${STRAPI_API_URL}/pqevents?filters[pqcoordinator][id][$eq]=${user.id}&filters[pqeventstatus][$eq]=pending&sort[0]=createdAt:desc&pagination[limit]=1`,
        { headers: { Authorization: `Bearer ${jwt}` } }
      );
      if (!eventRes.ok) throw new Error(`Failed to fetch events: ${eventRes.status}`);
      const eventData = await eventRes.json();
      if (!eventData.data || eventData.data.length === 0) {
        setErrorMessage('No pending event found. Create an event first.');
        return;
      }
      const latestEvent = eventData.data[0];

      // Get or create shopping list
      const shoppingListRes = await fetch(
        `${STRAPI_API_URL}/pqshoppinglists?filters[pqeventshoppinglist][id][$eq]=${latestEvent.id}`,
        { headers: { Authorization: `Bearer ${jwt}` } }
      );
      let shoppingListData = await shoppingListRes.json();
      let shoppingListId;

      if (!shoppingListData.data || shoppingListData.data.length === 0) {
        const newShoppingList = await fetch(`${STRAPI_API_URL}/pqshoppinglists`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwt}`,
          },
          body: JSON.stringify({
            data: {
              pqlistname: `${latestEvent.attributes.pqeventname} Shopping List`,
              pqitems: [],
              pqeventshoppinglist: latestEvent.id,
            },
          }),
        });
        if (!newShoppingList.ok) throw new Error('Failed to create shopping list');
        shoppingListId = (await newShoppingList.json()).data.id;
      } else {
        shoppingListId = shoppingListData.data[0].id;
      }

      // Add guests to pqinvitations
      if (guests.length > 0) {
        for (const guest of guests) {
          const invitationData = {
            data: {
              pqeventinvited: latestEvent.id,
              pqfirstname: guest.firstName,
              pqlastname: guest.lastName,
              pqemail: guest.email,
              pqphone: guest.phone || null,
              pqinvitestatus: 'pending',
            },
          };
          console.log('Sending invitation payload:', JSON.stringify(invitationData, null, 2));
          const inviteRes = await fetch(`${STRAPI_API_URL}/pqinvitations`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${STRAPI_API_TOKEN}`,
            },
            body: JSON.stringify(invitationData),
          });
          const inviteResponse = await inviteRes.json();
          if (!inviteRes.ok) {
            console.error('Invite response:', inviteResponse);
            throw new Error(`Failed to create invitations: ${JSON.stringify(inviteResponse)}`);
          }
        }
      }

      // Add volunteers to pqshoppinglists
      if (volunteers.length > 0) {
        const currentItems = shoppingListData.data.length ? shoppingListData.data[0].attributes.pqitems || [] : [];
        const volunteerItems = volunteers.map(v => ({
          itemName: `Volunteer: ${v.description}`,
          isVolunteer: true,
          quantity: v.quantity,
          cost: 0,
        }));
        const updatedItems = [...currentItems, ...volunteerItems];
        const updateShoppingList = await fetch(`${STRAPI_API_URL}/pqshoppinglists/${shoppingListId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwt}`,
          },
          body: JSON.stringify({ data: { pqitems: updatedItems } }),
        });
        if (!updateShoppingList.ok) throw new Error('Failed to update shopping list');
      }

      setShowSuccessModal(true);
      setTimeout(() => router.push('/pending-events'), 3000);
    } catch (error) {
      setErrorMessage(error.message);
      console.error(error);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#FAF3E0', padding: '20px', display: 'flex', justifyContent: 'center' }}>
      <div style={{ display: 'flex', gap: '24px', transform: 'rotateZ(1deg)', transition: '0.3s', backgroundColor: '#F5D1B0', padding: '24px', borderRadius: '46px' }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
        onMouseLeave={(e) => (e.currentTarget.style.transform = 'rotateZ(1deg)')}>
        <div style={{ padding: '32px', backgroundColor: '#FFFFFF', borderRadius: '46px', boxShadow: '8px 8px 13px #2b2a2a', transform: 'rotateZ(-2deg)', transition: '0.3s', width: '600px' }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'rotateZ(3deg)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'rotateZ(-2deg)')}>
          <h2 style={{ fontSize: '35px', fontFamily: 'STIX Two Text', fontWeight: 600 }}>Invite Guests</h2>
          {errorMessage && <div style={{ color: 'red', fontSize: '1rem', marginBottom: '1rem' }}>{errorMessage}</div>}

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontFamily: 'STIX Two Text', fontSize: '1rem' }}>Search Past Events:</label>
            <input
              type="text"
              value={eventSearchQuery}
              onChange={(e) => { setEventSearchQuery(e.target.value); debouncedFetchSuggestions(e.target.value); }}
              placeholder="Event name"
              style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '8px', width: '100%', fontFamily: 'STIX Two Text', fontSize: '1rem' }}
            />
            {suggestions.length > 0 && (
              <div style={{ border: '1px solid #ddd', borderRadius: '8px', marginTop: '0.5rem', maxHeight: '150px', overflowY: 'auto' }}>
                {suggestions.map((event, index) => (
                  <div key={index} onClick={() => handleSelectEvent(event)} style={{ padding: '0.5rem', cursor: 'pointer', borderBottom: '1px solid #eee' }}>
                    {event.name} ({event.guests.length} guests)
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <h3 style={{ fontFamily: 'STIX Two Text', fontSize: '1.2rem' }}>Guests</h3>
            {guests.map((guest, index) => (
              editingIndex === index ? (
                <div key={index} style={{ marginBottom: '0.5rem' }}>
                  <input value={editData.firstName} onChange={(e) => setEditData({ ...editData, firstName: e.target.value })} style={{ padding: '0.5rem', marginRight: '0.5rem' }} />
                  <input value={editData.lastName} onChange={(e) => setEditData({ ...editData, lastName: e.target.value })} style={{ padding: '0.5rem', marginRight: '0.5rem' }} />
                  <input value={editData.email} onChange={(e) => setEditData({ ...editData, email: e.target.value })} style={{ padding: '0.5rem', marginRight: '0.5rem' }} />
                  <input value={editData.phone} onChange={(e) => setEditData({ ...editData, phone: e.target.value })} style={{ padding: '0.5rem', marginRight: '0.5rem' }} />
                  <button onClick={() => saveEdit('guest')} style={{ padding: '0.5rem', background: '#FFC78B', border: 'none', borderRadius: '8px' }}>Save</button>
                </div>
              ) : (
                <div key={index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span onClick={() => startEditing(index, 'guest')} style={{ cursor: 'pointer' }}>{guest.firstName} {guest.lastName} - {guest.email} {guest.phone ? `(${guest.phone})` : ''}</span>
                  <button onClick={() => removeItem(index, 'guest')} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>🗑️</button>
                </div>
              )
            ))}
            <button onClick={() => setShowManualAddModal(true)} style={{ padding: '0.5rem 1rem', background: 'linear-gradient(90deg, #FFC78B 0%, #FFAD61 100%)', color: '#191818', border: 'none', borderRadius: '46px', cursor: 'pointer' }}>
              Add Guest
            </button>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <h3 style={{ fontFamily: 'STIX Two Text', fontSize: '1.2rem' }}>Volunteers</h3>
            {volunteers.map((volunteer, index) => (
              editingIndex === index ? (
                <div key={index} style={{ marginBottom: '0.5rem' }}>
                  <input value={editData.description} onChange={(e) => setEditData({ ...editData, description: e.target.value })} style={{ padding: '0.5rem', marginRight: '0.5rem' }} />
                  <input type="number" value={editData.quantity} onChange={(e) => setEditData({ ...editData, quantity: Math.max(1, parseInt(e.target.value) || 1) })} style={{ padding: '0.5rem', width: '50px', marginRight: '0.5rem' }} />
                  <button onClick={() => saveEdit('volunteer')} style={{ padding: '0.5rem', background: '#FFC78B', border: 'none', borderRadius: '8px' }}>Save</button>
                </div>
              ) : (
                <div key={index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span onClick={() => startEditing(index, 'volunteer')} style={{ cursor: 'pointer' }}>Volunteer: {volunteer.description}</span>
                  <div>
                    <button onClick={() => adjustVolunteerQuantity(index, -1)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>-</button>
                    <span>{volunteer.quantity}</span>
                    <button onClick={() => adjustVolunteerQuantity(index, 1)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>+</button>
                    <button onClick={() => removeItem(index, 'volunteer')} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>🗑️</button>
                  </div>
                </div>
              )
            ))}
            <button onClick={() => setShowVolunteerModal(true)} style={{ padding: '0.5rem 1rem', background: 'linear-gradient(90deg, #FFC78B 0%, #FFAD61 100%)', color: '#191818', border: 'none', borderRadius: '46px', cursor: 'pointer' }}>
              Add Volunteer
            </button>
          </div>

          <button onClick={handleCreateInvitation} style={{ padding: '0.75rem 2rem', background: 'linear-gradient(90deg, #FFC78B 0%, #FFAD61 100%)', color: '#191818', border: 'none', borderRadius: '46px', cursor: 'pointer', width: '100%' }}>
            Done
          </button>
        </div>
      </div>

      {showManualAddModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ padding: '24px', backgroundColor: '#F5D1B0', borderRadius: '46px' }}>
            <div style={{ padding: '24px', backgroundColor: '#FFFFFF', borderRadius: '46px', boxShadow: '8px 8px 13px #2b2a2a' }}>
              <h3>Add Guest</h3>
              <input type="text" placeholder="First Name" value={manualGuest.firstName} onChange={(e) => setManualGuest({ ...manualGuest, firstName: e.target.value })} style={{ display: 'block', marginBottom: '0.5rem', padding: '0.5rem', width: '100%' }} />
              <input type="text" placeholder="Last Name" value={manualGuest.lastName} onChange={(e) => setManualGuest({ ...manualGuest, lastName: e.target.value })} style={{ display: 'block', marginBottom: '0.5rem', padding: '0.5rem', width: '100%' }} />
              <input type="email" placeholder="Email" value={manualGuest.email} onChange={(e) => setManualGuest({ ...manualGuest, email: e.target.value })} style={{ display: 'block', marginBottom: '0.5rem', padding: '0.5rem', width: '100%' }} />
              <input type="text" placeholder="Phone (optional)" value={manualGuest.phone} onChange={(e) => setManualGuest({ ...manualGuest, phone: e.target.value })} style={{ display: 'block', marginBottom: '0.5rem', padding: '0.5rem', width: '100%' }} />
              <button onClick={handleAddManualGuest} style={{ padding: '0.5rem 1rem', background: '#FFC78B', border: 'none', borderRadius: '46px', cursor: 'pointer' }}>Add</button>
              <button onClick={() => setShowManualAddModal(false)} style={{ marginLeft: '1rem', padding: '0.5rem 1rem', background: '#FFAD61', border: 'none', borderRadius: '46px', cursor: 'pointer' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {showVolunteerModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ padding: '24px', backgroundColor: '#F5D1B0', borderRadius: '46px' }}>
            <div style={{ padding: '24px', backgroundColor: '#FFFFFF', borderRadius: '46px', boxShadow: '8px 8px 13px #2b2a2a' }}>
              <h3>Request Volunteers</h3>
              <textarea value={volunteerRequest} onChange={(e) => setVolunteerRequest(e.target.value)} placeholder="e.g., Help with setup" style={{ display: 'block', marginBottom: '0.5rem', padding: '0.5rem', width: '100%', height: '100px' }} />
              <label>Quantity:</label>
              <input type="number" value={volunteerQuantity} onChange={(e) => setVolunteerQuantity(Math.max(1, parseInt(e.target.value) || 1))} min="1" style={{ display: 'block', marginBottom: '0.5rem', padding: '0.5rem', width: '100%' }} />
              <button onClick={handleAddVolunteer} style={{ padding: '0.5rem 1rem', background: '#FFC78B', border: 'none', borderRadius: '46px', cursor: 'pointer' }}>Add</button>
              <button onClick={() => setShowVolunteerModal(false)} style={{ marginLeft: '1rem', padding: '0.5rem 1rem', background: '#FFAD61', border: 'none', borderRadius: '46px', cursor: 'pointer' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {showSuccessModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ padding: '24px', backgroundColor: '#F5D1B0', borderRadius: '46px' }}>
            <div style={{ padding: '24px', backgroundColor: '#FFFFFF', borderRadius: '46px', boxShadow: '8px 8px 13px #2b2a2a', textAlign: 'center' }}>
              <RocketAnimation />
              <h2>Invitations Created!</h2>
              <p>Redirecting to Pending Events...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}