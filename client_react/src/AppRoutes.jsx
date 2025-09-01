import React, { useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import { UserContext } from './contexts/UserContext';
import LandingPage from './pages/LandingPage';
import ProductMenu from './components/ProductMenu';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import FoodDashboard from './components/FoodDashboard';
import Checkout from './pages/Checkout';
import OrdersPage from './pages/OrdersPage';

const AppRoutes = () => {
  const { loading } = useContext(UserContext);

  if (loading) return <div>Loading user...</div>;

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/product/:restId/:restName" element={<ProductMenu />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/dashboard" element={<FoodDashboard />} />
      <Route path="/orders" element={<OrdersPage />} />
    </Routes>
  );
};

export default AppRoutes;
