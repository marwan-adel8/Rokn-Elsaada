import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity = 1, selectedSize = null) => {
    const cartItemId = product._id + (selectedSize ? '-' + selectedSize.size : '');
    const existingItem = cartItems.find(item => item.cartItemId === cartItemId);
    if (existingItem) {
      toast.success(`تم تحديث كمية ${product.name} ${selectedSize ? `(${selectedSize.size})` : ''} في السلة`);
    } else {
      toast.success(`تم إضافة ${product.name} ${selectedSize ? `(${selectedSize.size})` : ''} إلى السلة`);
    }

    setCartItems(prevItems => {
      if (existingItem) {
        return prevItems.map(item => 
          item.cartItemId === cartItemId ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prevItems, { 
        ...product, 
        cartItemId,
        selectedSize,
        price: selectedSize ? selectedSize.price : product.price,
        discount: selectedSize ? selectedSize.discount : product.discount,
        quantity 
      }];
    });
  };

  const removeFromCart = (cartItemId) => {
    const itemToRemove = cartItems.find(item => item.cartItemId === cartItemId);
    if (itemToRemove) {
      toast.success(`تم حذف ${itemToRemove.name} من السلة`);
    }
    setCartItems(prevItems => prevItems.filter(item => item.cartItemId !== cartItemId));
  };

  const updateQuantity = (cartItemId, quantity) => {
    if (quantity < 1) return;
    setCartItems(prevItems => 
      prevItems.map(item => item.cartItemId === cartItemId ? { ...item, quantity } : item)
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.discount > 0 ? item.price * (1 - item.discount / 100) : item.price;
      return total + (price * item.quantity);
    }, 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart, 
      getCartTotal,
      getCartCount 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
