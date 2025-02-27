import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { FaGoogle, FaFacebookF, FaApple } from 'react-icons/fa';

const SignUp = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337';

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${STRAPI_URL}/api/auth/local/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('jwt', data.jwt);
        router.push('/profile'); // Redirect to profile page after sign-up
      } else {
        setError(data.error.message || 'Sign-up failed');
      }
    } catch (err) {
      setError('Something went wrong. Try again.');
    }
  };

  return (
    <div className="sign-up-container">
      <Head>
        <title>Sign Up</title>
      </Head>
      <div className="sign-up-box">
        <h2 className="sign-up-title">Sign Up</h2>

        {/* Social Sign-Up Buttons */}
        <div className="social-login">
          <button className="social-button google"><FaGoogle /> Continue with Google</button>
          <button className="social-button facebook"><FaFacebookF /> Continue with Facebook</button>
          <button className="social-button apple"><FaApple /> Continue with Apple</button>
        </div>

        <p className="modal-divider">OR</p>

        {/* Sign-Up Form */}
        <form onSubmit={handleSubmit} className="sign-up-form">
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit" className="sign-up-button">Sign Up</button>
        </form>

        <p className="sign-up-footer">
          By continuing, you agree to the <a href="#">Terms of Use</a> and <a href="#">Privacy Policy</a>.
        </p>

        <p className="sign-up-footer">
          Already have an account? <a href="#" onClick={() => router.push('/')}>Sign In</a>
        </p>
      </div>
    </div>
  );
};

export default SignUp;