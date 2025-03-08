import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTranslations } from 'next-intl';

const Eventslist = (props) => {
  const [isMonthly, setIsMonthly] = useState(true);
  const [activeEvents, setActiveEvents] = useState([]);

  useEffect(() => {
    if (!props.user || !props.user.id) {
      console.log("🚨 No user found for fetching active events.");
      return;
    }

    const userId = String(props.user.id);
    fetch(`http://localhost:1337/api/events?filters[pqeventstatus][$eq]=active&filters[pqcoordinator][$eq]=${userId}`, {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN || 'YOUR_STRAPI_API_TOKEN'}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("📌 Active Events API Response:", data);
        setActiveEvents(data.data || []);
      })
      .catch((err) => console.error("🚨 Error fetching active events:", err));
  }, [props.user]);

  return (
    <>
      <div className="eventslist-pricing23 thq-section-padding">
        <div className="eventslist-eventsbox thq-section-max-width">
          <div className="eventslist-eventssectiontitle">
            <div className="eventslist-your-events">
              <h2 className="eventslist-title thq-heading-2">
                {props.heading1 ?? <span>Active Events</span>}
              </h2>
            </div>
          </div>
          <div className="eventslist-activepreviouseventsbutton">
            {!isMonthly && (
              <button
                onClick={() => setIsMonthly(true)}
                className="eventslist-event-page-button thq-button-animated thq-button-outline"
              >
                <span className="thq-body-small">Monthly</span>
              </button>
            )}
            <button
              onClick={() => setIsMonthly(false)}
              className="eventslist-activeeventbutton thq-button-animated thq-button-filled"
            >
              <span className="thq-body-small">Active</span>
            </button>
            {isMonthly && (
              <button
                onClick={() => setIsMonthly(false)}
                className="eventslist-previouseventbutton thq-button-animated thq-button-outline"
              >
                <span className="thq-body-small">Previous</span>
              </button>
            )}
          </div>
          {isMonthly && (
            <div className="eventslist-eventotlal1">
              {activeEvents.slice(0, 3).map((event, index) => (
                <div key={index} className={`eventslist-eventbox${index + 1} thq-card`}>
                  <div className={`eventslist-eventdesc${index + 1}`}>
                    <div className={`eventslist-eventtitle${index + 1}`}>
                      <p className={`eventslist-eventdate${index + 1} thq-body-large`}>
                        {event.attributes.pqstartdate
                          ? new Date(event.attributes.pqstartdate).toLocaleDateString()
                          : "Date TBD"}
                      </p>
                      <h3 className={`eventslist-eventtitle${index + 2} thq-heading-3`}>
                        {event.attributes.pqeventname || "Event Title"}
                      </h3>
                      <p className="thq-body-large">
                        {event.attributes.totalCost || "Cost TBD"}
                      </p>
                    </div>
                    <img
                      alt="Event Logo"
                      src="/olglogo-200h.webp"
                      className={`eventslist-orglogo${index + 1}`}
                    />
                  </div>
                  <button className={`eventslist-eventbutton${index + 1} thq-button-animated thq-button-filled`}>
                    <span className="thq-body-small">View Event</span>
                  </button>
                </div>
              ))}
            </div>
          )}
          {isMonthly && activeEvents.length > 3 && (
            <div className="eventslist-eventotlal2">
              {activeEvents.slice(3, 6).map((event, index) => (
                <div key={index} className={`eventslist-eventbox${index + 4} thq-card`}>
                  <div className={`eventslist-eventdesc${index + 4}`}>
                    <div className={`eventslist-eventtitle${index + 7}`}>
                      <p className={`eventslist-eventdate${index + 4} thq-body-large`}>
                        {event.attributes.pqstartdate
                          ? new Date(event.attributes.pqstartdate).toLocaleDateString()
                          : "Date TBD"}
                      </p>
                      <h3 className={`eventslist-eventtitle${index + 8} thq-heading-3`}>
                        {event.attributes.pqeventname || "Event Title"}
                      </h3>
                      <p className="thq-body-large">
                        {event.attributes.totalCost || "Cost TBD"}
                      </p>
                    </div>
                    <img
                      alt="Event Logo"
                      src="/olglogo-200h.webp"
                      className={`eventslist-orglogo${index + 4}`}
                    />
                  </div>
                  <button className={`eventslist-eventbutton${index + 4} thq-button-animated thq-button-filled`}>
                    <span className="thq-body-small">View Event</span>
                  </button>
                </div>
              ))}
            </div>
          )}
          {!isMonthly && (
            <div className="eventslist-container">
              <p>No previous events available.</p>
            </div>
          )}
        </div>
        <button className="eventslist-button6 thq-button-animated thq-button-filled">
          <span className="thq-body-small">More</span>
        </button>
      </div>
      <style jsx>{`
        .eventslist-pricing23 {
          width: 100%;
          height: auto;
          display: flex;
          overflow: hidden;
          position: relative;
          align-items: center;
          flex-shrink: 0;
          flex-direction: column;
        }
        .eventslist-eventsbox {
          gap: var(--dl-space-space-threeunits);
          width: 100%;
          display: flex;
          align-items: center;
          flex-direction: column;
        }
        .eventslist-eventssectiontitle {
          gap: var(--dl-space-space-unit);
          width: 100%;
          display: flex;
          max-width: 800px;
          align-items: center;
          flex-shrink: 0;
          flex-direction: column;
        }
        .eventslist-your-events {
          gap: var(--dl-space-space-oneandhalfunits);
          width: 100%;
          display: flex;
          max-width: 800px;
          align-self: stretch;
          align-items: center;
          flex-direction: column;
        }
        .eventslist-title {
          text-align: center;
          font-family: 'STIX Two Text, serif';
          font-size: 35px;
        }
        .eventslist-activepreviouseventsbutton {
          display: flex;
          align-items: flex-start;
        }
        .eventslist-event-page-button {
          gap: var(--dl-space-space-halfunit);
          width: 120px;
          height: 60px;
          border-style: solid;
          border-top-left-radius: 46px;
          border-top-right-radius: 0;
          border-bottom-left-radius: 46px;
          border-bottom-right-radius: 0;
        }
        .eventslist-activeeventbutton {
          gap: var(--dl-space-space-halfunit);
          color: var(--dl-color-theme-neutral-light);
          width: 120px;
          height: 60px;
          border-top-left-radius: 0;
          border-top-right-radius: 46px;
          border-bottom-left-radius: 0;
          border-bottom-right-radius: 46px;
          background: linear-gradient(90deg, #FFC78B 0%, #FFAD61 100%);
        }
        .eventslist-previouseventbutton {
          gap: var(--dl-space-space-halfunit);
          width: 120px;
          height: 60px;
          border-style: solid;
          border-top-left-radius: 0;
          border-top-right-radius: 46px;
          border-bottom-left-radius: 0;
          border-bottom-right-radius: 46px;
        }
        .eventslist-eventotlal1, .eventslist-eventotlal2 {
          gap: var(--dl-space-space-twounits);
          width: 100%;
          display: flex;
          align-self: stretch;
          align-items: flex-start;
          flex-shrink: 0;
          animation-name: fadeIn;
          animation-delay: 0s;
          animation-duration: 300ms;
          animation-direction: normal;
          animation-iteration-count: 1;
          animation-timing-function: ease;
        }
        .eventslist-eventbox1, .eventslist-eventbox2, .eventslist-eventbox3,
        .eventslist-eventbox4 {
          gap: var(--dl-space-space-twounits);
          flex: 1;
          width: 100%;
          display: flex;
          flex-grow: 1;
          align-self: stretch;
          align-items: center;
          border-color: var(--dl-color-theme-neutral-dark);
          border-style: solid;
          border-width: 1px;
          padding-right: 0px;
          flex-direction: column;
          background-color: #FFFFFF;
          border-radius: 46px;
          box-shadow: 8px 8px 13px 0px #2b2a2a;
        }
        .eventslist-eventdesc1, .eventslist-eventdesc2, .eventslist-eventdesc3,
        .eventslist-eventdesc4 {
          gap: var(--dl-space-space-twounits);
          display: flex;
          flex-grow: 1;
          align-self: stretch;
          align-items: center;
          flex-direction: column;
        }
        .eventslist-eventtitle1, .eventslist-eventtitle3, .eventslist-eventtitle5,
        .eventslist-eventtitle7 {
          gap: var(--dl-space-space-halfunit);
          display: flex;
          align-self: stretch;
          align-items: center;
          flex-direction: column;
        }
        .eventslist-eventdate1, .eventslist-eventdate2, .eventslist-eventdate3,
        .eventslist-eventdate4 {
          font-style: normal;
          font-weight: 600;
          font-family: 'STIX Two Text, serif';
        }
        .eventslist-eventtitle2, .eventslist-eventtitle4, .eventslist-eventtitle6,
        .eventslist-eventtitle8 {
          font-size: 40px;
          align-self: flex-start;
          font-family: 'STIX Two Text, serif';
        }
        .eventslist-orglogo1, .eventslist-orglogo2, .eventslist-orglogo3,
        .eventslist-orglogo4 {
          width: 200px;
          object-fit: cover;
        }
        .eventslist-eventbutton1, .eventslist-eventbutton2, .eventslist-eventbutton3,
        .eventslist-eventbutton4 {
          width: 100%;
          border-radius: 46px;
          background: linear-gradient(90deg, #FFC78B 0%, #FFAD61 100%);
          color: #191818;
          font-weight: 700;
          border: none;
          cursor: pointer;
        }
        .eventslist-eventbutton1:hover, .eventslist-eventbutton2:hover,
        .eventslist-eventbutton3:hover, .eventslist-eventbutton4:hover {
          color: #FFFFFF;
        }
        .eventslist-container {
          gap: 32px;
          width: 100%;
          display: flex;
          align-self: stretch;
          align-items: center;
          flex-shrink: 0;
          justify-content: center;
          animation-name: fadeIn;
          animation-delay: 0s;
          animation-duration: 300ms;
          animation-direction: normal;
          animation-iteration-count: 1;
          animation-timing-function: ease;
        }
        .eventslist-button6 {
          width: 182px;
          height: 53px;
          align-self: flex-end;
          box-shadow: 5px 5px 10px 0px #1e1d1d;
          margin-top: var(--dl-space-space-fiveunits);
          border-radius: 46px;
          background: linear-gradient(90deg, #FFC78B 0%, #FFAD61 100%);
          color: #191818;
          font-weight: 700;
          border: none;
          cursor: pointer;
        }
        .eventslist-button6:hover {
          color: #FFFFFF;
        }
        @media (max-width: 991px) {
          .eventslist-eventotlal1, .eventslist-eventotlal2, .eventslist-container {
            flex-direction: column;
          }
        }
        @media (max-width: 479px) {
          .eventslist-eventsbox {
            gap: var(--dl-space-space-oneandhalfunits);
          }
        }
      `}</style>
    </>
  );
};

Eventslist.defaultProps = {
  heading1: undefined,
};

Eventslist.propTypes = {
  heading1: PropTypes.element,
  user: PropTypes.object,
};

export default Eventslist;