import React, { useEffect, useState } from 'react';
import TopBar from '../components/TopBar';
const API_URL = import.meta.env.VITE_API_URL;
import './OrdersPage.css';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      const res = await fetch(`${API_URL}/orders/my-orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setOrders(data.orders || []);
    };
    fetchOrders();
  }, []);

  return (
    <div>
      <TopBar />
      <div className="ordersContainer">
        <h2>🧾 Your Orders</h2>
        {orders.length === 0 ? (
          <p>You have no orders yet!</p>
        ) : (
          orders.map((order) => (
            <div className="orderCard" key={order._id}>
              <h4 className="orderId">Order ID: {order._id}</h4>
              {order.items.map((item) => (
                <div className="orderItem" key={item.product._id}>
                  <img
                    src={`${item.product?.image}`}
                    alt={item.product?.productName}
                  />
                  <div className="itemInfo">
                    <h4>{item.product.productName}</h4>
                    <p>
                      ₹{item.product.price} × {item.quantity}
                    </p>
                  </div>
                </div>
              ))}
              <div className="orderFooter">
                <h3>Total: ₹{order.totalAmount}</h3>
                <span className={`status ${order.status}`}>{order.status}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
