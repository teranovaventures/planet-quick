
import React, { Fragment } from 'react'
import Head from 'next/head'
import Link from 'next/link'
// Remove: import Navbar from '../components/navbar'
// Remove: import Modal from '../components/modal'
import Toppagephotos from '../components/toppagephotos'
import Steps from '../components/steps'
import Eventslist from '../components/eventslist'
import Footer from '../components/footer'

export default function TimeMachine() {
  return (
    <>
      <div className="time-machine-container1">
        <Head>
          <title>Planet-Quick</title>
          <meta property="og:title" content="Planet-Quick" />
        </Head>

        {/*
          DO NOT render <Navbar> or <Modal> here. 
          The global <Navbar> + sign-in modal are already in _app.js.
        */}

        {/* Hero Section */}
        <Toppagephotos
          content1={
            <Fragment>
              <span className="time-machine-text24">
                Simplify event planning and increase community engagement...
              </span>
            </Fragment>
          }
          heading1={
            <Fragment>
              <span className="time-machine-text25">
                Coordinate Events with Ease
              </span>
            </Fragment>
          }
        />

        {/* Steps Section */}
        <Steps
          step1Title={<Fragment><span>Create an Account</span></Fragment>}
          step2Title={<Fragment><span>Schedule Your Event</span></Fragment>}
          step3Title={<Fragment><span>Crowdfund Your Event</span></Fragment>}
          step4Title={<Fragment><span>Increase Participation</span></Fragment>}
          step1Description={<Fragment><span>Sign up for a free account…</span></Fragment>}
          step2Description={<Fragment><span>Set the date, time, and details…</span></Fragment>}
          step3Description={<Fragment><span>Use our crowdfunding feature…</span></Fragment>}
          step4Description={<Fragment><span>Get more people involved…</span></Fragment>}
        />

        {/* 3 Tiles Section */}
        <div className="tiles-column">
          {/* Tile 1: Create Event */}
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

          {/* Tile 2: Shopping List */}
          <Link href="/create-shopping-list" passHref legacyBehavior>
            <a className="tile-link tile-middle">
              <div className="createevents-accent2-bg">
                <div className="createevents-accent1-bg">
                  <div className="createevents-container2">
                    <div className="createevents-content">
                      <span className="thq-heading-2">
                        Pick Items for Purchase &amp; Delivery
                      </span>
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

          {/* Tile 3: Build Group */}
          <Link href="/create-group" passHref legacyBehavior>
            <a className="tile-link tile-bottom">
              <div className="createevents-accent2-bg">
                <div className="createevents-accent1-bg">
                  <div className="createevents-container2">
                    <div className="createevents-content">
                      <span className="thq-heading-2">
                        Build &amp; Invite your Group
                      </span>
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
        <Eventslist
          heading1={<Fragment><span>Active Events</span></Fragment>}
        />

        {/* Footer */}
        <Footer
          link1={<Fragment><span>About Us</span></Fragment>}
          link2={<Fragment><span>Contact Us</span></Fragment>}
          link3={<Fragment><span>FAQ</span></Fragment>}
          link4={<Fragment><span>Terms of Service</span></Fragment>}
          link5={<Fragment><span>Privacy Policy</span></Fragment>}
          logoSrc="/tera%20nova%20logo-400h-1500h.webp"
        />
      </div>

      <style jsx>{`
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
            url('https://play.teleporthq.io/static/svg/default-img.svg');
        }

        .tiles-column {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          margin: 3rem 0;
          align-items: center;
        }
        .tile-link {
          display: block;
          text-decoration: none;
        }
        .createevents-accent2-bg {
          gap: var(--dl-space-space-oneandhalfunits);
          display: flex;
          transition: 0.3s;
          align-items: center;
          justify-content: space-between;
          background-color: var(--dl-color-theme-accent2);
          border-radius: 46px;
        }
        .createevents-accent2-bg:hover {
          transform: scale3d(1.02, 1.02, 1.02);
        }
        .createevents-accent1-bg {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background-color: var(--dl-color-theme-accent1);
          border-radius: 46px;
        }
        .createevents-container2 {
          gap: var(--dl-space-space-threeunits);
          width: 800px;
          height: 220px;
          display: flex;
          box-shadow: 8px 8px 13px 0px #2b2a2a;
          transition: 0.3s;
          align-items: center;
          padding: var(--dl-space-space-twounits);
          border-radius: 46px;
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
            width: 90%;
            height: auto;
          }
        }
      `}</style>
    </>
  )
}