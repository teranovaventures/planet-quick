import React, { useState } from 'react';
import { FaGoogle, FaFacebookF, FaApple } from 'react-icons/fa';
import styles from './modal.module.css';

const Modal = ({ isOpen, onClose, onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('/api/auth/local', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ identifier: email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.user) {
        setError("Invalid email or password. Please try again.");
        return;
      }

      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('jwt', data.jwt);
      onLogin(data.user);
      onClose();
    } catch (err) {
      setError("Server error. Please try again later.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>✕</button>
        <h2 className={styles.modalTitle}>Sign In</h2>
        <form className={styles.modalForm} onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            className={styles.modalInput}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className={styles.modalInput}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className={styles.modalSigninButton}>Sign In</button>
        </form>
        {error && <p className={styles.error}>{error}</p>}
        <p className={styles.modalDivider}>or sign in with</p>
        <div className={styles.socialLogin}>
          <button
            className={`${styles.socialButton} ${styles.google}`}
            onClick={() => console.log('Google login not implemented yet')}
          >
            <FaGoogle className={styles.socialIcon} /> Google
          </button>
          <button
            className={`${styles.socialButton} ${styles.facebook}`}
            onClick={() => console.log('Facebook login not implemented yet')}
          >
            <FaFacebookF className={styles.socialIcon} /> Facebook
          </button>
          <button
            className={`${styles.socialButton} ${styles.apple}`}
            onClick={() => console.log('Apple login not implemented yet')}
          >
            <FaApple className={styles.socialIcon} /> Apple
          </button>
        </div>
        <p className={styles.modalFooter}>
          <span className={styles.forgotPassword}>Forgot password?</span>
        </p>
      </div>
    </div>
  );
};

export default Modal;