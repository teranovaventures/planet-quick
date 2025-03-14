import { useEffect, useState, Fragment } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import Eventslist from '../components/eventslist';
import Footer from '../components/footer';
import { useRouter } from 'next/router';

export default function Home({ user }) {
  const router = useRouter();
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(false);
  const [notification, setNotification] = useState('');
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (router.query.welcome) {
      setShowWelcomeMessage(true);
    }
    const storedNotification = localStorage.getItem('notification');
    if (storedNotification) {
      setNotification(storedNotification);
      localStorage.removeItem('notification');
    }
    fetchEvents();
  }, [router.query]);

  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/events');
      if (!res.ok) {
        const errorText = await res.text();
        console.error('API Response:', errorText);
        throw new Error('Failed to fetch events');
      }
      const data = await res.json();
      setEvents(data.data || []);
    } catch (err) {
      console.error('Failed to fetch events:', err);
    }
  };

  return (
    <>
      <div className="time-machine-container1">
        <Head>
          <title>Planet-Quick</title>
          <meta property="og:title" content="Planet-Quick" />
        </Head>

        {/* Notification for Pending Event */}
        {notification && (
          <div
            style={{
              position: 'fixed',
              top: '80px',
              right: '20px',
              background: '#F5D1B0',
              padding: '15px',
              borderRadius: '46px',
              boxShadow: '8px 8px 13px 0px #2b2a2a',
              zIndex: 1000,
              color: '#BF4408',
              display: 'flex',
              alignItems: 'center',
              fontFamily: 'STIX Two Text, serif',
            }}
          >
            <span>{notification}</span>
            <button
              onClick={() => setNotification('')}
              style={{
                marginLeft: '10px',
                background: 'none',
                border: 'none',
                color: '#BF4408',
                cursor: 'pointer',
                fontSize: '20px',
              }}
            >
              ✕
            </button>
          </div>
        )}

        {/* Header with Logo and Heading */}
        <div className="header-container">
          <Image
            src="/logo.png"
            alt="PlanetQuick Astronaut Logo"
            className="logo"
            width={200}
            height={200}
            style={{ borderRadius: '46px', objectFit: 'cover' }}
          />
          <h2 className="party-heading">Let’s Get this Party Started!</h2>
        </div>

        {/* Tiles Section */}
        <div className="tiles-column">
          <Link href="/create-event" passHref legacyBehavior>
            <a className="tile-link tile-top">
              <div className="createevents-accent2-bg">
                <div className="createevents-accent1-bg">
                  <div className="createevents-container2">
                    <div className="createevents-content">
                      <span className="thq-heading-2">Create Event</span>
                      <p className="thq-body-large">
                        Create an Event, attach your Shopping List, and invite your Guests
                      </p>
                    </div>
                    <div className="createevents-actions">
                      <button type="button" className="thq-button-filled createevents-button">
                        <span>Create Event</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </a>
          </Link>

          <Link href="/create-shopping-list" passHref legacyBehavior>
            <a className="tile-link tile-middle">
              <div className="createevents-accent2-bg">
                <div className="createevents-accent1-bg">
                  <div className="createevents-container2">
                    <div className="createevents-content">
                      <span className="thq-heading-2">Pick Items for Purchase & Delivery</span>
                      <p className="thq-body-large">
                        Build your shopping list and attach it to your event(s).
                      </p>
                    </div>
                    <div className="createevents-actions">
                      <button type="button" className="thq-button-filled createevents-button">
                        <span>Shopping List</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </a>
          </Link>

          <Link href="/create-group" passHref legacyBehavior>
            <a className="tile-link tile-bottom">
              <div className="createevents-accent2-bg">
                <div className="createevents-accent1-bg">
                  <div className="createevents-container2">
                    <div className="createevents-content">
                      <span className="thq-heading-2">Build & Invite your Group</span>
                      <p className="thq-body-large">
                        Create a group and add guests quickly, customizing your community.
                      </p>
                    </div>
                    <div className="createevents-actions">
                      <button type="button" className="thq-button-filled createevents-button">
                        <span>Build Group</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </a>
          </Link>
        </div>

        {/* Events List Section */}
        <Eventslist heading1={<Fragment><span>Active Events</span></Fragment>} user={user} />

        {/* Footer */}
        <Footer
          link1={<Fragment><span>About Us</span></Fragment>}
          link2={<Fragment><span>Contact Us</span></Fragment>}
          link3={<Fragment><span>FAQ</span></Fragment>}
          link4={<Fragment><span>Terms of Service</span></Fragment>}
          link5={<Fragment><span>Privacy Policy</span></Fragment>}
          logoSrc="/tera%20nova%20logo-400h-1500h.webp"
        />

        {/* Welcome Popup */}
        {showWelcomeMessage && (
          <div className="welcome-popup">
            <p>Congratulations! You're all signed up.</p>
            <button onClick={() => setShowWelcomeMessage(false)}>Close</button>
          </div>
        )}
      </div>

      <style jsx>{`
        .welcome-popup {
          position: fixed;
          top: 20px;
          right: 20px;
          background: white;
          padding: 15px;
          border-radius: 46px;
          box-shadow: 8px 8px 13px 0px #2b2a2a;
          z-index: 1000;
          display: flex;
          align-items: center;
          font-family: 'STIX Two Text, serif';
        }
        .welcome-popup button {
          margin-left: 10px;
          background: none;
          border: none;
          color: #BF4408;
          cursor: pointer;
          font-size: 20px;
        }
        .time-machine-container1 {
          width: 100%;
          display: flex;
          min-height: 100vh;
          align-items: center;
          flex-direction: column;
          background-size: cover;
          background-image: linear-gradient(
              90deg,
              rgb(192, 36, 37) 0%,
              rgba(240, 134, 53, 0.04) 100%
            ),
            url('https://play.teleporthq.io/static/svg/.svg');
        }
        .header-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 2rem 0;
          overflow: hidden; /* Forces border-radius on child */
        }
        .logo {
          width: 200px;
          height: auto;
          border-radius: 46px; /* Ensure 46px radius */
          box-shadow: 8px 8px 13px 0px #2b2a2a; /* Matching tile shadow */
          transform: rotate(5deg); /* Slight tilt to the right */
          transition: transform 0.3s ease; /* Smooth transition for hover */
          object-fit: cover; /* Ensures image fits within rounded bounds */
        }
        .logo:hover {
          transform: rotate(0deg); /* Tilts back on hover */
        }
        .party-heading {
          font-family: 'STIX Two Text, serif';
          font-size: 36px;
          font-weight: 700;
          color: #191818;
          margin-top: 1rem;
        }
        .tiles-column {
          display: flex;
          flex-direction: column;
          gap: 4rem; /* Increased spacing between tiles */
          margin: 3rem 0;
          align-items: center;
        }
        .tile-link {
          display: block;
          color: #191818;
          text-decoration: none;
        }
        .createevents-accent2-bg {
          gap: var(--dl-space-space-oneandhalfunits);
          display: flex;
          transition: 0.3s;
          align-items: center;
          justify-content: space-between;
          background-color: #F5D1B0;
          border-radius: 46px;
          box-shadow: 8px 8px 13px 0px #2b2a2a; /* Added shadow */
        }
        .createevents-accent2-bg:hover {
          transform: scale3d(1.02, 1.02, 1.02);
        }
        .createevents-accent1-bg {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background-color: #FFFFFF;
          border-radius: 46px;
        }
        .createevents-container2 {
          gap: var(--dl-space-space-threeunits);
          width: 800px; /* Kept as requested */
          height: 165px; /* Kept as requested */
          display: flex;
          transition: 0.3s;
          align-items: center;
          padding: var(--dl-space-space-twounits);
          border-radius: 46px;
          box-shadow: 8px 8px 13px 0px #2b2a2a;
        }
        .createevents-container2:hover {
          color: var(--dl-color-theme-neutral-light);
          background-color: var(--dl-color-theme-neutral-dark);
        }
        .createevents-content {
          gap: var(--dl-space-space-oneandhalfunits);
          display: flex;
          align-items: flex-start;
          flex-direction: column;
          flex: 1;
        }
        .createevents-actions {
          gap: var(--dl-space-space-oneandhalfunits);
          display: flex;
          align-items: flex-start;
          justify-content: flex-end;
        }
        .createevents-button {
          padding: 0.75rem 1.5rem;
          border-radius: 46px;
          background: linear-gradient(90deg, #FFC78B 0%, #FFAD61 100%);
          color: rgb(24, 23, 23);
          font-weight: 700;
          border: none;
          cursor: pointer;
          font-size: 14px;
        }
        .createevents-button:hover {
          color: #FFFFFF;
        }
        .tile-top {
          transform: rotateZ(-5deg);
        }
        .tile-top:hover {
          transform: rotateZ(5deg) scale(1.05);
        }
        .tile-middle {
          transform: rotateZ(5deg);
        }
        .tile-middle:hover {
          transform: rotateZ(5deg) scale(1.05);
        }
        .tile-bottom {
          transform: rotateZ(-5deg);
        }
        .tile-bottom:hover {
          transform: rotateZ(-5deg) scale(1.05);
        }
        @media (max-width: 991px) {
          .createevents-container2 {
            width: 450px;
            height: 124px;
          }
          .logo {
            width: 150px;
          }
          .party-heading {
            font-size: 28px;
          }
        }
        @media (max-width: 767px) {
          .createevents-container2 {
            width: 100%;
            height: auto;
            padding: 1rem;
          }
          .logo {
            width: 100px;
          }
          .party-heading {
            font-size: 24px;
          }
          .tiles-column {
            gap: 2rem;
          }
        }
      `}</style>
    </>
  );
}