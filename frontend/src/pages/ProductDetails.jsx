import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Grid,
  Card,
  CardMedia,
  Typography,
  Button,
  Rating,
  Box,
  Chip,
  Divider,
  IconButton,
  CircularProgress,
  Container,
  Breadcrumbs,
  Skeleton,
  Alert,
  Snackbar,
} from '@mui/material';
import { ShoppingCart, Add, Remove, NavigateNext } from '@mui/icons-material';
import axios from 'axios';
import { API_BASE_URL } from '../config.js';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useCart } from '../hooks/useCart.jsx';
import { useNotify } from '../contexts/NotificationContext.jsx';

function ProductDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToCart, isActionLoading } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const notify = useNotify();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/products/${id}`);
      setProduct(response.data);
    } catch (error) {
      console.error('Error fetching product:', error);
      notify('Failed to load product details', { severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;

    const result = await addToCart({
      productId: String(product.id), // Convert to string for backend compatibility
      title: product.title,
      price: product.price,
      image: product.image,
      quantity,
    });
    
    if (result.success) {
      notify(`${product.title} added to cart!`, { severity: 'success' });
      setQuantity(1); // Reset quantity after successful add
    } else {
      notify(result.error || 'Failed to add to cart', { severity: 'error' });
    }
  };

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    setQuantity(prev => prev > 1 ? prev - 1 : 1);
  };

  

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Skeleton width={240} height={28} sx={{ mb: 3 }} />
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 3 }}>
              <Skeleton variant="rectangular" height={400} />
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Skeleton width={140} height={32} sx={{ mb: 2 }} />
            <Skeleton width="60%" height={44} />
            <Skeleton width="40%" height={28} sx={{ mt: 2 }} />
            <Skeleton width="30%" height={56} sx={{ mt: 3 }} />
            <Skeleton width="50%" height={36} sx={{ mt: 2 }} />
          </Grid>
        </Grid>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container>
        <Box textAlign="center" py={8}>
          <Typography variant="h6" color="error" gutterBottom>
            Product not found
          </Typography>
          <Button
            component={Link}
            to="/"
            variant="contained"
            sx={{ mt: 2 }}
          >
            Back to Home
          </Button>
        </Box>
      </Container>
    );
  }

  const addingToCart = isActionLoading(`add-${product.id}`);

  return (
    <Container maxWidth="lg">
      <Breadcrumbs 
        separator={<NavigateNext fontSize="small" />} 
        sx={{ mb: 3 }}
        aria-label="breadcrumb"
      >
        <Link to="/" style={{ textDecoration: 'none', color: '#1976d2' }}>
          Home
        </Link>
        <Link to="/shop" style={{ textDecoration: 'none', color: '#1976d2' }}>
          Shop
        </Link>
        <Typography color="text.primary" sx={{ textTransform: 'capitalize' }}>
          {product.category}
        </Typography>
        <Typography color="text.primary">
          {product.title}
        </Typography>
      </Breadcrumbs>

      <Grid container spacing={4} className="anim-fade">
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, backgroundColor: '#fafafa' }} className="hover-lift">
            <CardMedia
              component="img"
              image={product.image}
              alt={product.title}
              sx={{ 
                width: '100%', 
                height: 400, 
                objectFit: 'contain',
              }}
            />
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Box sx={{ p: 2 }}>
            <Chip 
              label={product.category}
              sx={{ mb: 2, textTransform: 'capitalize' }}
              color="primary"
              variant="outlined"
            />
            
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
              {product.title}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Rating
                value={product.rating.rate}
                precision={0.1}
                readOnly
                sx={{ mr: 2 }}
              />
              <Typography variant="body1" color="text.secondary">
                {product.rating.rate} ({product.rating.count} reviews)
              </Typography>
            </Box>
            
            <Typography variant="h3" color="primary" sx={{ mb: 3, fontWeight: 600 }}>
              ${product.price.toFixed(2)}
            </Typography>
            
            <Divider sx={{ my: 3 }} />
            
            <Typography variant="h6" gutterBottom>
              Description
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              {product.description}
            </Typography>
            
            <Divider sx={{ my: 3 }} />
            
            {user ? (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Quantity
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <IconButton 
                    onClick={decrementQuantity} 
                    disabled={quantity <= 1 || addingToCart}
                  >
                    <Remove />
                  </IconButton>
                  <Typography variant="h6" sx={{ mx: 2, minWidth: 40, textAlign: 'center' }}>
                    {quantity}
                  </Typography>
                  <IconButton 
                    onClick={incrementQuantity}
                    disabled={addingToCart}
                  >
                    <Add />
                  </IconButton>
                </Box>
                
                <Button
                  variant="contained"
                  size="large"
                  startIcon={addingToCart ? <CircularProgress size={20} /> : <ShoppingCart />}
                  onClick={handleAddToCart}
                  disabled={addingToCart}
                  sx={{ 
                    py: 2, 
                    px: 4,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    width: { xs: '100%', sm: 'auto' }
                  }}
                >
                  {addingToCart ? 'Adding...' : 'Add to Cart'}
                </Button>
              </Box>
            ) : (
              <Box sx={{ p: 3, backgroundColor: 'grey.100', borderRadius: 2 }}>
                <Typography variant="body1" textAlign="center" gutterBottom>
                  Please log in to add items to your cart
                </Typography>
                <Button
                  component={Link}
                  to="/login"
                  variant="contained"
                  fullWidth
                  sx={{ mt: 2 }}
                >
                  Login
                </Button>
              </Box>
            )}
          </Box>
        </Grid>
      </Grid>

      {/* Notifications handled globally */}
    </Container>
  );
}

export default ProductDetails;