
import React, { useState, Fragment } from 'react'

import PropTypes from 'prop-types'
import { useTranslations } from 'next-intl'

const Eventslist = (props) => {
  const [isMonthly, setIsMonthly] = useState(true)
  return (
    <>
      <div className="eventslist-pricing23 thq-section-padding">
        <div className="eventslist-eventsbox thq-section-max-width">
          <div className="eventslist-eventssectiontitle">
            <div className="eventslist-your-events">
              <h2 className="eventslist-title thq-heading-2">
                {props.heading1 ?? (
                  <Fragment>
                    <span className="eventslist-text67">Your Events</span>
                  </Fragment>
                )}
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
              <div className="eventslist-eventbox1 thq-card">
                <div className="eventslist-eventdesc1">
                  <div className="eventslist-eventtitle1">
                    <p className="eventslist-eventdate1 thq-body-large">
                      {props.plan2 ?? (
                        <Fragment>
                          <span className="eventslist-text80">
                            Date of Event
                          </span>
                        </Fragment>
                      )}
                    </p>
                    <h3 className="eventslist-eventtitle2 thq-heading-3">
                      {props.plan2Price ?? (
                        <Fragment>
                          <span className="eventslist-text69">
                            Title of Event
                          </span>
                        </Fragment>
                      )}
                    </h3>
                    <p className="thq-body-large">
                      {props.plan2Yearly ?? (
                        <Fragment>
                          <span className="eventslist-text93">$125.00</span>
                        </Fragment>
                      )}
                    </p>
                  </div>
                  <img
                    alt={props.imageAlt3}
                    src={props.imageSrc3}
                    className="eventslist-orglogo1"
                  />
                </div>
                <button className="eventslist-eventbutton1 thq-button-animated thq-button-filled">
                  <span className="thq-body-small">
                    {props.plan2Action6 ?? (
                      <Fragment>
                        <span className="eventslist-text58">View Event</span>
                      </Fragment>
                    )}
                  </span>
                </button>
              </div>
              <div className="eventslist-eventbox2 thq-card">
                <div className="eventslist-eventdesc2">
                  <div className="eventslist-eventtitle3">
                    <p className="eventslist-eventdate2 thq-body-large">
                      {props.plan28 ?? (
                        <Fragment>
                          <span className="eventslist-text94">
                            Date of Event
                          </span>
                        </Fragment>
                      )}
                    </p>
                    <h3 className="eventslist-eventtitle4 thq-heading-3">
                      {props.plan2Price8 ?? (
                        <Fragment>
                          <span className="eventslist-text57">
                            Title of Event
                          </span>
                        </Fragment>
                      )}
                    </h3>
                    <p className="thq-body-large">
                      {props.plan2Yearly8 ?? (
                        <Fragment>
                          <span className="eventslist-text64">$125.00</span>
                        </Fragment>
                      )}
                    </p>
                  </div>
                  <img
                    alt={props.imageAlt33}
                    src={props.imageSrc33}
                    className="eventslist-orglogo2"
                  />
                </div>
                <button className="eventslist-eventbutton2 thq-button-animated thq-button-filled">
                  <span className="thq-body-small">
                    {props.plan2Action63 ?? (
                      <Fragment>
                        <span className="eventslist-text62">View Event</span>
                      </Fragment>
                    )}
                  </span>
                </button>
              </div>
              <div className="eventslist-eventbox3 thq-card">
                <div className="eventslist-eventdesc3">
                  <div className="eventslist-eventtitle5">
                    <p className="eventslist-eventdate3 thq-body-large">
                      {props.plan27 ?? (
                        <Fragment>
                          <span className="eventslist-text77">
                            Date of Event
                          </span>
                        </Fragment>
                      )}
                    </p>
                    <h3 className="eventslist-eventtitle6 thq-heading-3">
                      {props.plan2Price7 ?? (
                        <Fragment>
                          <span className="eventslist-text49">
                            Title of Event
                          </span>
                        </Fragment>
                      )}
                    </h3>
                    <p className="thq-body-large">
                      {props.plan2Yearly7 ?? (
                        <Fragment>
                          <span className="eventslist-text85">$125.00</span>
                        </Fragment>
                      )}
                    </p>
                  </div>
                  <img
                    alt={props.imageAlt32}
                    src={props.imageSrc32}
                    className="eventslist-orglogo3"
                  />
                </div>
                <button className="eventslist-eventbutton3 thq-button-animated thq-button-filled">
                  <span className="thq-body-small">
                    {props.plan2Action62 ?? (
                      <Fragment>
                        <span className="eventslist-text82">View Event</span>
                      </Fragment>
                    )}
                  </span>
                </button>
              </div>
            </div>
          )}
          {isMonthly && (
            <div className="eventslist-eventotlal2">
              <div className="eventslist-eventbox4 thq-card">
                <div className="eventslist-eventdesc4">
                  <div className="eventslist-eventtitle7">
                    <p className="eventslist-eventdate4 thq-body-large">
                      {props.plan26 ?? (
                        <Fragment>
                          <span className="eventslist-text84">
                            Date of Event
                          </span>
                        </Fragment>
                      )}
                    </p>
                    <h3 className="eventslist-eventtitle8 thq-heading-3">
                      {props.plan2Price6 ?? (
                        <Fragment>
                          <span className="eventslist-text70">
                            Title of Event
                          </span>
                        </Fragment>
                      )}
                    </h3>
                    <p className="thq-body-large">
                      {props.plan2Yearly6 ?? (
                        <Fragment>
                          <span className="eventslist-text89">$125.00</span>
                        </Fragment>
                      )}
                    </p>
                  </div>
                  <img
                    alt={props.imageAlt31}
                    src={props.imageSrc31}
                    className="eventslist-orglogo4"
                  />
                </div>
                <button className="eventslist-eventbutton4 thq-button-animated thq-button-filled">
                  <span className="thq-body-small">
                    {props.plan2Action61 ?? (
                      <Fragment>
                        <span className="eventslist-text88">View Event</span>
                      </Fragment>
                    )}
                  </span>
                </button>
              </div>
              <div className="eventslist-column1 thq-card">
                <div className="eventslist-price1">
                  <div className="eventslist-eventtile">
                    <p className="eventslist-text12 thq-body-large">
                      {props.plan251 ?? (
                        <Fragment>
                          <span className="eventslist-text79">
                            Date of Event
                          </span>
                        </Fragment>
                      )}
                    </p>
                    <h3 className="eventslist-text13 thq-heading-3">
                      {props.plan2Price51 ?? (
                        <Fragment>
                          <span className="eventslist-text55">
                            Title of Event
                          </span>
                        </Fragment>
                      )}
                    </h3>
                    <p className="thq-body-large">
                      {props.plan2Yearly51 ?? (
                        <Fragment>
                          <span className="eventslist-text86">$125.00</span>
                        </Fragment>
                      )}
                    </p>
                  </div>
                  <img
                    alt={props.imageAlt41}
                    src={props.imageSrc41}
                    className="eventslist-image1"
                  />
                </div>
                <button className="eventslist-button1 thq-button-animated thq-button-filled">
                  <span className="thq-body-small">
                    {props.plan2Action51 ?? (
                      <Fragment>
                        <span className="eventslist-text90">View Event</span>
                      </Fragment>
                    )}
                  </span>
                </button>
              </div>
              <div className="eventslist-column2 thq-card">
                <div className="eventslist-price2">
                  <div className="eventslist-price3">
                    <p className="eventslist-text16 thq-body-large">
                      {props.plan241 ?? (
                        <Fragment>
                          <span className="eventslist-text45">
                            Date of Event
                          </span>
                        </Fragment>
                      )}
                    </p>
                    <h3 className="eventslist-text17 thq-heading-3">
                      {props.plan2Price41 ?? (
                        <Fragment>
                          <span className="eventslist-text78">
                            Title of Event
                          </span>
                        </Fragment>
                      )}
                    </h3>
                    <p className="thq-body-large">
                      {props.plan2Yearly41 ?? (
                        <Fragment>
                          <span className="eventslist-text92">$125.00</span>
                        </Fragment>
                      )}
                    </p>
                  </div>
                  <img
                    alt={props.imageAlt51}
                    src={props.imageSrc51}
                    className="eventslist-image2"
                  />
                </div>
                <button className="eventslist-button2 thq-button-animated thq-button-filled">
                  <span className="thq-body-small">
                    {props.plan2Action41 ?? (
                      <Fragment>
                        <span className="eventslist-text56">View Event</span>
                      </Fragment>
                    )}
                  </span>
                </button>
              </div>
            </div>
          )}
          {!isMonthly && (
            <div className="eventslist-container">
              <div className="eventslist-column3 thq-card">
                <div className="eventslist-price4">
                  <div className="eventslist-price5">
                    <span className="eventslist-text20 thq-body-large">
                      {props.plan11 ?? (
                        <Fragment>
                          <span className="eventslist-text73">Basic plan</span>
                        </Fragment>
                      )}
                    </span>
                    <h3 className="eventslist-text21 thq-heading-3">
                      {props.plan1Price1 ?? (
                        <Fragment>
                          <span className="eventslist-text71">$200/yr</span>
                        </Fragment>
                      )}
                    </h3>
                    <span className="thq-body-large">
                      {props.plan1Yearly1 ?? (
                        <Fragment>
                          <span className="eventslist-text66">
                            or $20 monthly
                          </span>
                        </Fragment>
                      )}
                    </span>
                  </div>
                  <div className="eventslist-list1">
                    <div className="eventslist-list-item10">
                      <svg viewBox="0 0 1024 1024" className="thq-icon-small">
                        <path d="M384 690l452-452 60 60-512 512-238-238 60-60z"></path>
                      </svg>
                      <span className="thq-body-small">
                        {props.plan1Feature11 ?? (
                          <Fragment>
                            <span className="eventslist-text75">
                              Feature text goes here
                            </span>
                          </Fragment>
                        )}
                      </span>
                    </div>
                    <div className="eventslist-list-item11">
                      <svg viewBox="0 0 1024 1024" className="thq-icon-small">
                        <path d="M384 690l452-452 60 60-512 512-238-238 60-60z"></path>
                      </svg>
                      <span className="thq-body-small">
                        {props.plan1Feature21 ?? (
                          <Fragment>
                            <span className="eventslist-text65">
                              Feature text goes here
                            </span>
                          </Fragment>
                        )}
                      </span>
                    </div>
                    <div className="eventslist-list-item12">
                      <svg viewBox="0 0 1024 1024" className="thq-icon-small">
                        <path d="M384 690l452-452 60 60-512 512-238-238 60-60z"></path>
                      </svg>
                      <span className="thq-body-small">
                        {props.plan1Feature31 ?? (
                          <Fragment>
                            <span className="eventslist-text51">
                              Feature text goes here
                            </span>
                          </Fragment>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
                <button className="eventslist-button3 thq-button-animated thq-button-outline">
                  <span className="thq-body-small">
                    {props.plan1Action1 ?? (
                      <Fragment>
                        <span className="eventslist-text48">Get started</span>
                      </Fragment>
                    )}
                  </span>
                </button>
              </div>
              <div className="eventslist-column4 thq-card">
                <div className="eventslist-price6">
                  <div className="eventslist-price7">
                    <span className="eventslist-text27 thq-body-large">
                      {props.plan21 ?? (
                        <Fragment>
                          <span className="eventslist-text60">
                            Business plan
                          </span>
                        </Fragment>
                      )}
                    </span>
                    <h3 className="eventslist-text28 thq-heading-3">
                      {props.plan2Price1 ?? (
                        <Fragment>
                          <span className="eventslist-text74">$299/yr</span>
                        </Fragment>
                      )}
                    </h3>
                    <span className="thq-body-large">
                      {props.plan2Yearly1 ?? (
                        <Fragment>
                          <span className="eventslist-text76">
                            or $29 monthly
                          </span>
                        </Fragment>
                      )}
                    </span>
                  </div>
                  <div className="eventslist-list2">
                    <div className="eventslist-list-item13">
                      <svg viewBox="0 0 1024 1024" className="thq-icon-small">
                        <path d="M384 690l452-452 60 60-512 512-238-238 60-60z"></path>
                      </svg>
                      <span className="thq-body-small">
                        {props.plan2Feature11 ?? (
                          <Fragment>
                            <span className="eventslist-text63">
                              Feature text goes here
                            </span>
                          </Fragment>
                        )}
                      </span>
                    </div>
                    <div className="eventslist-list-item14">
                      <svg viewBox="0 0 1024 1024" className="thq-icon-small">
                        <path d="M384 690l452-452 60 60-512 512-238-238 60-60z"></path>
                      </svg>
                      <span className="thq-body-small">
                        {props.plan2Feature21 ?? (
                          <Fragment>
                            <span className="eventslist-text68">
                              Feature text goes here
                            </span>
                          </Fragment>
                        )}
                      </span>
                    </div>
                    <div className="eventslist-list-item15">
                      <svg viewBox="0 0 1024 1024" className="thq-icon-small">
                        <path d="M384 690l452-452 60 60-512 512-238-238 60-60z"></path>
                      </svg>
                      <span className="thq-body-small">
                        {props.plan2Feature31 ?? (
                          <Fragment>
                            <span className="eventslist-text47">
                              Feature text goes here
                            </span>
                          </Fragment>
                        )}
                      </span>
                    </div>
                    <div className="eventslist-list-item16">
                      <svg viewBox="0 0 1024 1024" className="thq-icon-small">
                        <path d="M384 690l452-452 60 60-512 512-238-238 60-60z"></path>
                      </svg>
                      <span className="thq-body-small">
                        {props.plan2Feature41 ?? (
                          <Fragment>
                            <span className="eventslist-text72">
                              Feature text goes here
                            </span>
                          </Fragment>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
                <button className="eventslist-button4 thq-button-animated thq-button-filled">
                  <span className="thq-body-small">
                    {props.plan2Action1 ?? (
                      <Fragment>
                        <span className="eventslist-text83">Get started</span>
                      </Fragment>
                    )}
                  </span>
                </button>
              </div>
              <div className="eventslist-column5 thq-card">
                <div className="eventslist-price8">
                  <div className="eventslist-price9">
                    <span className="eventslist-text35 thq-body-large">
                      {props.plan31 ?? (
                        <Fragment>
                          <span className="eventslist-text59">
                            Enterprise plan
                          </span>
                        </Fragment>
                      )}
                    </span>
                    <h3 className="eventslist-text36 thq-heading-3">
                      {props.plan3Price1 ?? (
                        <Fragment>
                          <span className="eventslist-text46">$499/yr</span>
                        </Fragment>
                      )}
                    </h3>
                    <span className="thq-body-large">
                      {props.plan3Yearly1 ?? (
                        <Fragment>
                          <span className="eventslist-text81">
                            or $49 monthly
                          </span>
                        </Fragment>
                      )}
                    </span>
                  </div>
                  <div className="eventslist-list3">
                    <div className="eventslist-list-item17">
                      <svg viewBox="0 0 1024 1024" className="thq-icon-small">
                        <path d="M384 690l452-452 60 60-512 512-238-238 60-60z"></path>
                      </svg>
                      <span className="thq-body-small">
                        {props.plan3Feature11 ?? (
                          <Fragment>
                            <span className="eventslist-text61">
                              Feature text goes here
                            </span>
                          </Fragment>
                        )}
                      </span>
                    </div>
                    <div className="eventslist-list-item18">
                      <svg viewBox="0 0 1024 1024" className="thq-icon-small">
                        <path d="M384 690l452-452 60 60-512 512-238-238 60-60z"></path>
                      </svg>
                      <span className="thq-body-small">
                        {props.plan3Feature21 ?? (
                          <Fragment>
                            <span className="eventslist-text87">
                              Feature text goes here
                            </span>
                          </Fragment>
                        )}
                      </span>
                    </div>
                    <div className="eventslist-list-item19">
                      <svg viewBox="0 0 1024 1024" className="thq-icon-small">
                        <path d="M384 690l452-452 60 60-512 512-238-238 60-60z"></path>
                      </svg>
                      <span className="thq-body-small">
                        {props.plan3Feature31 ?? (
                          <Fragment>
                            <span className="eventslist-text91">
                              Feature text goes here
                            </span>
                          </Fragment>
                        )}
                      </span>
                    </div>
                    <div className="eventslist-list-item20">
                      <svg viewBox="0 0 1024 1024" className="thq-icon-small">
                        <path d="M384 690l452-452 60 60-512 512-238-238 60-60z"></path>
                      </svg>
                      <span className="thq-body-small">
                        {props.plan3Feature41 ?? (
                          <Fragment>
                            <span className="eventslist-text53">
                              Feature text goes here
                            </span>
                          </Fragment>
                        )}
                      </span>
                    </div>
                    <div className="eventslist-list-item21">
                      <svg viewBox="0 0 1024 1024" className="thq-icon-small">
                        <path d="M384 690l452-452 60 60-512 512-238-238 60-60z"></path>
                      </svg>
                      <span className="thq-body-small">
                        {props.plan3Feature51 ?? (
                          <Fragment>
                            <span className="eventslist-text50">
                              Feature text goes here
                            </span>
                          </Fragment>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
                <button className="eventslist-button5 thq-button-animated thq-button-filled">
                  <span className="thq-body-small">
                    {props.plan3Action1 ?? (
                      <Fragment>
                        <span className="eventslist-text54">Get started</span>
                      </Fragment>
                    )}
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
        <button className="eventslist-button6 thq-button-animated thq-button-filled">
          <span className="thq-body-small">
            {props.plan2Action ?? (
              <Fragment>
                <span className="eventslist-text52">More</span>
              </Fragment>
            )}
          </span>
        </button>
      </div>
      <style jsx>
        {`
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
            border-top-left-radius: var(--dl-radius-radius-buttonradius);
            border-top-right-radius: 0;
            border-bottom-left-radius: var(--dl-radius-radius-buttonradius);
            border-bottom-right-radius: 0;
          }
          .eventslist-activeeventbutton {
            gap: var(--dl-space-space-halfunit);
            color: var(--dl-color-theme-neutral-light);
            width: 120px;
            height: 60px;
            border-top-left-radius: 0;
            border-top-right-radius: var(--dl-radius-radius-buttonradius);
            border-bottom-left-radius: 0;
            border-bottom-right-radius: var(--dl-radius-radius-buttonradius);
          }
          .eventslist-previouseventbutton {
            gap: var(--dl-space-space-halfunit);
            width: 120px;
            height: 60px;
            border-style: solid;
            border-top-left-radius: 0;
            border-top-right-radius: var(--dl-radius-radius-buttonradius);
            border-bottom-left-radius: 0;
            border-bottom-right-radius: var(--dl-radius-radius-buttonradius);
          }
          .eventslist-eventotlal1 {
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
          .eventslist-eventbox1 {
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
            background-color: var(--dl-color-theme-accent1);
          }
          .eventslist-eventdesc1 {
            gap: var(--dl-space-space-twounits);
            display: flex;
            flex-grow: 1;
            align-self: stretch;
            align-items: center;
            flex-direction: column;
          }
          .eventslist-eventtitle1 {
            gap: var(--dl-space-space-halfunit);
            display: flex;
            align-self: stretch;
            align-items: center;
            flex-direction: column;
          }
          .eventslist-eventdate1 {
            font-style: normal;
            font-weight: 600;
          }
          .eventslist-eventtitle2 {
            font-size: 40px;
            align-self: flex-start;
          }
          .eventslist-orglogo1 {
            width: 200px;
            object-fit: cover;
          }
          .eventslist-eventbutton1 {
            width: 100%;
          }
          .eventslist-eventbox2 {
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
            background-color: var(--dl-color-theme-accent1);
          }
          .eventslist-eventdesc2 {
            gap: var(--dl-space-space-twounits);
            display: flex;
            flex-grow: 1;
            align-self: stretch;
            align-items: center;
            flex-direction: column;
          }
          .eventslist-eventtitle3 {
            gap: var(--dl-space-space-halfunit);
            display: flex;
            align-self: stretch;
            align-items: center;
            flex-direction: column;
          }
          .eventslist-eventdate2 {
            font-style: normal;
            font-weight: 600;
          }
          .eventslist-eventtitle4 {
            font-size: 40px;
            align-self: flex-start;
          }
          .eventslist-orglogo2 {
            width: 200px;
            object-fit: cover;
          }
          .eventslist-eventbutton2 {
            width: 100%;
          }
          .eventslist-eventbox3 {
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
            background-color: var(--dl-color-theme-accent1);
          }
          .eventslist-eventdesc3 {
            gap: var(--dl-space-space-twounits);
            display: flex;
            flex-grow: 1;
            align-self: stretch;
            align-items: center;
            flex-direction: column;
          }
          .eventslist-eventtitle5 {
            gap: var(--dl-space-space-halfunit);
            display: flex;
            align-self: stretch;
            align-items: center;
            flex-direction: column;
          }
          .eventslist-eventdate3 {
            font-style: normal;
            font-weight: 600;
          }
          .eventslist-eventtitle6 {
            font-size: 40px;
            align-self: flex-start;
          }
          .eventslist-orglogo3 {
            width: 200px;
            object-fit: cover;
          }
          .eventslist-eventbutton3 {
            width: 100%;
          }
          .eventslist-eventotlal2 {
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
            background-color: var(--dl-color-theme-accent1);
          }
          .eventslist-eventdesc4 {
            gap: var(--dl-space-space-twounits);
            display: flex;
            flex-grow: 1;
            align-self: stretch;
            align-items: center;
            flex-direction: column;
          }
          .eventslist-eventtitle7 {
            gap: var(--dl-space-space-halfunit);
            display: flex;
            align-self: stretch;
            align-items: center;
            flex-direction: column;
          }
          .eventslist-eventdate4 {
            font-style: normal;
            font-weight: 600;
          }
          .eventslist-eventtitle8 {
            font-size: 40px;
            align-self: flex-start;
          }
          .eventslist-orglogo4 {
            width: 200px;
            object-fit: cover;
          }
          .eventslist-eventbutton4 {
            width: 100%;
          }
          .eventslist-column1 {
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
            background-color: var(--dl-color-theme-accent1);
          }
          .eventslist-price1 {
            gap: var(--dl-space-space-twounits);
            display: flex;
            flex-grow: 1;
            align-self: stretch;
            align-items: center;
            flex-direction: column;
          }
          .eventslist-eventtile {
            gap: var(--dl-space-space-halfunit);
            display: flex;
            align-self: stretch;
            align-items: center;
            flex-direction: column;
          }
          .eventslist-text12 {
            font-style: normal;
            font-weight: 600;
          }
          .eventslist-text13 {
            font-size: 40px;
            align-self: flex-start;
          }
          .eventslist-image1 {
            width: 200px;
            object-fit: cover;
          }
          .eventslist-button1 {
            width: 100%;
          }
          .eventslist-column2 {
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
            background-color: var(--dl-color-theme-accent1);
          }
          .eventslist-price2 {
            gap: var(--dl-space-space-twounits);
            display: flex;
            flex-grow: 1;
            align-self: stretch;
            align-items: center;
            flex-direction: column;
          }
          .eventslist-price3 {
            gap: var(--dl-space-space-halfunit);
            display: flex;
            align-self: stretch;
            align-items: center;
            flex-direction: column;
          }
          .eventslist-text16 {
            font-style: normal;
            font-weight: 600;
          }
          .eventslist-text17 {
            font-size: 40px;
            align-self: flex-start;
          }
          .eventslist-image2 {
            width: 200px;
            object-fit: cover;
          }
          .eventslist-button2 {
            width: 100%;
          }
          .eventslist-container {
            gap: 32px;
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
          .eventslist-column3 {
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
            flex-direction: column;
          }
          .eventslist-price4 {
            gap: var(--dl-space-space-twounits);
            display: flex;
            flex-grow: 1;
            align-self: stretch;
            align-items: center;
            flex-direction: column;
          }
          .eventslist-price5 {
            gap: var(--dl-space-space-halfunit);
            display: flex;
            align-self: stretch;
            align-items: center;
            flex-direction: column;
          }
          .eventslist-text20 {
            font-style: normal;
            font-weight: 600;
          }
          .eventslist-text21 {
            font-size: 48px;
          }
          .eventslist-list1 {
            gap: var(--dl-space-space-unit);
            display: flex;
            align-self: stretch;
            align-items: flex-start;
            flex-direction: column;
          }
          .eventslist-list-item10 {
            gap: var(--dl-space-space-unit);
            display: flex;
            align-self: stretch;
            align-items: flex-start;
            flex-shrink: 0;
          }
          .eventslist-list-item11 {
            gap: var(--dl-space-space-unit);
            display: flex;
            align-self: stretch;
            align-items: flex-start;
            flex-shrink: 0;
          }
          .eventslist-list-item12 {
            gap: var(--dl-space-space-unit);
            display: flex;
            align-self: stretch;
            align-items: flex-start;
            flex-shrink: 0;
          }
          .eventslist-button3 {
            width: 100%;
          }
          .eventslist-column4 {
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
            flex-direction: column;
            background-color: var(--dl-color-theme-accent1);
          }
          .eventslist-price6 {
            gap: var(--dl-space-space-twounits);
            display: flex;
            flex-grow: 1;
            align-self: stretch;
            align-items: center;
            flex-direction: column;
          }
          .eventslist-price7 {
            gap: var(--dl-space-space-halfunit);
            display: flex;
            align-self: stretch;
            align-items: center;
            flex-direction: column;
          }
          .eventslist-text27 {
            font-style: normal;
            font-weight: 600;
          }
          .eventslist-text28 {
            font-size: 48px;
          }
          .eventslist-list2 {
            gap: var(--dl-space-space-unit);
            display: flex;
            align-self: stretch;
            align-items: flex-start;
            flex-direction: column;
          }
          .eventslist-list-item13 {
            gap: var(--dl-space-space-unit);
            display: flex;
            align-self: stretch;
            align-items: flex-start;
            flex-shrink: 0;
          }
          .eventslist-list-item14 {
            gap: var(--dl-space-space-unit);
            display: flex;
            align-self: stretch;
            align-items: flex-start;
            flex-shrink: 0;
          }
          .eventslist-list-item15 {
            gap: var(--dl-space-space-unit);
            display: flex;
            align-self: stretch;
            align-items: flex-start;
            flex-shrink: 0;
          }
          .eventslist-list-item16 {
            gap: var(--dl-space-space-unit);
            display: flex;
            align-self: stretch;
            align-items: flex-start;
            flex-shrink: 0;
          }
          .eventslist-button4 {
            width: 100%;
          }
          .eventslist-column5 {
            gap: var(--dl-space-space-twounits);
            flex: 1;
            width: 100%;
            display: flex;
            flex-grow: 1;
            align-items: center;
            flex-shrink: 0;
            border-color: var(--dl-color-theme-neutral-dark);
            border-style: solid;
            border-width: 1px;
            flex-direction: column;
            background-color: var(--dl-color-theme-accent2);
          }
          .eventslist-price8 {
            gap: var(--dl-space-space-twounits);
            display: flex;
            align-self: stretch;
            align-items: center;
            flex-direction: column;
          }
          .eventslist-price9 {
            gap: var(--dl-space-space-halfunit);
            display: flex;
            align-self: stretch;
            align-items: center;
            flex-direction: column;
          }
          .eventslist-text35 {
            font-style: normal;
            font-weight: 600;
          }
          .eventslist-text36 {
            font-size: 48px;
          }
          .eventslist-list3 {
            gap: var(--dl-space-space-unit);
            display: flex;
            align-self: stretch;
            align-items: flex-start;
            flex-direction: column;
          }
          .eventslist-list-item17 {
            gap: var(--dl-space-space-unit);
            display: flex;
            align-self: stretch;
            align-items: flex-start;
            flex-shrink: 0;
          }
          .eventslist-list-item18 {
            gap: var(--dl-space-space-unit);
            display: flex;
            align-self: stretch;
            align-items: flex-start;
            flex-shrink: 0;
          }
          .eventslist-list-item19 {
            gap: var(--dl-space-space-unit);
            display: flex;
            align-self: stretch;
            align-items: flex-start;
            flex-shrink: 0;
          }
          .eventslist-list-item20 {
            gap: var(--dl-space-space-unit);
            display: flex;
            align-self: stretch;
            align-items: flex-start;
            flex-shrink: 0;
          }
          .eventslist-list-item21 {
            gap: var(--dl-space-space-unit);
            display: flex;
            align-self: stretch;
            align-items: flex-start;
            flex-shrink: 0;
          }
          .eventslist-button5 {
            width: 100%;
          }
          .eventslist-button6 {
            width: 182px;
            height: 53px;
            align-self: flex-end;
            box-shadow: 5px 5px 10px 0px #1e1d1d;
            margin-top: var(--dl-space-space-fiveunits);
          }
          .eventslist-text45 {
            display: inline-block;
          }
          .eventslist-text46 {
            display: inline-block;
          }
          .eventslist-text47 {
            display: inline-block;
          }
          .eventslist-text48 {
            display: inline-block;
          }
          .eventslist-text49 {
            display: inline-block;
          }
          .eventslist-text50 {
            display: inline-block;
          }
          .eventslist-text51 {
            display: inline-block;
          }
          .eventslist-text52 {
            display: inline-block;
          }
          .eventslist-text53 {
            display: inline-block;
          }
          .eventslist-text54 {
            display: inline-block;
          }
          .eventslist-text55 {
            display: inline-block;
          }
          .eventslist-text56 {
            display: inline-block;
          }
          .eventslist-text57 {
            display: inline-block;
          }
          .eventslist-text58 {
            display: inline-block;
          }
          .eventslist-text59 {
            display: inline-block;
          }
          .eventslist-text60 {
            display: inline-block;
          }
          .eventslist-text61 {
            display: inline-block;
          }
          .eventslist-text62 {
            display: inline-block;
          }
          .eventslist-text63 {
            display: inline-block;
          }
          .eventslist-text64 {
            display: inline-block;
            font-weight: 700;
          }
          .eventslist-text65 {
            display: inline-block;
          }
          .eventslist-text66 {
            display: inline-block;
          }
          .eventslist-text67 {
            display: inline-block;
          }
          .eventslist-text68 {
            display: inline-block;
          }
          .eventslist-text69 {
            display: inline-block;
          }
          .eventslist-text70 {
            display: inline-block;
          }
          .eventslist-text71 {
            display: inline-block;
          }
          .eventslist-text72 {
            display: inline-block;
          }
          .eventslist-text73 {
            display: inline-block;
          }
          .eventslist-text74 {
            display: inline-block;
          }
          .eventslist-text75 {
            display: inline-block;
          }
          .eventslist-text76 {
            display: inline-block;
          }
          .eventslist-text77 {
            display: inline-block;
          }
          .eventslist-text78 {
            display: inline-block;
          }
          .eventslist-text79 {
            display: inline-block;
          }
          .eventslist-text80 {
            display: inline-block;
          }
          .eventslist-text81 {
            display: inline-block;
          }
          .eventslist-text82 {
            display: inline-block;
          }
          .eventslist-text83 {
            display: inline-block;
          }
          .eventslist-text84 {
            display: inline-block;
          }
          .eventslist-text85 {
            display: inline-block;
            font-weight: 700;
          }
          .eventslist-text86 {
            display: inline-block;
            font-weight: 700;
          }
          .eventslist-text87 {
            display: inline-block;
          }
          .eventslist-text88 {
            display: inline-block;
          }
          .eventslist-text89 {
            display: inline-block;
            font-weight: 700;
          }
          .eventslist-text90 {
            display: inline-block;
          }
          .eventslist-text91 {
            display: inline-block;
          }
          .eventslist-text92 {
            display: inline-block;
            font-weight: 700;
          }
          .eventslist-text93 {
            display: inline-block;
            font-weight: 700;
          }
          .eventslist-text94 {
            display: inline-block;
          }
          @media (max-width: 991px) {
            .eventslist-eventotlal1 {
              flex-direction: column;
            }
            .eventslist-eventotlal2 {
              flex-direction: column;
            }
            .eventslist-container {
              flex-direction: column;
            }
            .eventslist-column5 {
              width: 100%;
            }
          }
          @media (max-width: 479px) {
            .eventslist-eventsbox {
              gap: var(--dl-space-space-oneandhalfunits);
            }
          }
        `}
      </style>
    </>
  )
}

Eventslist.defaultProps = {
  plan241: undefined,
  plan3Price1: undefined,
  imageAlt51: 'image',
  plan2Feature31: undefined,
  plan1Action1: undefined,
  plan2Price7: undefined,
  plan3Feature51: undefined,
  plan1Feature31: undefined,
  plan2Action: undefined,
  plan3Feature41: undefined,
  imageAlt32: 'image',
  imageSrc3: '/olglogo-200h.webp',
  imageAlt31: 'image',
  plan3Action1: undefined,
  plan2Price51: undefined,
  plan2Action41: undefined,
  plan2Price8: undefined,
  plan2Action6: undefined,
  plan31: undefined,
  plan21: undefined,
  plan3Feature11: undefined,
  plan2Action63: undefined,
  plan2Feature11: undefined,
  imageSrc33: '/olglogo-200h.webp',
  plan2Yearly8: undefined,
  plan1Feature21: undefined,
  plan1Yearly1: undefined,
  imageSrc32: '/olglogo-200h.webp',
  heading1: undefined,
  plan2Feature21: undefined,
  imageAlt33: 'image',
  plan2Price: undefined,
  plan2Price6: undefined,
  plan1Price1: undefined,
  imageSrc41: '/olglogo-200h.webp',
  plan2Feature41: undefined,
  plan11: undefined,
  plan2Price1: undefined,
  plan1Feature11: undefined,
  plan2Yearly1: undefined,
  plan27: undefined,
  plan2Price41: undefined,
  plan251: undefined,
  plan2: undefined,
  plan3Yearly1: undefined,
  plan2Action62: undefined,
  plan2Action1: undefined,
  plan26: undefined,
  plan2Yearly7: undefined,
  plan2Yearly51: undefined,
  plan3Feature21: undefined,
  imageSrc31: '/olglogo-200h.webp',
  plan2Action61: undefined,
  imageAlt3: 'image',
  imageSrc51: '/olglogo-200h.webp',
  plan2Yearly6: undefined,
  plan2Action51: undefined,
  plan3Feature31: undefined,
  plan2Yearly41: undefined,
  plan2Yearly: undefined,
  imageAlt41: 'image',
  plan28: undefined,
}

Eventslist.propTypes = {
  plan241: PropTypes.element,
  plan3Price1: PropTypes.element,
  imageAlt51: PropTypes.string,
  plan2Feature31: PropTypes.element,
  plan1Action1: PropTypes.element,
  plan2Price7: PropTypes.element,
  plan3Feature51: PropTypes.element,
  plan1Feature31: PropTypes.element,
  plan2Action: PropTypes.element,
  plan3Feature41: PropTypes.element,
  imageAlt32: PropTypes.string,
  imageSrc3: PropTypes.string,
  imageAlt31: PropTypes.string,
  plan3Action1: PropTypes.element,
  plan2Price51: PropTypes.element,
  plan2Action41: PropTypes.element,
  plan2Price8: PropTypes.element,
  plan2Action6: PropTypes.element,
  plan31: PropTypes.element,
  plan21: PropTypes.element,
  plan3Feature11: PropTypes.element,
  plan2Action63: PropTypes.element,
  plan2Feature11: PropTypes.element,
  imageSrc33: PropTypes.string,
  plan2Yearly8: PropTypes.element,
  plan1Feature21: PropTypes.element,
  plan1Yearly1: PropTypes.element,
  imageSrc32: PropTypes.string,
  heading1: PropTypes.element,
  plan2Feature21: PropTypes.element,
  imageAlt33: PropTypes.string,
  plan2Price: PropTypes.element,
  plan2Price6: PropTypes.element,
  plan1Price1: PropTypes.element,
  imageSrc41: PropTypes.string,
  plan2Feature41: PropTypes.element,
  plan11: PropTypes.element,
  plan2Price1: PropTypes.element,
  plan1Feature11: PropTypes.element,
  plan2Yearly1: PropTypes.element,
  plan27: PropTypes.element,
  plan2Price41: PropTypes.element,
  plan251: PropTypes.element,
  plan2: PropTypes.element,
  plan3Yearly1: PropTypes.element,
  plan2Action62: PropTypes.element,
  plan2Action1: PropTypes.element,
  plan26: PropTypes.element,
  plan2Yearly7: PropTypes.element,
  plan2Yearly51: PropTypes.element,
  plan3Feature21: PropTypes.element,
  imageSrc31: PropTypes.string,
  plan2Action61: PropTypes.element,
  imageAlt3: PropTypes.string,
  imageSrc51: PropTypes.string,
  plan2Yearly6: PropTypes.element,
  plan2Action51: PropTypes.element,
  plan3Feature31: PropTypes.element,
  plan2Yearly41: PropTypes.element,
  plan2Yearly: PropTypes.element,
  imageAlt41: PropTypes.string,
  plan28: PropTypes.element,
}

export default Eventslist
