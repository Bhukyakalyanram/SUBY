import React, { useState } from 'react';
import { API_URL } from '../../data/apiPath';
import { ThreeCircles } from 'react-loader-spinner';

const Login = ({ showWelcomeHandler, setShowLogOut }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const loginHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/vendor/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert('Login failed');
        return;
      }

      // ✅ Success
      alert('Login success');
      setEmail('');
      setPassword('');
      localStorage.setItem('loginToken', data.token);
      setShowLogOut(true);
      showWelcomeHandler();

      // Fetch vendor data after successful login
      const vendorId = data.vendorId;
      const vendorResponse = await fetch(
        `${API_URL}/vendor/single-vendor/${vendorId}`
      );
      const vendorData = await vendorResponse.json();

      if (vendorResponse.ok && vendorData.vendor.firm.length > 0) {
        localStorage.setItem('firmId', vendorData.vendor.firm[0]._id);
        localStorage.setItem('firmName', vendorData.vendor.firm[0].firmName);
      }

      window.location.reload();
    } catch (error) {
      console.error(error);
      alert('Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="loginSection">
      {loading && (
        <div className="loaderSection">
          <ThreeCircles
            visible={loading}
            height={100}
            width={100}
            color="#4fa94d"
            ariaLabel="three-circles-loading"
            wrapperStyle={{}}
            wrapperClass=""
          />
          <p>Login in process... Please wait</p>
        </div>
      )}
      {!loading && (
        <form className="authForm" onSubmit={loginHandler} autoComplete="off">
          <h3>Vendor Login</h3>
          <label>Email</label>
          <input
            type="text"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="enter your email"
          />
          <br />
          <label>Password</label>
          <div className="inputWithToggle">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="enter your password"
            />
            <span className="showPassword" onClick={handleShowPassword}>
              {showPassword ? 'Hide' : 'Show'}
            </span>
          </div>{' '}
          <div className="btnSubmit">
            <button type="submit">Submit</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Login;
