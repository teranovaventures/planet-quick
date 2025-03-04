import React, { useState } from 'react';
import Autocomplete from 'react-google-autocomplete';
import { useRouter } from 'next/router';

export default function CreateEventPage() {
  const [eventName, setEventName] = useState('');
  const [eventAddress, setEventAddress] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [deliverySameAsEvent, setDeliverySameAsEvent] = useState(true);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');
  const [fundingDeadline, setFundingDeadline] = useState('');
  const [groupReuse, setGroupReuse] = useState('no');
  const [groupTitle, setGroupTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showDateModal, setShowDateModal] = useState(false);
  const [showShoppingModal, setShowShoppingModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const router = useRouter();
  const [isDateTimeSet, setIsDateTimeSet] = useState(false);
  const [isDeliverySet, setIsDeliverySet] = useState(false);
  const [eventHasShoppingList, setEventHasShoppingList] = useState(false);
  const [eventHasGroup, setEventHasGroup] = useState(false);
  const [shoppingDetails, setShoppingDetails] = useState({
    deliveryInfo: "",
    deliveryTime: "",
    fundraiserCloses: ""
  });

  const STRAPI_API_URL = 'http://localhost:1337/api/events';

  const handleCreateEvent = async () => {
    setErrorMessage('');

    try {
      if (!eventName || !eventAddress || !eventDate || !eventTime) {
        setErrorMessage('Please fill out all required fields.');
        return;
      }

      let eventDateTime = new Date(`${eventDate}T${eventTime}:00`);
      let deliveryDateTimeObj = deliveryDate && deliveryTime ? new Date(`${deliveryDate}T${deliveryTime}:00`) : null;
      let fundraiserCloseDate = new Date(eventDateTime.getTime() - 24 * 60 * 60 * 1000);

      if (deliveryDateTimeObj && deliveryDateTimeObj > eventDateTime) {
        setErrorMessage('Delivery date/time cannot be after the event date/time.');
        return;
      }

      setFundingDeadline(fundraiserCloseDate.toISOString().slice(0, 16));



      const eventData = {
        data: {
          title: eventName,
          location: eventAddress,
          date: new Date(eventDate).toISOString().split('T')[0],  // ✅ Converts to "YYYY-MM-DD"
          time: eventTime ? `${eventTime}:00` : null,
          deliveryAddress: deliverySameAsEvent ? eventAddress : deliveryAddress,
          deliveryDate: deliveryDate ? new Date(deliveryDate).toISOString().split('T')[0] : null,
          deliveryTime: deliveryTime ? `${deliveryTime}:00` : null,
          fundingDeadline: new Date(fundingDeadline).toISOString().split('T')[0],  // ✅ Converts to "YYYY-MM-DD"
          groupReuse,
          groupTitle: groupReuse === 'yes' ? groupTitle : null,
          state: 'pending',
        },
      };

      

      console.log('📡 Sending event data to Strapi:', eventData);

      const res = await fetch(`${STRAPI_API_URL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('jwt')}`,  // ❌ This might be the issue
        },
        body: JSON.stringify(eventData),
      });

      if (!res.ok) {
        const json = await res.json();
        console.error('🚨 Error creating event in Strapi:', json);
        setErrorMessage(json.error?.message || 'Failed to create event. Check console for details.');
        return;
      }

      // Extract the event ID from the response (only once)
      const json = await res.json();
      const eventId = json.data.id; // ✅ Get event ID from Strapi response

      // Fetch event details to check for attached shopping list and group
      try {
        const eventRes = await fetch(`${STRAPI_API_URL}/${eventId}?populate=*`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_KEY}`,
          },
        });

        const eventDetails = await eventRes.json();
        console.log("🎯 Event Details from Strapi:", eventDetails);

        if (eventDetails.data) {
          setEventHasShoppingList(eventDetails.data.shoppinglist !== null);
          setEventHasGroup(eventDetails.data.group !== null);
        } else {
          console.warn("⚠️ No event data found in Strapi response.");
        }
      } catch (error) {
        console.error("🚨 Error fetching event details:", error);
      }

      // Show success modal instead of redirecting immediately
      setShowSuccessModal(true);

    } catch (error) {
      console.error('🚨 Error:', error);
      setErrorMessage('Server error. Please try again later.');
    }
  };

  const handleSaveShoppingDetails = () => {
    // Require fundraiser close date/time regardless of delivery option
    if (!fundingDeadline) {
      alert("Please select a fundraiser close date and time before saving.");
      return; // Keep modal open if missing
    }

    // Only require delivery details if delivery is selected
    if (isDeliverySet && (!deliveryDate || !deliveryTime)) {
      alert("Please select a delivery date and time before saving.");
      return; // Keep modal open if required fields are missing
    }

    // Save the details correctly
    setShoppingDetails({
      deliveryInfo: isDeliverySet
        ? deliverySameAsEvent
          ? "Same as Event"
          : deliveryAddress
        : "No Delivery",

      deliveryTime: isDeliverySet ? deliveryTime || "TBD" : "N/A",

      fundraiserCloses: new Date(fundingDeadline).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
    });

    // Close the modal after successfully saving
    setShowShoppingModal(false);
};


  return (
    <div className="page-background">
      <div className="createevents-accent2-bg">
        <div className="createevents-accent1-bg">
          <div className="createevents-container2">
            <div className="createevents-content">
                <h2 className="thq-heading-2">Plan Your Event</h2>
                {errorMessage && <div className="error-message">{errorMessage}</div>}

                <label>Event Name</label>
                <input type="text" value={eventName} onChange={(e) => setEventName(e.target.value)} placeholder="e.g. 'Gala Bash'" />

                <label>Event Address</label>
                <Autocomplete
                  apiKey="YOUR_GOOGLE_PLACES_API_KEY"
                  onPlaceSelected={(place) => setEventAddress(place.formatted_address)}
                  options={{ types: ['establishment', 'geocode'], componentRestrictions: { country: 'us' } }}
                  className="google-places-input"
                  placeholder="Type place name or address"
                />



{isDateTimeSet ? (
  <div className="event-details">
    <span>
      <strong>Event Date/Time:</strong> {new Date(`${eventDate}T${eventTime}`).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })}
    </span>
    <button className="edit-link" onClick={() => setShowDateModal(true)}>Edit</button>
  </div>
) : (
  <button className="thq-button-outline" onClick={() => setShowDateModal(true)}>Set Date/Time</button>
)}





{shoppingDetails.fundraiserCloses ? (
  <div className="event-details">
    <p>
      <strong>Delivery Info:</strong> {shoppingDetails.deliveryInfo} {shoppingDetails.deliveryTime !== "N/A" ? `@ ${shoppingDetails.deliveryTime}` : ""}
    </p>
    <p>
      <strong>Fundraiser Closes:</strong> {shoppingDetails.fundraiserCloses}
    </p>
    <button className="edit-link" onClick={() => setShowShoppingModal(true)}>Edit</button>
  </div>
) : (
  <button className="thq-button-outline" onClick={() => setShowShoppingModal(true)}>Set Shopping Details</button>
)}


              

              <button className="thq-button-filled create-event-button" onClick={handleCreateEvent}>Create Event</button>
            </div>
          </div>
        </div>
      </div>




                            {showSuccessModal && (
                        <div className="modal-overlay">
                          <div className="modal-content expanded-modal"> {/* Widened modal */}
                            
                            {/* ❌ Close Button */}
                            <button className="close-button" onClick={() => setShowSuccessModal(false)}>✖</button>

                            <h2>🎉 Way to Go! 🎉</h2>

                            {/* 🌟 Animated Text */}
                            <p id="redirectMessage">Planet Quick is getting things ready...</p>

                            {/* 🎯 Buttons Based on Event Status */}
                            <div className="modal-buttons-table">
                              {(!eventHasShoppingList && !eventHasGroup) && (
                                <>
                                  <button 
                                    className="thq-button-navbar"
                                    onClick={() => {
                                      document.getElementById("redirectMessage").innerText = "Planet Quick is sending you to shop!";
                                      setTimeout(() => router.push('/create-shopping-list'), 1500);
                                    }}
                                  >
                                    🛒 Build Shopping List
                                  </button>
                                  <button 
                                    className="thq-button-navbar"
                                    onClick={() => {
                                      document.getElementById("redirectMessage").innerText = "Planet Quick is sending you to Invite Guests!";
                                      setTimeout(() => router.push('/create-group'), 1500);
                                    }}
                                  >
                                    🎟 Invite Guests
                                  </button>
                                </>
                              )}

                              {eventHasGroup && !eventHasShoppingList && (
                                <button 
                                  className="thq-button-navbar"
                                  onClick={() => {
                                    document.getElementById("redirectMessage").innerText = "Planet Quick is sending you to shop!";
                                    setTimeout(() => router.push('/create-shopping-list'), 1500);
                                  }}
                                >
                                  🛒 Build Shopping List
                                </button>
                              )}

                              {eventHasShoppingList && !eventHasGroup && (
                                <button 
                                  className="thq-button-navbar"
                                  onClick={() => {
                                    document.getElementById("redirectMessage").innerText = "Planet Quick is sending you to Invite Guests!";
                                    setTimeout(() => router.push('/create-group'), 1500);
                                  }}
                                >
                                  🎟 Invite Guests
                                </button>
                              )}

                              {/* 📌 If the event has BOTH a shopping list & a group, go to Pending Events */}
                              {(eventHasShoppingList || eventHasGroup) && (
                                <button 
                                  className="thq-button-navbar"
                                  onClick={() => {
                                    document.getElementById("redirectMessage").innerText = "Planet Quick is sending you to Pending Events!";
                                    setTimeout(() => router.push('/pending-events'), 1500);
                                  }}
                                >
                                  ✅ See Pending Events
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      )}


                      



            {/* ✅ Set Event Date/Time Modal */}
{showDateModal && (
  <div className="modal-overlay" onClick={() => setShowDateModal(false)}>
    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      <h3>Set Event Date/Time</h3>

      <label>Event Date</label>
      <input 
        type="date" 
        value={eventDate} 
        onChange={(e) => setEventDate(e.target.value)} 
      />

      <label>Event Time</label>
      <input 
        type="time" 
        value={eventTime} 
        onChange={(e) => setEventTime(e.target.value)} 
      />

      <div className="modal-buttons">
        <button 
          className="thq-button-outline"
          onClick={() => {
            setShowDateModal(false);  // ✅ Close modal
            if (!eventDate || !eventTime) setIsDateTimeSet(false);  // ✅ Restore modal button if no selection
          }}
        >Cancel</button>

        <button 
          className="thq-button-filled"
          onClick={() => { 
            if (!eventDate || !eventTime) {
              setErrorMessage("Please select a valid date and time.");
              return;
            }
            setIsDateTimeSet(true);  // ✅ Mark as set
            setShowDateModal(false);  // ✅ Close modal
          }}
        >Save</button>
      </div>
    </div>
  </div>
)}







              {showShoppingModal && (
                <div className="modal-overlay">
                  <div className="modal-content wider-modal">
                    
                    <h3>Set Shopping/Delivery Details</h3>

                    {/* Deliver the Shopping List? (Dropdown) */}
                    <label>Deliver the shopping list?</label>
                    <select
                      value={isDeliverySet ? "yes" : "no"}
                      onChange={(e) => setIsDeliverySet(e.target.value === "yes")}
                    >
                      <option value="no">No</option>
                      <option value="yes">Yes</option>
                    </select>

                    {/* Only show address selection if delivery is required */}
                    {isDeliverySet && (
                      <>
                        <div className="radio-group">
                          <label>
                            <input
                              type="radio"
                              name="deliveryAddress"
                              checked={deliverySameAsEvent}
                              onChange={() => setDeliverySameAsEvent(true)}
                            />
                            Same as Event Address
                          </label>
                          
                          <label>
                            <input
                              type="radio"
                              name="deliveryAddress"
                              checked={!deliverySameAsEvent}
                              onChange={() => setDeliverySameAsEvent(false)}
                            />
                            Use Different Address
                          </label>
                        </div>

                        {!deliverySameAsEvent && (
                          <Autocomplete
                            apiKey="YOUR_GOOGLE_PLACES_API_KEY"
                            onPlaceSelected={(place) => setDeliveryAddress(place.formatted_address)}
                            options={{ types: ['geocode'], componentRestrictions: { country: 'us' } }}
                            className="google-places-input"
                            placeholder="Enter delivery address"
                          />
                        )}

                        <label>Delivery Date</label>
                        <input type="date" value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)} required />

                        <label>Delivery Time</label>
                        <input type="time" value={deliveryTime} onChange={(e) => setDeliveryTime(e.target.value)} required />
                      </>
                    )}

                    {/* Fundraiser Close Date & Time (Required Regardless of Delivery) */}
                    <label>Fundraiser Closes</label>
                    <input type="datetime-local" value={fundingDeadline} onChange={(e) => setFundingDeadline(e.target.value)} required />

                    {/* Modal Buttons */}
                    <div className="modal-buttons">
                      <button className="cancel-button" onClick={() => setShowShoppingModal(false)}>Cancel</button>
                      <button className="save-button" onClick={handleSaveShoppingDetails}>Save</button>
                    </div>

                  </div>
                </div>
              )}


            {/* STYLES */}
            <style jsx>{`
              .page-background {
                flex: 1;
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                background-size: cover;
                background-image: linear-gradient(
                    90deg,
                    rgb(192, 36, 37) 0%,
                    rgba(240, 134, 53, 0.04) 100%
                  ),
                  url("https://play.teleporthq.io/static/svg/.svg");
              }
              .createevents-accent2-bg {
                gap: var(--dl-space-space-oneandhalfunits);
                display: flex;
                transform: rotateZ(1deg);
                transition: 0.3s;
                align-items: center;
                border-radius: 46px;
                justify-content: space-between;
                background-color: var(--dl-color-theme-accent2);
              }
              .createevents-accent2-bg:hover {
                transform: scale(1.02);
              }
              .createevents-accent1-bg {
                width: 100%;
                display: flex;
                transform: rotateZ(-2deg);
                align-items: center;
                border-radius: 46px;
                justify-content: space-between;
                background-color: var(--dl-color-theme-accent1);
              }
              .createevents-container2 {
                gap: var(--dl-space-space-threeunits);
                width: 700px;
                display: flex;
                box-shadow: 8px 8px 13px 0px #2b2a2a;
                transition: 0.3s;
                align-items: center;
                padding: 3rem 2rem;
                border-radius: 46px;
              }
              .createevents-container2:hover {
                color: var(--dl-color-theme-neutral-light);
                background-color: var(--dl-color-theme-neutral-dark);
              }
              .createevents-content {
                gap: 1rem;
                display: flex;
                flex-direction: column;
                width: 100%;
              }
              .error-message {
                color: red;
                font-size: 0.9rem;
                margin-bottom: 0.5rem;
              }
              label {
                font-weight: bold;
              }
              input[type='text'],
              input[type='date'],
              input[type='time'],
              input[type='datetime-local'] {
                padding: 0.5rem;
                border: 1px solid #ddd;
                border-radius: 8px;
                width: 100%;
                margin-bottom: 0.5rem;
              }
              .google-places-input {
                width: 100%;
                padding: 0.5rem;
                border: 1px solid #ddd;
                border-radius: 8px;
                margin-bottom: 0.5rem;
              }
              .address-confirmation {
                margin-top: 0.5rem;
                font-size: 0.9rem;
                color: #444;
              }
              .edit-link {
                font-size: 0.85rem;
                color: #333;
                text-decoration: underline;
                background: none;
                border: none;
                cursor: pointer;
              }
              .date-time-readout {
                margin-top: 0.5rem;
                font-size: 0.9rem;
                color: #444;
                display: flex;
                align-items: center;
                gap: 0.5rem;
              }
              .thq-button-outline {
                padding: 0.5rem 1rem;
                border: 2px solid #444;
                border-radius: 46px;
                background-color: transparent;
                cursor: pointer;
                margin-bottom: 0.5rem;
              }
              .thq-button-filled.create-event-button {
                margin-top: 1rem;
                width: 100%;
                padding: 0.75rem;
                border-radius: 46px;
                border: none;
                background-color: rgb(192, 36, 37);
                color: #fff;
                cursor: pointer;
              }
              .thq-button-filled.create-event-button:hover {
                opacity: 0.9;
              }
              .modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.4);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 999;
              }
              .modal-content {
                background: #fff;
                padding: 2rem;
                border-radius: 8px;
                width: 400px;
                max-width: 90%;
              }
              .modal-content label {
                font-weight: bold;
                margin-top: 1rem;
              }
              .modal-buttons {
                display: flex;
                gap: 1rem;
                justify-content: flex-end;
                margin-top: 1rem;
              }
              .thq-button-filled {
                padding: 0.5rem 1rem;
                border-radius: 46px;
                background-color: rgb(192, 36, 37);
                color: #fff;
                border: none;
                cursor: pointer;
              }
              .thq-button-filled:hover {
                opacity: 0.9;
              }
                .radio-group {
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 10px;
              }

              .radio-group label {
                display: flex;
                align-items: center;
                gap: 5px;
              }

              .modal-buttons {
                display: flex;
                justify-content: space-between;
                margin-top: 15px;
              }

              .modal-buttons button {
                padding: 8px 16px;
                font-size: 14px;
                border-radius: 6px;
                border: none;
                cursor: pointer;
                transition: 0.2s ease-in-out;
              }

              .modal-buttons .save-button {
                background-color: var(--dl-color-theme-primary1);
                color: white;
              }
                .modal-buttons {
                display: flex;
                justify-content: space-between;
                margin-top: 15px;
              }

              .modal-buttons button {
                padding: 10px 16px;
                font-size: 14px;
                border-radius: 6px;
                border: none;
                cursor: pointer;
                transition: 0.2s ease-in-out;
              }

              .modal-buttons .cancel-button {
                background-color: #ddd;
                color: black;
              }

              .modal-buttons .save-button {
                background-color: rgb(192, 36, 37);
                color: white;
              }

              .modal-buttons .save-button:hover {
                background-color: darkred;
              }
                @keyframes fadeIn {
                0% { opacity: 0; transform: scale(0.9); }
                100% { opacity: 1; transform: scale(1); }
              }

              #redirectMessage {
                text-align: center;
                font-size: 18px;
                font-weight: bold;
                margin-bottom: 20px;
                color: #1263a1;
                animation: fadeIn 1s ease-in-out;
              }
                /* 📌 Widened Modal */
              .expanded-modal {
                width: 550px; /* Increase width */
                height: auto; /* Adjust height automatically */
                padding: 2rem;
                border-radius: 20px;
                text-align: center;
              }

              /* ❌ Close Button Styling */
              .close-button {
                position: absolute;
                top: 10px;
                right: 15px;
                background: none;
                border: none;
                font-size: 20px;
                cursor: pointer;
              }

              /* 🎯 Button Layout (Table-Like) */
              .modal-buttons-table {
                display: flex;
                justify-content: center;
                gap: 15px;
                margin-top: 20px;
              }

              /* 🌟 Match Navbar Sign-In Button */
              .thq-button-navbar {
                padding: 12px 24px;
                border-radius: 46px;
                background-color:rgb(170, 14, 27); /* Match navbar button color */
                color: white;
                font-size: 16px;
                border: none;
                cursor: pointer;
                transition: all 0.2s ease-in-out;
              }

              .thq-button-navbar:hover {
                background-color: #0d4a7a; /* Darker hover color */
                transform: scale(1.05);
              }
            `}</style>
          </div>
        );
      }