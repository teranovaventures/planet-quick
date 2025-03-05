import React, { useState } from "react";
import { FaGoogle, FaFacebookF, FaApple } from "react-icons/fa";
import styles from "./modal.module.css"; // ✅ Importing CSS Module

const Modal = ({ isOpen, onClose, onLogin }) => {
  if (!isOpen) return null;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337";

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${STRAPI_URL}/api/auth/local`, {
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

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalBackground}></div> {/* ✅ Darkens background */}
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>✕</button>
        <h2 className={styles.modalTitle}>Sign In</h2>

        {/* Sign-In Form */}
        <form className={styles.modalForm} onSubmit={handleSubmit}>
          <input type="email" placeholder="Email" className={styles.modalInput} value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" className={styles.modalInput} value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit" className={styles.modalSigninButton}>Sign In</button>
        </form>

        {error && <p className={styles.error}>{error}</p>}

        <p className={styles.modalDivider}>or sign in with</p>

        {/* Social Login Buttons */}
        <div className={styles.socialLogin}>
          <a href={`${STRAPI_URL}/api/auth/google`} className={`${styles.socialButton} ${styles.google}`}>
            <FaGoogle className={styles.socialIcon} /> Google
          </a>
          <a href={`${STRAPI_URL}/api/auth/facebook`} className={`${styles.socialButton} ${styles.facebook}`}>
            <FaFacebookF className={styles.socialIcon} /> Facebook
          </a>
          <a href={`${STRAPI_URL}/api/auth/apple`} className={`${styles.socialButton} ${styles.apple}`}>
            <FaApple className={styles.socialIcon} /> Apple
          </a>
        </div>

        <p className={styles.modalFooter}>
          <span className={styles.forgotPassword} onClick={() => setForgotPasswordOpen(true)}>Forgot password?</span>
        </p>
      </div>
    </div>
  );
};

export default Modal;