import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Autocomplete from 'react-google-autocomplete';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [newAddressTitle, setNewAddressTitle] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const router = useRouter();

  const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337';

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setName(userData.name || '');
      setEmail(userData.email || '');
      setPhone(userData.phone || '');
      setSavedAddresses(userData.savedAddresses || []);
    }
  }, []);

  const handleSaveProfile = async () => {
    if (!user) return;

    try {
      const res = await fetch(`${STRAPI_URL}/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('jwt')}`,
        },
        body: JSON.stringify({ name, email, phone, savedAddresses }),
      });

      if (res.ok) {
        alert("Profile updated successfully!");
        localStorage.setItem('user', JSON.stringify({ ...user, name, email, phone, savedAddresses }));
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
      <div className="profile-accent2-bg">
        <div className="profile-accent1-bg">
          <div className="profile-tile">
            <h2 className="profile-title">Profile Information</h2>

            {/* Editable Name */}
            <label>Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />

            {/* Editable Email */}
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

            {/* Editable Phone */}
            <label>Phone Number</label>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />

            {/* Address Book */}
            <h3 className="profile-subtitle">Address Book</h3>
            <label>Saved Addresses</label>
            <select onChange={(e) => setSelectedAddress(e.target.value)}>
              <option value="">Select a saved address...</option>
              {savedAddresses.map((addr, index) => (
                <option key={index} value={addr.address}>{addr.title} - {addr.address}</option>
              ))}
            </select>

            {/* Add New Address */}
            <h4 className="profile-subtitle">Add to Address Book</h4>
            <label>Address Name</label>
            <input type="text" value={newAddressTitle} onChange={(e) => setNewAddressTitle(e.target.value)} placeholder="e.g., Work, Parents' House" />

            <label>New Address</label>
            <Autocomplete
              apiKey="YOUR_GOOGLE_PLACES_API_KEY"
              onPlaceSelected={(place) => setNewAddress(place.formatted_address)}
              className="google-places-input"
              placeholder="Type new address"
            />

            <button className="save-address-button" onClick={handleAddAddress}>Save New Address</button>

            {/* Save Profile Button */}
            <button className="save-profile-button" onClick={handleSaveProfile}>Save Profile</button>

            {/* Delete Account */}
            <button className="delete-account-button" onClick={handleDeleteAccount}>Delete Account</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;