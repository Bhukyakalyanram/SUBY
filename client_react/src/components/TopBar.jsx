import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import { CartContext } from '../contexts/CartContext';
import { FaShoppingCart } from 'react-icons/fa';
const API_URL = import.meta.env.VITE_API_URL;

const TopBar = ({ onlyLogout, onSearch }) => {
  const { user, logout } = useContext(UserContext);
  const { totalItems } = useContext(CartContext);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [localUser, setLocalUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setLocalUser(JSON.parse(storedUser));
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setLocalUser(null);
  };

  const goToCart = () => navigate('/checkout');
  const goToOrders = () => navigate('/orders');

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.length > 1 && onSearch) {
      try {
        const res = await fetch(
          `${API_URL}/product/search-products?q=${query}`
        );
        const data = await res.json();
        onSearch(data.products || []);
      } catch (err) {
        console.error(err);
      }
    } else if (onSearch) {
      onSearch([]);
    }
  };

  const currentUser = user || localUser;

  return (
    <section className="topBarSection">
      <div className="companyTitle">
        <Link to={currentUser ? '/dashboard' : '/'} className="link">
          <h2>SUBY</h2>
        </Link>
      </div>

      <div className="searchBar">
        <input
          type="text"
          placeholder="Search foods..."
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      <div className="userAuth">
        {currentUser && (
          <>
            <span
              onClick={goToCart}
              style={{
                cursor: 'pointer',
                marginRight: '15px',
                position: 'relative',
              }}
            >
              <FaShoppingCart size={20} />
              {totalItems > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-8px',
                    right: '-10px',
                    background: 'red',
                    color: 'white',
                    borderRadius: '50%',
                    padding: '2px 6px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}
                >
                  {totalItems}
                </span>
              )}
            </span>

            <span
              onClick={goToOrders}
              style={{
                cursor: 'pointer',
                marginRight: '15px',
                fontWeight: 'bold',
                color: '#ff6600',
              }}
            >
              Your Orders
            </span>
          </>
        )}

        {currentUser ? (
          <span
            onClick={handleLogout}
            style={{ color: 'red', fontWeight: 'bold', cursor: 'pointer' }}
          >
            Logout
          </span>
        ) : !onlyLogout ? (
          <>
            <Link to="/login">Login</Link> / <Link to="/signup">Signup</Link>
          </>
        ) : null}
      </div>
    </section>
  );
};

export default TopBar;
