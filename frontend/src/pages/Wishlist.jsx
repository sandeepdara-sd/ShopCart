import { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Grid, 
  Typography, 
  Paper, 
  Button, 
  CircularProgress, 
  Fade,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  IconButton,
  Rating,
  Chip,
  Stack,
  Tooltip,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useCart } from '../hooks/useCart.jsx';
import { useNotify } from '../contexts/NotificationContext.jsx';
import { API_BASE_URL } from '../config.js';
import { 
  FavoriteBorder, 
  Delete, 
  ShoppingCart, 
  Visibility,
  Favorite,
} from '@mui/icons-material';

const WISHLIST_STORAGE_KEY = 'wishlist_items_v1';

function Wishlist() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingItem, setRemovingItem] = useState(null);
  const { user } = useAuth();
  const { addToCart, isActionLoading } = useCart();
  const notify = useNotify();
  const navigate = useNavigate();

  useEffect(() => {
    fetchWishlist();
  }, [user]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);

      if (user) {
        // Fetch from server for authenticated users
        const response = await axios.get(`${API_BASE_URL}/wishlist`);
        const wishlistItems = response.data.items || [];
        
        // Transform server data to match expected format
        const transformedItems = wishlistItems.map(item => ({
          id: item.productId || item.id,
          productId: item.productId || item.id,
          title: item.title,
          image: item.image,
          price: item.price,
          rating: item.rating,
          category: item.category,
        }));
        
        setItems(transformedItems);
      } else {
        // Fetch from localStorage for guest users
        const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
        if (stored) {
          const wishlistItems = JSON.parse(stored);
          setItems(wishlistItems);
        } else {
          setItems([]);
        }
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      // Fallback to localStorage on error
      try {
        const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
        if (stored) {
          const wishlistItems = JSON.parse(stored);
          setItems(wishlistItems);
        } else {
          setItems([]);
        }
      } catch (_) {
        setItems([]);
      }
    } finally {
      setLoading(false);
    }
  };

  // Refresh wishlist when component gains focus
  useEffect(() => {
    const handleFocus = () => {
      fetchWishlist();
    };

    window.addEventListener('focus', handleFocus);
    
    // Listen for storage changes (multi-tab support)
    const handleStorageChange = (e) => {
      if (e.key === WISHLIST_STORAGE_KEY) {
        fetchWishlist();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [user]);

  const handleRemoveFromWishlist = async (product) => {
    if (removingItem) return;

    try {
      setRemovingItem(product.id);

      if (user) {
        // Remove from server
        await axios.delete(`${API_BASE_URL}/wishlist/${product.id}`);
      } else {
        // Remove from localStorage
        const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
        if (stored) {
          let wishlistItems = JSON.parse(stored);
          wishlistItems = wishlistItems.filter(item => item.id !== product.id);
          localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlistItems));
        }
      }

      // Update local state
      setItems(prev => prev.filter(item => item.id !== product.id));
      notify('Removed from wishlist', { severity: 'info' });
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      notify('Failed to remove from wishlist', { severity: 'error' });
    } finally {
      setRemovingItem(null);
    }
  };

  const handleAddToCart = async (product) => {
    if (!user) {
      notify('Please log in to add items to cart', { severity: 'warning' });
      navigate('/login');
      return;
    }

    const result = await addToCart({
      productId: String(product.id),
      title: product.title,
      price: product.price,
      image: product.image,
      quantity: 1,
    });
    
    if (result.success) {
      notify(`${product.title} added to cart!`, { severity: 'success' });
    } else {
      notify(result.error || 'Failed to add to cart', { severity: 'error' });
    }
  };

  const handleViewDetails = (productId) => {
    navigate(`/product/${productId}`);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Fade in timeout={500}>
        <Box>
          {/* Header */}
          <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Favorite sx={{ fontSize: 40, color: 'error.main' }} />
            <Box>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                My Wishlist
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {items.length} {items.length === 1 ? 'item' : 'items'} saved
              </Typography>
            </Box>
          </Box>

          {items.length === 0 ? (
            <Fade in timeout={700}>
              <Paper 
                elevation={0}
                sx={{ 
                  p: 6, 
                  textAlign: 'center',
                  border: '2px dashed',
                  borderColor: 'grey.300',
                  borderRadius: 4,
                  background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
                }}
              >
                <FavoriteBorder 
                  sx={{ 
                    fontSize: 80, 
                    color: 'grey.300',
                    mb: 2,
                  }} 
                />
                <Typography 
                  variant="h5" 
                  sx={{ mb: 2, fontWeight: 700, color: 'text.primary' }}
                >
                  Your wishlist is empty
                </Typography>
                <Typography 
                  variant="body1" 
                  color="text.secondary" 
                  sx={{ mb: 4, maxWidth: 500, mx: 'auto' }}
                >
                  Start adding your favorite products to your wishlist. Click the heart icon on any product to save it here!
                </Typography>
                <Button 
                  component={Link} 
                  to="/shop" 
                  variant="contained"
                  size="large"
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontWeight: 700,
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    boxShadow: '0 8px 24px rgba(102,126,234,0.35)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 12px 32px rgba(102,126,234,0.45)',
                    },
                  }}
                >
                  Browse Products
                </Button>
              </Paper>
            </Fade>
          ) : (
            <Grid container spacing={3}>
              {items.map((product) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                  <Fade in timeout={500}>
                    <Card 
                      sx={{ 
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        position: 'relative',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
                        }
                      }}
                    >
                      {/* Remove Button */}
                     {/* Remove Button */}
                      <Tooltip title="Remove from Wishlist">
                        <IconButton
                          size="small"
                          onClick={() => handleRemoveFromWishlist(product)}
                          disabled={removingItem === product.id}
                          sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            zIndex: 2,
                            backgroundColor: 'background.paper',
                            color: 'text.primary',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                            '&:hover': {
                              backgroundColor: 'error.main',
                              color: 'white',
                            },
                          }}
                        >
                          {removingItem === product.id ? (
                            <CircularProgress size={20} color="inherit" />
                          ) : (
                            <Delete fontSize="small" />
                          )}
                        </IconButton>
                      </Tooltip>

                      {/* Product Image */}
                      <CardMedia
                        component="img"
                        image={product.image}
                        alt={product.title}
                        sx={{ 
                          height: 200, 
                          objectFit: 'contain',
                          p: 2,
                          backgroundColor: 'grey.50',
                          cursor: 'pointer',
                        }}
                        onClick={() => handleViewDetails(product.id)}
                      />

                      {/* Product Info */}
                      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                        <Chip 
                          label={product.category}
                          size="small"
                          sx={{ 
                            mb: 1,
                            textTransform: 'capitalize',
                            fontWeight: 600,
                            fontSize: '0.7rem',
                          }}
                        />
                        
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            mb: 1,
                            fontWeight: 600,
                            fontSize: '0.95rem',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            minHeight: '2.8em',
                            cursor: 'pointer',
                            '&:hover': {
                              color: 'primary.main',
                            }
                          }}
                          onClick={() => handleViewDetails(product.id)}
                        >
                          {product.title}
                        </Typography>

                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                          <Rating 
                            value={product.rating?.rate || 0} 
                            precision={0.1} 
                            size="small" 
                            readOnly 
                          />
                          <Typography variant="caption" color="text.secondary">
                            ({product.rating?.count || 0})
                          </Typography>
                        </Stack>

                        <Typography 
                          variant="h5" 
                          color="primary.main" 
                          sx={{ fontWeight: 800 }}
                        >
                          ${product.price?.toFixed(2) || '0.00'}
                        </Typography>
                      </CardContent>

                      {/* Action Buttons */}
                      <CardActions sx={{ p: 2, pt: 0 }}>
                        <Stack spacing={1} sx={{ width: '100%' }}>
                          <Button
                            variant="contained"
                            fullWidth
                            startIcon={
                              isActionLoading(`add-${product.id}`) ? 
                              <CircularProgress size={18} color="inherit" /> : 
                              <ShoppingCart />
                            }
                            onClick={() => handleAddToCart(product)}
                            disabled={isActionLoading(`add-${product.id}`)}
                            sx={{
                              fontWeight: 600,
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              '&:hover': {
                                background: 'linear-gradient(135deg, #5568d3 0%, #6a3d8f 100%)',
                              },
                            }}
                          >
                            Add to Cart
                          </Button>

                          <Button
                            variant="outlined"
                            fullWidth
                            startIcon={<Visibility />}
                            onClick={() => handleViewDetails(product.id)}
                            sx={{
                              fontWeight: 600,
                            }}
                          >
                            View Details
                          </Button>
                        </Stack>
                      </CardActions>
                    </Card>
                  </Fade>
                </Grid>
              ))}
            </Grid>
          )}

          {/* Info Section */}
          {items.length > 0 && (
            <Fade in timeout={1000}>
              <Paper
                elevation={0}
                sx={{
                  mt: 4,
                  p: 3,
                  background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)',
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: 'primary.light',
                }}
              >
                <Typography variant="body2" color="text.secondary" textAlign="center">
                  <strong>Tip:</strong> Items in your wishlist are saved {user ? 'to your account' : 'in your browser'}. 
                  {!user && ' Log in to sync your wishlist across devices!'}
                </Typography>
              </Paper>
            </Fade>
          )}
        </Box>
      </Fade>
    </Container>
  );
}

export default Wishlist;