// pages/create-group.js
import React, { useState } from 'react'
import Navbar from '../components/navbar'

export default function CreateGroupPage(props) {
  // ------------------------------
  // 1) STATE
  // ------------------------------
  // For the group name/title
  const [groupTitle, setGroupTitle] = useState('')
  // Array of members, each with { memberName, memberEmail } for example
  const [members, setMembers] = useState([{ memberName: '', memberEmail: '' }])

  // Example state for a “search bar” at the top (like your Instacart search)
  const [searchValue, setSearchValue] = useState('')
  const [suggestions, setSuggestions] = useState([])

  // Strapi endpoint & API key
  const API_URL = 'http://localhost:1337/api/groups'
  const STRAPI_API_KEY = '7edc7cdec8951ea06e187b6f6627c4d8d9c6515023e2ef0a4bfd061fdd6adcc8924c23e520e813b536304458ff18a2504281b3cacd5df97e668b5a64e3c8de97342a1834462e66ed9bd185d575bffa8719902407cbd46e16942c919a1840c45e5de57e3a33e6ca7a28e98c941d4e7ee8316f23a2b62754a5d867ea9e443267b9'

  // ------------------------------
  // 2) AUTOCOMPLETE (dummy logic)
  // ------------------------------
  const handleSearchChange = (e) => {
    const query = e.target.value
    setSearchValue(query)

    // Example dummy suggestions. Replace with your real API call if needed.
    if (query.length > 2) {
      const dummy = [
        { name: 'John Smith', email: 'john@example.com' },
        { name: 'Jane Doe', email: 'jane@example.com' },
        { name: 'Johnny Appleseed', email: 'johnny@example.com' }
      ]
      const filtered = dummy.filter((item) =>
        item.name.toLowerCase().includes(query.toLowerCase())
      )
      setSuggestions(filtered)
    } else {
      setSuggestions([])
    }
  }

  const handleSelectSuggestion = (person) => {
    // Insert a new member row with the selected suggestion
    const newMember = {
      memberName: person.name,
      memberEmail: person.email
    }
    setMembers((prev) => [...prev, newMember])
    // Clear the search
    setSearchValue('')
    setSuggestions([])
  }

  // ------------------------------
  // 3) MANUAL MEMBERS
  // ------------------------------
  const handleAddMember = () => {
    setMembers([...members, { memberName: '', memberEmail: '' }])
  }

  const handleMemberChange = (index, field, value) => {
    const newMembers = [...members]
    newMembers[index][field] = value
    setMembers(newMembers)
  }

  const handleRemoveMember = (index) => {
    const newMembers = members.filter((_, i) => i !== index)
    setMembers(newMembers)
  }

  // ------------------------------
  // 4) SUBMIT TO STRAPI
  // ------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Format members for Strapi
    const membersFormatted = members.map((m) => ({
      memberName: m.memberName,
      memberEmail: m.memberEmail
    }))

    const groupData = {
      data: {
        title: groupTitle, // or rename “title” to “groupName” in your Strapi model
        state: 'pending',  // or any default status you prefer
        members: membersFormatted
      }
    }

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${STRAPI_API_KEY}`
        },
        body: JSON.stringify(groupData)
      })

      const json = await res.json()
      if (res.ok) {
        alert('Group created successfully!')
        console.log('Group response:', json)
        // Reset
        setGroupTitle('')
        setMembers([{ memberName: '', memberEmail: '' }])
      } else {
        console.error('Error creating group:', json)
        alert('Failed to create group. Check console for details.')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error creating group. See console for details.')
    }
  }

  // ------------------------------
  // 5) RENDER
  // ------------------------------
  return (
    <>
      <div className="create-group-container">
        {/* Navbar to handle sign-in modal, etc. Pass setIsModalOpen if needed */}
        <Navbar {...props} />

        <div className="page-background">
          {/* Tilted tile with accent backgrounds, same as create-shopping-list */}
          <div className="createevents-accent2-bg">
            <div className="createevents-accent1-bg">
              <div className="createevents-container2">
                <div className="createevents-content">
                  <h2 className="thq-heading-2">Create Your Guest List</h2>
                  <p className="thq-body-large">
                    Add new group members by searching data, or add them manually below.
                  </p>

                  {/* (A) Autocomplete search input */}
                  <div className="autocomplete-section">
                    <input
                      type="text"
                      className="search-bar"
                      placeholder="Search potential members..."
                      value={searchValue}
                      onChange={handleSearchChange}
                    />
                    {suggestions.length > 0 && (
                      <div className="suggestions-container">
                        {suggestions.map((person, i) => (
                          <div
                            key={i}
                            className="suggestion-item"
                            onClick={() => handleSelectSuggestion(person)}
                          >
                            {person.name} — {person.email}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* The main form */}
                  <form onSubmit={handleSubmit} className="group-form">
                    <label>Name Your Group</label>
                    <input
                      type="text"
                      value={groupTitle}
                      onChange={(e) => setGroupTitle(e.target.value)}
                      required
                    />

                    <h3 className="manual-entry-heading">Add Members Manually</h3>
                    {members.map((m, index) => (
                      <div key={index} className="single-member">
                        <label>Member Name</label>
                        <input
                          type="text"
                          value={m.memberName}
                          onChange={(e) =>
                            handleMemberChange(index, 'memberName', e.target.value)
                          }
                          required
                        />
                        <label>Member Email</label>
                        <input
                          type="email"
                          value={m.memberEmail}
                          onChange={(e) =>
                            handleMemberChange(index, 'memberEmail', e.target.value)
                          }
                          required
                        />

                        <button
                          type="button"
                          onClick={() => handleRemoveMember(index)}
                          className="remove-member-button"
                        >
                          Remove Member
                        </button>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={handleAddMember}
                      className="add-member-button"
                    >
                      + Add Another Member
                    </button>

                    <button type="submit" className="thq-button-filled">
                      Create Guest List
                    </button>
                  </form>
                </div>
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
          /* Same background as create-shopping-list, or change if desired */
          background-image: url("/dorritos.jpeg");
        }

        /* Outer tilt & accent background */
        .createevents-accent2-bg {
          gap: var(--dl-space-space-oneandhalfunits);
          display: flex;
          transition: 0.3s;
          align-items: center;
          border-radius: var(--dl-radius-radius-cardradius);
          justify-content: space-between;
          background-color: var(--dl-color-theme-accent2);
          /* Slight tilt (optional) */
          transform: rotateZ(1deg);
        }
        .createevents-accent2-bg:hover {
          transform: scale(1.02) rotateZ(1deg);
        }

        /* Inner accent background */
        .createevents-accent1-bg {
          width: 100%;
          display: flex;
          align-items: center;
          border-radius: var(--dl-radius-radius-cardradius);
          justify-content: space-between;
          background-color: var(--dl-color-theme-accent1);
          /* Opposite tilt */
          transform: rotateZ(-2deg);
        }

        /* Container that holds the main content */
        .createevents-container2 {
          gap: var(--dl-space-space-threeunits);
          width: 100%;
          display: flex;
          box-shadow: 8px 8px 13px 0px #2b2a2a;
          transition: 0.3s;
          align-items: center;
          padding: var(--dl-space-space-sixunits) var(--dl-space-space-fourunits);
          border-radius: var(--dl-radius-radius-cardradius);
        }
        .createevents-container2:hover {
          color: var(--dl-color-theme-neutral-light);
          background-color: var(--dl-color-theme-neutral-dark);
        }

        .createevents-content {
          gap: var(--dl-space-space-oneandhalfunits);
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          width: 100%;
        }

        /* Autocomplete search */
        .autocomplete-section {
          position: relative;
          width: 100%;
        }
        .search-bar {
          width: 100%;
          padding: 10px;
          margin-bottom: 10px;
          border: 1px solid #ddd;
          border-radius: var(--dl-radius-radius-buttonradius);
          font-size: 16px;
          color: #666;
        }
        .suggestions-container {
          position: absolute;
          top: 50px;
          left: 0;
          right: 0;
          background: #fff;
          border: 1px solid #ddd;
          border-radius: 4px;
          z-index: 10;
          max-height: 200px;
          overflow-y: auto;
        }
        .suggestion-item {
          padding: 8px;
          cursor: pointer;
        }
        .suggestion-item:hover {
          background-color: #f2f2f2;
        }

        /* Form styling */
        .group-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-top: 1rem;
          text-align: left;
          width: 100%;
        }
        .group-form label {
          font-weight: bold;
        }
        .group-form input {
          padding: 0.5rem;
          border: 1px solid #ddd;
          border-radius: var(--dl-radius-radius-buttonradius);
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
          color: var(--dl-color-theme-primary1);
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

        /* “Create Guest List” button */
        .thq-button-filled {
          padding: 0.75rem 1.5rem;
          border-radius: 46px;
          background-color: var(--dl-color-theme-primary1, #c02425);
          color: #fff;
          border: none;
          cursor: pointer;
        }
        .thq-button-filled:hover {
          opacity: 0.9;
        }
      `}</style>
    </>
  )
}