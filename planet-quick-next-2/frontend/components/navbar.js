import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Router from 'next/router';
import RocketAnimation from './RocketAnimation';

const Navbar = ({ user, setUser, setIsModalOpen, notificationCount, notificationMessage, clearNotifications }) => {
  const [eventsDropdownOpen, setEventsDropdownOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState(0);
  const [showNotificationAnimation, setShowNotificationAnimation] = useState(false);

  useEffect(() => {
    const fetchPendingEvents = async () => {
      try {
        const res = await fetch('/api/events');
        if (!res.ok) {
          const errorText = await res.text();
          console.error('API Response:', errorText);
          throw new Error('Failed to fetch events');
        }
        const data = await res.json();
        const pendingEvents = data.data.filter(e => e.status === 'pending');
        setNotifications(pendingEvents.length);
      } catch (err) {
        console.error('Failed to fetch pending events:', err);
        setNotifications(0); // Default to 0 if fetch fails
      }
    };
    fetchPendingEvents();
    const interval = setInterval(fetchPendingEvents, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (notificationCount > 0) {
      setShowNotificationAnimation(true);
      setTimeout(() => setShowNotificationAnimation(false), 3000);
    }
  }, [notificationCount]);

  const handleSignOut = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('jwt');
    clearNotifications();
    Router.push('/');
  };

  return (
    <header>
      <div
        style={{
          width: '100%',
          display: 'flex',
          zIndex: 1000,
          position: 'sticky',
          paddingTop: '24px',
          paddingBottom: '24px',
          justifyContent: 'center',
          backgroundColor: '#FFFFFF',
        }}
      >
        <div
          style={{
            width: '100%',
            display: 'flex',
            maxWidth: '1144px',
            alignItems: 'center',
            paddingLeft: '24px',
            paddingRight: '24px',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <Link href="/">
  <Image src="/logo.png" alt="PlanetQuick Logo" width={90} height={85} style={{ borderRadius: '46px' }} />
</Link>
            <nav style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              <Link href="/">
                <span
                  style={{
                    fontSize: '16px',
                    fontFamily: 'Titillium Web',
                    fontWeight: 600,
                    color: '#BF4408',
                    cursor: 'pointer',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#E65103')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#BF4408')}
                >
                  Home
                </span>
              </Link>
              <div
                className="events-dropdown-trigger"
                onClick={(e) => {
                  e.stopPropagation();
                  if (moreDropdownOpen) setMoreDropdownOpen(false);
                  setEventsDropdownOpen(!eventsDropdownOpen);
                }}
                style={{ position: 'relative' }}
              >
                <span
                  style={{
                    fontSize: '16px',
                    fontFamily: 'Titillium Web',
                    fontWeight: 600,
                    color: '#BF4408',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#E65103')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#BF4408')}
                >
                  Events <span style={{ fontSize: '12px' }}>▼</span>
                </span>
                {eventsDropdownOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 8px)',
                      left: '-128px',
                      backgroundColor: '#FBFAF9',
                      border: '1px solid #BF4408',
                      borderRadius: '8px',
                      padding: '0.5rem',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'flex-start',
                      width: '400px',
                      zIndex: 999,
                    }}
                  >
                    <Link href="/create-event">
                      <span
                        style={{
                          padding: '0.5rem 1rem',
                          textDecoration: 'none',
                          color: '#BF4408',
                          fontSize: '14px',
                          fontFamily: 'Titillium Web',
                          textAlign: 'center',
                          borderRadius: '6px',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F5D1B0')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        Create Event
                      </span>
                    </Link>
                    <Link href="/create-shopping-list">
                      <span
                        style={{
                          padding: '0.5rem 1rem',
                          textDecoration: 'none',
                          color: '#BF4408',
                          fontSize: '14px',
                          fontFamily: 'Titillium Web',
                          textAlign: 'center',
                          borderRadius: '6px',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F5D1B0')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        Shopping List
                      </span>
                    </Link>
                    <Link href="/create-group">
                      <span
                        style={{
                          padding: '0.5rem 1rem',
                          textDecoration: 'none',
                          color: '#BF4408',
                          fontSize: '14px',
                          fontFamily: 'Titillium Web',
                          textAlign: 'center',
                          borderRadius: '6px',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F5D1B0')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        Create Invitations
                      </span>
                    </Link>
                  </div>
                )}
              </div>

              <div
                className="more-dropdown-trigger"
                onClick={(e) => {
                  e.stopPropagation();
                  if (eventsDropdownOpen) setEventsDropdownOpen(false);
                  setMoreDropdownOpen(!moreDropdownOpen);
                }}
                style={{ position: 'relative' }}
              >
                <span
                  style={{
                    fontSize: '16px',
                    fontFamily: 'Titillium Web',
                    fontWeight: 600,
                    color: '#BF4408',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#E65103')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#BF4408')}
                >
                  More <span style={{ fontSize: '12px' }}>▼</span>
                </span>
                {moreDropdownOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 8px)',
                      left: '-128px',
                      backgroundColor: '#FBFAF9',
                      border: '1px solid #BF4408',
                      borderRadius: '8px',
                      padding: '0.5rem',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'flex-start',
                      width: '400px',
                      zIndex: 999,
                    }}
                  >
                    <Link href="/pending-events">
                      <span
                        style={{
                          padding: '0.5rem 1rem',
                          textDecoration: 'none',
                          color: '#BF4408',
                          fontSize: '14px',
                          fontFamily: 'Titillium Web',
                          textAlign: 'center',
                          borderRadius: '6px',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F5D1B0')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        Pending Events
                      </span>
                    </Link>
                    <Link href="/reports">
                      <span
                        style={{
                          padding: '0.5rem 1rem',
                          textDecoration: 'none',
                          color: '#BF4408',
                          fontSize: '14px',
                          fontFamily: 'Titillium Web',
                          textAlign: 'center',
                          borderRadius: '6px',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F5D1B0')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        Reporting
                      </span>
                    </Link>
                    <Link href="/profile">
                      <span
                        style={{
                          padding: '0.5rem 1rem',
                          textDecoration: 'none',
                          color: '#BF4408',
                          fontSize: '14px',
                          fontFamily: 'Titillium Web',
                          textAlign: 'center',
                          borderRadius: '6px',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F5D1B0')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        Profile
                      </span>
                    </Link>
                  </div>
                )}
              </div>
            </nav>
          </div>

          <div style={{ gap: '16px', display: 'flex', alignItems: 'center' }}>
            {showNotificationAnimation && <RocketAnimation message="You’ve got a notification" />}
            {!user ? (
              <>
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
                  onClick={() => Router.push('/sign-up')}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#191818')}
                >
                  Get Started
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
                  onClick={() => setIsModalOpen(true)}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FBFAF9')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FFFFFF')}
                >
                  Sign In
                </button>
              </>
            ) : (
              <>
                <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => alert(localStorage.getItem('notification') || 'No notifications')}>
                  <span style={{ fontSize: '40px', color: '#BF4408' }}>🚀</span>
                  {notifications > 0 && (
                    <span
                      style={{
                        position: 'absolute',
                        top: '-5px',
                        right: '-5px',
                        backgroundColor: '#E65103',
                        color: 'white',
                        borderRadius: '50%',
                        padding: '2px 8px',
                        fontSize: '14px',
                      }}
                    >
                      {notifications}
                    </span>
                  )}
                </div>
                {notifications > 0 && (
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
                    onClick={clearNotifications}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FBFAF9')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FFFFFF')}
                  >
                    Clear Notifications
                  </button>
                )}
                <div
                  className="profile-menu"
                  onMouseEnter={() => setProfileDropdownOpen(true)}
                  onMouseLeave={() => setProfileDropdownOpen(false)}
                  style={{
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <i
                    className="fa-sharp fa-solid fa-chalkboard-user fa-flip-horizontal fa-lg"
                    style={{ fontSize: '40px', color: '#BF4408' }}
                  ></i>
                  {profileDropdownOpen && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '100%',
                        background: '#FBFAF9',
                        borderRadius: '8px',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                        width: '150px',
                        display: 'flex',
                        flexDirection: 'column',
                        padding: '10px',
                        zIndex: 999,
                      }}
                    >
                      <a
                        href="#"
                        onClick={handleSignOut}
                        style={{
                          padding: '6px',
                          textDecoration: 'none',
                          color: '#BF4408',
                          fontSize: '14px',
                          fontFamily: 'Titillium Web',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F5D1B0')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        Sign Out
                      </a>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;