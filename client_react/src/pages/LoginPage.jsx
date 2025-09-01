import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
const API_URL = import.meta.env.VITE_API_URL;
import TopBar from '../components/TopBar';
import { CartContext } from '../contexts/CartContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user.id));
        toast.success(`Login successful! Welcome ${data.user.name}`);

        // ✅ Add pending product to cart immediately
        const pending = localStorage.getItem('pendingProduct');
        if (pending) {
          const product = JSON.parse(pending);
          addToCart(product);
          localStorage.removeItem('pendingProduct');
        }

        navigate('/dashboard'); // redirect
      } else {
        toast.error(data.message || 'Login failed');
      }
    } catch (err) {
      console.error('Login error', err);
      toast.error('Login failed: network or server error');
    }
  };

  return (
    <>
      <TopBar onlyLogout={false} />
      <div className="authPage">
        <div className="authContainer">
          <h2>Login</h2>
          <form onSubmit={handleLogin}>
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
            <button type="submit">Login</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
