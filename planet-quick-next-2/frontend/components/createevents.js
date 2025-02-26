import React, { useState } from 'react'
import Autocomplete from 'react-google-autocomplete'

/**
 * This page uses:
 *  - The global sign-in modal from Navbar (triggered by setIsModalOpen(true)).
 *  - The local modals for date/time & shopping/delivery details.
 *  - The same "tile" or "accent" styling you had before (createevents-accent2-bg, etc.).
 */

function formatDisplayDate(dateObj) {
  const options = { year: '2-digit', month: 'short', day: 'numeric' }
  return dateObj.toLocaleDateString('en-US', options)
}
function formatDisplayTime(dateObj) {
  const options = { hour: 'numeric', minute: '2-digit' }
  return dateObj.toLocaleTimeString('en-US', options)
}

export default function CreateEventPage() {
  // Main form states
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

  // Local modals for date/time & shopping
  const [showDateModal, setShowDateModal] = useState(false)
  const [showShoppingModal, setShowShoppingModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  // Did the user finalize date/time or shopping details?
  const [dateTimeSet, setDateTimeSet] = useState(false)
  const [shoppingSet, setShoppingSet] = useState(false)

  // (Optional) Strapi config if you want to save the event
  const STRAPI_API_URL = 'http://localhost:1337/api/events'
  const STRAPI_API_KEY = 'YOUR_STRAPI_API_KEY' // put your real key

  // Submit event to Strapi (optional)
  const handleCreateEvent = async () => {
    setErrorMessage('')
    // Validate date/time
    let eventDateTime = null
    if (eventDate && eventTime) {
      try {
        eventDateTime = new Date(`${eventDate}T${eventTime}:00`)
      } catch {
        setErrorMessage('Invalid event date/time format.')
        return
      }
    }
    // Validate delivery
    let deliveryDateTimeObj = null
    if (deliveryDate && deliveryTime) {
      try {
        deliveryDateTimeObj = new Date(`${deliveryDate}T${deliveryTime}:00`)
      } catch {
        setErrorMessage('Invalid delivery date/time format.')
        return
      }
    }
    // Validate funding
    let fundingDeadlineObj = null
    if (fundingDeadline) {
      try {
        fundingDeadlineObj = new Date(fundingDeadline)
      } catch {
        setErrorMessage('Invalid fundraising deadline format.')
        return
      }
    }
    // Example constraints
    if (eventDateTime && deliveryDateTimeObj && deliveryDateTimeObj > eventDateTime) {
      setErrorMessage('Delivery cannot be after the event date/time.')
      return
    }
    if (eventDateTime && fundingDeadlineObj && fundingDeadlineObj > eventDateTime) {
      setErrorMessage('Fundraising deadline cannot be after the event date/time.')
      return
    }

    // Build final data
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

  // Once user hits “Done” in date/time modal
  const handleDateModalDone = () => {
    if (!eventDate || !eventTime) {
      setErrorMessage('Please pick event date/time.')
      return
    }
    setErrorMessage('')
    // For demonstration: auto-set the funding deadline to 24h before the event
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

  // Once user hits “Done” in the shopping modal
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

  return (
    <>
      <div className="page-background">
        {/* 
          Wrap your content in the same tile classes you had: 
          createevents-accent2-bg, etc.
        */}
        <div className="createevents-accent2-bg">
          <div className="createevents-accent1-bg">
            <div className="createevents-container2">
              <div className="createevents-content">
                <h2 className="thq-heading-2">Plan Your Event</h2>

                {errorMessage && (
                  <div className="error-message" style={{ color: 'red' }}>
                    {errorMessage}
                  </div>
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
                    apiKey="YOUR_GOOGLE_MAPS_API_KEY"
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

                {/* SET DATE/TIME */}
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

                {/* SET SHOPPING/DELIVERY */}
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
                    <strong>Shopping/Delivery:</strong>{' '}
                    {deliverySameAsEvent
                      ? '(Same as Event Address)'
                      : deliveryAddress || '(No address)'}
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

                {/* GROUP REUSE */}
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

        {/* DATE/TIME MODAL */}
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
                  apiKey="YOUR_GOOGLE_MAPS_API_KEY"
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

        {/* SUCCESS MODAL (after creating event) */}
        {showSuccessModal && (
          <div
            className="modal-overlay"
            onClick={() => setShowSuccessModal(false)}
          >
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3>Well done!</h3>
              <p>
                You&apos;ve created your event. You can now create a shopping list
                or invite guests!
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
    </>
  )
}