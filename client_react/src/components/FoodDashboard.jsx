import React, { useEffect, useState, useContext } from 'react';
import TopBar from './TopBar';
const API_URL = import.meta.env.VITE_API_URL;
import { CartContext } from '../contexts/CartContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';

const FoodDashboard = () => {
  const [firms, setFirms] = useState([]);
  const [popular, setPopular] = useState([]);
  const { addToCart } = useContext(CartContext);
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get('q') || '';

  const fetchFirms = async () => {
    try {
      const res = await fetch(`${API_URL}/vendor/all-vendors`);
      const data = await res.json();
      setFirms(data.vendors || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPopular = async () => {
    try {
      const res = await fetch(`${API_URL}/product/popular`);
      const data = await res.json();
      setPopular(data.products || []);
    } catch (err) {
      console.error('Failed to fetch popular products:', err);
    }
  };

  const currentUser = JSON.parse(localStorage.getItem('user'));

  const handleAddToCart = (item) => {
    if (!currentUser) {
      localStorage.setItem('pendingProduct', JSON.stringify(item));
      navigate('/login');
      return;
    }
    addToCart(item);
  };

  useEffect(() => {
    fetchFirms();
    fetchPopular();
  }, [searchQuery]);

  return (
    <div>
      <TopBar onlyLogout={true} />
      <div className="dashboardContainer">
        <div className="heroBanner">
          <h2>Discover the best food around you 🍴</h2>
          <p>Order from your favourite restaurants with Suby</p>
        </div>

        <section className="popularSection">
          <h3>
            {searchQuery
              ? `Search Results for "${searchQuery}"`
              : '🔥 Popular Dishes'}
          </h3>
          <div className="popularGrid">
            {popular.map((item) => (
              <div className="dishCard" key={item._id}>
                <img src={`${item.image}`} alt={item.productName} />
                <h4>{item.productName}</h4>
                <p>₹{item.price}</p>
                <button onClick={() => handleAddToCart(item)}>
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
          {searchQuery && popular.length === 0 && (
            <p style={{ textAlign: 'center', marginTop: '20px' }}>
              No food found for "{searchQuery}"
            </p>
          )}
        </section>

        <section className="restaurantsSection">
          <h3>🏪 Restaurants Near You</h3>
          <div className="restaurantGrid">
            {firms.map((vendor) =>
              vendor.firm.map((rest) => (
                <Link
                  to={`/product/${rest._id}/${rest.firmName}`} // matches /product/:restId/:restName
                  className="restaurantCard"
                  key={rest._id}
                >
                  <img src={`${rest.image}`} alt={rest.firmName} />
                  <div className="restaurantInfo">
                    <h4>{rest.firmName}</h4>
                    <p>{rest.region.join(', ')}</p>
                    <p className="offer">{rest.offer}</p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default FoodDashboard;
