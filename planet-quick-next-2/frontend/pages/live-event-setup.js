import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Autocomplete from 'react-google-autocomplete';

export default function LiveEventSetup({ user }) {
  const [mode, setMode] = useState(null); // Start null to trigger selection
  const [fundingDeadline, setFundingDeadline] = useState('');
  const [deliveryRequired, setDeliveryRequired] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliveryLocation, setDeliveryLocation] = useState('');
  const [venmo, setVenmo] = useState('');
  const [zelle, setZelle] = useState('');
  const [cashapp, setCashapp] = useState('');
  const [savedPaymentDetails, setSavedPaymentDetails] = useState({ venmo: '', zelle: '', cashapp: '' });
  const [showSummary, setShowSummary] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const STRAPI_API_URL = 'http://localhost:1337/api/pqliveevents';
  const STRAPI_API_TOKEN = '76e1da1b6c27d1c452b2de5248d6432e1a83ebd112ded6abc3773a0f80244dc865054434af3067cd4c9e18c658ac4815f8b12dfaf91ae9cc545afd4c001ee6007d7ce3e63b712a9a10b6968669276b0cd69b6b7118be8a0d122f322eeaa5391107a2856181dfd4bd58fb9984da48f7c5c241352b8a67724bb916e982e4af8b19';

  useEffect(() => {
    if (!user || !user.id) {
      setErrorMessage('Please log in to set up a live event.');
      router.push('/login');
    }
  }, [user, router]);

  const handleModeSelect = (selectedMode) => {
    setMode(selectedMode);
    if (selectedMode === 'hands-off') {
      setSavedPaymentDetails(JSON.parse(localStorage.getItem('paymentDetails') || '{}'));
    }
  };

  const handleSavePayment = () => {
    const details = { venmo, zelle, cashapp };
    localStorage.setItem('paymentDetails', JSON.stringify(details));
    setSavedPaymentDetails(details);
  };

  const handleLaunch = async () => {
    if (!mode) {
      setErrorMessage('Please select a mode (Hands-On or Hands-Off).');
      return;
    }
    if (!fundingDeadline) {
      setErrorMessage('Please set a funding deadline.');
      return;
    }
    if (deliveryRequired && (!deliveryDate || !deliveryLocation)) {
      setErrorMessage('Please set delivery date and location.');
      return;
    }
    if (mode === 'hands-off' && (!savedPaymentDetails.venmo && !savedPaymentDetails.zelle && !savedPaymentDetails.cashapp)) {
      setErrorMessage('Please provide at least one payment method.');
      return;
    }

    const jwt = localStorage.getItem('jwt');
    if (!jwt) {
      setErrorMessage('No authentication token found. Please log in again.');
      return;
    }

    try {
      const eventRes = await fetch(`${STRAPI_API_URL}/pqevents?filters[pqcoordinator][id][$eq]=${user.id}&filters[pqeventstatus][$eq]=pending&sort[0]=createdAt:desc&pagination[limit]=1`, { headers: { Authorization: `Bearer ${jwt}` } });
      if (!eventRes.ok) throw new Error(`Failed to fetch events: ${eventRes.status}`);
      const eventData = await eventRes.json();
      if (!eventData.data || eventData.data.length === 0) {
        setErrorMessage('No pending event found.');
        return;
      }
      const latestEvent = eventData.data[0];

      const shoppingListRes = await fetch(`${STRAPI_API_URL}/pqshoppinglists?filters[pqeventshoppinglist][id][$eq]=${latestEvent.id}`, { headers: { Authorization: `Bearer ${jwt}` } });
      const shoppingListData = await shoppingListRes.json();
      if (!shoppingListData.data || shoppingListData.data.length === 0) {
        setErrorMessage('No pending shopping list found.');
        return;
      }
      const latestShoppingList = shoppingListData.data[0];

      const groupRes = await fetch(`${STRAPI_API_URL}/pqinvitations?filters[pqeventinvited][id][$eq]=${latestEvent.id}`, { headers: { Authorization: `Bearer ${jwt}` } });
      const groupData = await groupRes.json();
      if (!groupData.data || groupData.data.length === 0) {
        setErrorMessage('No pending group found.');
        return;
      }

      const liveEventData = {
        data: {
          pqeventname: latestEvent.attributes.pqeventname,
          pqeventstatus: 'active',
          pqstartdate: latestEvent.attributes.pqstartdate,
          pqcontributiondeadline: new Date(fundingDeadline).toISOString(),
          pqdeliveryrequired: deliveryRequired,
          pqdeliverydate: deliveryRequired ? new Date(deliveryDate).toISOString() : null,
          pqdeliverylocation: deliveryRequired ? deliveryLocation : null,
          pqevent: latestEvent.id,
          pqshoppinglist: latestShoppingList.id,
          pqgroup: groupData.data.map(g => g.id),
          pqmode: mode,
          pqpaymentdetails: mode === 'hands-off' ? savedPaymentDetails : null,
        },
      };
      const liveEventRes = await fetch(STRAPI_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${STRAPI_API_TOKEN}` },
        body: JSON.stringify(liveEventData),
      });
      if (!liveEventRes.ok) {
        const errorText = await liveEventRes.text();
        setErrorMessage(`Failed to create live event: ${errorText}`);
        return;
      }

      await fetch(`${STRAPI_API_URL}/pqevents/${latestEvent.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${jwt}` },
        body: JSON.stringify({ data: { pqeventstatus: 'active' } }),
      });

      router.push('/');
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
          <h2 style={{ fontSize: '35px', fontFamily: 'STIX Two Text', fontWeight: 600 }}>Set Up Live Event</h2>
          {errorMessage && <div style={{ color: 'red', fontSize: '1rem', marginBottom: '1rem' }}>{errorMessage}</div>}
          {!mode && (
            <div style={{ marginBottom: '1rem' }}>
              <h3 style={{ fontFamily: 'STIX Two Text', fontSize: '1.2rem' }}>Select Mode</h3>
              <button style={{ padding: '0.5rem 1rem', background: '#00AF87', color: '#FFF', border: 'none', borderRadius: '46px', cursor: 'pointer', marginRight: '1rem' }} onClick={() => handleModeSelect('hands-on')}>
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Venmo_logo.svg/1200px-Venmo_logo.svg.png" alt="Venmo" style={{ width: '20px', verticalAlign: 'middle' }} /> Hands-On
              </button>
              <button style={{ padding: '0.5rem 1rem', background: '#00C73C', color: '#FFF', border: 'none', borderRadius: '46px', cursor: 'pointer' }} onClick={() => handleModeSelect('hands-off')}>
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Cash_App_Logo.svg/1200px-Cash_App_Logo.svg.png" alt="CashApp" style={{ width: '20px', verticalAlign: 'middle' }} /> Hands-Off
              </button>
            </div>
          )}
          {mode && (
            <>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontFamily: 'STIX Two Text', fontSize: '1rem' }}>Funding Deadline:</label>
                <input type="datetime-local" value={fundingDeadline} onChange={(e) => setFundingDeadline(e.target.value)} style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '8px', width: '100%' }} />
              </div>
              {mode === 'hands-on' && (
                <>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ fontFamily: 'STIX Two Text', fontSize: '1rem' }}>
                      Require Delivery?
                      <input type="checkbox" checked={deliveryRequired} onChange={(e) => setDeliveryRequired(e.target.checked)} style={{ marginLeft: '0.5rem' }} />
                    </label>
                  </div>
                  {deliveryRequired && (
                    <>
                      <div style={{ marginBottom: '1rem' }}>
                        <label style={{ fontFamily: 'STIX Two Text', fontSize: '1rem' }}>Delivery Date:</label>
                        <input type="datetime-local" value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)} style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '8px', width: '100%' }} />
                      </div>
                      <div style={{ marginBottom: '1rem' }}>
                        <label style={{ fontFamily: 'STIX Two Text', fontSize: '1rem' }}>Delivery Location:</label>
                        <Autocomplete apiKey="YOUR_GOOGLE_PLACES_API_KEY" onPlaceSelected={(place) => setDeliveryLocation(place.formatted_address)} options={{ types: ['establishment', 'geocode'], componentRestrictions: { country: 'us' } }} style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '8px' }} placeholder="Type place name or address" />
                      </div>
                    </>
                  )}
                </>
              )}
              {mode === 'hands-off' && (
                <div style={{ marginBottom: '1rem' }}>
                  <h3 style={{ fontFamily: 'STIX Two Text', fontSize: '1.2rem' }}>Payment Details</h3>
                  {!savedPaymentDetails.venmo && <button style={{ padding: '0.5rem 1rem', background: '#00AF87', color: '#FFF', border: 'none', borderRadius: '46px', cursor: 'pointer', marginRight: '1rem' }} onClick={() => setVenmo(prompt('Enter Venmo handle:'))}>
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Venmo_logo.svg/1200px-Venmo_logo.svg.png" alt="Venmo" style={{ width: '20px', verticalAlign: 'middle' }} /> Add Venmo
                  </button>}
                  {savedPaymentDetails.venmo && <span style={{ marginRight: '1rem' }}>Venmo: {savedPaymentDetails.venmo}</span>}
                  {!savedPaymentDetails.zelle && <button style={{ padding: '0.5rem 1rem', background: '#0078D4', color: '#FFF', border: 'none', borderRadius: '46px', cursor: 'pointer', marginRight: '1rem' }} onClick={() => setZelle(prompt('Enter Zelle handle:'))}>
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Zelle_logo.svg/1200px-Zelle_logo.svg.png" alt="Zelle" style={{ width: '20px', verticalAlign: 'middle' }} /> Add Zelle
                  </button>}
                  {savedPaymentDetails.zelle && <span style={{ marginRight: '1rem' }}>Zelle: {savedPaymentDetails.zelle}</span>}
                  {!savedPaymentDetails.cashapp && <button style={{ padding: '0.5rem 1rem', background: '#00C73C', color: '#FFF', border: 'none', borderRadius: '46px', cursor: 'pointer' }} onClick={() => setCashapp(prompt('Enter CashApp handle:'))}>
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Cash_App_Logo.svg/1200px-Cash_App_Logo.svg.png" alt="CashApp" style={{ width: '20px', verticalAlign: 'middle' }} /> Add CashApp
                  </button>}
                  {savedPaymentDetails.cashapp && <span>CashApp: {savedPaymentDetails.cashapp}</span>}
                  <button style={{ padding: '0.5rem 1rem', background: '#FFC78B', border: 'none', borderRadius: '46px', cursor: 'pointer', marginTop: '0.5rem' }} onClick={handleSavePayment}>Save</button>
                </div>
              )}
              <button style={{ padding: '0.75rem 2rem', background: 'linear-gradient(90deg, #FFC78B 0%, #FFAD61 100%)', color: '#191818', border: 'none', borderRadius: '46px', cursor: 'pointer', width: '100%', marginTop: '1rem' }} onClick={() => setShowSummary(true)} onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')} onMouseLeave={(e) => (e.currentTarget.style.color = '#191818')}>Review Summary</button>
            </>
          )}
          {showSummary && (
            <div style={{ marginTop: '1rem', textAlign: 'left' }}>
              <h3 style={{ fontFamily: 'STIX Two Text', fontSize: '1.2rem' }}>Summary</h3>
              <p><strong>Mode:</strong> {mode}</p>
              <p><strong>Funding Deadline:</strong> {new Date(fundingDeadline).toLocaleString()}</p>
              {deliveryRequired && (
                <>
                  <p><strong>Delivery Required:</strong> Yes</p>
                  <p><strong>Delivery Date:</strong> {new Date(deliveryDate).toLocaleString()}</p>
                  <p><strong>Delivery Location:</strong> {deliveryLocation}</p>
                </>
              )}
              {mode === 'hands-off' && (
                <p><strong>Payment Details:</strong> {Object.entries(savedPaymentDetails).filter(([_, v]) => v).map(([k, v]) => `${k}: ${v}`).join(', ')}</p>
              )}
              <button style={{ padding: '0.5rem 1rem', background: 'linear-gradient(90deg, #FFC78B 0%, #FFAD61 100%)', color: '#191818', border: 'none', borderRadius: '46px', cursor: 'pointer', marginTop: '1rem' }} onClick={handleLaunch} onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')} onMouseLeave={(e) => (e.currentTarget.style.color = '#191818')}>Confirm and Launch</button>
              <button style={{ padding: '0.5rem 1rem', background: '#FFAD61', border: 'none', borderRadius: '46px', cursor: 'pointer', marginTop: '0.5rem' }} onClick={() => setShowSummary(false)}>Back</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}