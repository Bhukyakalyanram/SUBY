import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
const API_URL = import.meta.env.VITE_API_URL;
import { CartContext } from '../contexts/CartContext';
import { UserContext } from '../contexts/UserContext';
import TopBar from '../components/TopBar';
import { toast } from 'react-toastify';

const ProductsMenu = () => {
  const { restId } = useParams();
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  // Listen for pending cart items after login
  useEffect(() => {
    const handler = (e) => {
      console.log('[ProductsMenu] Event received:', e.detail);
      addToCart(e.detail);
      toast.success(`${e.detail.productName} added to cart!`);
    };
    window.addEventListener('add-to-cart-after-login', handler);
    return () => window.removeEventListener('add-to-cart-after-login', handler);
  }, [addToCart]);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      if (!restId) return;
      try {
        const res = await fetch(`${API_URL}/product/${restId}/products`);
        const data = await res.json();
        setProducts(data.products || []);
      } catch (err) {
        console.error('Failed to fetch products:', err);
      }
    };
    fetchProducts();
  }, [restId]);

  const currentUser = user || JSON.parse(localStorage.getItem('user'));

  const handleAddToCart = (product) => {
    if (!currentUser) {
      toast.info('Please Login to Add Product');
      localStorage.setItem('pendingProduct', JSON.stringify(product));
      navigate('/login');
      return;
    }
    addToCart(product);
  };

  return (
    <div>
      <TopBar />
      <div className="dashboardContainer">
        <h2 style={{ margin: '20px 0' }}>Menu</h2>
        <div className="popularGrid">
          {products.length > 0 ? (
            products.map((item) => (
              <div className="dishCard" key={item._id}>
                <img
                  src={`${API_URL}/uploads/${item.image}`}
                  alt={item.productName}
                />
                <h4>{item.productName}</h4>
                <p>₹{item.price}</p>
                <button onClick={() => handleAddToCart(item)}>
                  Add to Cart
                </button>
              </div>
            ))
          ) : (
            <p>No products found for this restaurant.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsMenu;
