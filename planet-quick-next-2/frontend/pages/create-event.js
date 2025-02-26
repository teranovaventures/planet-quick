// pages/create-event.js
import React, { useState } from 'react'
import Autocomplete from 'react-google-autocomplete'

// Helper to format date/time for display
function formatDisplayDate(dateObj) {
  const options = { year: '2-digit', month: 'short', day: 'numeric' }
  return dateObj.toLocaleDateString('en-US', options) // e.g. "Feb 24, 25"
}
function formatDisplayTime(dateObj) {
  const options = { hour: 'numeric', minute: '2-digit' }
  return dateObj.toLocaleTimeString('en-US', options) // e.g. "2:00 PM"
}

export default function CreateEventPage() {
  // 1) MAIN STATE
  const [eventName, setEventName] = useState('')
  const [eventAddress, setEventAddress] = useState('')
  const [eventDate, setEventDate] = useState('')
  const [eventTime, setEventTime] = useState('')

  const [deliverySameAsEvent, setDeliverySameAsEvent] = useState(true)
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [deliveryDate, setDeliveryDate] = useState('')
  const [deliveryTime, setDeliveryTime] = useState('')
  const [fundingDeadline, setFundingDeadline] = useState('')

  const [groupReuse, setGroupReuse] = useState('no')
  const [groupTitle, setGroupTitle] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  // Control modals
  const [showDateModal, setShowDateModal] = useState(false)
  const [showShoppingModal, setShowShoppingModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  // Track if user completed date/time => hide “Set Date/Time” button
  const [dateTimeSet, setDateTimeSet] = useState(false)
  // Track if user completed shopping => hide “Set Shopping Details” button
  const [shoppingSet, setShoppingSet] = useState(false)

  // Strapi config (put your actual API key here)
  const STRAPI_API_URL = 'http://localhost:1337/api/events'
  const STRAPI_API_KEY = 'YOUR_LONG_STRAPI_API_KEY'

  // 2) VALIDATION + SUBMISSION
  const handleCreateEvent = async () => {
    setErrorMessage('')
    let eventDateTime = null
    if (eventDate && eventTime) {
      try {
        eventDateTime = new Date(`${eventDate}T${eventTime}:00`)
      } catch {
        setErrorMessage('Invalid event date/time format.')
        return
      }
    }

    let deliveryDateTimeObj = null
    if (deliveryDate && deliveryTime) {
      try {
        deliveryDateTimeObj = new Date(`${deliveryDate}T${deliveryTime}:00`)
      } catch {
        setErrorMessage('Invalid delivery date/time format.')
        return
      }
    }

    let fundingDeadlineObj = null
    if (fundingDeadline) {
      try {
        fundingDeadlineObj = new Date(fundingDeadline)
      } catch {
        setErrorMessage('Invalid fundraising deadline format.')
        return
      }
    }

    // Validate that the delivery date/time is NOT after event date/time
    if (eventDateTime && deliveryDateTimeObj) {
      if (deliveryDateTimeObj > eventDateTime) {
        setErrorMessage('Delivery date/time cannot be after the event date/time.')
        return
      }
    }
    // Validate that fundingDeadline is not after event date/time
    if (eventDateTime && fundingDeadlineObj) {
      if (fundingDeadlineObj > eventDateTime) {
        setErrorMessage('Fundraising deadline cannot be after the event date/time.')
        return
      }
    }

    const finalEventTime = eventTime && eventTime.includes(':')
      ? `${eventTime}:00`
      : eventTime

    const finalDeliveryTime = deliveryTime && deliveryTime.includes(':')
      ? `${deliveryTime}:00`
      : deliveryTime

    const eventData = {
      data: {
        title: eventName,
        location: eventAddress,
        date: eventDate,
        time: finalEventTime,
        deliveryAddress: deliverySameAsEvent ? eventAddress : deliveryAddress,
        deliveryDate,
        deliveryTime: finalDeliveryTime,
        fundingDeadline,
        groupReuse,
        groupTitle: groupReuse === 'yes' ? groupTitle : null,
        state: 'pending'
      }
    }

    try {
      const res = await fetch(STRAPI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${STRAPI_API_KEY}`
        },
        body: JSON.stringify(eventData)
      })
      const json = await res.json()
      if (!res.ok) {
        console.error('Error creating event in Strapi:', json)
        setErrorMessage('Failed to create event. Check console for details.')
        return
      }
      setShowSuccessModal(true)
      console.log('Event response:', json)
      // Reset
      setEventName('')
      setEventAddress('')
      setEventDate('')
      setEventTime('')
      setDeliverySameAsEvent(true)
      setDeliveryAddress('')
      setDeliveryDate('')
      setDeliveryTime('')
      setFundingDeadline('')
      setGroupReuse('no')
      setGroupTitle('')
      setDateTimeSet(false)
      setShoppingSet(false)
      setErrorMessage('')
    } catch (error) {
      console.error('Error:', error)
      setErrorMessage('Error creating event. See console for details.')
    }
  }

  // 3) Once user hits “Done” in date/time modal
  const handleDateModalDone = () => {
    if (!eventDate || !eventTime) {
      setErrorMessage('Please pick event date/time.')
      return
    }
    setErrorMessage('')
    const dt = new Date(`${eventDate}T${eventTime}:00`)
    const minus24 = new Date(dt.getTime() - 24 * 60 * 60 * 1000)

    const yyyy = minus24.getFullYear()
    const mm = String(minus24.getMonth() + 1).padStart(2, '0')
    const dd = String(minus24.getDate()).padStart(2, '0')
    const hh = String(minus24.getHours()).padStart(2, '0')
    const min = String(minus24.getMinutes()).padStart(2, '0')
    const iso = `${yyyy}-${mm}-${dd}T${hh}:${min}`

    setFundingDeadline(iso)
    setShowDateModal(false)
    setDateTimeSet(true)
  }

  // 4) Once user hits “Done” in the shopping modal
  const handleShoppingModalDone = () => {
    if (!deliverySameAsEvent && !deliveryAddress) {
      setErrorMessage('Please provide a delivery address or pick same as event.')
      return
    }
    if (!deliveryDate || !deliveryTime) {
      setErrorMessage('Please pick delivery date/time.')
      return
    }
    setErrorMessage('')
    setShowShoppingModal(false)
    setShoppingSet(true)
  }

  // 5) RENDER
  return (
    <>
      {/* 
        DO NOT render <Navbar> here—it's already in _app.js.
        So remove any “import Navbar” or <Navbar ...> usage. 
      */}

      <div className="page-background">
        <div className="createevents-accent2-bg">
          <div className="createevents-accent1-bg">
            <div className="createevents-container2">
              <div className="createevents-content">
                <h2 className="thq-heading-2">Plan Your Event</h2>
                {errorMessage && (
                  <div className="error-message">{errorMessage}</div>
                )}

                {/* EVENT NAME */}
                <label>Event Name</label>
                <input
                  type="text"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  placeholder="e.g. 'Gala Bash'"
                />

                {/* EVENT ADDRESS */}
                <label>Event Address</label>
                {!eventAddress && (
                  <Autocomplete
                    apiKey="AIzaSyDIJPLNjk7OMPfEIfs9pGo20LmHKkzzsu0"
                    onPlaceSelected={(place) => {
                      const formatted = place.formatted_address || place.name || ''
                      setEventAddress(formatted)
                    }}
                    options={{
                      types: ['establishment', 'geocode'],
                      componentRestrictions: { country: 'us' }
                    }}
                    className="google-places-input"
                    placeholder="Type or select your event location"
                  />
                )}
                {eventAddress && (
                  <div className="address-confirmation">
                    <span>Selected Address: </span>
                    <strong>{eventAddress}</strong>{' '}
                    <button
                      type="button"
                      className="edit-link"
                      onClick={() => {
                        setEventAddress('')
                        setErrorMessage('')
                      }}
                    >
                      Edit
                    </button>
                  </div>
                )}

                {/* DATE/TIME */}
                {!dateTimeSet && (
                  <button
                    type="button"
                    className="thq-button-outline"
                    onClick={() => {
                      setShowDateModal(true)
                      setErrorMessage('')
                    }}
                  >
                    Set Date/Time
                  </button>
                )}
                {dateTimeSet && (
                  <div className="date-time-readout">
                    <span>
                      <strong>Event Details: </strong>
                      {eventDate && eventTime ? (() => {
                        const dt = new Date(`${eventDate}T${eventTime}:00`)
                        const dateStr = formatDisplayDate(dt)
                        const timeStr = formatDisplayTime(dt)
                        return `${dateStr} at ${timeStr}`
                      })() : 'Not set'}
                    </span>
                    <button
                      type="button"
                      className="edit-link"
                      onClick={() => {
                        setShowDateModal(true)
                        setErrorMessage('')
                      }}
                    >
                      Edit
                    </button>
                  </div>
                )}

                {/* SHOPPING/DELIVERY */}
                {!shoppingSet && (
                  <button
                    type="button"
                    className="thq-button-outline"
                    onClick={() => {
                      setShowShoppingModal(true)
                      setErrorMessage('')
                    }}
                  >
                    Set Shopping Details
                  </button>
                )}
                {shoppingSet && (
                  <div className="date-time-readout">
                    <span>
                      <strong>Shopping/Delivery:</strong>{' '}
                      {deliverySameAsEvent
                        ? '(Same as Event Address)'
                        : deliveryAddress
                          ? deliveryAddress
                          : '(No address)'}
                      {' — '}
                      {deliveryDate && deliveryTime
                        ? (() => {
                            const dt = new Date(`${deliveryDate}T${deliveryTime}:00`)
                            const dateStr = formatDisplayDate(dt)
                            const timeStr = formatDisplayTime(dt)
                            return `${dateStr} at ${timeStr}`
                          })()
                        : '(No date/time)'}
                      {' — '}
                      {fundingDeadline
                        ? (() => {
                            const fd = new Date(fundingDeadline)
                            const dateStr = formatDisplayDate(fd)
                            const timeStr = formatDisplayTime(fd)
                            return `Funding closes: ${dateStr}, ${timeStr}`
                          })()
                        : ''}
                    </span>
                    <button
                      type="button"
                      className="edit-link"
                      onClick={() => {
                        setShowShoppingModal(true)
                        setErrorMessage('')
                      }}
                    >
                      Edit
                    </button>
                  </div>
                )}

                {/* TAG FOR FUTURE REUSE */}
                <label>Tag this event for future reuse?</label>
                <select
                  value={groupReuse}
                  onChange={(e) => setGroupReuse(e.target.value)}
                >
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
                {groupReuse === 'yes' && (
                  <>
                    <label>Group Title</label>
                    <input
                      type="text"
                      value={groupTitle}
                      onChange={(e) => setGroupTitle(e.target.value)}
                      placeholder="e.g. '5th Grade Girls Soccer'"
                    />
                  </>
                )}

                {/* CREATE EVENT */}
                <button
                  type="button"
                  className="thq-button-filled create-event-button"
                  onClick={handleCreateEvent}
                >
                  Create Event
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* DATE MODAL */}
        {showDateModal && (
          <div
            className="modal-overlay"
            onClick={() => {
              setShowDateModal(false)
              setErrorMessage('')
            }}
          >
            <div
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
            >
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
                  type="button"
                  className="thq-button-outline"
                  onClick={() => {
                    setShowDateModal(false)
                    setErrorMessage('')
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="thq-button-filled"
                  onClick={handleDateModalDone}
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SHOPPING MODAL */}
        {showShoppingModal && (
          <div
            className="modal-overlay"
            onClick={() => {
              setShowShoppingModal(false)
              setErrorMessage('')
            }}
          >
            <div
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <h3>Set Shopping/Delivery Details</h3>
              <label>Delivery Address</label>
              <div style={{ marginBottom: '0.5rem' }}>
                <input
                  type="radio"
                  id="sameAddr"
                  name="deliveryAddrOption"
                  checked={deliverySameAsEvent}
                  onChange={() => {
                    setDeliverySameAsEvent(true)
                    setDeliveryAddress('')
                  }}
                />
                <label htmlFor="sameAddr"> Same as Event Address</label>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <input
                  type="radio"
                  id="diffAddr"
                  name="deliveryAddrOption"
                  checked={!deliverySameAsEvent}
                  onChange={() => {
                    setDeliverySameAsEvent(false)
                  }}
                />
                <label htmlFor="diffAddr"> Different address</label>
              </div>
              {!deliverySameAsEvent && (
                <Autocomplete
                  apiKey="AIzaSyDIJPLNjk7OMPfEIfs9pGo20LmHKkzzsu0"
                  onPlaceSelected={(place) => {
                    const formatted = place.formatted_address || place.name || ''
                    setDeliveryAddress(formatted)
                  }}
                  options={{
                    types: ['establishment', 'geocode'],
                    componentRestrictions: { country: 'us' }
                  }}
                  className="google-places-input"
                  placeholder="Type or select a delivery address"
                  defaultValue={deliveryAddress}
                />
              )}

              <label>Delivery Date</label>
              <input
                type="date"
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
              />
              <label>Delivery Time</label>
              <input
                type="time"
                value={deliveryTime}
                onChange={(e) => setDeliveryTime(e.target.value)}
              />

              <label>Fundraising Closes</label>
              <input
                type="datetime-local"
                value={fundingDeadline}
                onChange={(e) => setFundingDeadline(e.target.value)}
              />

              <div className="modal-buttons">
                <button
                  type="button"
                  className="thq-button-outline"
                  onClick={() => {
                    setShowShoppingModal(false)
                    setErrorMessage('')
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="thq-button-filled"
                  onClick={handleShoppingModalDone}
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SUCCESS MODAL */}
        {showSuccessModal && (
          <div className="modal-overlay" onClick={() => setShowSuccessModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3>Well done!</h3>
              <p>
                You've created your event. You can now create a shopping list or invite guests!
              </p>
              <div className="modal-buttons">
                <button
                  type="button"
                  className="thq-button-filled"
                  onClick={() => setShowSuccessModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

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
            url("https://play.teleporthq.io/static/svg/default-img.svg");
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
      `}</style>
    </>
  )
}