import { useEffect, useState } from 'react';
import Navbar from '../components/navbar';
import Modal from '../components/modal';
import '../pages/style.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

function MyApp({ Component, pageProps }) {
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [notificationMessage, setNotificationMessage] = useState('');

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      const count = localStorage.getItem('notificationCount') || '0';
      const message = localStorage.getItem('notification') || '';
      setNotificationCount(parseInt(count));
      setNotificationMessage(message);
    } catch (error) {
      console.error("Error reading localStorage:", error);
    }
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      const count = localStorage.getItem('notificationCount') || '0';
      const message = localStorage.getItem('notification') || '';
      setNotificationCount(parseInt(count));
      setNotificationMessage(message);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    try {
      localStorage.setItem('user', JSON.stringify(userData)); // Persist session
    } catch (error) {
      console.error("Error saving user to localStorage:", error);
    }
    setIsModalOpen(false); // Close modal after login
  };

  const clearNotifications = () => {
    setNotificationCount(0);
    setNotificationMessage('');
    localStorage.setItem('notificationCount', '0');
    localStorage.removeItem('notification');
  };

  return (
    <>
      <Navbar
        user={user}
        setUser={setUser}
        setIsModalOpen={setIsModalOpen}
        notificationCount={notificationCount}
        notificationMessage={notificationMessage}
        clearNotifications={clearNotifications}
      />
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onLogin={handleLogin} />
      <Component {...pageProps} user={user} setUser={setUser} setIsModalOpen={setIsModalOpen} />
    </>
  );
}

export default MyApp;