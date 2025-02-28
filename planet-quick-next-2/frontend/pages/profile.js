import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Autocomplete from 'react-google-autocomplete';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [newAddressTitle, setNewAddressTitle] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const router = useRouter();

  const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337';

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setFirstName(userData.firstName || '');
      setLastName(userData.lastName || '');
      setEmail(userData.email || '');
      setPhone(userData.phone || '');
      setSavedAddresses(userData.savedAddresses || []);
    }

    const handleBeforeUnload = (event) => {
      if (unsavedChanges) {
        event.preventDefault();
        event.returnValue = "You have unsaved changes!";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [unsavedChanges]);

  const handleSaveProfile = async () => {
    if (!user) return;

    try {
      const res = await fetch(`${STRAPI_URL}/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('jwt')}`,
        },
        body: JSON.stringify({ firstName, lastName, email, phone, savedAddresses }),
      });

      if (res.ok) {
        alert("Profile updated successfully!");
        localStorage.setItem('user', JSON.stringify({ ...user, firstName, lastName, email, phone, savedAddresses }));
        setUnsavedChanges(false);
      } else {
        alert("Error updating profile. Please try again.");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Server error. Please try again later.");
    }
  };

  const handleAddAddress = () => {
    if (newAddress && newAddressTitle) {
      setSavedAddresses([...savedAddresses, { title: newAddressTitle, address: newAddress }]);
      setNewAddressTitle('');
      setNewAddress('');
      setShowAddressModal(false);
      setUnsavedChanges(true);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;

    const confirmDelete = window.confirm("Are you sure? This action cannot be undone.");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`${STRAPI_URL}/api/users/${user.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('jwt')}`,
        },
      });

      if (res.ok) {
        alert("Your account has been deleted.");
        localStorage.removeItem('user');
        localStorage.removeItem('jwt');
        router.push('/');
      } else {
        alert("Error deleting account. Please try again.");
      }
    } catch (err) {
      console.error("Error deleting account:", err);
      alert("Server error. Please try again later.");
    }
  };

  return (
    <div className="profile-container">
      <Head><title>Profile</title></Head>
      
      {/* Profile Tile */}
      <div className="profile-accent2-bg">
        <div className="profile-accent1-bg">
          <div className="profile-tile">
            <h2 className="profile-title">Profile Information</h2>

            {/* Editable Fields */}
            <label>First Name</label>
            <input type="text" value={firstName} onChange={(e) => { setFirstName(e.target.value); setUnsavedChanges(true); }} />

            <label>Last Name</label>
            <input type="text" value={lastName} onChange={(e) => { setLastName(e.target.value); setUnsavedChanges(true); }} />

            <label>Email</label>
            <input type="email" value={email} readOnly />

            <label>Phone</label>
            <input type="tel" value={phone} onChange={(e) => { setPhone(e.target.value); setUnsavedChanges(true); }} />

            {/* Address Book */}
            <label>Address Book</label>
            <select value={selectedAddress} onChange={(e) => setSelectedAddress(e.target.value)}>
              <option value="">Select an address</option>
              {savedAddresses.map((addr, index) => (
                <option key={index} value={addr.address}>{addr.title} - {addr.address}</option>
              ))}
            </select>

            {/* + Address Book Button */}
            <button className="small-add-button" onClick={() => setShowAddressModal(true)}>+ Address Book</button>

            {/* Update Profile Button (Bottom Right) */}
            <button className="thq-button-filled profile-update-button" onClick={handleSaveProfile}>Update Profile</button>
          </div>
        </div>
      </div>

      {/* Delete Account Button (Closer to Tile) */}
      <button className="delete-account-button" onClick={handleDeleteAccount}>Delete Account</button>

      {/* Address Modal */}
      {showAddressModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Add to Address Book</h3>
            <label>Name Location</label>
            <input type="text" value={newAddressTitle} onChange={(e) => setNewAddressTitle(e.target.value)} />
            
            <label>Enter Address</label>
            <Autocomplete
              apiKey="YOUR_GOOGLE_PLACES_API_KEY"
              onPlaceSelected={(place) => setNewAddress(place.formatted_address)}
              options={{ types: ['geocode'] }}
              className="google-places-input"
              placeholder="Enter address"
            />

          <div className="modal-buttons">
            <button className="cancel-button" onClick={() => setShowAddressModal(false)}>Cancel</button>
            <button className="save-button" onClick={handleAddAddress}>Save Address</button>
         </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;