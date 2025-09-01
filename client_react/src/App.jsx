import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import AppRoutes from './AppRoutes';
import { UserProvider } from './contexts/UserContext';
import { CartProvider } from './contexts/CartContext';
import './App.css';

function App() {
  return (
    <UserProvider>
      <CartProvider>
        <AppRoutes />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </CartProvider>
    </UserProvider>
  );
}

export default App;
