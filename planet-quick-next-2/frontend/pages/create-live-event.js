import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Autocomplete from 'react-google-autocomplete';
import RocketAnimation from '../components/RocketAnimation';
import confetti from 'canvas-confetti';

export default function CreateLiveEventPage({ user }) {
  const [event, setEvent] = useState(null);
  const [shoppingList, setShoppingList] = useState(null);
  const [invitation, setInvitation] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isHandsOn, setIsHandsOn] = useState(null);
  const [isDeliveryRequired, setIsDeliveryRequired] = useState(null);
  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');
  const [deliveryLocation, setDeliveryLocation] = useState('');
  const [useEventLocation, setUseEventLocation] = useState(true);
  const [placeInWallet, setPlaceInWallet] = useState(false);
  const [venmo, setVenmo] = useState('');
  const [zelle, setZelle] = useState('');
  const [cashapp, setCashapp] = useState('');
  const [cohostEmail, setCohostEmail] = useState('');
  const [cohosts, setCohosts] = useState([]);
  const [fundraiserDetails, setFundraiserDetails] = useState({ startDate: '', startTime: '' });
  const [step, setStep] = useState(1);
  const [showSummary, setShowSummary] = useState(false);
  const router = useRouter();
  const { eventId, shoppingListId, invitationId } = router.query;

  const STRAPI_API_TOKEN = '76e1da1b6c27d1c452b2de5248d6432e1a83ebd112ded6abc3773a0f80244dc865054434af3067cd4c9e18c658ac4815f8b12dfaf91ae9cc545afd4c001ee6007d7ce3e63b712a9a10b6968669276b0cd69b6b7118be8a0d122f322eeaa5391107a2856181dfd4bd58fb9984da48f7c5c241352b8a67724bb916e982e4af8b19';
  const STRAPI_EVENTS_URL = 'http://localhost:1337/api/pqevents';
  const STRAPI_SHOPPINGLISTS_URL = 'http://localhost:1337/api/pqshoppinglists';
  const STRAPI_INVITATIONS_URL = 'http://localhost:1337/api/pqinvitations';
  const STRAPI_LIVE_EVENTS_URL = 'http://localhost:1337/api/pqliveevents';
  const GOOGLE_API_KEY = 'YOUR_GOOGLE_API_KEY';
  const INSTACART_AFFILIATE_LINK = 'https://www.instacart.com/affiliate-link';

  useEffect(() => {
    if (!eventId || !shoppingListId || !invitationId) {
      setErrorMessage('Missing required parameters.');
      return;
    }

    const fetchData = async () => {
      try {
        const jwt = localStorage.getItem('jwt') || STRAPI_API_TOKEN;
        const eventRes = await fetch(`${STRAPI_EVENTS_URL}/${eventId}`, {
          headers: { Authorization: `Bearer ${jwt}` },
        });
        if (!eventRes.ok) throw new Error('Failed to fetch event');
        const eventData = await eventRes.json();
        setEvent(eventData.data);

        const shoppingListRes = await fetch(`${STRAPI_SHOPPINGLISTS_URL}/${shoppingListId}`, {
          headers: { Authorization: `Bearer ${jwt}` },
        });
        if (!shoppingListRes.ok) throw new Error('Failed to fetch shopping list');
        const shoppingListData = await shoppingListRes.json();
        setShoppingList(shoppingListData.data);

        const invitationRes = await fetch(`${STRAPI_INVITATIONS_URL}/${invitationId}`, {
          headers: { Authorization: `Bearer ${jwt}` },
        });
        if (!invitationRes.ok) throw new Error('Failed to fetch invitation');
        const invitationData = await invitationRes.json();
        setInvitation(invitationData.data);
      } catch (error) {
        setErrorMessage(error.message);
      }
    };

    fetchData();
  }, [eventId, shoppingListId, invitationId]);

  const handleHandsOnSelection = (value) => {
    setIsHandsOn(value);
    setStep(2);
  };

  const handleDeliverySelection = (value) => {
    setIsDeliveryRequired(value);
    setStep(3);
  };

  const addCohost = () => {
    if (cohostEmail.trim()) {
      setCohosts([...cohosts, cohostEmail.trim()]);
      setCohostEmail('');
    }
  };

  const handleSubmit = async () => {
    try {
      const jwt = localStorage.getItem('jwt') || STRAPI_API_TOKEN;
      const liveEventData = {
        data: {
          pqeventname: event.attributes.pqeventname || 'Unnamed Event',
          pqeventstatus: 'active',
          pqstartdate: fundraiserDetails.startDate ? new Date(`${fundraiserDetails.startDate}T${fundraiserDetails.startTime}`).toISOString() : new Date().toISOString(),
          pqcontributiondeadline: new Date(`${fundraiserDetails.startDate}T${fundraiserDetails.startTime}`).toISOString(),
          pqdeliveryrequired: isDeliveryRequired,
          pqdeliverydate: isDeliveryRequired ? new Date(`${deliveryDate}T${deliveryTime}`).toISOString() : null,
          pqdeliverylocation: isDeliveryRequired ? (useEventLocation ? event.attributes.pqlocation : deliveryLocation) : null,
          pqevent: event.id,
          pqshoppinglist: shoppingList.id,
          pqinvitation: invitation.id,
          payment_process: isHandsOn ? 'hands-on' : 'hands-off',
          instacart_link: isDeliveryRequired ? INSTACART_AFFILIATE_LINK : null,
        },
      };

      if (cohosts.length > 0) {
        const cohostRes = await fetch(`http://localhost:1337/api/pqusers?filters[pqemail][$eq]=${cohosts[0]}`, {
          headers: { Authorization: `Bearer ${jwt}` },
        });
        const cohostData = await cohostRes.json();
        if (cohostData.data.length) {
          liveEventData.data.pqcohosts = { connect: [cohostData.data[0].id] };
        } else {
          setErrorMessage('Co-host not found.');
          return;
        }
      }

      const response = await fetch(STRAPI_LIVE_EVENTS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${jwt}` },
        body: JSON.stringify(liveEventData),
      });

      if (!response.ok) throw new Error('Failed to launch live event: ' + await response.text());

      await fetch(`${STRAPI_EVENTS_URL}/${event.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${jwt}` },
        body: JSON.stringify({ data: { pqeventstatus: 'active' } }),
      });

      triggerCelebration();
      setTimeout(() => router.push('/live-events'), 500);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const triggerCelebration = () => {
    const rocket = document.querySelector('.rocket-animation');
    if (rocket) rocket.style.display = 'block';
    confetti({
      particleCount: 200,
      spread: 70,
      origin: { y: 0.6 },
      scalar: 1.5,
    });
  };

  const guestCount = invitation ? (invitation.attributes.pqinvitationlist?.data?.length || 0) : 0;
  const totalCost = shoppingList ? shoppingList.attributes.pqitems.reduce((sum, i) => sum + (i.totalcost || 0) * (i.quantity || 1), 0).toFixed(2) : '0.00';

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(90deg, rgb(192, 36, 37) 0%, rgba(240, 134, 53, 0.04) 100%)', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
      <div style={{ display: 'flex', width: '90%', maxWidth: '1200px', gap: '24px', transform: 'rotateZ(1deg)', transition: '0.3s' }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
        onMouseLeave={(e) => (e.currentTarget.style.transform = 'rotateZ(1deg)')}>
        <div style={{ flex: 2, padding: '40px', backgroundColor: '#F5D1B0', borderRadius: '46px' }}>
          <div style={{ padding: '48px 32px', backgroundColor: '#FFFFFF', borderRadius: '46px', boxShadow: '8px 8px 13px #2b2a2a', transition: '0.3s', minHeight: '600px', transform: 'rotateZ(-2deg)' }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'rotateZ(3deg)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'rotateZ(-2deg)')}>
            <h2 style={{ fontSize: '35px', fontFamily: 'STIX Two Text', fontWeight: 600, lineHeight: '1.5', margin: '0' }}>Create Live Event</h2>
            {errorMessage && <div style={{ color: 'red', fontSize: '0.9rem', marginBottom: '0.5rem', textAlign: 'center', fontFamily: 'STIX Two Text' }}>{errorMessage}</div>}

            {event && shoppingList && invitation && (
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontFamily: 'STIX Two Text', color: 'black' }}>{event.attributes.pqeventname}</h3>
                <p style={{ fontFamily: 'STIX Two Text', color: 'black' }}>Shopping List Total: ${totalCost}</p>
                <p style={{ fontFamily: 'STIX Two Text', color: 'black' }}>Guests: {guestCount} invitations</p>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ padding: '24px', backgroundColor: '#FFFFFF', borderRadius: '46px', boxShadow: '8px 8px 13px #2b2a2a', transform: 'rotateZ(-2deg)', transition: '0.3s' }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'rotateZ(3deg)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'rotateZ(-2deg)')}>
                <h3 style={{ fontSize: '25px', fontFamily: 'STIX Two Text', fontWeight: '600', margin: '0 0 1rem' }}>Type of Live Event</h3>
                <div style={{ marginBottom: '1rem' }}>
                  <label>
                    <input
                      type="checkbox"
                      checked={isHandsOn === true}
                      onChange={() => handleHandsOnSelection(isHandsOn === true ? null : true)}
                    />
                    Hands-On
                  </label>
                  <p style={{ fontFamily: 'STIX Two Text', color: 'black', marginTop: '0.5rem' }}>
                    We will handle the checkout process for your guests. When they buy an item or contribute to the event, we’ll collect the funds and place them per your instructions. More options below.
                  </p>
                  {isHandsOn === true && (
                    <>
                      <div style={{ marginBottom: '1rem' }}>
                        <label>
                          <input
                            type="checkbox"
                            checked={isDeliveryRequired}
                            onChange={() => setIsDeliveryRequired(!isDeliveryRequired)}
                          />
                          Purchase Items for Delivery
                        </label>
                      </div>
                      {isDeliveryRequired && (
                        <>
                          <div style={{ marginBottom: '1rem' }}>
                            <label>
                              <input
                                type="checkbox"
                                checked={useEventLocation}
                                onChange={() => setUseEventLocation(!useEventLocation)}
                              />
                              Delivery Address (Same as Location)
                            </label>
                            {!useEventLocation && (
                              <Autocomplete
                                apiKey={GOOGLE_API_KEY}
                                onPlaceSelected={(place) => setDeliveryLocation(place.formatted_address)}
                                options={{ types: ['establishment', 'geocode'], componentRestrictions: { country: 'us' } }}
                                placeholder="Enter delivery address"
                                style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '8px', width: '200px', marginTop: '0.5rem' }}
                              />
                            )}
                            {deliveryLocation && <p>{deliveryLocation}</p>}
                          </div>
                        </>
                      )}
                      {!isDeliveryRequired && (
                        <div style={{ marginBottom: '1rem' }}>
                          <label>
                            <input
                              type="checkbox"
                              checked={placeInWallet}
                              onChange={() => setPlaceInWallet(!placeInWallet)}
                            />
                            Place Contributions in Wallet
                          </label>
                          {placeInWallet && <p>I’ll do the shopping myself.</p>}
                        </div>
                      )}
                      <button
                        onClick={() => setStep(2)}
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
                        Done
                      </button>
                    </>
                  )}
                  {isHandsOn === false && (
                    <div>
                      <p>Please share handle(s) for payment:</p>
                      <label>
                        CashApp
                        <input
                          type="text"
                          value={cashapp}
                          onChange={(e) => setCashapp(e.target.value)}
                          placeholder="CashApp handle"
                          style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '8px', width: '200px', marginTop: '0.5rem' }}
                        />
                      </label>
                      <label>
                        Venmo
                        <input
                          type="text"
                          value={venmo}
                          onChange={(e) => setVenmo(e.target.value)}
                          placeholder="Venmo handle"
                          style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '8px', width: '200px', marginTop: '0.5rem' }}
                        />
                      </label>
                      <label>
                        Zelle
                        <input
                          type="text"
                          value={zelle}
                          onChange={(e) => setZelle(e.target.value)}
                          placeholder="Zelle handle"
                          style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '8px', width: '200px', marginTop: '0.5rem' }}
                        />
                      </label>
                      <button
                        onClick={() => setStep(2)}
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
                          marginTop: '1rem',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = '#191818')}
                      >
                        Done
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div style={{ padding: '24px', backgroundColor: step >= 2 ? '#FFFFFF' : '#D3D3D3', borderRadius: '46px', boxShadow: '8px 8px 13px #2b2a2a', transform: 'rotateZ(-2deg)', transition: '0.3s', opacity: step >= 2 ? 1 : 0.5 }}
                onMouseEnter={(e) => step >= 2 && (e.currentTarget.style.transform = 'rotateZ(3deg)')}
                onMouseLeave={(e) => step >= 2 && (e.currentTarget.style.transform = 'rotateZ(-2deg)')}>
                <h3 style={{ fontSize: '25px', fontFamily: 'STIX Two Text', fontWeight: '600', margin: '0 0 1rem' }}>Fundraiser Details</h3>
                {step >= 2 && (
                  <>
                    <div style={{ marginBottom: '1rem' }}>
                      <label>
                        Start Date
                        <input
                          type="date"
                          value={fundraiserDetails.startDate}
                          onChange={(e) => setFundraiserDetails({ ...fundraiserDetails, startDate: e.target.value })}
                          style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '8px', width: '200px', marginTop: '0.5rem' }}
                        />
                      </label>
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                      <label>
                        Start Time
                        <input
                          type="time"
                          value={fundraiserDetails.startTime}
                          onChange={(e) => setFundraiserDetails({ ...fundraiserDetails, startTime: e.target.value })}
                          style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '8px', width: '200px', marginTop: '0.5rem' }}
                        />
                      </label>
                    </div>
                    <button
                      onClick={() => setStep(3)}
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
                      Done
                    </button>
                  </>
                )}
              </div>

              <div style={{ padding: '24px', backgroundColor: step >= 3 ? '#FFFFFF' : '#D3D3D3', borderRadius: '46px', boxShadow: '8px 8px 13px #2b2a2a', transform: 'rotateZ(-2deg)', transition: '0.3s', opacity: step >= 3 ? 1 : 0.5 }}
                onMouseEnter={(e) => step >= 3 && (e.currentTarget.style.transform = 'rotateZ(3deg)')}
                onMouseLeave={(e) => step >= 3 && (e.currentTarget.style.transform = 'rotateZ(-2deg)')}>
                <h3 style={{ fontSize: '25px', fontFamily: 'STIX Two Text', fontWeight: '600', margin: '0 0 1rem' }}>Co-Host</h3>
                {step >= 3 && (
                  <>
                    <div style={{ marginBottom: '1rem' }}>
                      <input
                        type="text"
                        value={cohostEmail}
                        onChange={(e) => setCohostEmail(e.target.value)}
                        placeholder="Enter co-host email"
                        style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '8px', width: '200px', marginTop: '0.5rem' }}
                      />
                      <button
                        onClick={addCohost}
                        style={{
                          padding: '0.5rem 1rem',
                          borderRadius: '8px',
                          background: 'linear-gradient(90deg, #FFC78B 0%, #FFAD61 100%)',
                          color: '#191818',
                          fontWeight: '700',
                          border: 'none',
                          cursor: 'pointer',
                          marginLeft: '10px',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = '#191818')}
                      >
                        Add Co-Host
                      </button>
                    </div>
                    {cohosts.length > 0 && (
                      <ul style={{ listStyle: 'none', padding: 0 }}>
                        {cohosts.map((host, idx) => (
                          <li key={idx} style={{ fontFamily: 'STIX Two Text', color: 'black' }}>{host}</li>
                        ))}
                      </ul>
                    )}
                    <button
                      onClick={() => setShowSummary(true)}
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
                      Done
                    </button>
                  </>
                )}
              </div>

              {showSummary && (
                <div style={{ padding: '24px', backgroundColor: '#FFFFFF', borderRadius: '46px', boxShadow: '8px 8px 13px #2b2a2a', transform: 'rotateZ(-2deg)', transition: '0.3s' }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'rotateZ(3deg)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'rotateZ(-2deg)')}>
                  <h3 style={{ fontSize: '25px', fontFamily: 'STIX Two Text', fontWeight: '600', margin: '0 0 1rem' }}>Summary</h3>
                  <p><strong>Event Type:</strong> {isHandsOn ? 'Hands-On' : 'Hands-Off'}</p>
                  {isHandsOn && (
                    <>
                      <p><strong>Purchase for Delivery:</strong> {isDeliveryRequired ? 'Yes' : 'No'}</p>
                      {isDeliveryRequired && (
                        <>
                          <p><strong>Delivery Address:</strong> {useEventLocation ? 'Same as Location' : deliveryLocation}</p>
                        </>
                      )}
                      {!isDeliveryRequired && (
                        <p><strong>Place in Wallet:</strong> {placeInWallet ? 'Yes' : 'No'}</p>
                      )}
                    </>
                  )}
                  {!isHandsOn && (
                    <p><strong>Payment Details:</strong> {venmo && `Venmo: ${venmo}, `}{zelle && `Zelle: ${zelle}, `}{cashapp && `CashApp: ${cashapp}`}</p>
                  )}
                  <p><strong>Fundraiser Start:</strong> {fundraiserDetails.startDate} at {fundraiserDetails.startTime}</p>
                  <p><strong>Co-Hosts:</strong> {cohosts.length > 0 ? cohosts.join(', ') : 'None'}</p>
                  <button
                    onClick={handleSubmit}
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
                      marginTop: '1rem',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#191818')}
                  >
                    Launch Live Event!
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <RocketAnimation
        className="rocket-animation"
        style={{ display: 'none', position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 3000 }}
      />
    </div>
  );
}