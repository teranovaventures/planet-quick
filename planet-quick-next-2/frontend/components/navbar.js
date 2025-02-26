// components/navbar.js
import React, { useState, Fragment } from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'

const Navbar = (props) => {
  const [dropdownOpen, setDropdownOpen] = useState(false)

  // Close the dropdown if the user clicks anywhere in the header (outside the dropdown)
  const handleOutsideClick = () => {
    if (dropdownOpen) setDropdownOpen(false)
  }

  // Toggle the dropdown when “more” is clicked
  const toggleDropdown = (e) => {
    e.stopPropagation()
    setDropdownOpen(!dropdownOpen)
  }

  // Placeholder for sign-out functionality
  const handleSignOut = (e) => {
    e.preventDefault()
    console.log('Signing out...')
    // Add your sign-out logic here.
  }

  // Smooth-scroll to the #active-events section when Events is clicked
  const scrollToEvents = (e) => {
    e.preventDefault()
    const el = document.getElementById('active-events')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    // Outer header that closes dropdown when clicking outside
    <header className="navbar-container1" onClick={handleOutsideClick}>
      <div
        data-thq="thq-navbar"
        className="navbar-navbar-interactive"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Logo on left */}
        <img
          alt={props.imageAlt}
          src={props.imageSrc}
          className="navbar-image"
        />

        {/* Desktop Menu */}
        <div data-thq="thq-navbar-nav" className="navbar-desktop-menu">
          <nav className="navbar-links1">
            {/* Home */}
            <Link href="/" legacyBehavior>
              <a className="navbar-link11 thq-body-small thq-link">
                {props.link1 ?? <span className="navbar-text14">Home</span>}
              </a>
            </Link>

            {/* Events → scroll to #active-events */}
            <a
              href="#active-events"
              className="thq-body-small thq-link"
              onClick={scrollToEvents}
            >
              {props.link2 ?? <span className="navbar-text21">Events</span>}
            </a>

            {/* Reports */}
            <Link href="/reports" legacyBehavior>
              <a className="navbar-link31 thq-body-small thq-link">
                {props.link3 ?? <span className="navbar-text27">Reports</span>}
              </a>
            </Link>

            {/* “more” dropdown trigger */}
            <div
              className="navbar-link4-dropdown-trigger"
              onClick={toggleDropdown}
            >
              <span className="thq-body-small thq-link">
                {props.link4 ?? <span className="navbar-text20">More</span>}
              </span>
              <div className="navbar-icon-container1">
                {dropdownOpen ? (
                  <div className="navbar-container2">
                    <svg viewBox="0 0 1024 1024" className="navbar-icon10">
                      <path d="M298 426h428l-214 214z"></path>
                    </svg>
                  </div>
                ) : (
                  <div className="navbar-container3">
                    <svg viewBox="0 0 1024 1024" className="navbar-icon12">
                      <path d="M426 726v-428l214 214z"></path>
                    </svg>
                  </div>
                )}
              </div>

              {/* Dropdown menu (desktop) */}
              {dropdownOpen && (
                <div
                  className="navbar-dropdown"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Link href="/pending-events" legacyBehavior>
                    <a className="dropdown-menu-item">
                      <span className="dropdown-menu-text">Pending Events</span>
                    </a>
                  </Link>
                  <Link href="/admin" legacyBehavior>
                    <a className="dropdown-menu-item">
                      <span className="dropdown-menu-text">Admin</span>
                    </a>
                  </Link>
                  <a
                    href="#signout"
                    className="dropdown-menu-item"
                    onClick={handleSignOut}
                  >
                    <span className="dropdown-menu-text">Sign Out</span>
                  </a>
                </div>
              )}
            </div>
          </nav>

          {/* Right side buttons */}
          <div className="navbar-buttons1">
            <button
              className="navbar-action11 thq-button-animated thq-button-filled"
              onClick={() => console.log('Get Started clicked')}
            >
              <span>
                {props.action1 ?? (
                  <span className="navbar-text26">Get Started</span>
                )}
              </span>
            </button>
            <button
              className="navbar-action21 thq-button-animated thq-button-outline"
              onClick={() => props.setIsModalOpen(true)}
            >
              <span>
                {props.action2 ?? (
                  <span className="navbar-text23">Sign In</span>
                )}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile burger icon (hidden on desktop) */}
        <div data-thq="thq-burger-menu" className="navbar-burger-menu">
          <svg viewBox="0 0 1024 1024" className="navbar-icon14">
            <path d="M128 554.667h768c23.552 0 42.667-19.115 42.667-42.667s-19.115-42.667-42.667-42.667h-768c-23.552 0-42.667 19.115-42.667 42.667s19.115 42.667 42.667 42.667zM128 298.667h768c23.552 0 42.667-19.115 42.667-42.667s-19.115-42.667-42.667-42.667h-768c-23.552 0-42.667 19.115-42.667 42.667s19.115 42.667 42.667 42.667zM128 810.667h768c23.552 0 42.667-19.115 42.667-42.667s-19.115-42.667-42.667-42.667h-768c-23.552 0-42.667 19.115-42.667 42.667s19.115 42.667 42.667 42.667z"></path>
          </svg>
        </div>
      </div>

      {/* Styles */}
      <style jsx>{`
        .navbar-container1 {
          top: 0;
          width: 100%;
          display: flex;
          z-index: 1000;
          position: sticky;
          justify-content: center;
          background-color: var(--dl-color-theme-neutral-light);
        }
        .navbar-navbar-interactive {
          width: 100%;
          display: flex;
          z-index: 100;
          max-width: var(--dl-size-size-maxwidth);
          align-items: center;
          padding: var(--dl-space-space-oneandhalfunits)
            var(--dl-space-space-threeunits);
          justify-content: space-between;
        }
        .navbar-image {
          width: 103px;
          height: 78px;
          object-fit: cover;
          border-radius: 46px;
        }
        .navbar-desktop-menu {
          flex: 1;
          display: flex;
          justify-content: space-between;
        }
        .navbar-links1 {
          gap: var(--dl-space-space-twounits);
          flex: 1;
          display: flex;
          align-items: center;
          margin-left: var(--dl-space-space-twounits);
          flex-direction: row;
          justify-content: flex-start;
        }
        .navbar-link11,
        .navbar-link31 {
          text-decoration: none;
        }
        .navbar-link4-dropdown-trigger {
          position: relative;
          gap: 4px;
          cursor: pointer;
          display: flex;
          align-self: stretch;
          align-items: center;
          flex-direction: row;
          justify-content: flex-end;
        }
        .navbar-icon-container1 {
          display: flex;
          align-items: center;
          flex-direction: row;
          justify-content: flex-end;
        }
        .navbar-container2 {
          display: flex;
          align-items: center;
          animation-name: rotateInDownLeft;
          animation-duration: 500ms;
          animation-iteration-count: 1;
        }
        .navbar-icon10 {
          width: 24px;
          height: 24px;
        }
        .navbar-container3 {
          display: flex;
          align-items: center;
          animation-name: rotateInDownRight;
          animation-duration: 500ms;
          animation-iteration-count: 1;
        }
        .navbar-icon12 {
          width: 24px;
          height: 24px;
        }
        .navbar-buttons1 {
          gap: var(--dl-space-space-twounits);
          display: flex;
          align-items: center;
          flex-direction: row;
        }
        .navbar-action11,
        .navbar-action21 {
          display: flex;
          flex-direction: row;
        }
        .navbar-burger-menu {
          display: none;
        }
        .navbar-icon14 {
          width: var(--dl-size-size-xsmall);
          height: var(--dl-size-size-xsmall);
        }
        /* Dropdown styles */
        .navbar-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          width: 400px;
          background-color: var(--dl-color-theme-neutral-light);
          border: 1px solid #ccc;
          border-radius: 8px;
          padding: 0.5rem;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          display: flex;
          flex-direction: row;
          justify-content: space-evenly;
          align-items: center;
          z-index: 999;
        }
        .dropdown-menu-item {
          display: flex;
          justify-content: center;
          align-items: center;
          text-decoration: none;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 6px;
          width: 120px;
        }
        .dropdown-menu-item:hover {
          background-color: #f2f2f2;
        }
        /* Updated text style: reduced font size and tightened letter spacing */
        .dropdown-menu-text {
          font-family: inherit;
          font-size: 0.875rem;
          color: inherit;
          text-align: center;
          letter-spacing: -0.5px;
        }
        @media (max-width: 767px) {
          .navbar-desktop-menu {
            display: none;
          }
          .navbar-burger-menu {
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
          }
        }
      `}</style>
    </header>
  )
}

Navbar.defaultProps = {
  imageAlt: 'Logo alt text',
  imageSrc: '/tera%20nova%20logo-400h-1500h.webp',
  link1: null,
  link2: null,
  link3: null,
  link4: null,
  linkUrlPage1: '/pending-events',
  linkUrlPage2: '/admin',
  setIsModalOpen: () => {},
  action1: null,
  action2: null,
}

Navbar.propTypes = {
  imageAlt: PropTypes.string,
  imageSrc: PropTypes.string,
  link1: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  link2: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  link3: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  link4: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  linkUrlPage1: PropTypes.string,
  linkUrlPage2: PropTypes.string,
  setIsModalOpen: PropTypes.func,
  action1: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  action2: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
}

export default Navbar

