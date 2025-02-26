
import React from "react";
import { FaGoogle, FaFacebookF, FaApple } from "react-icons/fa";
import styles from "./modal.module.css"; // ✅ Importing CSS Module

const Modal = ({ isOpen, onClose, onLogin }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>✕</button>
        <h2 className={styles.modalTitle}>Sign In</h2>
        <form className={styles.modalForm}>
          <input type="email" placeholder="Email" className={styles.modalInput} />
          <input type="password" placeholder="Password" className={styles.modalInput} />
          <button type="button" className={styles.modalSigninButton} onClick={onLogin}>Sign In</button>
        </form>
        
        <p className={styles.modalDivider}>or sign in with</p>
        
        <div className={styles.socialLogin}>
          <button className={`${styles.socialButton} ${styles.google}`}>
            <FaGoogle className={styles.socialIcon} /> Google
          </button>
          <button className={`${styles.socialButton} ${styles.facebook}`}>
            <FaFacebookF className={styles.socialIcon} /> Facebook
          </button>
          <button className={`${styles.socialButton} ${styles.apple}`}>
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