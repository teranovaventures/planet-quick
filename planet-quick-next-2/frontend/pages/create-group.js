import React, { useState } from 'react'

export default function CreateGroupPage() {
  // ------------------------------
  // 1) STATE
  // ------------------------------
  const [groupTitle, setGroupTitle] = useState('')
  const [members, setMembers] = useState([{ memberName: '', memberEmail: '' }])
  const [searchValue, setSearchValue] = useState('')
  const [suggestions, setSuggestions] = useState([])

  // Strapi API
  const API_URL = 'http://localhost:1337/api/groups'
  const STRAPI_API_KEY = 'YOUR_STRAPI_API_KEY_HERE' // Replace with valid API key

  // ------------------------------
  // 2) AUTOCOMPLETE
  // ------------------------------
  const handleSearchChange = (e) => {
    const query = e.target.value
    setSearchValue(query)

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
    setMembers((prev) => [...prev, { memberName: person.name, memberEmail: person.email }])
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
    setMembers(members.filter((_, i) => i !== index))
  }

  // ------------------------------
  // 4) SUBMIT TO STRAPI
  // ------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault()

    const groupData = {
      data: {
        title: groupTitle,
        state: 'pending',
        members
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
        setGroupTitle('')
        setMembers([{ memberName: '', memberEmail: '' }])
      } else {
        console.error('Error creating group:', json)
        alert('Failed to create group.')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error creating group.')
    }
  }

  // ------------------------------
  // 5) RENDER
  // ------------------------------
  return (
    <>
      <div className="create-group-container">
        <div className="page-background">
          <div className="createevents-accent2-bg">
            <div className="createevents-accent1-bg">
              <div className="createevents-container2">
                <div className="createevents-content">
                  <h2 className="thq-heading-2">Create Your Guest List</h2>
                  <p className="thq-body-large">
                    Add new group members by searching or manually entering their details below.
                  </p>

                  {/* Autocomplete Search */}
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

                  {/* Main Form */}
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

                    <button type="button" onClick={handleAddMember} className="add-member-button">
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
          background-image: url("/dorritos.jpeg");
        }
        .createevents-accent2-bg {
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: var(--dl-color-theme-accent2);
        }
        .createevents-accent1-bg {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: var(--dl-color-theme-accent1);
        }
        .createevents-container2 {
          width: 100%;
          display: flex;
          align-items: center;
          padding: var(--dl-space-space-sixunits);
          border-radius: var(--dl-radius-radius-cardradius);
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
        }
        .search-bar {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
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
          border-radius: 4px;
          font-size: 16px;
        }
      `}</style>
    </>
  )
}