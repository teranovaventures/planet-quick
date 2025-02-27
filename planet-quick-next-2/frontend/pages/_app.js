import { useEffect, useState } from 'react';
import Navbar from '../components/navbar';
import Modal from '../components/modal';
import '../pages/style.css';

function MyApp({ Component, pageProps }) {
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <>
      <Navbar user={user} setUser={setUser} setIsModalOpen={setIsModalOpen} />
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onLogin={(userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData)); // Ensure session persists
      }} />
      <Component {...pageProps} user={user} setUser={setUser} />
    </>
  );
}

export default MyApp;