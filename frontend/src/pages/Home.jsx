import { useState, useEffect } from 'react';
import {
  Grid,
  Typography,
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  Container,
  Skeleton,
  Card,
  CardContent,
} from '@mui/material';
import { Search } from '@mui/icons-material';
import axios from 'axios';
import ProductCard from '../components/Product/ProductCard.jsx';
import { useAuth } from '../contexts/AuthContext.jsx'; 
import { API_BASE_URL } from '../config.js';

const WISHLIST_STORAGE_KEY = 'wishlist_items_v1';

function Home() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [wishlistItems, setWishlistItems] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchWishlist();
  }, []);

  useEffect(() => {
    fetchWishlist();
  }, [user]);

  useEffect(() => {
    filterProducts();
  }, [products, selectedCategory, searchTerm]);

  // Listen for wishlist changes from other components
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === WISHLIST_STORAGE_KEY) {
        fetchWishlist();
      }
    };

    const handleWishlistUpdate = () => {
      fetchWishlist();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('wishlist-updated', handleWishlistUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('wishlist-updated', handleWishlistUpdate);
    };
  }, [user]);

  const fetchWishlist = async () => {
    try {
      if (user) {
        // Fetch from server
        const response = await axios.get(`${API_BASE_URL}/wishlist`);
        const items = response.data.items || [];
        setWishlistItems(items.map(item => item.productId || item.id));
      } else {
        // Fetch from localStorage
        const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
        if (stored) {
          const items = JSON.parse(stored);
          setWishlistItems(items.map(item => String(item.id)));
        } else {
          setWishlistItems([]);
        }
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      // Fallback to localStorage
      try {
        const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
        if (stored) {
          const items = JSON.parse(stored);
          setWishlistItems(items.map(item => String(item.id)));
        }
      } catch (_) {
        setWishlistItems([]);
      }
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/products`);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/products/categories/all`);
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    if (selectedCategory) {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  };

  const handleWishlistChange = () => {
    fetchWishlist();
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4, textAlign: 'center' }}>
          Discover Amazing Products
        </Typography>
        <Box sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Skeleton variant="rounded" width={400} height={56} />
          <Skeleton variant="rounded" width={200} height={56} />
        </Box>
        <Grid container spacing={3}>
          {Array.from({ length: 8 }).map((_, idx) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={idx}>
              <Card>
                <Skeleton variant="rectangular" height={200} />
                <CardContent>
                  <Skeleton width="60%" />
                  <Skeleton width="80%" />
                  <Skeleton width="40%" />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4, textAlign: 'center' }} className="anim-fade-up gradient-text">
        Discover Amazing Products
      </Typography>

      <Box sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <TextField
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ flex: 1, minWidth: 250 }}
        />
        
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={selectedCategory}
            label="Category"
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <MenuItem value="">All Categories</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category} value={category} sx={{ textTransform: 'capitalize' }}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Typography variant="h6" sx={{ mb: 3, color: 'text.secondary' }}>
        {filteredProducts.length} products found
      </Typography>

      <Grid container spacing={3} className="anim-fade">
        {filteredProducts.map((product) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
            <ProductCard 
              product={product} 
              isInWishlist={wishlistItems.includes(String(product.id))}
              onWishlistChange={handleWishlistChange}
            />
          </Grid>
        ))}
      </Grid>

      {filteredProducts.length === 0 && !loading && (
        <Box textAlign="center" py={8}>
          <Typography variant="h6" color="text.secondary">
            No products found matching your criteria
          </Typography>
        </Box>
      )}
    </Container>
  );
}

export default Home;