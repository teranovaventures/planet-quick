import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import RocketAnimation from '../components/RocketAnimation';
import confetti from 'canvas-confetti';

export default function CreateEventPage({ user }) {
  const [eventName, setEventName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!user || !user.id) {
      setErrorMessage('Please log in to create an event.');
      router.push('/sign-in');
    }
  }, [user, router]);

  const handleCreateEvent = async () => {
    if (!eventName || !startDate || !endDate) {
      setErrorMessage('Please fill in all fields.');
      return;
    }

    if (new Date(startDate) >= new Date(endDate)) {
      setErrorMessage('End date must be after start date.');
      return;
    }

    const eventData = {
      eventName,
      startDate,
      endDate,
      status: 'pending',
      coordinator: user.id,
    };

    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) throw new Error('Failed to create event');
      const responseData = await response.json();
      const eventId = responseData.data._id;

      setShowSuccessModal(true);
      localStorage.setItem('lastCreatedEventId', eventId);
    } catch (error) {
      setErrorMessage('Server error: ' + error.message);
    }
  };

  const triggerCelebration = () => {
    const rocket = document.querySelector('.rocket-animation');
    if (rocket) rocket.style.display = 'block';
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
  };

  const handleRedirect = (destination) => {
    setShowSuccessModal(false);
    triggerCelebration();
    setTimeout(() => {
      router.push(destination).then(() => {
        if (destination === '/') {
          const currentNotifications = parseInt(localStorage.getItem('notificationCount') || '0');
          localStorage.setItem('notificationCount', (currentNotifications + 1).toString());
          localStorage.setItem('notification', 'You have a pending event!');
        }
      });
    }, 1000);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(90deg, rgb(192, 36, 37) 0%, rgba(240, 134, 53, 0.04) 100%)', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
      <div style={{ display: 'flex', width: '90%', maxWidth: '1200px', gap: '24px', transform: 'rotateZ(1deg)', transition: '0.3s' }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
        onMouseLeave={(e) => (e.currentTarget.style.transform = 'rotateZ(1deg)')}>
        <div style={{ flex: 2, padding: '40px', backgroundColor: '#F5D1B0', borderRadius: '46px' }}>
          <div style={{ padding: '48px 32px', backgroundColor: '#FFFFFF', borderRadius: '46px', boxShadow: '8px 8px 13px #2b2a2a', transition: '0.3s', minHeight: '600px', transform: 'rotateZ(-2deg)' }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'rotateZ(3deg)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'rotateZ(-2deg)')}>
            <h2 style={{ fontSize: '35px', fontFamily: 'STIX Two Text', fontWeight: 600, lineHeight: '1.5', margin: '0' }}>Create Event</h2>
            {errorMessage && <div style={{ color: 'red', fontSize: '0.9rem', marginBottom: '0.5rem', textAlign: 'center', fontFamily: 'STIX Two Text' }}>{errorMessage}</div>}
            <div style={{ marginTop: '2rem' }}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontFamily: 'STIX Two Text', fontSize: '1.1rem', display: 'block', marginBottom: '0.5rem' }}>Event Name</label>
                <input
                  type="text"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  placeholder="Enter event name"
                  style={{ padding: '0.5rem', border: '2px solid #191818', borderRadius: '8px', width: '100%', fontFamily: 'STIX Two Text', boxShadow: '2px 2px 5px rgba(0,0,0,0.2)' }}
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontFamily: 'STIX Two Text', fontSize: '1.1rem', display: 'block', marginBottom: '0.5rem' }}>Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  style={{ padding: '0.5rem', border: '2px solid #191818', borderRadius: '8px', width: '100%', fontFamily: 'STIX Two Text', boxShadow: '2px 2px 5px rgba(0,0,0,0.2)' }}
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontFamily: 'STIX Two Text', fontSize: '1.1rem', display: 'block', marginBottom: '0.5rem' }}>End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  style={{ padding: '0.5rem', border: '2px solid #191818', borderRadius: '8px', width: '100%', fontFamily: 'STIX Two Text', boxShadow: '2px 2px 5px rgba(0,0,0,0.2)' }}
                />
              </div>
              <button
                onClick={handleCreateEvent}
                style={{
                  padding: '0.75rem 2rem',
                  borderRadius: '46px',
                  background: 'linear-gradient(90deg, #FFC78B 0%, #FFAD61 100%)',
                  color: '#191818',
                  fontWeight: '700',
                  border: 'none',
                  cursor: 'pointer',
                  width: '100%',
                  fontFamily: 'STIX Two Text',
                  boxShadow: '2px 2px 5px rgba(0,0,0,0.2)',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#191818')}
              >
                Create Event
              </button>
            </div>
          </div>
        </div>
      </div>

      {showSuccessModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
          <div style={{ background: '#FFFFFF', padding: '2rem', borderRadius: '46px', textAlign: 'center', width: '550px', height: 'auto', position: 'relative', boxShadow: '8px 8px 13px 0px #2b2a2a' }}>
            <button style={{ position: 'absolute', top: '10px', right: '15px', background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: 'black' }} onClick={() => handleRedirect('/')}>✕</button>
            <h2 style={{ marginTop: 0, marginBottom: '16px', fontSize: '35px', fontFamily: 'STIX Two Text', fontWeight: 600, lineHeight: 1.5 }}>Event Created! 🎉</h2>
            <p style={{ fontFamily: 'STIX Two Text' }}>{eventName}</p>
            <p style={{ fontFamily: 'STIX Two Text', fontWeight: '700' }}>
              {new Date(startDate).toLocaleDateString()} - {new Date(endDate).toLocaleDateString()}
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '20px' }}>
              <button
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '46px',
                  background: 'linear-gradient(90deg, #FFC78B 0%, #FFAD61 100%)',
                  color: '#191818',
                  fontWeight: '700',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
                onClick={() => handleRedirect('/create-shopping-list')}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#191818')}
              >
                Create Shopping List
              </button>
              <button
                style={{
                  padding: '0.5rem 1rem',
                  border: '2px solid #BF4408',
                  borderRadius: '46px',
                  backgroundColor: '#FFFFFF',
                  color: '#BF4408',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
                onClick={() => handleRedirect('/create-group')}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FBFAF9')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FFFFFF')}
              >
                🎟 Invite Guests
              </button>
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