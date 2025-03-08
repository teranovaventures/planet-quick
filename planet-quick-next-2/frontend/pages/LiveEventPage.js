"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function LiveEventPage({ user }) {
  const router = useRouter();
  const { id } = router.query;
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !id) return;
    const jwt = localStorage.getItem('jwt');
    fetch(`${process.env.STRAPI_URL || 'http://localhost:1337'}/api/events/${id}?populate=*`, {
      headers: { Authorization: `Bearer ${jwt}` },
    })
      .then(res => res.json())
      .then(data => {
        console.log('Live Event Data:', data);
        setEvent(data.data || null);
        setLoading(false);
      })
      .catch(err => console.error('Error fetching event:', err));
  }, [user, id]);

  if (loading) return <div>Loading...</div>;

  const { title, date, location, shoppingList, group } = event.attributes || {};
  const totalContributions = group?.attributes?.guests?.reduce((sum, guest) => sum + (guest.contribution || 0), 0) || 0;
  const goal = 78.94; // Example from your image
  const remaining = goal - totalContributions;

  return (
    <div className="live-event-container">
      <div className="event-header">
        <h1 className="thq-heading-1">{title || 'Untitled Event'}</h1>
        <p>{new Date(date).toLocaleDateString()} at {location}</p>
      </div>
      <div className="event-content">
        <div className="contributions-section">
          <h2>Team Goal Contributions</h2>
          <p>Goal: ${goal.toFixed(2)}</p>
          <p>Contributions: ${totalContributions.toFixed(2)}</p>
          <p>Only This Much to go! ${remaining.toFixed(2)}</p>
          <div className="progress-bar">
            <div className="progress" style={{ width: `${(totalContributions / goal) * 100}%` }}></div>
          </div>
          <ul className="guest-list">
            {group?.attributes?.guests?.map((guest, i) => (
              <li key={i}>{guest.firstName} {guest.lastName} - ${guest.contribution || 0}</li>
            ))}
          </ul>
        </div>
        <div className="shopping-list-section">
          <h2>Shopping List</h2>
          <ul>
            {shoppingList?.attributes?.items?.map((item, i) => (
              <li key={i}>{item.itemDescription} - ${item.totalcost} (x{item.quantity})</li>
            ))}
          </ul>
          <p>Subtotal: ${(shoppingList?.attributes?.totalcost || 0).toFixed(2)}</p>
          <div className="payment-options">
            <button className="thq-button-filled">Cash App</button>
            <button className="thq-button-filled">Venmo</button>
            <button className="thq-button-filled">PayPal</button>
            <button className="thq-button-filled">Checkout</button>
          </div>
        </div>
      </div>
      <style jsx>{`
        .live-event-container {
          padding: 40px;
          background: linear-gradient(90deg, rgb(192, 36, 37) 0%, rgba(240, 134, 53, 0.04) 100%);
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .event-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        .event-content {
          display: flex;
          gap: 2rem;
          justify-content: center;
          width: 100%;
          max-width: 1200px;
        }
        .contributions-section, .shopping-list-section {
          background: #fff;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          width: 45%;
        }
        .progress-bar {
          width: 100%;
          height: 20px;
          background: #e0e0e0;
          border-radius: 10px;
          overflow: hidden;
          margin: 1rem 0;
        }
        .progress {
          height: 100%;
          background: #4CAF50;
          transition: width 0.3s ease;
        }
        .guest-list {
          list-style: none;
          padding: 0;
        }
        .shopping-list-section ul {
          list-style: none;
          padding: 0;
          margin: 1rem 0;
        }
        .payment-options {
          display: flex;
          gap: 10px;
          justify-content: center;
          margin-top: 1rem;
        }
        .thq-button-filled {
          padding: 0.5rem 1rem;
          border-radius: 5px;
          border: none;
          background-color: #1263a1;
          color: #fff;
          cursor: pointer;
        }
        .thq-button-filled:hover {
          opacity: 0.9;
        }
      `}</style>
    </div>
  );
}