import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import '../pages/style.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [image, setImage] = useState('');
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setName(userData.username);
      setPhone(userData.phone || '');
      setImage(userData.image || '');
    }
  }, []);

  const handleUpdate = async () => {
    // API Call to update user details in Strapi
  };

  return (
    <div className="profile-container">
      <h2>Profile</h2>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
      <button onClick={handleUpdate}>Update Profile</button>
    </div>
  );
};

export default Profile;