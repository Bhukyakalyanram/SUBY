import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user.id));
        toast.success('Login successful!');

        // ✅ Dispatch pending product if exists
        const pending = localStorage.getItem('pendingProduct');
        if (pending) {
          const event = new CustomEvent('add-to-cart-after-login', {
            detail: JSON.parse(pending),
          });
          window.dispatchEvent(event);
          localStorage.removeItem('pendingProduct');
        }

        navigate('/dashboard');
      } else {
        toast.error(data.message || 'Login failed');
      }
    } catch (err) {
      console.error(err);
      toast.error('Login failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    toast.info('Logged out successfully');
  };

  if (loading) return null;

  return (
    <UserContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </UserContext.Provider>
  );
};
