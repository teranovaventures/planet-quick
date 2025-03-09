import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { useRouter } from 'next/router';
import RocketAnimation from './RocketAnimation';

const Navbar = ({ user, setUser, setIsModalOpen }) => {
  const [eventsDropdownOpen, setEventsDropdownOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState(0);
  const [showNotificationAnimation, setShowNotificationAnimation] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (eventsDropdownOpen || moreDropdownOpen) {
        if (!event.target.closest('.events-dropdown-trigger') && eventsDropdownOpen) {
          setEventsDropdownOpen(false);
        }
        if (!event.target.closest('.more-dropdown-trigger') && moreDropdownOpen) {
          setMoreDropdownOpen(false);
        }
      }
      if (!event.target.closest('.profile-menu') && profileDropdownOpen) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [eventsDropdownOpen, moreDropdownOpen, profileDropdownOpen]);

  useEffect(() => {
    const updateNotifications = () => {
      const count = localStorage.getItem('notificationCount') || '0';
      const newCount = parseInt(count);
      setNotifications(newCount);
      if (newCount > notifications) {
        setShowNotificationAnimation(true);
      }
    };
    updateNotifications();
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      const count = localStorage.getItem('notificationCount') || '0';
      const newCount = parseInt(count);
      setNotifications(newCount);
      if (newCount > notifications) {
        setShowNotificationAnimation(true);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [notifications]);

  const handleSignOut = (e) => {
    e.preventDefault();
    localStorage.removeItem('user');
    localStorage.removeItem('jwt');
    localStorage.setItem('notificationCount', '0');
    localStorage.removeItem('notification');
    setNotifications(0);
    setUser(null);
    router.push('/');
  };

  const clearNotifications = () => {
    setNotifications(0);
    localStorage.setItem('notificationCount', '0');
    localStorage.removeItem('notification');
  };

  return (
    <header
      style={{
        top: 0,
        width: '100%',
        display: 'flex',
        zIndex: 1000,
        position: 'sticky',
        justifyContent: 'center',
        backgroundColor: '#FBFAF9',
        padding: '8px 24px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}
    >
      <div
        style={{
          width: '100%',
          display: 'flex',
          maxWidth: '1144px',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Link href="/">
          <img
            alt="Planet Quick Logo"
            src="http://localhost:1337/uploads/pqlogo.png"
            style={{
              width: '103px',
              height: '78px',
              objectFit: 'cover',
              borderRadius: '46px',
            }}
            onError={(e) => {
              console.error('Logo failed to load. Check if Strapi is running and file exists.');
              e.target.src = '/fallback-logo.png';
            }}
          />
        </Link>

        <div
          style={{
            flex: 1,
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <nav
            style={{
              gap: '32px',
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              marginLeft: '32px',
            }}
          >
            <div style={{ position: 'relative' }}>
              <Link href="/" style={{ textDecoration: 'none' }}>
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
                  Home
                </span>
              </Link>
            </div>

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
                    left: '-64px',
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
                  onClick={() => router.push('/sign-up')}
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

Navbar.defaultProps = {
  imageAlt: 'Logo alt text',
  imageSrc: '/tera%20nova%20logo-400h-1500h.webp',
  setIsModalOpen: () => {},
};

Navbar.propTypes = {
  imageAlt: PropTypes.string,
  imageSrc: PropTypes.string,
  setIsModalOpen: PropTypes.func,
  user: PropTypes.object,
  setUser: PropTypes.func,
};

export default Navbar;