import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function CreateGroupPage({ user }) {
  const router = useRouter();
  const [groupTitle, setGroupTitle] = useState('');
  const [members, setMembers] = useState([{ memberName: '', memberEmail: '' }]);
  const [searchValue, setSearchValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const API_URL = 'http://localhost:1337/api/groups';
  const STRAPI_API_TOKEN = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN || 'YOUR_STRAPI_API_TOKEN';

  useEffect(() => {
    if (!user || !user.id) {
      router.push('/sign-in');
    }
  }, [user, router]);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchValue(query);

    if (query.length > 2) {
      const dummy = [
        { name: 'John Smith', email: 'john@example.com' },
        { name: 'Jane Doe', email: 'jane@example.com' },
        { name: 'Johnny Appleseed', email: 'johnny@example.com' },
      ];
      const filtered = dummy.filter((item) =>
        item.name.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const handleSelectSuggestion = (person) => {
    setMembers((prev) => [...prev, { memberName: person.name, memberEmail: person.email }]);
    setSearchValue('');
    setSuggestions([]);
  };

  const handleAddMember = () => {
    setMembers([...members, { memberName: '', memberEmail: '' }]);
  };

  const handleMemberChange = (index, field, value) => {
    const newMembers = [...members];
    newMembers[index][field] = value;
    setMembers(newMembers);
  };

  const handleRemoveMember = (index) => {
    setMembers(members.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!groupTitle || members.some(m => !m.memberName || !m.memberEmail)) {
      setErrorMessage('Please fill out all required fields.');
      return;
    }

    const groupData = {
      data: {
        title: groupTitle,
        state: 'pending',
        members: members,
        pqcoordinator: user.id,
      },
    };

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${STRAPI_API_TOKEN}`,
        },
        body: JSON.stringify(groupData),
      });

      const json = await res.json();
      if (res.ok) {
        console.log('✅ Group created:', json);
        setGroupTitle('');
        setMembers([{ memberName: '', memberEmail: '' }]);
        router.push('/pending-events');
      } else {
        console.error('🚨 Error creating group:', json);
        setErrorMessage('Failed to create group. Check console for details.');
      }
    } catch (error) {
      console.error('🚨 Error:', error);
      setErrorMessage('Server error. Please try again later.');
    }
  };

  return (
    <div className="create-group-container">
      <div className="page-background">
        <div className="createevents-accent2-bg">
          <div className="createevents-accent1-bg">
            <div className="createevents-container2">
              <div className="createevents-content">
                <h2 className="thq-heading-2" style={{ fontFamily: 'STIX Two Text, serif' }}>Create Your Guest List</h2>
                <p className="thq-body-large" style={{ fontFamily: 'STIX Two Text, serif' }}>
                  Add new group members by searching or manually entering their details below.
                </p>

                {errorMessage && (
                  <div
                    style={{
                      color: 'red',
                      fontSize: '0.9rem',
                      marginBottom: '0.5rem',
                      textAlign: 'center',
                      fontFamily: 'STIX Two Text, serif',
                    }}
                  >
                    {errorMessage}
                  </div>
                )}

                <div className="autocomplete-section">
                  <input
                    type="text"
                    className="search-bar"
                    placeholder="Search potential members..."
                    value={searchValue}
                    onChange={handleSearchChange}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      fontSize: '16px',
                      marginBottom: '0.5rem',
                    }}
                  />
                  {suggestions.length > 0 && (
                    <div className="suggestions-container">
                      {suggestions.map((person, i) => (
                        <div
                          key={i}
                          className="suggestion-item"
                          onClick={() => handleSelectSuggestion(person)}
                          style={{
                            padding: '8px',
                            cursor: 'pointer',
                            background: '#fff',
                            borderBottom: '1px solid #ddd',
                          }}
                        >
                          {person.name} — {person.email}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <form onSubmit={handleSubmit} className="group-form">
                  <label style={{ fontWeight: 'bold', marginBottom: '0.5rem', fontFamily: 'STIX Two Text, serif' }}>Name Your Group</label>
                  <input
                    type="text"
                    value={groupTitle}
                    onChange={(e) => setGroupTitle(e.target.value)}
                    required
                    style={{
                      padding: '0.5rem',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      fontSize: '16px',
                      width: '100%',
                      marginBottom: '1rem',
                    }}
                  />

                  <h3 className="manual-entry-heading" style={{ fontFamily: 'STIX Two Text, serif', fontSize: '20px', marginBottom: '1rem' }}>Add Members Manually</h3>
                  {members.map((m, index) => (
                    <div key={index} className="single-member" style={{ marginBottom: '1rem' }}>
                      <label style={{ fontWeight: 'bold', marginBottom: '0.5rem', fontFamily: 'STIX Two Text, serif' }}>Member Name</label>
                      <input
                        type="text"
                        value={m.memberName}
                        onChange={(e) =>
                          handleMemberChange(index, 'memberName', e.target.value)
                        }
                        required
                        style={{
                          padding: '0.5rem',
                          border: '1px solid #ddd',
                          borderRadius: '8px',
                          fontSize: '16px',
                          width: '100%',
                          marginBottom: '0.5rem',
                        }}
                      />
                      <label style={{ fontWeight: 'bold', marginBottom: '0.5rem', fontFamily: 'STIX Two Text, serif' }}>Member Email</label>
                      <input
                        type="email"
                        value={m.memberEmail}
                        onChange={(e) =>
                          handleMemberChange(index, 'memberEmail', e.target.value)
                        }
                        required
                        style={{
                          padding: '0.5rem',
                          border: '1px solid #ddd',
                          borderRadius: '8px',
                          fontSize: '16px',
                          width: '100%',
                          marginBottom: '0.5rem',
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveMember(index)}
                        className="remove-member-button"
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'red',
                          cursor: 'pointer',
                          fontSize: '14px',
                          marginTop: '0.5rem',
                        }}
                      >
                        Remove Member
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={handleAddMember}
                    className="add-member-button"
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#1263a1',
                      cursor: 'pointer',
                      fontSize: '16px',
                      textAlign: 'left',
                      padding: 0,
                      marginBottom: '1rem',
                    }}
                  >
                    + Add Another Member
                  </button>

                  <button
                    type="submit"
                    className="thq-button-filled"
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
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#191818')}
                  >
                    Create Guest List
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .create-group-container {
          width: 100%;
          display: flex;
          flex-direction: column;
        }
        .page-background {
          flex: 1;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background-size: cover;
          background-image: url("/dorritos.jpeg");
        }
        .createevents-accent2-bg {
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #F5D1B0;
          border-radius: 46px;
        }
        .createevents-accent2-bg:hover {
          transform: scale(1.02);
        }
        .createevents-accent1-bg {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #FFFFFF;
          border-radius: 46px;
        }
        .createevents-container2 {
          width: 100%;
          display: flex;
          align-items: center;
          padding: var(--dl-space-space-sixunits);
          border-radius: 46px;
          box-shadow: 8px 8px 13px 0px #2b2a2a;
        }
        .createevents-content {
          display: flex;
          flex-direction: column;
          width: 100%;
        }
        .autocomplete-section {
          position: relative;
          width: 100%;
          margin-bottom: 1rem;
        }
        .search-bar {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 8px;
        }
        .suggestions-container {
          position: absolute;
          top: 100%;
          background: #fff;
          border: 1px solid #ddd;
          max-height: 200px;
          overflow-y: auto;
          z-index: 10;
        }
        .suggestion-item {
          padding: 8px;
          cursor: pointer;
        }
        .group-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          width: 100%;
        }
        .group-form input {
          padding: 0.5rem;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 16px;
        }
        .manual-entry-heading {
          margin-top: 2rem;
          margin-bottom: 1rem;
          font-size: 20px;
          font-weight: bold;
        }
        .single-member {
          margin-bottom: 1rem;
        }
        .add-member-button {
          background: none;
          border: none;
          color: #1263a1;
          cursor: pointer;
          font-size: 16px;
          text-align: left;
          padding: 0;
        }
        .remove-member-button {
          background: none;
          border: none;
          color: red;
          cursor: pointer;
          font-size: 14px;
          margin-top: 0.5rem;
        }
        .thq-button-filled {
          padding: 0.75rem 1.5rem;
          border-radius: 46px;
          background: linear-gradient(90deg, #FFC78B 0%, #FFAD61 100%);
          color: #191818;
          font-weight: 700;
          border: none;
          cursor: pointer;
        }
        .thq-button-filled:hover {
          color: #FFFFFF;
        }
      `}</style>
    </div>
  );
}