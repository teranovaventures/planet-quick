import React, { useState } from "react";
import { FaGoogle, FaFacebookF, FaApple } from "react-icons/fa";
import styles from "./modal.module.css"; // ✅ Importing CSS Module

const Modal = ({ isOpen, onClose, onLogin }) => {
  if (!isOpen) return null;

  // Strapi API URL
  const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337";

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>✕</button>
        <h2 className={styles.modalTitle}>Sign In</h2>

        {/* Strapi Email/Password Login */}
        <form className={styles.modalForm} action={`${STRAPI_URL}/api/auth/local`} method="POST">
          <input type="email" name="identifier" placeholder="Email" className={styles.modalInput} required />
          <input type="password" name="password" placeholder="Password" className={styles.modalInput} required />
          <button type="submit" className={styles.modalSigninButton} onClick={onLogin}>Sign In</button>
        </form>

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
          <span className={styles.forgotPassword}>Forgot password?</span>
        </p>
      </div>
    </div>
  );
};

export default Modal;