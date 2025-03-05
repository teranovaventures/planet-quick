
import React, { Fragment } from 'react'

import PropTypes from 'prop-types'
import { useTranslations } from 'next-intl'

const Steps = (props) => {
  return (
    <>
      <div className="steps-container1 thq-section-padding">
        <div className="steps-max-width thq-section-max-width">
          <div className="steps-container2 thq-grid-2">
            <img
              alt={props.imageAlt}
              src={props.imageSrc}
              className="steps-image thq-img-ratio-1-1 thq-img-scale"
            />
            <div className="steps-container3">
              <div className="steps-container4 thq-card">
                <h2 className="thq-heading-2">
                  {props.step1Title ?? (
                    <Fragment>
                      <span className="steps-text25">Create an Account</span>
                    </Fragment>
                  )}
                </h2>
                <span className="steps-text11 thq-body-small">
                  {props.step1Description ?? (
                    <Fragment>
                      <span className="steps-text29">
                        Sign up for a free account to start planning your events
                        and engaging your community.
                      </span>
                    </Fragment>
                  )}
                </span>
                <label className="steps-text12 thq-heading-3">01</label>
              </div>
              <div className="steps-container5 thq-card">
                <h2 className="thq-heading-2">
                  {props.step2Title ?? (
                    <Fragment>
                      <span className="steps-text24">Schedule Your Event</span>
                    </Fragment>
                  )}
                </h2>
                <span className="steps-text14 thq-body-small">
                  {props.step2Description ?? (
                    <Fragment>
                      <span className="steps-text27">
                        Set the date, time, and details of your event to let
                        your community know what&apos;s happening.
                      </span>
                    </Fragment>
                  )}
                </span>
                <label className="steps-text15 thq-heading-3">02</label>
              </div>
              <div className="steps-container6 thq-card">
                <h2 className="thq-heading-2">
                  {props.step3Title ?? (
                    <Fragment>
                      <span className="steps-text22">Crowdfund Your Event</span>
                    </Fragment>
                  )}
                </h2>
                <span className="steps-text17 thq-body-small">
                  {props.step3Description ?? (
                    <Fragment>
                      <span className="steps-text26">
                        Use our crowdfunding feature to raise funds for your
                        event and make it a success.
                      </span>
                    </Fragment>
                  )}
                </span>
                <label className="steps-text18 thq-heading-3">03</label>
              </div>
              <div className="steps-container7 thq-card">
                <h2 className="thq-heading-2">
                  {props.step4Title ?? (
                    <Fragment>
                      <span className="steps-text23">
                        Increase Participation
                      </span>
                    </Fragment>
                  )}
                </h2>
                <span className="steps-text20 thq-body-small">
                  {props.step4Description ?? (
                    <Fragment>
                      <span className="steps-text28">
                        Get more people involved in your events by easily
                        coordinating schedules and resources.
                      </span>
                    </Fragment>
                  )}
                </span>
                <label className="steps-text21 thq-heading-3">04</label>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx>
        {`
          .steps-container1 {
            width: 100%;
            display: flex;
            position: relative;
            align-items: center;
            flex-direction: column;
            justify-content: center;
          }
          .steps-max-width {
            gap: var(--dl-space-space-fourunits);
            width: 100%;
            display: flex;
            align-items: flex-start;
            flex-direction: row;
          }
          .steps-container2 {
            align-items: start;
          }
          .steps-image {
            width: 450px;
            height: 450px;
            box-shadow: 8px 8px 13px 0px #2b2a2a;
            margin-top: var(--dl-space-space-eightunits);
            object-fit: cover;
            border-top-left-radius: var(--dl-radius-radius-radis46px);
            border-top-right-radius: var(--dl-radius-radius-radis46px);
            border-bottom-left-radius: var(--dl-radius-radius-radis46px);
            border-bottom-right-radius: var(--dl-radius-radius-radis46px);
          }
          .steps-container3 {
            grid-area: span 1 / span 1 / span 1 / span 1;
          }
          .steps-container4 {
            top: 10%;
            position: sticky;
            transform: rotate(-2deg);
            box-shadow: 5px 5px 13px 0px #2b2a2a;
            border-radius: var(--dl-radius-radius-radis46px);
            margin-bottom: var(--dl-space-space-twounits);
            background-color: var(--dl-color-theme-accent1);
            border-top-left-radius: var(--dl-radius-radius-radis46px);
            border-top-right-radius: var(--dl-radius-radius-radis46px);
            border-bottom-left-radius: var(--dl-radius-radius-radis46px);
            border-bottom-right-radius: var(--dl-radius-radius-radis46px);
          }
          .steps-text11 {
            text-align: center;
          }
          .steps-text12 {
            top: var(--dl-space-space-unit);
            right: var(--dl-space-space-unit);
            position: absolute;
            font-size: 40px;
            font-style: normal;
            font-weight: 700;
          }
          .steps-container5 {
            top: 10%;
            position: sticky;
            transform: rotate(2deg);
            box-shadow: 8px 8px 13px 0px #2b2a2a;
            margin-bottom: var(--dl-space-space-twounits);
            background-color: var(--dl-color-theme-accent2);
            border-top-left-radius: var(--dl-radius-radius-radis46px);
            border-top-right-radius: var(--dl-radius-radius-radis46px);
            border-bottom-left-radius: var(--dl-radius-radius-radis46px);
            border-bottom-right-radius: var(--dl-radius-radius-radis46px);
          }
          .steps-text14 {
            text-align: center;
          }
          .steps-text15 {
            top: var(--dl-space-space-unit);
            right: var(--dl-space-space-unit);
            position: absolute;
            font-size: 40px;
            font-style: normal;
            font-weight: 700;
          }
          .steps-container6 {
            top: 10%;
            position: sticky;
            transform: rotate(-2deg);
            box-shadow: 8px 8px 13px 0px #2b2a2a;
            margin-bottom: var(--dl-space-space-twounits);
            background-color: var(--dl-color-theme-accent1);
            border-top-left-radius: var(--dl-radius-radius-radis46px);
            border-top-right-radius: var(--dl-radius-radius-radis46px);
            border-bottom-left-radius: var(--dl-radius-radius-radis46px);
            border-bottom-right-radius: var(--dl-radius-radius-radis46px);
          }
          .steps-text17 {
            text-align: center;
          }
          .steps-text18 {
            top: var(--dl-space-space-unit);
            right: var(--dl-space-space-unit);
            position: absolute;
            font-size: 40px;
            font-style: normal;
            font-weight: 700;
          }
          .steps-container7 {
            top: 10%;
            position: sticky;
            transform: rotate(2deg);
            box-shadow: 5px 5px 13px 0px #2b2a2a;
            background-color: var(--dl-color-theme-accent2);
            border-top-left-radius: var(--dl-radius-radius-radis46px);
            border-top-right-radius: var(--dl-radius-radius-radis46px);
            border-bottom-left-radius: var(--dl-radius-radius-radis46px);
            border-bottom-right-radius: var(--dl-radius-radius-radis46px);
          }
          .steps-text20 {
            text-align: center;
          }
          .steps-text21 {
            top: var(--dl-space-space-unit);
            right: var(--dl-space-space-unit);
            position: absolute;
            font-size: 40px;
            font-style: normal;
            font-weight: 700;
          }
          .steps-text22 {
            display: inline-block;
          }
          .steps-text23 {
            display: inline-block;
          }
          .steps-text24 {
            display: inline-block;
          }
          .steps-text25 {
            display: inline-block;
          }
          .steps-text26 {
            display: inline-block;
          }
          .steps-text27 {
            display: inline-block;
          }
          .steps-text28 {
            display: inline-block;
          }
          .steps-text29 {
            display: inline-block;
          }
          @media (max-width: 991px) {
            .steps-max-width {
              flex-direction: column;
            }
          }
          @media (max-width: 767px) {
            .steps-container4 {
              width: 100%;
            }
            .steps-container5 {
              width: 100%;
            }
            .steps-container6 {
              width: 100%;
            }
            .steps-container7 {
              width: 100%;
            }
          }
        `}
      </style>
    </>
  )
}

Steps.defaultProps = {
  step3Title: undefined,
  step4Title: undefined,
  step2Title: undefined,
  step1Title: undefined,
  imageAlt: 'image',
  step3Description: undefined,
  step2Description: undefined,
  imageSrc: '/unsplash-image14-1200w.webp',
  step4Description: undefined,
  step1Description: undefined,
}

Steps.propTypes = {
  step3Title: PropTypes.element,
  step4Title: PropTypes.element,
  step2Title: PropTypes.element,
  step1Title: PropTypes.element,
  imageAlt: PropTypes.string,
  step3Description: PropTypes.element,
  step2Description: PropTypes.element,
  imageSrc: PropTypes.string,
  step4Description: PropTypes.element,
  step1Description: PropTypes.element,
}

export default Steps
