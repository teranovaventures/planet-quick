import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { FaGoogle, FaFacebookF, FaApple } from 'react-icons/fa';

const SignUp = ({ setUser, setIsModalOpen = () => {} }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [accountCreated, setAccountCreated] = useState(false);
  const router = useRouter();

  const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337';

  useEffect(() => {
    // ✅ If already logged in, redirect to homepage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      router.push('/');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const randomUsername = `user_${Math.floor(Math.random() * 1000000)}`;

    try {
      const res = await fetch(`${STRAPI_URL}/api/auth/local/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: randomUsername, email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        if (data.error?.message.includes("Email already taken")) {
          setError("This email is already registered. Signing you in...");
          setTimeout(() => handleLogin(email, password), 2000);
        } else {
          setError(data.error?.message || "Sign-up failed.");
        }
        return;
      }

      // ✅ Store session BEFORE redirecting
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('jwt', data.jwt);
      setUser(data.user);

      // ✅ Show Welcome Message Animation
      setAccountCreated(true);
      setTimeout(() => {
        router.push('/'); // ✅ Redirect to homepage
      }, 2500);

    } catch (err) {
      setError("Server error. Please try again later.");
    }
  };

  return (
    <div className="sign-up-container">
      <Head><title>Sign Up</title></Head>

      {accountCreated ? (
        <div className="welcome-message">
          <h2>🎉 Welcome to Planet Quick!</h2>
          <p>Redirecting you to your dashboard...</p>
        </div>
      ) : (
        <div className="sign-up-box">
          <h2 className="sign-up-title">Sign Up</h2>

          <div className="social-login">
            <button className="social-button google"><FaGoogle /> Continue with Google</button>
            <button className="social-button facebook"><FaFacebookF /> Continue with Facebook</button>
            <button className="social-button apple"><FaApple /> Continue with Apple</button>
          </div>

          <p className="modal-divider">OR</p>

          {error && <p className="error">{error}</p>}

          <form onSubmit={handleSubmit} className="sign-up-form">
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button type="submit" className="sign-up-button">Sign Up</button>
          </form>

          <p className="sign-up-footer">
            By continuing, you agree to the <a href="#">Terms of Use</a> and <a href="#">Privacy Policy</a>.
          </p>

          <p className="sign-up-footer">
            Already have an account? <a href="#" onClick={(e) => {
              e.preventDefault();
              setIsModalOpen(true);
            }} className="sign-in-link">Sign In</a>
          </p>
        </div>
      )}
    </div>
  );
};

export default SignUp;