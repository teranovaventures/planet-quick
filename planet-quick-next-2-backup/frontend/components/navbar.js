import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Navbar = ({ user, setUser, setIsModalOpen }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".profile-menu") && profileDropdownOpen) {
        setProfileDropdownOpen(false); // ✅ Close profile dropdown when clicking outside
      }
      if (!event.target.closest(".navbar-link4-dropdown-trigger") && dropdownOpen) {
        setDropdownOpen(false); // ✅ Close More dropdown when clicking outside
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [profileDropdownOpen, dropdownOpen]);

  const handleSignOut = (e) => {
    e.preventDefault();
    localStorage.removeItem('user');
    localStorage.removeItem('jwt');
    setUser(null);
    router.push('/');
  };

  return (
    <header className="navbar-container1">
      <div className="navbar-navbar-interactive">
        <img alt="Logo" src="/tera-nova-logo.png" className="navbar-image" />

        <div className="navbar-desktop-menu">
          <nav className="navbar-links1">
            <Link href="/" legacyBehavior>
              <a className="navbar-link">Home</a>
            </Link>
            <Link href="/events" legacyBehavior>
              <a className="navbar-link">Events</a>
            </Link>
            <Link href="/reports" legacyBehavior>
              <a className="navbar-link">Reports</a>
            </Link>

            {user && (
              <div
                className="navbar-link4-dropdown-trigger"
                onClick={(e) => {
                  e.stopPropagation();
                  setDropdownOpen(!dropdownOpen);
                }}
              >
                <span className="thq-body-small thq-link">More</span>
                {dropdownOpen && (
                  <div className="navbar-dropdown">
                    <Link href="/pending-events" legacyBehavior>
                      <a className="dropdown-menu-item">Pending Events</a>
                    </Link>
                    <Link href="/reports" legacyBehavior>
                      <a className="dropdown-menu-item">Reports</a>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </nav>

          <div className="navbar-buttons1">
            {!user ? (
              <>
                <button className="navbar-action11 thq-button-animated thq-button-filled" onClick={() => router.push('/sign-up')}>
                  <span>Get Started</span>
                </button>
                <button className="navbar-action21 thq-button-animated thq-button-outline" onClick={() => setIsModalOpen(true)}>
                  <span>Sign In</span>
                </button>
              </>
            ) : (
              <div
                className="profile-menu"
                onClick={(e) => {
                  e.stopPropagation();
                  setProfileDropdownOpen(!profileDropdownOpen);
                }}
              >
                {/* ✅ Restored Font Awesome Profile Icon */}
                <i className="fa-sharp fa-solid fa-chalkboard-user fa-flip-horizontal fa-lg profile-icon"></i>
                {profileDropdownOpen && (
                  <div className="profile-dropdown">
                    <Link href="/profile" legacyBehavior>
                      <a className="profile-dropdown-item">Profile</a>
                    </Link>
                    <a href="#" onClick={handleSignOut} className="profile-dropdown-item">Sign Out</a>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Styles */}
      <style jsx>{`
      
      .profile-menu {
          position: relative;
          cursor: pointer;
        }
        .profile-icon {
          font-size: 40px; /* ✅ Ensure the new icon is properly sized */
          color: #1263a1;
        }
        .profile-dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          background: white;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          width: 150px;
          display: flex;
          flex-direction: column;
          padding: 10px;
        }
        .profile-dropdown-item {
          padding: 6px;
          text-decoration: none;
          color: black;
          font-size: 14px;
          display: block;
        }
        .profile-dropdown-item:hover {
          background-color: #f2f2f2;
        }
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

