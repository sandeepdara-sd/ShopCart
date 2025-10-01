import { useState } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  Rating,
  Box,
  Chip,
  IconButton,
  Tooltip,
  Zoom,
  alpha,
  useTheme,
  keyframes,
} from '@mui/material';
import { 
  ShoppingCart, 
  Visibility, 
  FavoriteBorder, 
  Favorite,
  LocalOffer,
  TrendingUp,
  Bolt,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useCart } from '../../hooks/useCart.jsx';
import { useTilt } from '../../hooks/useTilt.jsx';
import { useWishlist } from '../../contexts/WishlistContext.jsx';

// Animations
const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
`;

const shimmer = keyframes`
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
`;

const scaleIn = keyframes`
  from { transform: scale(0); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
`;

const slideUp = keyframes`
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

function ProductCard({ product }) {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const theme = useTheme();
  const tiltRef = useTilt(6);
  const { toggle: toggleWishlist, exists } = useWishlist();
  const [isHovered, setIsHovered] = useState(false);
  const isFavorite = exists(product.id);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      quantity: 1,
    });
  };

  const handleFavoriteToggle = () => {
    toggleWishlist({ id: product.id, title: product.title, image: product.image, price: product.price, rating: product.rating, category: product.category });
  };

  // Check if product is on sale or trending
  const isOnSale = product.rating?.rate >= 4.5;
  const isTrending = product.rating?.count > 200;
  const discount = isOnSale ? Math.floor(Math.random() * 20 + 10) : 0;

  return (
    <Card 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        position: 'relative',
        borderRadius: 4,
        overflow: 'hidden',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        background: theme.palette.mode === 'light'
          ? 'rgba(255, 255, 255, 0.9)'
          : 'rgba(20, 25, 40, 0.9)',
        backdropFilter: 'blur(20px)',
        boxShadow: theme.palette.mode === 'light'
          ? '0 4px 20px rgba(0, 0, 0, 0.08)'
          : '0 4px 20px rgba(0, 0, 0, 0.3)',
        '&:hover': {
          transform: 'translateY(-12px) scale(1.02)',
          boxShadow: theme.palette.mode === 'light'
            ? '0 20px 40px rgba(0, 0, 0, 0.15)'
            : '0 20px 40px rgba(0, 0, 0, 0.6)',
          border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          opacity: 0,
          transition: 'opacity 0.3s ease',
        },
        '&:hover::before': {
          opacity: 1,
        }
      }}
      ref={tiltRef}
    >
      {/* Badges Container */}
      <Box
        sx={{
          position: 'absolute',
          top: 12,
          left: 12,
          right: 12,
          zIndex: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {isOnSale && (
            <Chip
              icon={<LocalOffer sx={{ fontSize: 16 }} />}
              label={`${discount}% OFF`}
              size="small"
              sx={{
                fontWeight: 800,
                fontSize: '0.75rem',
                height: 28,
                background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                color: 'white',
                boxShadow: '0 4px 15px rgba(250, 112, 154, 0.4)',
                animation: `${pulse} 2s ease-in-out infinite`,
                '& .MuiChip-icon': {
                  color: 'white',
                }
              }}
            />
          )}
          {isTrending && (
            <Chip
              icon={<TrendingUp sx={{ fontSize: 16 }} />}
              label="Trending"
              size="small"
              sx={{
                fontWeight: 700,
                fontSize: '0.7rem',
                height: 28,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                '& .MuiChip-icon': {
                  color: 'white',
                }
              }}
            />
          )}
        </Box>

        {/* Favorite Button */}
        <Tooltip title={isFavorite ? "Remove from wishlist" : "Add to wishlist"} arrow>
          <IconButton
            onClick={handleFavoriteToggle}
            size="small"
            sx={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.3s ease',
              '&:hover': {
                background: 'rgba(255, 255, 255, 1)',
                transform: 'scale(1.1)',
              }
            }}
          >
            {isFavorite ? (
              <Favorite sx={{ fontSize: 20, color: '#fa709a' }} />
            ) : (
              <FavoriteBorder sx={{ fontSize: 20, color: theme.palette.text.secondary }} />
            )}
          </IconButton>
        </Tooltip>
      </Box>

      {/* Product Image */}
      <Box
        sx={{
          position: 'relative',
          height: 240,
          overflow: 'hidden',
          background: theme.palette.mode === 'light'
            ? 'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)'
            : 'linear-gradient(135deg, #2d3748 0%, #1a202c 100%)',
        }}
      >
        {!imageLoaded && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `linear-gradient(90deg, 
                ${alpha(theme.palette.primary.main, 0.1)} 0%, 
                ${alpha(theme.palette.primary.main, 0.2)} 50%, 
                ${alpha(theme.palette.primary.main, 0.1)} 100%)`,
              backgroundSize: '1000px 100%',
              animation: `${shimmer} 2s infinite linear`,
            }}
          />
        )}
        <CardMedia
          component="img"
          image={product.image}
          alt={product.title}
          onLoad={() => setImageLoaded(true)}
          sx={{ 
            height: '100%',
            objectFit: 'contain',
            p: 3,
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: isHovered ? 'scale(1.1) rotate(2deg)' : 'scale(1)',
            filter: isHovered ? 'brightness(1.1)' : 'brightness(1)',
            opacity: imageLoaded ? 1 : 0,
          }}
        />

        {/* Quick View Overlay */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(10px)',
            opacity: isHovered ? 1 : 0,
            transition: 'opacity 0.3s ease',
            pointerEvents: isHovered ? 'auto' : 'none',
          }}
        >
          <Button
            component={Link}
            to={`/product/${product.id}`}
            variant="contained"
            startIcon={<Visibility />}
            sx={{
              fontWeight: 700,
              textTransform: 'none',
              borderRadius: 3,
              px: 3,
              py: 1.5,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              boxShadow: '0 8px 25px rgba(102, 126, 234, 0.5)',
              animation: isHovered ? `${slideUp} 0.3s ease-out` : 'none',
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: '0 12px 35px rgba(102, 126, 234, 0.6)',
              }
            }}
          >
            Quick View
          </Button>
        </Box>
      </Box>

      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        {/* Category Chip */}
        <Chip 
          label={product.category}
          size="small"
          sx={{ 
            mb: 2,
            textTransform: 'capitalize',
            fontWeight: 700,
            fontSize: '0.7rem',
            height: 24,
            background: theme.palette.mode === 'light'
              ? alpha(theme.palette.primary.main, 0.1)
              : alpha(theme.palette.primary.main, 0.2),
            color: theme.palette.primary.main,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
            transition: 'all 0.2s ease',
            '&:hover': {
              background: theme.palette.primary.main,
              color: 'white',
              transform: 'scale(1.05)',
            }
          }}
        />

        {/* Product Title */}
        <Typography 
          gutterBottom 
          variant="h6" 
          component={Link}
          to={`/product/${product.id}`}
          sx={{
            fontWeight: 700,
            fontSize: '1rem',
            lineHeight: 1.4,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            minHeight: '2.8em',
            mb: 2,
            textDecoration: 'none',
            color: 'inherit',
            fontFamily: '"Inter", sans-serif',
            transition: 'color 0.2s ease',
            '&:hover': {
              color: theme.palette.primary.main,
            }
          }}
        >
          {product.title}
        </Typography>

        {/* Rating */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Rating
            value={product.rating.rate}
            precision={0.1}
            readOnly
            size="small"
            sx={{ 
              mr: 1,
              '& .MuiRating-iconFilled': {
                color: '#ffd700',
              }
            }}
          />
          <Typography 
            variant="body2" 
            sx={{ 
              color: 'text.secondary',
              fontWeight: 600,
              fontSize: '0.75rem',
            }}
          >
            {product.rating.rate} ({product.rating.count})
          </Typography>
        </Box>

        {/* Price Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 800,
              background: theme.palette.mode === 'light'
                ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                : 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontFamily: '"Inter", sans-serif',
            }}
          >
            ${product.price.toFixed(2)}
          </Typography>
          {isOnSale && (
            <Typography 
              variant="body2" 
              sx={{ 
                textDecoration: 'line-through',
                color: 'text.disabled',
                fontWeight: 600,
              }}
            >
              ${(product.price * (1 + discount / 100)).toFixed(2)}
            </Typography>
          )}
        </Box>
      </CardContent>

      {/* Actions */}
      <CardActions 
        sx={{ 
          px: 3, 
          pb: 3, 
          pt: 0,
          gap: 1.5,
        }}
      >
        <Button
          fullWidth
          component={Link}
          to={`/product/${product.id}`}
          sx={{
            py: 1.2,
            fontWeight: 700,
            fontSize: '0.875rem',
            borderRadius: 3,
            textTransform: 'none',
            fontFamily: '"Inter", sans-serif',
            border: `2px solid ${alpha(theme.palette.primary.main, 0.3)}`,
            color: theme.palette.text.primary,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              borderColor: theme.palette.primary.main,
              background: alpha(theme.palette.primary.main, 0.1),
              transform: 'translateY(-2px)',
            }
          }}
        >
          View Details
        </Button>
        
        {user && (
          <Button
            fullWidth
            variant="contained"
            startIcon={<ShoppingCart />}
            onClick={handleAddToCart}
            sx={{
              py: 1.2,
              fontWeight: 700,
              fontSize: '0.875rem',
              borderRadius: 3,
              textTransform: 'none',
              fontFamily: '"Inter", sans-serif',
              background: theme.palette.mode === 'light'
                ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                : 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              boxShadow: theme.palette.mode === 'light'
                ? '0 4px 20px rgba(102, 126, 234, 0.4)'
                : '0 4px 20px rgba(79, 172, 254, 0.4)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: '-100%',
                width: '100%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                transition: 'left 0.5s ease',
              },
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: theme.palette.mode === 'light'
                  ? '0 8px 30px rgba(102, 126, 234, 0.6)'
                  : '0 8px 30px rgba(79, 172, 254, 0.6)',
                '&::before': {
                  left: '100%',
                }
              }
            }}
          >
            Add to Cart
          </Button>
        )}
      </CardActions>
    </Card>
  );
}

export default ProductCard;