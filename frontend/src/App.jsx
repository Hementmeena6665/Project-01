import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProductList from './pages/ProductList';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import EditProfile from './pages/EditProfile';
import OrderDetail from './pages/OrderDetail';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Footer from './components/Footer';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-slate-950 text-slate-50 pt-28">
          <Navbar />
          <main className="max-w-7xl mx-auto px-6 pb-20">
            <Routes>
              <Route path="/" element={<ProductList />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/order/:id" element={<OrderDetail />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/edit-profile" element={<EditProfile />} />
              <Route path="/footer" element={<Footer/>}/>
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;