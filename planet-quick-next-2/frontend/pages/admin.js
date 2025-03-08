import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import '../pages/style.css'; // Assuming your global CSS is here

const Admin = ({ user, setUser }) => {
  const router = useRouter();
  const [notificationSettings, setNotificationSettings] = useState({
    eventCreation: true,
    shoppingListCreation: true,
    groupCreation: true,
    invites: false, // Disabled until invite API is ready
    payments: true,
    fundraiserClose: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      router.push('/sign-up');
    } else {
      // Simulate fetching settings from backend (replace with real fetch later)
      fetchNotificationSettings();
    }
  }, [user, router]);

  const fetchNotificationSettings = async () => {
    setLoading(true);
    const jwt = localStorage.getItem('jwt');
    if (!jwt) {
      setError('No authentication token found. Please sign in again.');
      setLoading(false);
      return;
    }

    try {
      // This is a placeholder—replace with real Strapi endpoint when ready
      const response = await fetch(`http://localhost:1337/api/user-settings/${user.id}`, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      if (response.ok) {
        const data = await response.json();
        setNotificationSettings(data.data.attributes || notificationSettings); // Fallback to defaults
      } else {
        console.warn('No settings found, using defaults');
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
      setError('Failed to load settings. Using defaults.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (key) => {
    const updatedSettings = { ...notificationSettings, [key]: !notificationSettings[key] };
    setNotificationSettings(updatedSettings);
    setLoading(true);
    setError(null);

    const jwt = localStorage.getItem('jwt');
    try {
      // Placeholder PUT request—replace with real Strapi endpoint
      const response = await fetch(`http://localhost:1337/api/user-settings/${user.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${jwt}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: updatedSettings }),
      });
      if (!response.ok) throw new Error('Failed to save settings');
    } catch (err) {
      console.error('Error saving settings:', err);
      setError('Failed to save settings. Changes may not persist.');
      // Revert on error (optional)
      setNotificationSettings({ ...notificationSettings });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('jwt');
    setUser(null);
    router.push('/');
  };

  if (!user) return null;

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1 className="thq-heading-1">Admin Panel</h1>
        <button className="thq-button-outline" onClick={handleSignOut}>
          <span>Sign Out</span>
        </button>
      </header>

      <section className="thq-section-padding">
        <h2 className="thq-heading-2">Notification Settings</h2>
        {loading && <p>Loading...</p>}
        {error && <p className="error-message">{error}</p>}
        <div className="settings-list">
          {Object.entries(notificationSettings).map(([key, value]) => (
            <div key={key} className="notification-toggle thq-flex-row">
              <label className="thq-body-large">
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
                <input
                  type="checkbox"
                  checked={value}
                  onChange={() => handleToggle(key)}
                  disabled={key === 'invites' || loading} // Disable invites until API ready
                />
              </label>
            </div>
          ))}
        </div>
      </section>

      <style jsx>{`
        .admin-container {
          width: 100%;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          background-color: var(--dl-color-theme-neutral-light);
          font-family: 'Lexend', sans-serif;
        }
        .admin-header {
          width: 100%;
          max-width: var(--dl-size-size-maxwidth);
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--dl-space-space-oneandhalfunits) var(--dl-space-space-threeunits);
          background-color: var(--dl-color-theme-neutral-light);
          border-bottom: 1px solid var(--dl-color-theme-neutral-dark);
          position: sticky;
          top: 0;
          z-index: 1000;
        }
        .settings-list {
          width: 100%;
          max-width: 600px;
          display: flex;
          flex-direction: column;
          gap: var(--dl-space-space-unit);
          margin-top: var(--dl-space-space-twounits);
        }
        .notification-toggle {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--dl-space-space-unit);
          border-radius: var(--dl-radius-radius-cardradius);
          background-color: var(--dl-color-scheme-white);
          box-shadow: 0px 0px 5px -2px var(--dl-color-theme-neutral-dark);
        }
        .notification-toggle input {
          margin-left: var(--dl-space-space-unit);
          cursor: ${loading ? 'not-allowed' : 'pointer'};
        }
        .error-message {
          color: red;
          font-size: 14px;
          margin: var(--dl-space-space-unit) 0;
        }
        @media (max-width: 767px) {
          .admin-header {
            padding: var(--dl-space-space-unit);
            flex-direction: column;
            gap: var(--dl-space-space-unit);
          }
          .settings-list {
            max-width: 100%;
            padding: 0 var(--dl-space-space-unit);
          }
        }
      `}</style>
    </div>
  );
};

export default Admin;