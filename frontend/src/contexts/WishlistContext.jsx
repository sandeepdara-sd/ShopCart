import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext.jsx';

const WishlistContext = createContext({
  items: [],
  add: () => {},
  remove: () => {},
  toggle: () => {},
  exists: () => false,
  clear: () => {},
});

const STORAGE_KEY = 'wishlist_items_v1';

export function WishlistProvider({ children }) {
  const [items, setItems] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchServerWishlist = async () => {
      if (!user) {
        try {
          const raw = localStorage.getItem(STORAGE_KEY);
          if (raw) setItems(JSON.parse(raw));
          else setItems([]);
        } catch (_) { setItems([]); }
        return;
      }
      try {
        const res = await axios.get('http://localhost:5000/api/wishlist');
        setItems(res.data.items || []);
      } catch (_) {
        setItems([]);
      }
    };
    fetchServerWishlist();
  }, [user]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch (_) {}
  }, [items]);

  const add = async (product) => {
    setItems((prev) => (prev.some((p) => p.id === product.id) ? prev : [...prev, product]));
    try {
      if (user) await axios.post(`http://localhost:5000/api/wishlist/${product.id}`, product);
    } catch (_) {}
  };

  const remove = async (productId) => {
    setItems((prev) => prev.filter((p) => p.id !== productId));
    try {
      if (user) await axios.delete(`http://localhost:5000/api/wishlist/${productId}`);
    } catch (_) {}
  };

  const toggle = async (product) => {
    const exists = items.some((p) => p.id === product.id);
    setItems((prev) => (exists ? prev.filter((p) => p.id !== product.id) : [...prev, product]));
    try {
      if (!user) return;
      if (exists) await axios.delete(`http://localhost:5000/api/wishlist/${product.id}`);
      else await axios.post(`http://localhost:5000/api/wishlist/${product.id}`, product);
    } catch (_) {}
  };

  const exists = (productId) => items.some((p) => p.id === productId);

  const clear = () => setItems([]);

  const value = useMemo(() => ({ items, add, remove, toggle, exists, clear }), [items]);

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}


