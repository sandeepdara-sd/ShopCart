import { Routes, Route, Navigate } from 'react-router-dom';
import { Container } from '@mui/material';
import Navbar from './components/Layout/Navbar.jsx';
import Footer from './components/Layout/Footer.jsx';
import Landing from './pages/Landing.jsx';
import Home from './pages/Home.jsx';
import ProductDetails from './pages/ProductDetails.jsx';
import Cart from './pages/Cart.jsx';
import Checkout from './pages/Checkout.jsx';
import Orders from './pages/Orders.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Profile from './pages/Profile.jsx';
import Wishlist from './pages/Wishlist.jsx';
import { useAuth } from './contexts/AuthContext.jsx';
import NotFound from './pages/NotFound.jsx';

function App() {
  const { user } = useAuth();

  return (
    <div>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/shop" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route 
            path="/cart" 
            element={user ? <Cart /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/checkout" 
            element={user ? <Checkout /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/orders" 
            element={user ? <Orders /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/wishlist" 
            element={user ? <Wishlist /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/profile" 
            element={user ? <Profile /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/login" 
            element={!user ? <Login /> : <Navigate to="/shop" />} 
          />
          <Route 
            path="/register" 
            element={!user ? <Register /> : <Navigate to="/shop" />} 
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Container>
      <Footer />
    </div>
  );
}

export default App;