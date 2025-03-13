import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import RocketAnimation from '../components/RocketAnimation';
import confetti from 'canvas-confetti';

export default function PendingEventsPage() {
  const [events, setEvents] = useState([]);
  const [shoppingLists, setShoppingLists] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSelecting, setIsSelecting] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedList, setSelectedList] = useState(null);
  const [selectedInvitation, setSelectedInvitation] = useState(null);
  const [showLaunchModal, setShowLaunchModal] = useState(false);
  const router = useRouter();

  const STRAPI_API_TOKEN = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN || '76e1da1b6c27d1c452b2de5248d6432e1a83ebd112ded6abc3773a0f80244dc865054434af3067cd4c9e18c658ac4815f8b12dfaf91ae9cc545afd4c001ee6007d7ce3e63b712a9a10b6968669276b0cd69b6b7118be8a0d122f322eeaa5391107a2856181dfd4bd58fb9984da48f7c5c241352b8a67724bb916e982e4af8b19';
  const STRAPI_EVENTS_URL = 'http://localhost:1337/api/pqevents';
  const STRAPI_SHOPPINGLISTS_URL = 'http://localhost:1337/api/pqshoppinglists';
  const STRAPI_INVITATIONS_URL = 'http://localhost:1337/api/pqinvitations';

  const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || '{}') : {};

  useEffect(() => {
    if (!user || !user.id) {
      setErrorMessage('Please log in to view pending events.');
      router.push('/login');
    } else {
      fetchPendingItems();
    }
  }, [user, router]);

  useEffect(() => {
    // Monitor selection state and trigger modal
    const isReady = selectedEvent && selectedList && selectedInvitation;
    console.log('Selection state:', { selectedEvent, selectedList, selectedInvitation, isReady }); // Debug log
    if (isReady && !showLaunchModal) {
      setShowLaunchModal(true);
    }
  }, [selectedEvent, selectedList, selectedInvitation]);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      const styleSheet = document.createElement('style');
      styleSheet.innerText = `
        @keyframes tiltShake {
          0% { transform: rotate(-3deg) scale(1.02); }
          100% { transform: rotate(3deg) scale(1.02); }
        }
        @keyframes fadeIn { 0% { opacity: 0; transform: scale(0.9); } 100% { opacity: 1; transform: scale(1); } }
      `;
      document.head.appendChild(styleSheet);
    }
  }, []);

  const fetchWithRetry = async (url, options, retries = 3, delay = 1000) => {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url, options);
        if (!response.ok) throw new Error('Failed to fetch: ' + await response.text());
        return await response.json();
      } catch (error) {
        if (i === retries - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  };

  const fetchPendingItems = async () => {
    try {
      const jwt = localStorage.getItem('jwt') || STRAPI_API_TOKEN;
      const eventsData = await fetchWithRetry(
        `${STRAPI_EVENTS_URL}?filters[pqcoordinator][id][$eq]=${user.id}&filters[pqeventstatus][$eq]=pending`,
        { headers: { Authorization: `Bearer ${jwt}` } }
      );
      setEvents(eventsData.data || []);

      const shoppingListsData = await fetchWithRetry(
        `${STRAPI_SHOPPINGLISTS_URL}?filters[pqeventshoppinglist][pqeventstatus][$eq]=pending`,
        { headers: { Authorization: `Bearer ${jwt}` } }
      );
      setShoppingLists(shoppingListsData.data || []);

      const invitationsData = await fetchWithRetry(
        `${STRAPI_INVITATIONS_URL}?filters[pqeventinvited][pqcoordinator][id][$eq]=${user.id}`,
        { headers: { Authorization: `Bearer ${jwt}` } }
      );
      setInvitations(invitationsData.data || []);
    } catch (error) {
      setErrorMessage(error.message);
      console.error('Fetch error:', error);
      // Mock data as fallback with your latest entry
      setEvents([
        { id: 1, attributes: { pqeventname: "Cookie's Party", pqstartdate: '2025-03-16' } },
      ]);
      setShoppingLists([
        { id: 2, attributes: { pqlistname: "Cookie's Party Shopping List", pqitems: [] } },
      ]);
      setInvitations([
        { id: 3, attributes: { pqgroupname: 'Guest List for Cookie\'s Party' } },
      ]);
    }
  };

  const handleSelect = (item, type) => {
    if (!isSelecting) return;

    console.log(`Selecting ${type}:`, item); // Debug log
    if (type === 'event') setSelectedEvent(item);
    else if (type === 'list') setSelectedList(item);
    else if (type === 'invitation') setSelectedInvitation(item);
  };

  const handleEdit = (item, type) => {
    if (type === 'event') router.push(`/edit-event/${item.id}`);
    else if (type === 'list') router.push(`/edit-shopping-list/${item.id}`);
    else if (type === 'invitation') router.push(`/edit-invitation/${item.id}`);
  };

  const handleInviteCohost = async (eventId) => {
    const email = prompt('Enter co-host email:');
    if (!email) return;

    try {
      const userRes = await fetch(
        `http://localhost:1337/api/pqusers?filters[pqemail][$eq]=${email}`,
        { headers: { Authorization: `Bearer ${STRAPI_API_TOKEN}` } }
      );
      const userData = await userRes.json();
      if (!userData.data.length) {
        setErrorMessage('User not found.');
        return;
      }

      const cohostId = userData.data[0].id;
      const eventRes = await fetch(`${STRAPI_EVENTS_URL}/${eventId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${STRAPI_API_TOKEN}` },
        body: JSON.stringify({ data: { pqcohosts: { connect: [cohostId] } } }),
      });

      if (eventRes.ok) {
        alert('Co-host invited successfully.');
        fetchPendingItems();
      } else {
        setErrorMessage('Failed to invite co-host.');
      }
    } catch (error) {
      setErrorMessage('Error inviting co-host.');
    }
  };

  const handleDelete = async (itemId, type) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      let url;
      if (type === 'event') url = `${STRAPI_EVENTS_URL}/${itemId}`;
      else if (type === 'list') url = `${STRAPI_SHOPPINGLISTS_URL}/${itemId}`;
      else if (type === 'invitation') url = `${STRAPI_INVITATIONS_URL}/${itemId}`;

      const response = await fetch(url, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${STRAPI_API_TOKEN}` },
      });

      if (!response.ok) throw new Error(`Failed to delete ${type}: ${await response.text()}`);
      fetchPendingItems();
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleLaunchLiveEvent = () => {
    setIsSelecting(true);
    setIsShaking(true);
  };

  const toggleShaking = () => {
    setIsSelecting(false);
    setIsShaking(false);
    setSelectedEvent(null);
    setSelectedList(null);
    setSelectedInvitation(null);
    setShowLaunchModal(false);
  };

  const handleLaunchSubmit = () => {
    router.push({
      pathname: '/live-event-prep',
      query: {
        eventId: selectedEvent.id,
        shoppingListId: selectedList.id,
        invitationId: selectedInvitation.id,
      },
    });
  };

  const triggerCelebration = () => {
    const rocket = document.querySelector('.rocket-animation');
    if (rocket) rocket.style.display = 'block';
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
  };

  const hasVolunteers = selectedInvitation && selectedList?.attributes.pqitems.some(item => item.isVolunteer);
  const guestCount = selectedInvitation ? (selectedInvitation.attributes.pqinvitationlist?.data?.length || 0) : 0;
  const volunteerCount = selectedList?.attributes.pqitems.filter(item => item.isVolunteer).reduce((sum, item) => sum + (item.quantity || 0), 0) || 0;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FAF3E0' }}>
      <div
        style={{
          display: 'flex',
          gap: '24px',
          transform: 'rotateZ(1deg)',
          transition: '0.3s',
          alignItems: 'center',
          borderRadius: '46px',
          justifyContent: 'space-between',
          backgroundColor: '#F5D1B0',
          padding: '48px 32px',
          width: '800px',
          maxWidth: '90%',
          boxShadow: '8px 8px 13px 0px #2b2a2a',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
        onMouseLeave={(e) => (e.currentTarget.style.transform = 'rotateZ(1deg)')}
      >
        <div
          style={{
            width: '100%',
            backgroundColor: '#FFFFFF',
            borderRadius: '46px',
            padding: '20px',
            transform: 'rotateZ(-2deg)',
            transition: '0.3s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'rotateZ(3deg)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'rotateZ(-2deg)')}
        >
          <h1 style={{ fontFamily: 'STIX Two Text', fontSize: '2rem', color: '#BF4408', textAlign: 'left', marginBottom: '20px' }}>Pending</h1>
          {errorMessage && <div style={{ color: 'red', fontSize: '1rem', marginBottom: '1rem', textAlign: 'center' }}>{errorMessage}</div>}
          {!isSelecting && (
            <button
              style={{
                backgroundColor: isShaking ? '#666' : '#FFFFFF',
                color: '#191818',
                padding: '12px 20px',
                fontSize: '16px',
                cursor: isShaking ? 'not-allowed' : 'pointer',
                borderRadius: '46px',
                border: '2px solid #191818',
                boxShadow: '2px 2px 5px rgba(0,0,0,0.2)',
                transition: '0.3s ease-in-out',
                position: 'absolute',
                top: '20px',
                right: '20px',
              }}
              onClick={handleLaunchLiveEvent}
              disabled={isShaking}
              onMouseEnter={(e) => !isShaking && (e.target.style.backgroundColor = '#FFAD61')}
              onMouseLeave={(e) => !isShaking && (e.target.style.backgroundColor = '#FFFFFF')}
            >
              🚀 Create Live Event
            </button>
          )}
          {isSelecting && isShaking && (
            <button
              style={{
                backgroundColor: '#666',
                color: 'white',
                padding: '12px 20px',
                fontSize: '16px',
                cursor: 'pointer',
                borderRadius: '46px',
                border: 'none',
                transition: '0.3s ease-in-out',
                position: 'absolute',
                top: '20px',
                right: '20px',
              }}
              onClick={toggleShaking}
              onMouseEnter={(e) => (e.target.style.backgroundColor = '#555')}
              onMouseLeave={(e) => (e.target.style.backgroundColor = '#666')}
            >
              Cancel
            </button>
          )}

          {[
            { title: 'Events', data: events, type: 'event', selected: selectedEvent },
            { title: 'Shopping Lists', data: shoppingLists, type: 'list', selected: selectedList },
            { title: 'Invitations', data: invitations, type: 'invitation', selected: selectedInvitation },
          ].map(({ title, data, type, selected }, index) => (
            <section key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: '40px', marginLeft: '20px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '10px', color: 'black' }}>{title}</h2>
              <div style={{ marginBottom: '15px' }} />
              <div style={{ display: 'flex', gap: '20px', overflow: 'hidden', justifyContent: 'center', marginTop: '20px', flexWrap: 'wrap' }}>
                {data.length > 0 ? (
                  data.map((item) => {
                    const isSelected = selected?.id === item.id;
                    const isGreyedOut =
                      (type === 'event' && selectedEvent && selectedEvent.id !== item.id) ||
                      (type === 'list' && selectedList && selectedList.id !== item.id) ||
                      (type === 'invitation' && selectedInvitation && selectedInvitation.id !== item.id);

                    return (
                      <div
                        key={item.id}
                        style={{
                          position: 'relative',
                          width: '250px',
                          height: '150px',
                          background: '#D4A373',
                          borderRadius: '46px',
                          transform: 'rotate(-5deg)',
                          transition: '0.3s ease-in-out',
                          border: '2px solid #191818',
                          boxShadow: '2px 2px 5px rgba(0,0,0,0.2)',
                          ...(isSelected || isGreyedOut ? {} : { background: '#FFAD61' }),
                        }}
                        onMouseEnter={(e) => !isSelected && !isGreyedOut && (e.target.style.transform = 'rotate(5deg) scale(1.05)')}
                        onMouseLeave={(e) => !isSelected && !isGreyedOut && (e.target.style.transform = 'rotate(-5deg)')}
                      >
                        <div
                          style={{
                            width: '100%',
                            height: '100%',
                            background: '#FFFFFF',
                            padding: '20px',
                            borderRadius: '46px',
                            boxShadow: '5px 5px 10px rgba(0,0,0,0.15)',
                            transform: 'rotate(2deg)',
                            transition: '0.3s ease-in-out',
                            cursor: 'pointer',
                            fontFamily: 'STIX Two Text, serif',
                            textAlign: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            position: 'relative',
                            ...(isSelecting && isShaking && !isSelected && !isGreyedOut ? { animation: 'tiltShake 0.4s ease-in-out infinite alternate', transformOrigin: 'center' } : {}),
                            ...(isSelected ? { backgroundColor: 'rgba(0,0,0,0.8)', color: 'white', transform: 'scale(1.1) rotate(2deg)', border: '2px solid white' } : {}),
                            ...(isGreyedOut ? { backgroundColor: 'rgba(211,211,211,0.7)', color: '#A0A0A0', cursor: 'not-allowed', transform: 'scale(0.95) rotate(2deg)', filter: 'grayscale(70%)' } : {}),
                          }}
                          onClick={() => !isGreyedOut && handleSelect(item, type)}
                        >
                          <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', gap: '5px' }}>
                            <span style={{ fontSize: '16px', cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); handleEdit(item, type); }}>✏️</span>
                            {type === 'event' && (
                              <span style={{ fontSize: '16px', cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); handleInviteCohost(item.id); }}>👥</span>
                            )}
                            <span style={{ fontSize: '16px', cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); handleDelete(item.id, type); }}>🗑️</span>
                          </div>
                          <h3 style={{ color: isSelected ? 'white' : 'black' }}>{item.attributes[type === 'event' ? 'pqeventname' : type === 'list' ? 'pqlistname' : 'pqgroupname'] || 'No Title'}</h3>
                          {type === 'event' && <p style={{ color: isSelected ? 'white' : 'black' }}>📅 {new Date(item.attributes.pqstartdate).toLocaleDateString()}</p>}
                          {type === 'list' && <p style={{ color: isSelected ? 'white' : 'black' }}>📅 Total: ${item.attributes.pqitems.reduce((sum, i) => sum + (i.totalcost || 0) * (i.quantity || 1), 0).toFixed(2)}</p>}
                          {type === 'invitation' && <p style={{ color: isSelected ? 'white' : 'black' }}>{guestCount > 0 ? `${guestCount} guests${volunteerCount > 0 ? `, ${volunteerCount} volunteer${volunteerCount > 1 ? 's' : ''}` : ''}` : 'Guest List'}</p>}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p style={{ textAlign: 'center', color: 'black', marginTop: '10px' }}>No pending {type.toLowerCase()} found.</p>
                )}
              </div>
            </section>
          ))}

          {(selectedEvent && selectedList && selectedInvitation) && showLaunchModal && (
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
              <div style={{ padding: '24px', backgroundColor: '#F5D1B0', borderRadius: '46px', textAlign: 'center', width: '600px', maxWidth: '90%' }}>
                <div style={{ padding: '24px', backgroundColor: '#FFFFFF', borderRadius: '46px', boxShadow: '8px 8px 13px #2b2a2a' }}>
                  <button onClick={() => { setShowLaunchModal(false); router.push('/pending-events'); }} style={{ position: 'absolute', top: '10px', right: '15px', background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: 'black' }}>✕</button>
                  <h2 style={{ fontFamily: 'STIX Two Text', fontWeight: '700', marginBottom: '1rem', color: 'black' }}>Ready to Launch Live Event?</h2>
                  <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <div style={{ position: 'relative', width: '250px', height: '150px', background: '#D4A373', borderRadius: '46px', transform: 'rotate(-5deg)', transition: '0.3s ease-in-out', background: '#FFAD61', border: '2px solid #191818', boxShadow: '2px 2px 5px rgba(0,0,0,0.2)' }}>
                      <div style={{ width: '100%', height: '100%', background: '#FFFFFF', padding: '20px', borderRadius: '46px', boxShadow: '5px 5px 10px rgba(0,0,0,0.15)', transform: 'rotate(2deg)', transition: '0.3s ease-in-out', fontFamily: 'STIX Two Text, serif', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                        <h3 style={{ color: 'black' }}>{selectedEvent.attributes.pqeventname || 'Event'}</h3>
                        <p style={{ color: 'black' }}>📅 {new Date(selectedEvent.attributes.pqstartdate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div style={{ position: 'relative', width: '250px', height: '150px', background: '#D4A373', borderRadius: '46px', transform: 'rotate(-5deg)', transition: '0.3s ease-in-out', background: '#FFAD61', border: '2px solid #191818', boxShadow: '2px 2px 5px rgba(0,0,0,0.2)' }}>
                      <div style={{ width: '100%', height: '100%', background: '#FFFFFF', padding: '20px', borderRadius: '46px', boxShadow: '5px 5px 10px rgba(0,0,0,0.15)', transform: 'rotate(2deg)', transition: '0.3s ease-in-out', fontFamily: 'STIX Two Text, serif', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                        <h3 style={{ color: 'black' }}>{selectedList.attributes.pqlistname || 'Shopping List'}</h3>
                        <p style={{ color: 'black' }}>📅 Total: ${selectedList.attributes.pqitems.reduce((sum, i) => sum + (i.totalcost || 0) * (i.quantity || 1), 0).toFixed(2)}</p>
                      </div>
                    </div>
                    <div style={{ position: 'relative', width: '250px', height: '150px', background: '#D4A373', borderRadius: '46px', transform: 'rotate(-5deg)', transition: '0.3s ease-in-out', background: '#FFAD61', border: '2px solid #191818', boxShadow: '2px 2px 5px rgba(0,0,0,0.2)' }}>
                      <div style={{ width: '100%', height: '100%', background: '#FFFFFF', padding: '20px', borderRadius: '46px', boxShadow: '5px 5px 10px rgba(0,0,0,0.15)', transform: 'rotate(2deg)', transition: '0.3s ease-in-out', fontFamily: 'STIX Two Text, serif', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                        <h3 style={{ color: 'black' }}>Guest List</h3>
                        <p style={{ color: 'black' }}>{guestCount > 0 ? `${guestCount} guests${volunteerCount > 0 ? `, ${volunteerCount} volunteer${volunteerCount > 1 ? 's' : ''}` : ''}` : 'Guest List'}</p>
                        {hasVolunteers && <span style={{ fontSize: '20px', cursor: 'pointer' }}>👥 Volunteer</span>}
                      </div>
                    </div>
                  </div>
                  <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
                    <button
                      style={{
                        padding: '0.75rem 2rem',
                        background: 'linear-gradient(90deg, #FFC78B 0%, #FFAD61 100%)',
                        color: '#191818',
                        border: '2px solid #191818',
                        boxShadow: '2px 2px 5px rgba(0,0,0,0.2)',
                        borderRadius: '46px',
                        cursor: 'pointer',
                        fontFamily: 'STIX Two Text',
                        margin: '0 5px',
                      }}
                      onClick={handleLaunchSubmit}
                      onMouseEnter={(e) => (e.target.style.color = '#FFFFFF')}
                      onMouseLeave={(e) => (e.target.style.color = '#191818')}
                    >
                      Launch Live Event
                    </button>
                    <button
                      style={{
                        padding: '0.75rem 2rem',
                        background: 'linear-gradient(90deg, #FFC78B 0%, #FFAD61 100%)',
                        color: '#191818',
                        border: '2px solid #191818',
                        boxShadow: '2px 2px 5px rgba(0,0,0,0.2)',
                        borderRadius: '46px',
                        cursor: 'pointer',
                        fontFamily: 'STIX Two Text',
                        margin: '0 5px',
                      }}
                      onClick={() => { setShowLaunchModal(false); router.push('/pending-events'); }}
                      onMouseEnter={(e) => (e.target.style.color = '#FFFFFF')}
                      onMouseLeave={(e) => (e.target.style.color = '#191818')}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <RocketAnimation
        className="rocket-animation"
        style={{ display: 'none', position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 3000 }}
      />
    </div>
  );
}