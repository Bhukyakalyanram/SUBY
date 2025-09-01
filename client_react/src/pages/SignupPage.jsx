import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
const API_URL = import.meta.env.VITE_API_URL;
import TopBar from '../components/TopBar';

const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, confirmPassword }),
      });
      const data = await res.json();

      if (res.ok) {
        toast.success('Signup successful! Please login now.');
        navigate('/login');
      } else {
        toast.error(data.message || 'Signup failed');
      }
    } catch (err) {
      console.error('Signup error', err);
      toast.error('Signup failed: network or server error');
    }
  };

  return (
    <>
      <TopBar onlyLogout={false} />
      <div className="authPage">
        <div className="authContainer">
          <h2>Signup</h2>
          <form onSubmit={handleSignup}>
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button type="submit">Signup</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default SignupPage;
