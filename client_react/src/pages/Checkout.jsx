import React, { useContext, useEffect, useState } from 'react';
import TopBar from '../components/TopBar';
import { CartContext } from '../contexts/CartContext';
import { UserContext } from '../contexts/UserContext';
const API_URL = import.meta.env.VITE_API_URL;
const RAZOR_KEY = import.meta.env.VITE_RAZOR_PAY;
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './Checkout.css';

const Checkout = () => {
  const { cart, removeFromCart, clearCart } = useContext(CartContext);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  const currentUser = user || JSON.parse(localStorage.getItem('user'));

  const totalPrice = cart.reduce(
    (acc, item) => acc + (item.price || 0) * (item.quantity || 1),
    0
  );

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => setRazorpayLoaded(true);
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, []);

  const handlePayment = async () => {
    if (!currentUser) return navigate('/login');
    if (cart.length === 0) return toast.info('Cart is empty');
    if (!razorpayLoaded) return toast.info('Payment gateway is loading...');

    try {
      const res = await fetch(`${API_URL}/payment/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: totalPrice }),
      });
      const orderData = await res.json();

      const options = {
        key: RAZOR_KEY,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'SUBY Food',
        description: 'Order Payment',
        order_id: orderData.id,
        handler: async function (response) {
          await fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({
              items: cart.map((i) => ({
                product: i._id,
                quantity: i.quantity,
              })),
              totalAmount: totalPrice,
              paymentId: response.razorpay_payment_id,
            }),
          });
          clearCart();
          toast.success(`Payment of ₹${totalPrice} successful!`);
          navigate('/orders');
        },
        prefill: { email: currentUser.email },
        theme: { color: '#ff6347' },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      toast.error('Payment failed! Please try again.');
    }
  };

  return (
    <div>
      <TopBar />
      <div className="checkoutContainer">
        <h2>🛒 Your Cart</h2>
        {cart.length === 0 ? (
          <p>Your cart is empty!</p>
        ) : (
          <>
            <div className="cartItems">
              {cart.map((item) => (
                <div className="cartItem" key={item._id}>
                  <img src={`${item.image}`} alt={item.productName} />
                  <div className="itemInfo">
                    <h4>{item.productName}</h4>
                    <p>
                      ₹{item.price} × {item.quantity}
                    </p>
                  </div>
                  <button
                    className="removeBtn"
                    onClick={() => removeFromCart(item._id)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <div className="checkoutSummary">
              <h3>Total: ₹{totalPrice}</h3>
              <div className="checkoutButtons">
                <button className="clearBtn" onClick={clearCart}>
                  Clear Cart
                </button>
                <button className="removeBtn" onClick={handlePayment}>
                  Proceed to Payment
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Checkout;
