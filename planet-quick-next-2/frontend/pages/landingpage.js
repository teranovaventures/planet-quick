import { useEffect, useState, Fragment } from 'react';
import Head from 'next/head';
import Toppagephotos from '../components/toppagephotos';
import Steps from '../components/steps';
import { useRouter } from 'next/router';

export default function LandingPage({ user }) {
  const router = useRouter();
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(false);
  const [notification, setNotification] = useState('');

  useEffect(() => {
    if (router.query.welcome) {
      setShowWelcomeMessage(true);
    }
    const storedNotification = localStorage.getItem('notification');
    if (storedNotification) {
      setNotification(storedNotification);
      localStorage.removeItem('notification');
    }
  }, [router.query]);

  return (
    <>
      <div className="landing-page-container">
        <Head>
          <title>Planet-Quick - Welcome</title>
          <meta property="og:title" content="Planet-Quick - Welcome" />
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

        {/* Hero Section (Toppagephotos) */}
        <Toppagephotos
          content1={<Fragment><span>Simplify event planning and increase community engagement through our user-friendly platform. Create, schedule, and crowdfund events effortlessly.</span></Fragment>}
          heading1={<Fragment><span>Coordinate Events with Ease</span></Fragment>}
        />

        {/* Steps Section */}
        <Steps
          step1Title={<Fragment><span>Create an Account</span></Fragment>}
          step2Title={<Fragment><span>Schedule Your Event</span></Fragment>}
          step3Title={<Fragment><span>Crowdfund Your Event</span></Fragment>}
          step4Title={<Fragment><span>Increase Participation</span></Fragment>}
          step1Description={<Fragment><span>Sign up for a free account to start planning your events and engaging your community.</span></Fragment>}
          step2Description={<Fragment><span>Set the date, time, and details of your event to let your community know what's happening.</span></Fragment>}
          step3Description={<Fragment><span>Use our crowdfunding feature to raise funds for your event and make it a success.</span></Fragment>}
          step4Description={<Fragment><span>Get more people involved in your events by easily coordinating schedules and resources.</span></Fragment>}
        />

        {/* Why Planet Quick Section */}
        <div className="why-planet-quick">
          <h2 className="why-planet-quick-heading">Why Planet Quick? 🚀</h2>
          <p className="why-planet-quick-subheading">
            Planning events shouldn’t feel like a mission to Mars. With Planet Quick, it’s as easy as a moonwalk!
          </p>
          <div className="why-planet-quick-features">
            <div className="feature-card">
              <div className="feature-icon">🌌</div>
              <h3 className="feature-title">Blast Off with Ease</h3>
              <p className="feature-description">
                Our intuitive platform lets you create events faster than a rocket launch. No complicated controls—just pure, interstellar simplicity!
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">👽</div>
              <h3 className="feature-title">Crowdfund Like an Alien</h3>
              <p className="feature-description">
                Gather resources from your crew with our out-of-this-world crowdfunding feature. Fund your event faster than light speed!
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🧑‍🚀</div>
              <h3 className="feature-title">Engage Your Astronauts</h3>
              <p className="feature-description">
                Coordinate schedules and boost participation with tools that make your community feel like they’re part of a galactic adventure.
              </p>
            </div>
          </div>
        </div>

        {/* Welcome Popup */}
        {showWelcomeMessage && (
          <div className="welcome-popup">
            <p>Congratulations! You're all signed up.</p>
            <button onClick={() => setShowWelcomeMessage(false)}>Close</button>
          </div>
        )}
      </div>

      <style jsx>{`
        .landing-page-container {
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
        .welcome-popup {
          position: fixed;
          top: 20px;
          right: 20px;
          background: white;
          padding: 15px;
          border-radius: 46px;
          box-shadow: 8px 8px 13px 0px #2b2a2a;
          zIndex: 1000;
          display: flex;
          alignItems: 'center',
          fontFamily: 'STIX Two Text, serif',
        }
        .welcome-popup button {
          margin-left: 10px;
          background: none;
          border: none;
          color: #BF4408;
          cursor: 'pointer';
          fontSize: 20px;
        }
        .why-planet-quick {
          width: 100%;
          max-width: 1144px;
          padding: 3rem 1rem;
          text-align: center;
          margin: 3rem 0;
        }
        .why-planet-quick-heading {
          font-family: 'STIX Two Text, serif';
          font-size: 36px;
          font-weight: 700;
          color: #191818;
          margin-bottom: 1rem;
        }
        .why-planet-quick-subheading {
          font-family: 'STIX Two Text, serif';
          font-size: 18px;
          line-height: 1.5;
          color: #191818;
          margin-bottom: 2rem;
        }
        .why-planet-quick-features {
          display: flex;
          flex-wrap: wrap;
          gap: 2rem;
          justify-content: center;
        }
        .feature-card {
          background: #F5D1B0;
          border-radius: 46px;
          padding: 2rem;
          width: 300px;
          text-align: center;
          box-shadow: 8px 8px 13px 0px rgba(43, 42, 42, 0.5);
          transform: rotateZ(-2deg);
          transition: transform 0.3s ease;
        }
        .feature-card:hover {
          transform: rotateZ(2deg) scale(1.05);
        }
        .feature-icon {
          font-size: 40px;
          margin-bottom: 1rem;
        }
        .feature-title {
          font-family: 'STIX Two Text, serif';
          font-size: 24px;
          font-weight: 600;
          color: #BF4408;
          margin-bottom: 0.5rem;
        }
        .feature-description {
          font-family: 'STIX Two Text, serif';
          font-size: 16px;
          line-height: 1.5;
          color: #191818;
        }
        @media (max-width: 767px) {
          .feature-card {
            width: 90%;
            transform: rotateZ(0deg);
          }
          .feature-card:hover {
            transform: scale(1.05);
          }
        }
      `}</style>
    </>
  );
}