import React, { useState } from 'react';
import { useRouter } from 'next/router';
import RocketAnimation from '../components/RocketAnimation';

export default function SignUpPage({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const router = useRouter();

  const handleSignUp = async () => {
    setErrorMessage('');

    if (!email || !password) {
      setErrorMessage('Please fill out all required fields.');
      return;
    }

    try {
      const res = await fetch('http://localhost:1337/api/auth/local/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: email, email, password }),
      });

      const json = await res.json();
      if (!res.ok) {
        setErrorMessage(json.error?.message || 'Failed to sign up.');
        return;
      }

      const userData = { id: json.user.id, email: json.user.email };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('jwt', json.jwt);

      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Server error. Please try again later.');
    }
  };

  const handleRedirect = (destination) => {
    setTimeout(() => router.push(destination), 3000);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(90deg, rgb(192, 36, 37) 0%, rgba(240, 134, 53, 0.04) 100%)',
      }}
    >
      <div
        style={{ padding: '24px', backgroundColor: '#F5D1B0', borderRadius: '46px' }}
      >
        <div
          style={{ padding: '48px 32px', backgroundColor: '#FFFFFF', borderRadius: '46px', boxShadow: '8px 8px 13px 0px #2b2a2a' }}
        >
          <h2 style={{ fontSize: '35px', fontFamily: 'STIX Two Text', fontWeight: 600, lineHeight: 1.5, margin: 0 }}>
            Sign Up
          </h2>
          {errorMessage && <div style={{ color: 'red', fontSize: '0.9rem', marginBottom: '0.5rem', textAlign: 'center' }}>{errorMessage}</div>}

          <label style={{ fontWeight: 'bold', textAlign: 'left', marginBottom: '0.5rem' }}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g. user@example.com"
            style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '8px', width: '100%', marginBottom: '0.5rem' }}
          />

          <label style={{ fontWeight: 'bold', textAlign: 'left', marginBottom: '0.5rem' }}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '8px', width: '100%', marginBottom: '0.5rem' }}
          />

          <button
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '46px',
              background: 'linear-gradient(90deg, #FFC78B 0%, #FFAD61 100%)',
              color: '#191818',
              fontWeight: '700',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              width: '150px',
              alignSelf: 'center',
            }}
            onClick={handleSignUp}
          >
            Sign Up
          </button>

          {showSuccessModal && (
            <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 2000,
              }}
            >
              <div
                style={{
                  background: '#FFFFFF',
                  padding: '2rem',
                  borderRadius: '46px',
                  textAlign: 'center',
                  width: '550px',
                  height: 'auto',
                  position: 'relative',
                  boxShadow: '8px 8px 13px 0px #2b2a2a',
                }}
              >
                <RocketAnimation />
                <button
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '15px',
                    background: 'none',
                    border: 'none',
                    fontSize: '20px',
                    cursor: 'pointer',
                    color: 'black',
                  }}
                  onClick={() => handleRedirect('/')}
                >
                  ✕
                </button>
                <h2 style={{ marginTop: 0, marginBottom: '16px', fontSize: '35px', fontFamily: 'STIX Two Text', fontWeight: 600, lineHeight: 1.5 }}>
                  Account Created! 🎉
                </h2>
                <button
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '46px',
                    background: 'linear-gradient(90deg, #FFC78B 0%, #FFAD61 100%)',
                    color: '#191818',
                    fontWeight: '700',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '14px',
                  }}
                  onClick={() => handleRedirect('/create-event')}
                >
                  Create an Event
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}