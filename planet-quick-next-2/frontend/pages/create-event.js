import React, { useState, useEffect } from 'react';
import Autocomplete from 'react-google-autocomplete';
import { useRouter } from 'next/router';
import confetti from 'canvas-confetti';
import RocketAnimation from '../components/RocketAnimation';

export default function CreateEventPage() {
  const [eventName, setEventName] = useState('');
  const [eventAddress, setEventAddress] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [isDateTimeSet, setIsDateTimeSet] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showDateModal, setShowDateModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showNextStepModal, setShowNextStepModal] = useState(false);
  const [showContent, setShowContent] = useState(true);
  const router = useRouter();

  const STRAPI_API_URL = 'http://localhost:1337/api/pqevents';
  const STRAPI_API_TOKEN = '76e1da1b6c27d1c452b2de5248d6432e1a83ebd112ded6abc3773a0f80244dc865054434af3067cd4c9e18c658ac4815f8b12dfaf91ae9cc545afd4c001ee6007d7ce3e63b712a9a10b6968669276b0cd69b6b7118be8a0d122f322eeaa5391107a2856181dfd4bd58fb9984da48f7c5c241352b8a67724bb916e982e4af8b19';

  const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || '{}') : {};

  useEffect(() => {
    if (!user || !user.id) {
      setErrorMessage('Please log in to create an event.');
      router.push('/login');
    }
  }, [user, router]);

  const handleCreateEvent = async () => {
    setErrorMessage('');
    if (!user || !user.id) {
      setErrorMessage('Please log in to create an event.');
      router.push('/login');
      return;
    }
    if (!eventName || !eventAddress || !eventDate || !eventTime) {
      setErrorMessage('Please fill out all required fields.');
      return;
    }

    const eventDateTime = new Date(`${eventDate}T${eventTime}:00`);
    const eventData = {
      data: {
        pqeventname: eventName,
        pqeventstatus: 'pending',
        pqstartdate: eventDateTime.toISOString().split('T')[0],
        pqdescription: '',
        pqenddate: eventDateTime.toISOString().split('T')[0],
        pqcreatedat: new Date().toISOString().split('T')[0],
        pqupdatedat: new Date().toISOString().split('T')[0],
        pqlocation: eventAddress,
        pqcoordinator: user.id,
      },
    };

    console.log('📡 Sending event data to Strapi:', JSON.stringify(eventData, null, 2));
    const res = await fetch(STRAPI_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${STRAPI_API_TOKEN}` },
      body: JSON.stringify(eventData),
    });
    const json = await res.json();
    console.log('Response data:', JSON.stringify(json, null, 2));

    if (!res.ok) {
      console.error('🚨 Error creating event in Strapi:', json);
      setErrorMessage(json.error?.message || 'Failed to create event.');
      return;
    }

    const eventId = json.data.id;
    console.log('✅ Event Created with ID:', eventId);

    const updateUserProfile = async () => {
      const res = await fetch(`http://localhost:1337/api/pqusers/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${STRAPI_API_TOKEN}` },
        body: JSON.stringify({ data: { pqeventstats: { pqtotalevents: (user.pqeventstats?.pqtotalevents || 0) + 1 } } }),
      });
      if (!res.ok) console.error('Failed to update user profile');
    };
    await updateUserProfile();

    // Check for pending events
    const pendingRes = await fetch(`${STRAPI_API_URL}?filters[pqcoordinator][id][$eq]=${user.id}&filters[pqeventstatus][$eq]=pending`, {
      headers: { Authorization: `Bearer ${STRAPI_API_TOKEN}` },
    });
    const pendingData = await pendingRes.json();
    if (pendingData.data && pendingData.data.length > 1) { // More than the just-created event
      setShowNextStepModal(true);
    } else {
      setShowSuccessModal(true);
    }
  };

  const triggerCelebration = () => {
    const rocket = document.querySelector('.rocket-animation');
    if (rocket) rocket.style.display = 'block';
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
  };

  const handleRedirect = (destination) => {
    setShowSuccessModal(false);
    setShowNextStepModal(false);
    setShowContent(false);
    triggerCelebration();
    setTimeout(() => {
      if (destination === '/') {
        const currentNotifications = parseInt(localStorage.getItem('notificationCount') || '0');
        localStorage.setItem('notificationCount', (currentNotifications + 1).toString());
        localStorage.setItem('notification', 'You have a pending event!');
      }
      router.push(destination);
    }, 1000);
  };

  const handleConfirmDateTime = () => {
    if (!eventDate || !eventTime) {
      setErrorMessage('Please select a valid date and time.');
      return;
    }
    setIsDateTimeSet(true);
    setShowDateModal(false);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FAF3E0' }}>
      {showContent && (
        <div style={{ display: 'flex', gap: '24px', transform: 'rotateZ(1deg)', transition: '0.3s', alignItems: 'center', borderRadius: '46px', justifyContent: 'space-between', backgroundColor: '#F5D1B0', padding: '24px' }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'rotateZ(1deg)')}>
          <div style={{ width: '100%', display: 'flex', transform: 'rotateZ(-2deg)', alignItems: 'center', borderRadius: '46px', justifyContent: 'space-between', backgroundColor: '#FFFFFF', padding: '48px 32px', boxShadow: '8px 8px 13px 0px #2b2a2a', transition: '0.3s' }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'rotateZ(3deg)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'rotateZ(-2deg)')}>
            <div style={{ gap: '16px', display: 'flex', flexDirection: 'column', width: '100%' }}>
              <h2 style={{ fontSize: '35px', fontFamily: 'STIX Two Text', fontWeight: 600, lineHeight: 1.5, margin: 0 }}>Create Your Event</h2>
              {errorMessage && <div style={{ color: 'red', fontSize: '0.9rem', marginBottom: '0.5rem', textAlign: 'center' }}>{errorMessage}</div>}

              <label style={{ fontWeight: 'bold', textAlign: 'left', marginBottom: '0.5rem' }}>Event Name</label>
              <input type="text" value={eventName} onChange={(e) => setEventName(e.target.value)} placeholder="e.g. 'Star Party'" style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '8px', width: '100%', marginBottom: '0.5rem' }} />

              <label style={{ fontWeight: 'bold', textAlign: 'left', marginBottom: '0.5rem' }}>Event Address</label>
              <Autocomplete apiKey="YOUR_GOOGLE_PLACES_API_KEY" onPlaceSelected={(place) => setEventAddress(place.formatted_address)} options={{ types: ['establishment', 'geocode'], componentRestrictions: { country: 'us' } }} style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '0.5rem' }} placeholder="Type place name or address" />

              {isDateTimeSet ? (
                <div className="event-details" style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#444', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', borderRadius: '8px', backgroundColor: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} onMouseEnter={(e) => (e.currentTarget.style.transform = 'rotateZ(3deg)')} onMouseLeave={(e) => (e.currentTarget.style.transform = 'rotateZ(0deg)')}>
                  <strong>Event Date/Time:</strong> {new Date(`${eventDate}T${eventTime}`).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true })}
                  <button style={{ fontSize: '0.85rem', color: '#333', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => setShowDateModal(true)}>Edit</button>
                </div>
              ) : (
                <button style={{ padding: '0.5rem 1rem', border: '2px solid #BF4408', borderRadius: '46px', backgroundColor: '#FFFFFF', color: '#BF4408', cursor: 'pointer', fontSize: '14px', width: 'auto' }} onClick={() => setShowDateModal(true)} onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FBFAF9')} onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FFFFFF')}>Set Date/Time</button>
              )}

              <button style={{ padding: '0.5rem 1rem', borderRadius: '46px', background: 'linear-gradient(90deg, #FFC78B 0%, #FFAD61 100%)', color: '#191818', fontWeight: '700', border: 'none', cursor: 'pointer', fontSize: '14px', width: '150px', alignSelf: 'center' }} onClick={handleCreateEvent} onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')} onMouseLeave={(e) => (e.currentTarget.style.color = '#191818')}>Create Event</button>
            </div>
          </div>
        </div>
      )}

      {showDateModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }} onClick={() => setShowDateModal(false)}>
          <div style={{ background: '#FFFFFF', padding: '2rem', borderRadius: '46px', width: '400px', maxWidth: '90%', textAlign: 'center', position: 'relative', boxShadow: '8px 8px 13px 0px #2b2a2a' }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginTop: 0, marginBottom: '16px', fontSize: '26px', fontFamily: 'STIX Two Text', fontWeight: 600, lineHeight: 1.5 }}>Set Event Date/Time</h3>
            <label style={{ fontWeight: 'bold', marginTop: '1rem', marginBottom: '0.5rem' }}>Event Date</label>
            <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '8px', width: '100%', marginBottom: '0.5rem' }} />
            <label style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Event Time</label>
            <input type="time" value={eventTime} onChange={(e) => setEventTime(e.target.value)} style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '8px', width: '100%', marginBottom: '1rem' }} />
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <button style={{ padding: '0.5rem 1rem', border: '2px solid #BF4408', borderRadius: '46px', backgroundColor: '#FFFFFF', color: '#BF4408', cursor: 'pointer', fontSize: '14px' }} onClick={() => setShowDateModal(false)} onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FBFAF9')} onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FFFFFF')}>Cancel</button>
              <button style={{ padding: '0.5rem 1rem', borderRadius: '46px', background: 'linear-gradient(90deg, #FFC78B 0%, #FFAD61 100%)', color: '#191818', fontWeight: '700', border: 'none', cursor: 'pointer', fontSize: '14px' }} onClick={handleConfirmDateTime} onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')} onMouseLeave={(e) => (e.currentTarget.style.color = '#191818')}>Confirm</button>
            </div>
          </div>
        </div>
      )}

      {showSuccessModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
          <div style={{ background: '#FFFFFF', padding: '2rem', borderRadius: '46px', textAlign: 'center', width: '550px', height: 'auto', position: 'relative', boxShadow: '8px 8px 13px 0px #2b2a2a' }}>
            <button style={{ position: 'absolute', top: '10px', right: '15px', background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: 'black' }} onClick={() => handleRedirect('/')}>✕</button>
            <h2 style={{ marginTop: 0, marginBottom: '16px', fontSize: '35px', fontFamily: 'STIX Two Text', fontWeight: 600, lineHeight: 1.5 }}>Event Created! 🎉</h2>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '20px' }}>
              <button style={{ padding: '0.5rem 1rem', borderRadius: '46px', background: 'linear-gradient(90deg, #FFC78B 0%, #FFAD61 100%)', color: '#191818', fontWeight: '700', border: 'none', cursor: 'pointer', fontSize: '14px' }} onClick={() => handleRedirect('/create-shopping-list')} onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')} onMouseLeave={(e) => (e.currentTarget.style.color = '#191818')}>🛒 Go Shop</button>
              <button style={{ padding: '0.5rem 1rem', border: '2px solid #BF4408', borderRadius: '46px', backgroundColor: '#FFFFFF', color: '#BF4408', cursor: 'pointer', fontSize: '14px' }} onClick={() => handleRedirect('/create-group')} onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FBFAF9')} onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FFFFFF')}>🎟 Invite Guests</button>
            </div>
          </div>
        </div>
      )}

      {showNextStepModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
          <div style={{ background: '#FFFFFF', padding: '2rem', borderRadius: '46px', textAlign: 'center', width: '550px', height: 'auto', position: 'relative', boxShadow: '8px 8px 13px 0px #2b2a2a' }}>
            <button style={{ position: 'absolute', top: '10px', right: '15px', background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: 'black' }} onClick={() => handleRedirect('/')}>✕</button>
            <h2 style={{ marginTop: 0, marginBottom: '16px', fontSize: '35px', fontFamily: 'STIX Two Text', fontWeight: 600, lineHeight: 1.5 }}>Next Step</h2>
            <p>You have a pending event. What would you like to do?</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '20px' }}>
              <button style={{ padding: '0.5rem 1rem', borderRadius: '46px', background: 'linear-gradient(90deg, #FFC78B 0%, #FFAD61 100%)', color: '#191818', fontWeight: '700', border: 'none', cursor: 'pointer', fontSize: '14px' }} onClick={() => handleRedirect('/create-shopping-list')} onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')} onMouseLeave={(e) => (e.currentTarget.style.color = '#191818')}>🛒 Go Shop</button>
              <button style={{ padding: '0.5rem 1rem', border: '2px solid #BF4408', borderRadius: '46px', backgroundColor: '#FFFFFF', color: '#BF4408', cursor: 'pointer', fontSize: '14px' }} onClick={() => handleRedirect('/create-group')} onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FBFAF9')} onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FFFFFF')}>🎟 Invite Guests</button>
            </div>
          </div>
        </div>
      )}

      <RocketAnimation className="rocket-animation" style={{ display: 'none', position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 3000 }} />
      <style jsx>{`
        @keyframes fadeIn { 0% { opacity: 0; transform: scale(0.9); } 100% { opacity: 1; transform: scale(1); } }
      `}</style>
    </div>
  );
}