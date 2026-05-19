import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { WishlistProvider } from './context/WishlistContext'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Collections from './pages/Collections'
import Shop from './pages/Shop'
import ProductDetails from './pages/ProductDetails'
import Cart from './pages/Cart'
import Wishlist from './pages/Wishlist'
import Checkout from './pages/Checkout'
import AboutUs from './pages/AboutUs'
import Contact from './pages/Contact'
import Dashboard from './pages/Admin/Dashboard'
import AdminProducts from './pages/Admin/AdminProducts'
import AddProduct from './pages/Admin/AddProduct'
import AdminCategories from './pages/Admin/AdminCategories'
import AdminOrders from './pages/Admin/AdminOrders'
import AdminUsers from './pages/Admin/AdminUsers'
import AdminCoupons from './pages/Admin/AdminCoupons'
import EditProduct from './pages/Admin/EditProduct'

import { Toaster } from 'react-hot-toast';

import AdminRoute from './components/AdminRoute'
import Preloader from './components/Preloader'
import ScrollToTop from './components/ScrollToTop'

const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <Toaster 
            position="bottom-center"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#333',
                color: '#fff',
                fontFamily: 'Almarai, sans-serif'
              },
            }}
          />
          <Router>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/collections" element={<Collections />} />
              <Route path="/products" element={<Shop />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/contact" element={<Contact />} />
              
              {/* Admin Routes - Protected */}
              <Route path="/admin/dashboard" element={<AdminRoute><Dashboard /></AdminRoute>} />
              <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
              <Route path="/admin/products/add" element={<AdminRoute><AddProduct /></AdminRoute>} />
              <Route path="/admin/products/edit/:id" element={<AdminRoute><EditProduct /></AdminRoute>} />
              <Route path="/admin/categories" element={<AdminRoute><AdminCategories /></AdminRoute>} />
              <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
              <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
              <Route path="/admin/coupons" element={<AdminRoute><AdminCoupons /></AdminRoute>} />
            </Routes>
          </Router>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  )
}

export default App