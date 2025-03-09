import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import RocketAnimation from '../components/RocketAnimation';

export default function CreateGroupPage({ user }) {
  const [groupName, setGroupName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const router = useRouter();

  const STRAPI_API_URL = 'http://localhost:1337/api/groups';
  const STRAPI_API_TOKEN = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN || '76e1da1b6c27d1c452b2de5248d6432e1a83ebd112ded6abc3773a0f80244dc865054434af3067cd4c9e18c658ac4815f8b12dfaf91ae9cc545afd4c001ee6007d7ce3e63b712a9a10b6968669276b0cd69b6b7118be8a0d122f322eeaa5391107a2856181dfd4bd58fb9984da48f7c5c241352b8a67724bb916e982e4af8b19';

  useEffect(() => {
    console.log('User object:', user);
    if (!user || !user.id) {
      setErrorMessage('Please log in to create a group.');
      router.push('/sign-in');
    }
  }, [user, router]);

  const handleCreateGroup = async () => {
    setErrorMessage('');

    if (!user || !user.id) {
      setErrorMessage('Please log in to create a group.');
      router.push('/sign-in');
      return;
    }

    try {
      if (!groupName) {
        setErrorMessage('Please fill out the group name.');
        return;
      }

      const groupData = {
        data: {
          groupname: groupName,
          pqcoordinator: user.id || 1,
        },
      };

      console.log('📡 Sending group data to Strapi:', JSON.stringify(groupData, null, 2));

      const res = await fetch(STRAPI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${STRAPI_API_TOKEN}`,
        },
        body: JSON.stringify(groupData),
      });

      console.log('Response status:', res.status);
      const json = await res.json();
      console.log('Response data:', JSON.stringify(json, null, 2));

      if (!res.ok) {
        console.error('🚨 Error creating group in Strapi:', json);
        setErrorMessage(
          json.error?.message || 'Failed to create group. Check if the user exists in Strapi.'
        );
        return;
      }

      const groupId = json.data.id;
      console.log('✅ Group Created with ID:', groupId);

      setShowSuccessModal(true);
    } catch (error) {
      console.error('🚨 Error:', error);
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
            Create Group
          </h2>
          {errorMessage && <div style={{ color: 'red', fontSize: '0.9rem', marginBottom: '0.5rem', textAlign: 'center' }}>{errorMessage}</div>}

          <label style={{ fontWeight: 'bold', textAlign: 'left', marginBottom: '0.5rem' }}>Group Name</label>
          <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="e.g. 'Party Crew'"
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
            onClick={handleCreateGroup}
          >
            Create Group
          </button>

          {showSuccessModal && (
            <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: '0',
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
                  Group Created! 🎉
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
                  Back to Events
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}