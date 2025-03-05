
import React, { Fragment } from 'react'

import PropTypes from 'prop-types'
import { useTranslations } from 'next-intl'

const Footer = (props) => {
  return (
    <>
      <footer className="footer-footer7 thq-section-padding">
        <div className="footer-max-width thq-section-max-width">
          <div className="footer-content">
            <div className="footer-logo1">
              <img
                alt={props.logoAlt}
                src={props.logoSrc}
                className="footer-logo2"
              />
            </div>
            <div className="footer-links">
              <a
                href="https://example.com"
                target="_blank"
                rel="noreferrer noopener"
                className="thq-body-small"
              >
                {props.link1 ?? (
                  <Fragment>
                    <span className="footer-text18">About Us</span>
                  </Fragment>
                )}
              </a>
              <a
                href="https://example.com"
                target="_blank"
                rel="noreferrer noopener"
                className="thq-body-small"
              >
                {props.link2 ?? (
                  <Fragment>
                    <span className="footer-text14">Contact Us</span>
                  </Fragment>
                )}
              </a>
              <a
                href="https://example.com"
                target="_blank"
                rel="noreferrer noopener"
                className="thq-body-small"
              >
                {props.link3 ?? (
                  <Fragment>
                    <span className="footer-text21">FAQ</span>
                  </Fragment>
                )}
              </a>
              <a
                href="https://example.com"
                target="_blank"
                rel="noreferrer noopener"
                className="thq-body-small"
              >
                {props.link4 ?? (
                  <Fragment>
                    <span className="footer-text16">Terms of Service</span>
                  </Fragment>
                )}
              </a>
              <a
                href="https://example.com"
                target="_blank"
                rel="noreferrer noopener"
                className="thq-body-small"
              >
                {props.link5 ?? (
                  <Fragment>
                    <span className="footer-text15">Privacy Policy</span>
                  </Fragment>
                )}
              </a>
            </div>
          </div>
          <div className="footer-credits">
            <div className="thq-divider-horizontal"></div>
            <div className="footer-row">
              <div className="footer-container">
                <span className="thq-body-small">© 2024 TeleportHQ</span>
              </div>
              <div className="footer-footer-links">
                <span className="footer-text11 thq-body-small">
                  {props.privacyLink ?? (
                    <Fragment>
                      <span className="footer-text19">Privacy Policy</span>
                    </Fragment>
                  )}
                </span>
                <span className="thq-body-small">
                  {props.termsLink ?? (
                    <Fragment>
                      <span className="footer-text20">Terms of Service</span>
                    </Fragment>
                  )}
                </span>
                <span className="thq-body-small">
                  {props.cookiesLink ?? (
                    <Fragment>
                      <span className="footer-text17">Cookies Policy</span>
                    </Fragment>
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>
      <style jsx>
        {`
          .footer-footer7 {
            width: 100%;
            height: auto;
            display: flex;
            overflow: hidden;
            position: relative;
            align-items: center;
            flex-shrink: 0;
            flex-direction: column;
            justify-content: center;
          }
          .footer-max-width {
            gap: var(--dl-space-space-threeunits);
            display: flex;
            align-items: center;
            flex-direction: column;
          }
          .footer-content {
            gap: var(--dl-space-space-twounits);
            display: flex;
            align-items: center;
            flex-direction: column;
          }
          .footer-logo1 {
            gap: 24px;
            display: flex;
            overflow: hidden;
            align-items: flex-start;
            flex-direction: column;
          }
          .footer-logo2 {
            height: 2rem;
          }
          .footer-links {
            gap: var(--dl-space-space-twounits);
            display: flex;
            align-items: flex-start;
          }
          .footer-credits {
            gap: var(--dl-space-space-twounits);
            display: flex;
            align-self: stretch;
            align-items: center;
            flex-direction: column;
          }
          .footer-row {
            display: flex;
            align-self: stretch;
            align-items: flex-start;
            flex-shrink: 0;
            justify-content: space-between;
          }
          .footer-container {
            display: flex;
            align-items: flex-start;
          }
          .footer-footer-links {
            gap: 24px;
            display: flex;
            align-items: flex-start;
          }
          .footer-text11 {
            fill: var(--dl-color-theme-neutral-dark);
            color: var(--dl-color-theme-neutral-dark);
          }
          .footer-text14 {
            display: inline-block;
          }
          .footer-text15 {
            display: inline-block;
          }
          .footer-text16 {
            display: inline-block;
          }
          .footer-text17 {
            display: inline-block;
          }
          .footer-text18 {
            display: inline-block;
          }
          .footer-text19 {
            display: inline-block;
          }
          .footer-text20 {
            display: inline-block;
          }
          .footer-text21 {
            display: inline-block;
          }
          @media (max-width: 767px) {
            .footer-row {
              gap: var(--dl-space-space-oneandhalfunits);
              align-items: center;
              flex-direction: column;
              justify-content: center;
            }
          }
          @media (max-width: 479px) {
            .footer-max-width {
              gap: var(--dl-space-space-oneandhalfunits);
            }
            .footer-links {
              flex-direction: column;
            }
            .footer-footer-links {
              align-items: center;
              flex-direction: column;
              justify-content: center;
            }
          }
        `}
      </style>
    </>
  )
}

Footer.defaultProps = {
  logoAlt: 'EventPlanner Logo',
  link2: undefined,
  link5: undefined,
  link4: undefined,
  cookiesLink: undefined,
  link1: undefined,
  logoSrc: 'https://presentation-website-assets.teleporthq.io/logos/logo.png',
  privacyLink: undefined,
  termsLink: undefined,
  link3: undefined,
}

Footer.propTypes = {
  logoAlt: PropTypes.string,
  link2: PropTypes.element,
  link5: PropTypes.element,
  link4: PropTypes.element,
  cookiesLink: PropTypes.element,
  link1: PropTypes.element,
  logoSrc: PropTypes.string,
  privacyLink: PropTypes.element,
  termsLink: PropTypes.element,
  link3: PropTypes.element,
}

export default Footer
