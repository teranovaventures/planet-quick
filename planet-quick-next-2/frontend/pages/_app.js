import { useEffect, useState } from 'react';
import Navbar from '../components/navbar';
import Modal from '../components/modal';
import '../pages/style.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

function MyApp({ Component, pageProps }) {
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Error reading localStorage:", error);
    }
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

  return (
    <>
      <Navbar user={user} setUser={setUser} setIsModalOpen={setIsModalOpen} />
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onLogin={handleLogin} />
      <Component {...pageProps} user={user} setUser={setUser} setIsModalOpen={setIsModalOpen} />
    </>
  );
}

export default MyApp;