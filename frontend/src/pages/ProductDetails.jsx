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
  Paper,
  Stack,
  Fade,
  Zoom,
  Tabs,
  Tab,
  Avatar,
  LinearProgress,
  Tooltip,
  Snackbar,
  Alert,
  useTheme,
  alpha,
} from '@mui/material';
import { 
  ShoppingCart, 
  Add, 
  Remove, 
  NavigateNext,
  LocalShipping,
  SecurityOutlined,
  AssignmentReturn,
  CheckCircleOutline,
  FavoriteBorder,
  Favorite,
  Share,
  LocalOffer,
  Verified,
  TrendingUp,
  Inventory2Outlined,
} from '@mui/icons-material';
import axios from 'axios';
import { API_BASE_URL } from '../config.js';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useCart } from '../hooks/useCart.jsx';
import { useNotify } from '../contexts/NotificationContext.jsx';

const WISHLIST_STORAGE_KEY = 'wishlist_items_v1';

function ProductDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToCart, isActionLoading } = useCart();
  const theme = useTheme();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedTab, setSelectedTab] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [shareSnackbar, setShareSnackbar] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const notify = useNotify();

  // Fetch product details
  useEffect(() => {
    fetchProduct();
  }, [id]);

  // Check wishlist status when product or user changes
  useEffect(() => {
    if (product) {
      checkWishlistStatus();
    }
  }, [product, user]);

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

  // Check if product is in wishlist
  const checkWishlistStatus = async () => {
    if (!product) return;

    try {
      if (user) {
        // Check from server
        const response = await axios.get(`${API_BASE_URL}/wishlist`);
        const wishlistItems = response.data.items || [];
        const exists = wishlistItems.some(item => item.productId === String(product.id));
        setIsInWishlist(exists);
      } else {
        // Check from localStorage
        const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
        if (stored) {
          const wishlistItems = JSON.parse(stored);
          const exists = wishlistItems.some(item => item.id === product.id);
          setIsInWishlist(exists);
        } else {
          setIsInWishlist(false);
        }
      }
    } catch (error) {
      console.error('Error checking wishlist status:', error);
      // Fallback to localStorage check
      try {
        const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
        if (stored) {
          const wishlistItems = JSON.parse(stored);
          const exists = wishlistItems.some(item => item.id === product.id);
          setIsInWishlist(exists);
        }
      } catch (_) {
        setIsInWishlist(false);
      }
    }
  };

  // Toggle wishlist
  const handleWishlistToggle = async () => {
    if (!product || wishlistLoading) return;

    const productData = {
      id: product.id,
      productId: String(product.id),
      title: product.title,
      image: product.image,
      price: product.price,
      rating: product.rating,
      category: product.category,
    };

    try {
      setWishlistLoading(true);

      if (user) {
        // Server-side wishlist management
        if (isInWishlist) {
          // Remove from wishlist
          await axios.delete(`${API_BASE_URL}/wishlist/${product.id}`);
          setIsInWishlist(false);
          notify('Removed from wishlist', { severity: 'info' });
        } else {
          // Add to wishlist
          await axios.post(`${API_BASE_URL}/wishlist/${product.id}`, productData);
          setIsInWishlist(true);
          notify('Added to wishlist!', { severity: 'success' });
        }
      } else {
        // Local storage wishlist management
        const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
        let wishlistItems = stored ? JSON.parse(stored) : [];

        if (isInWishlist) {
          // Remove from local wishlist
          wishlistItems = wishlistItems.filter(item => item.id !== product.id);
          localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlistItems));
          setIsInWishlist(false);
          notify('Removed from wishlist', { severity: 'info' });
        } else {
          // Add to local wishlist
          wishlistItems.push(productData);
          localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlistItems));
          setIsInWishlist(true);
          notify('Added to wishlist!', { severity: 'success' });
        }
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      notify('Failed to update wishlist', { severity: 'error' });
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: product.title,
      text: `Check out this amazing product: ${product.title}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        notify('Shared successfully!', { severity: 'success' });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setShareSnackbar(true);
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Error sharing:', error);
        try {
          await navigator.clipboard.writeText(window.location.href);
          setShareSnackbar(true);
        } catch (clipboardError) {
          notify('Failed to share', { severity: 'error' });
        }
      }
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;

    console.log('🛒 ProductDetails: Adding to cart', { quantity, product });

    const result = await addToCart({
      productId: String(product.id),
      title: product.title,
      price: product.price,
      image: product.image,
      quantity,
    });
    
    if (result.success) {
      notify(`${quantity} × ${product.title} added to cart!`, { severity: 'success' });
      setQuantity(1);
    } else {
      notify(result.error || 'Failed to add to cart', { severity: 'error' });
    }
  };

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => prev > 1 ? prev - 1 : 1);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
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
          <Button component={Link} to="/" variant="contained" sx={{ mt: 2 }}>
            Back to Home
          </Button>
        </Box>
      </Container>
    );
  }

  const addingToCart = isActionLoading(`add-${product.id}`);
  const ratingPercentage = (product.rating.rate / 5) * 100;
  const inStock = product.rating.count > 50;

  return (
    <Box sx={{ 
      background: theme.palette.mode === 'light'
        ? 'linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%)'
        : 'linear-gradient(180deg, #0a0e1a 0%, #1a1f2e 100%)',
      minHeight: '100vh',
      py: 4,
    }}>
      <Container maxWidth="lg">
        {/* Breadcrumbs */}
        <Fade in timeout={300}>
          <Breadcrumbs 
            separator={<NavigateNext fontSize="small" />} 
            sx={{ 
              mb: 4,
              '& a': { 
                textDecoration: 'none', 
                color: 'primary.main',
                fontWeight: 500,
                transition: 'all 0.2s',
                '&:hover': { 
                  color: 'primary.dark',
                  textDecoration: 'underline',
                }
              }
            }}
          >
            <Link to="/">Home</Link>
            <Link to="/shop">Shop</Link>
            <Typography color="text.primary" sx={{ textTransform: 'capitalize', fontWeight: 600 }}>
              {product.category}
            </Typography>
          </Breadcrumbs>
        </Fade>

        <Grid container spacing={4}>
          {/* Left Column - Product Image */}
          <Grid item xs={12} md={6}>
            <Zoom in timeout={500}>
              <Box sx={{ position: 'sticky', top: 20 }}>
                {/* Quick Actions Bar */}
                <Stack 
                  direction="row" 
                  justifyContent="space-between" 
                  sx={{ mb: 2 }}
                >
                  {product.rating.rate >= 4.5 && (
                    <Chip 
                      icon={<TrendingUp />}
                      label="Trending" 
                      color="error"
                      size="small"
                      sx={{ fontWeight: 600 }}
                    />
                  )}
                  <Box sx={{ ml: 'auto' }}>
                    <Stack direction="row" spacing={1}>
                      <Tooltip title={isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}>
                        <IconButton 
                          size="small"
                          onClick={handleWishlistToggle}
                          disabled={wishlistLoading}
                          sx={{ 
                            backgroundColor: theme.palette.mode === 'light' 
                              ? 'white' 
                              : alpha(theme.palette.background.paper, 0.8),
                            boxShadow: theme.palette.mode === 'light'
                              ? '0 2px 8px rgba(0,0,0,0.1)'
                              : '0 2px 8px rgba(0,0,0,0.3)',
                            transition: 'all 0.3s',
                            ...(isInWishlist && {
                              backgroundColor: 'error.main',
                              color: 'white',
                              '&:hover': { 
                                backgroundColor: 'error.dark',
                              },
                            }),
                            ...(!isInWishlist && {
                              '&:hover': { 
                                backgroundColor: 'error.main',
                                color: 'white',
                                transform: 'scale(1.1)',
                              },
                            })
                          }}
                        >
                          {wishlistLoading ? (
                            <CircularProgress size={20} color="inherit" />
                          ) : isInWishlist ? (
                            <Favorite fontSize="small" />
                          ) : (
                            <FavoriteBorder fontSize="small" />
                          )}
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Share Product">
                        <IconButton 
                          size="small"
                          onClick={handleShare}
                          sx={{ 
                            backgroundColor: theme.palette.mode === 'light' 
                              ? 'white' 
                              : alpha(theme.palette.background.paper, 0.8),
                            boxShadow: theme.palette.mode === 'light'
                              ? '0 2px 8px rgba(0,0,0,0.1)'
                              : '0 2px 8px rgba(0,0,0,0.3)',
                            '&:hover': { 
                              backgroundColor: 'primary.main',
                              color: 'white',
                              transform: 'scale(1.1)',
                            },
                            transition: 'all 0.3s',
                          }}
                        >
                          <Share fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </Box>
                </Stack>

                {/* Product Image Card */}
                <Card 
                  elevation={0}
                  sx={{ 
                    p: 4, 
                    backgroundColor: theme.palette.background.paper,
                    borderRadius: 4,
                    border: '1px solid',
                    borderColor: theme.palette.divider,
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: theme.palette.mode === 'light'
                        ? 'linear-gradient(135deg, rgba(25,118,210,0.05) 0%, rgba(156,39,176,0.05) 100%)'
                        : 'linear-gradient(135deg, rgba(102,126,234,0.1) 0%, rgba(118,75,162,0.1) 100%)',
                      opacity: imageLoaded ? 1 : 0,
                      transition: 'opacity 0.5s',
                    }
                  }}
                >
                  <CardMedia
                    component="img"
                    image={product.image}
                    alt={product.title}
                    onLoad={() => setImageLoaded(true)}
                    sx={{ 
                      width: '100%', 
                      height: 480, 
                      objectFit: 'contain',
                      position: 'relative',
                      zIndex: 1,
                      filter: imageLoaded ? 'none' : 'blur(10px)',
                      transition: 'filter 0.5s',
                    }}
                  />
                  
                  {/* Top Rated Badge */}
                  {product.rating.rate >= 4.0 && (
                    <Chip
                      icon={<LocalOffer />}
                      label="Top Rated"
                      color="success"
                      sx={{
                        position: 'absolute',
                        top: 20,
                        right: 20,
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        px: 1,
                        boxShadow: '0 4px 12px rgba(76,175,80,0.3)',
                      }}
                    />
                  )}
                </Card>

                {/* Trust Badges */}
                <Fade in timeout={800}>
                  <Grid container spacing={2} sx={{ mt: 3 }}>
                    <Grid item xs={6}>
                      <Paper 
                        elevation={0}
                        sx={{ 
                          p: 2.5, 
                          textAlign: 'center',
                          border: '1px solid',
                          borderColor: theme.palette.divider,
                          borderRadius: 3,
                          backgroundColor: theme.palette.background.paper,
                          transition: 'all 0.3s',
                          '&:hover': {
                            borderColor: 'primary.main',
                            boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.15)}`,
                            transform: 'translateY(-4px)',
                          }
                        }}
                      >
                        <LocalShipping color="primary" sx={{ fontSize: 36, mb: 1 }} />
                        <Typography variant="body2" fontWeight={700}>
                          Free Shipping
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          On orders $50+
                        </Typography>
                      </Paper>
                    </Grid>
                    
                    <Grid item xs={6}>
                      <Paper 
                        elevation={0}
                        sx={{ 
                          p: 2.5, 
                          textAlign: 'center',
                          border: '1px solid',
                          borderColor: theme.palette.divider,
                          borderRadius: 3,
                          backgroundColor: theme.palette.background.paper,
                          transition: 'all 0.3s',
                          '&:hover': {
                            borderColor: 'primary.main',
                            boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.15)}`,
                            transform: 'translateY(-4px)',
                          }
                        }}
                      >
                        <AssignmentReturn color="primary" sx={{ fontSize: 36, mb: 1 }} />
                        <Typography variant="body2" fontWeight={700}>
                          Easy Returns
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          30-day policy
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                </Fade>
              </Box>
            </Zoom>
          </Grid>
          
          {/* Right Column - Product Details */}
          <Grid item xs={12} md={6}>
            <Fade in timeout={600}>
              <Box>
                {/* Category & Stock Status */}
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                  <Chip 
                    label={product.category}
                    sx={{ 
                      textTransform: 'capitalize',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                    }}
                  />
                  <Chip 
                    icon={<Inventory2Outlined />}
                    label={inStock ? "In Stock" : "Limited Stock"}
                    color={inStock ? "success" : "warning"}
                    size="small"
                    variant="outlined"
                    sx={{ fontWeight: 600 }}
                  />
                </Stack>
                
                {/* Product Title */}
                <Typography 
                  variant="h3" 
                  component="h1" 
                  gutterBottom 
                  sx={{ 
                    fontWeight: 800,
                    lineHeight: 1.2,
                    mb: 2,
                    background: theme.palette.mode === 'light'
                      ? 'linear-gradient(135deg, #1a1a1a 0%, #4a4a4a 100%)'
                      : 'linear-gradient(135deg, #ffffff 0%, #a0a0a0 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {product.title}
                </Typography>
                
                {/* Rating Section */}
                <Paper 
                  elevation={0}
                  sx={{ 
                    p: 2.5, 
                    mb: 3,
                    backgroundColor: theme.palette.mode === 'light' 
                      ? alpha(theme.palette.grey[100], 0.5)
                      : alpha(theme.palette.background.paper, 0.6),
                    borderRadius: 3,
                    border: '1px solid',
                    borderColor: theme.palette.divider,
                  }}
                >
                  <Stack direction="row" spacing={3} alignItems="center" flexWrap="wrap">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Rating
                        value={product.rating.rate}
                        precision={0.1}
                        readOnly
                        size="large"
                      />
                      <Typography variant="h6" fontWeight={700}>
                        {product.rating.rate}
                      </Typography>
                    </Box>
                    <Divider orientation="vertical" flexItem />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        {product.rating.count} reviews
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                        <LinearProgress 
                          variant="determinate" 
                          value={ratingPercentage} 
                          sx={{ 
                            width: 100, 
                            height: 6, 
                            borderRadius: 3,
                            backgroundColor: alpha(theme.palette.grey[500], 0.2),
                            '& .MuiLinearProgress-bar': {
                              background: 'linear-gradient(90deg, #f59e0b 0%, #eab308 100%)',
                            }
                          }} 
                        />
                        <Typography variant="caption" fontWeight={600}>
                          {ratingPercentage.toFixed(0)}%
                        </Typography>
                      </Box>
                    </Box>
                  </Stack>
                </Paper>
                
                {/* Price Section */}
                <Box 
                  sx={{ 
                    p: 3.5, 
                    mb: 3,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: 3,
                    boxShadow: '0 8px 24px rgba(102,126,234,0.35)',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'radial-gradient(circle at top right, rgba(255,255,255,0.2) 0%, transparent 60%)',
                    }
                  }}
                >
                  <Typography variant="h2" sx={{ fontWeight: 900, color: 'white', position: 'relative' }}>
                    ${product.price.toFixed(2)}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)', mt: 1, position: 'relative' }}>
                    Tax included • Free shipping on orders over $50
                  </Typography>
                </Box>

                {/* Tabs for Description */}
                <Paper 
                  elevation={0}
                  sx={{ 
                    mb: 3,
                    borderRadius: 3,
                    border: '1px solid',
                    borderColor: theme.palette.divider,
                    backgroundColor: theme.palette.background.paper,
                    overflow: 'hidden',
                  }}
                >
                  <Tabs 
                    value={selectedTab} 
                    onChange={(e, v) => setSelectedTab(v)}
                    sx={{
                      borderBottom: '1px solid',
                      borderColor: theme.palette.divider,
                      '& .MuiTab-root': { fontWeight: 600 },
                    }}
                  >
                    <Tab label="Description" />
                    <Tab label="Details" />
                  </Tabs>
                  
                  <Box sx={{ p: 3 }}>
                    {selectedTab === 0 && (
                      <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                        {product.description}
                      </Typography>
                    )}
                    
                    {selectedTab === 1 && (
                      <Stack spacing={2}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar sx={{ bgcolor: 'success.main', width: 32, height: 32 }}>
                            <CheckCircleOutline fontSize="small" />
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight={600}>
                              Category
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
                              {product.category}
                            </Typography>
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                            <CheckCircleOutline fontSize="small" />
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight={600}>
                              Rating
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {product.rating.rate} out of 5 ({product.rating.count} reviews)
                            </Typography>
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar sx={{ bgcolor: 'warning.main', width: 32, height: 32 }}>
                            <CheckCircleOutline fontSize="small" />
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight={600}>
                              Availability
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {inStock ? 'In Stock - Ready to Ship' : 'Limited Stock Available'}
                            </Typography>
                          </Box>
                        </Box>
                      </Stack>
                    )}
                  </Box>
                </Paper>
                
                {/* Add to Cart Section */}
                {user ? (
                  <Box>
                    {/* Quantity Selector */}
                    <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
                      Select Quantity
                    </Typography>
                    
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                      <Paper 
                        elevation={0}
                        sx={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          border: '2px solid',
                          borderColor: 'primary.main',
                          borderRadius: 2,
                          overflow: 'hidden',
                          backgroundColor: theme.palette.background.paper,
                        }}
                      >
                        <IconButton 
                          onClick={decrementQuantity} 
                          disabled={quantity <= 1 || addingToCart}
                          sx={{ 
                            borderRadius: 0,
                            px: 2,
                            py: 1.5,
                            '&:hover': { 
                              backgroundColor: 'primary.main', 
                              color: 'white',
                            }
                          }}
                        >
                          <Remove />
                        </IconButton>
                        
                        <Typography 
                          variant="h5" 
                          sx={{ 
                            px: 4, 
                            minWidth: 80, 
                            textAlign: 'center',
                            fontWeight: 700,
                          }}
                        >
                          {quantity}
                        </Typography>
                        
                        <IconButton 
                          onClick={incrementQuantity}
                          disabled={addingToCart}
                          sx={{ 
                            borderRadius: 0,
                            px: 2,
                            py: 1.5,
                            '&:hover': { 
                              backgroundColor: 'primary.main', 
                              color: 'white',
                            }
                          }}
                        >
                          <Add />
                        </IconButton>
                      </Paper>
                      
                      {/* Total Price */}
                      <Paper 
                        elevation={0}
                        sx={{ 
                          p: 2, 
                          flex: 1,
                          background: theme.palette.mode === 'light'
                            ? 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)'
                            : `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.15)} 0%, ${alpha(theme.palette.primary.main, 0.25)} 100%)`,
                          borderRadius: 2,
                          border: '1px solid',
                          borderColor: alpha(theme.palette.primary.main, 0.3),
                        }}
                      >
                        <Typography variant="caption" color="text.secondary" display="block">
                          Total Price
                        </Typography>
                        <Typography variant="h4" color="primary.main" sx={{ fontWeight: 800 }}>
                          ${(product.price * quantity).toFixed(2)}
                        </Typography>
                      </Paper>
                    </Stack>
                    
                    {/* Action Buttons */}
                    <Stack spacing={2}>
                      <Button
                        variant="contained"
                        size="large"
                        fullWidth
                        startIcon={addingToCart ? <CircularProgress size={20} color="inherit" /> : <ShoppingCart />}
                        onClick={handleAddToCart}
                        disabled={addingToCart}
                        sx={{ 
                          py: 2, 
                          fontSize: '1.1rem',
                          fontWeight: 700,
                          borderRadius: 2,
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          boxShadow: '0 8px 24px rgba(102,126,234,0.35)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 12px 32px rgba(102,126,234,0.45)',
                          },
                          '&:disabled': {
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            opacity: 0.7,
                          }
                        }}
                      >
                        {addingToCart ? 'Adding to Cart...' : 'Add to Cart'}
                      </Button>
                    </Stack>

                    {/* Security Badge */}
                    <Stack 
                      direction="row" 
                      spacing={3} 
                      justifyContent="center" 
                      sx={{ mt: 3 }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <SecurityOutlined fontSize="small" color="success" />
                        <Typography variant="caption" color="text.secondary" fontWeight={600}>
                          Verified Product
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>
                ) : (
                  <Paper 
                    elevation={0}
                    sx={{ 
                      p: 4, 
                      background: theme.palette.mode === 'light'
                        ? 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)'
                        : `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.2)} 0%, ${alpha(theme.palette.warning.main, 0.3)} 100%)`,
                      borderRadius: 3,
                      border: '2px solid',
                      borderColor: theme.palette.warning.main,
                      textAlign: 'center',
                    }}
                  >
                    <Typography variant="h6" gutterBottom fontWeight={700}>
                      🔐 Login Required
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Please log in to add items to your cart and complete your purchase
                    </Typography>
                    <Button
                      component={Link}
                      to="/login"
                      variant="contained"
                      size="large"
                      fullWidth
                      sx={{ 
                        py: 1.5,
                        fontWeight: 700,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      }}
                    >
                      Login to Continue
                    </Button>
                  </Paper>
                )}
              </Box>
            </Fade>
          </Grid>
        </Grid>
      </Container>

      {/* Share Snackbar */}
      <Snackbar
        open={shareSnackbar}
        autoHideDuration={3000}
        onClose={() => setShareSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setShareSnackbar(false)} 
          severity="success" 
          sx={{ width: '100%' }}
        >
          Link copied to clipboard!
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default ProductDetails;