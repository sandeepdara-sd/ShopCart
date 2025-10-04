import { useState, useEffect, useCallback, useRef, createContext, useContext } from 'react';
import { useNotify } from '../contexts/NotificationContext.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import { API_BASE_URL } from '../config.js';

const REQUEST_TIMEOUT = 10000;

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState({});
  const { user } = useAuth();
  const abortControllerRef = useRef(null);
  const notify = useNotify();

  // Centralized fetch wrapper with error handling
  const apiFetch = async (endpoint, options = {}) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      };

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      throw error;
    }
  };

  // Fetch cart data
  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCart(null);
    }

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [user]);

  const fetchCart = useCallback(async (showLoader = true) => {
    if (!user) return;

    try {
      if (showLoader) setLoading(true);
      setError(null);

      const data = await apiFetch('/cart');
      setCart(data);
      return data;
    } catch (error) {
      const errorMessage = error.message || 'Failed to fetch cart';
      setError(errorMessage);
      console.error('Error fetching cart:', error);
      throw error;
    } finally {
      if (showLoader) setLoading(false);
    }
  }, [user]);

  // ✅ FIXED: Properly handles quantity
  const addToCart = useCallback(async (product) => {
    if (!user) {
      setError('Please login to add items to cart');
      return { success: false, error: 'Not authenticated' };
    }

    // Extract quantity and productId
    const quantity = product.quantity || 1;
    const productId = product.productId || product.id || product._id;
    const actionId = `add-${productId}`;
    
    console.log('🛒 Adding to cart:', { 
      productId, 
      quantity, 
      productData: product 
    });
    
    setActionLoading((prev) => ({ ...prev, [actionId]: true }));
    setError(null);

    try {
      // Make API call with quantity
      const data = await apiFetch('/cart/add', {
        method: 'POST',
        body: JSON.stringify({ 
          productId,
          title: product.title,
          price: product.price,
          image: product.image,
          quantity  // ✅ This is the key - quantity is sent to backend
        }),
      });

      console.log('✅ Cart response:', data);
      setCart(data);
      return { success: true, data };
    } catch (error) {
      const errorMessage = error.message || 'Failed to add item to cart';
      setError(errorMessage);
      console.error('❌ Error adding to cart:', error);
      return { success: false, error: errorMessage };
    } finally {
      setActionLoading((prev) => {
        const newState = { ...prev };
        delete newState[actionId];
        return newState;
      });
    }
  }, [user, notify]);

  const updateQuantity = useCallback(async (productId, quantity) => {
    if (!user || quantity < 0) return { success: false };

    const actionId = `update-${productId}`;
    setActionLoading((prev) => ({ ...prev, [actionId]: true }));
    setError(null);

    const previousCart = cart;

    if (cart && cart.items) {
      const updatedItems = cart.items.map((item) =>
        (item._id || item.id) === productId ? { ...item, quantity } : item
      );

      const newTotalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
      const newTotalPrice = updatedItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      setCart({
        ...cart,
        items: updatedItems,
        totalItems: newTotalItems,
        totalPrice: newTotalPrice,
      });
    }

    try {
      const data = await apiFetch(`/cart/update/${productId}`, {
        method: 'PUT',
        body: JSON.stringify({ quantity }),
      });

      setCart(data);
      return { success: true, data };
    } catch (error) {
      setCart(previousCart);
      
      const errorMessage = error.message || 'Failed to update quantity';
      setError(errorMessage);
      console.error('Error updating quantity:', error);
      return { success: false, error: errorMessage };
    } finally {
      setActionLoading((prev) => {
        const newState = { ...prev };
        delete newState[actionId];
        return newState;
      });
    }
  }, [user, cart]);

  const removeFromCart = useCallback(async (productId) => {
    if (!user) return { success: false };

    const actionId = `remove-${productId}`;
    setActionLoading((prev) => ({ ...prev, [actionId]: true }));
    setError(null);

    const previousCart = cart;

    if (cart && cart.items) {
      const removedItem = cart.items.find((item) => (item._id || item.id) === productId);
      const updatedItems = cart.items.filter((item) => (item._id || item.id) !== productId);

      setCart({
        ...cart,
        items: updatedItems,
        totalItems: (cart.totalItems || 0) - (removedItem?.quantity || 0),
        totalPrice: (cart.totalPrice || 0) - (removedItem?.price * removedItem?.quantity || 0),
      });
    }

    try {
      const data = await apiFetch(`/cart/remove/${productId}`, {
        method: 'DELETE',
      });

      setCart(data);
      return { success: true, data };
    } catch (error) {
      setCart(previousCart);
      
      const errorMessage = error.message || 'Failed to remove item';
      setError(errorMessage);
      console.error('Error removing from cart:', error);
      return { success: false, error: errorMessage };
    } finally {
      setActionLoading((prev) => {
        const newState = { ...prev };
        delete newState[actionId];
        return newState;
      });
    }
  }, [user, cart]);

  const clearCart = useCallback(async () => {
    if (!user) return { success: false };

    setActionLoading((prev) => ({ ...prev, clear: true }));
    setError(null);

    const previousCart = cart;
    setCart({ items: [], totalItems: 0, totalPrice: 0 });

    try {
      const data = await apiFetch('/cart/clear', {
        method: 'DELETE',
      });

      setCart(data);
      return { success: true, data };
    } catch (error) {
      setCart(previousCart);
      
      const errorMessage = error.message || 'Failed to clear cart';
      setError(errorMessage);
      console.error('Error clearing cart:', error);
      return { success: false, error: errorMessage };
    } finally {
      setActionLoading((prev) => {
        const newState = { ...prev };
        delete newState.clear;
        return newState;
      });
    }
  }, [user, cart]);

  const isActionLoading = useCallback((actionId) => {
    return actionLoading[actionId] || false;
  }, [actionLoading]);

  const cartSummary = {
    itemCount: cart?.totalItems || 0,
    subtotal: cart?.totalPrice || 0,
    isEmpty: !cart?.items || cart.items.length === 0,
  };

  const value = {
    cart,
    loading,
    error,
    actionLoading,
    isActionLoading,
    cartSummary,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    fetchCart,
    setError,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

// ✅ FIXED: Export hook separately to avoid Fast Refresh warning
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};