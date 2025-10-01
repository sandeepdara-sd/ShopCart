import { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Box,
  Container,
  Tooltip,
  useTheme,
  alpha,
  Divider,
  ListItemIcon,
  ListItemText,
  keyframes,
} from '@mui/material';
import {
  ShoppingCart,
  AccountCircle,
  Store,
  Person,
  Receipt,
  Logout,
  Login,
  PersonAdd,
  LocalOffer,
  FavoriteBorder,
} from '@mui/icons-material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useColorMode } from '../../contexts/ThemeContext.jsx';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useCart } from '../../hooks/useCart.jsx';

// Animations
const shimmer = keyframes`
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
`;

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 5px rgba(99, 102, 241, 0.3), 0 0 10px rgba(99, 102, 241, 0.2); }
  50% { box-shadow: 0 0 20px rgba(99, 102, 241, 0.5), 0 0 30px rgba(99, 102, 241, 0.3); }
`;

const slideDown = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

function Navbar() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const theme = useTheme();
  const { toggleColorMode } = useColorMode();

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
    navigate('/');
  };

  const cartItemsCount = cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;

  const isActive = (path) => location.pathname === path;

  return (
    <AppBar 
      position="sticky" 
      elevation={0} 
      sx={{
        transition: 'all .4s cubic-bezier(0.4, 0, 0.2, 1)',
        backgroundColor: scrolled
          ? theme.palette.mode === 'light' 
            ? 'rgba(255, 255, 255, 0.95)' 
            : 'rgba(10, 15, 30, 0.95)'
          : theme.palette.mode === 'light' 
            ? 'rgba(255, 255, 255, 0.85)' 
            : 'rgba(15, 21, 35, 0.85)',
        backdropFilter: 'saturate(180%) blur(20px)',
        WebkitBackdropFilter: 'saturate(180%) blur(20px)',
        borderBottom: scrolled 
          ? `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
          : `1px solid ${alpha(theme.palette.divider, 0.05)}`,
        boxShadow: scrolled
          ? theme.palette.mode === 'light'
            ? '0 4px 30px rgba(0, 0, 0, 0.08)'
            : '0 4px 30px rgba(0, 0, 0, 0.6)'
          : 'none',
      }}
    >
      <Container maxWidth="lg">
        <Toolbar 
          disableGutters 
          sx={{ 
            minHeight: { xs: 64, sm: 72 },
            py: 1,
          }}
        >
          {/* Logo Section with Shimmer Effect */}
          <Box
            component={Link}
            to="/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              textDecoration: 'none',
              color: 'inherit',
              mr: 'auto',
              position: 'relative',
              '&:hover .logo-box': {
                transform: 'rotate(5deg) scale(1.05)',
                animation: `${glow} 2s ease-in-out infinite`,
              },
              '&:hover .logo-text': {
                backgroundSize: '200% auto',
                animation: `${shimmer} 2s linear infinite`,
              }
            }}
          >
            <Box
              className="logo-box"
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 44,
                height: 44,
                borderRadius: 2.5,
                background: theme.palette.mode === 'light'
                  ? `linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)`
                  : `linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)`,
                boxShadow: theme.palette.mode === 'light'
                  ? '0 8px 24px rgba(102, 126, 234, 0.4)'
                  : '0 8px 24px rgba(79, 172, 254, 0.4)',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: '-100%',
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
                  transition: 'left 0.5s',
                },
                '&:hover::before': {
                  left: '100%',
                }
              }}
            >
              <Store sx={{ color: 'white', fontSize: 26, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }} />
            </Box>
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <Typography 
                className="logo-text"
                variant="h5" 
                sx={{ 
                  fontWeight: 800,
                  fontSize: '1.5rem',
                  letterSpacing: '-0.02em',
                  background: theme.palette.mode === 'light'
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)'
                    : 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                  backgroundSize: '200% auto',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  transition: 'all 0.3s ease',
                  fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
                }}
              >
                ShopCart
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  display: 'block',
                  fontSize: '0.65rem',
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: theme.palette.text.secondary,
                  mt: -0.5,
                  fontFamily: '"Inter", sans-serif',
                }}
              >
                Premium Store
              </Typography>
            </Box>
          </Box>

          {/* Navigation Items */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1.5 } }}>
            {/* Shop Button with Active State */}
            <Button 
              component={Link} 
              to="/shop"
              startIcon={<LocalOffer sx={{ fontSize: 18 }} />}
              sx={{
                px: { xs: 1.5, sm: 3 },
                py: 1.2,
                fontWeight: 700,
                fontSize: '0.875rem',
                borderRadius: 3,
                textTransform: 'none',
                position: 'relative',
                overflow: 'hidden',
                fontFamily: '"Inter", sans-serif',
                color: isActive('/shop') ? 'white' : theme.palette.text.primary,
                background: isActive('/shop')
                  ? theme.palette.mode === 'light'
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    : 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
                  : 'transparent',
                boxShadow: isActive('/shop')
                  ? '0 4px 15px rgba(102, 126, 234, 0.4)'
                  : 'none',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: theme.palette.mode === 'light'
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    : 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                  opacity: 0,
                  transition: 'opacity 0.3s ease',
                  zIndex: -1,
                },
                '&:hover': {
                  color: 'white',
                  transform: 'translateY(-2px)',
                  boxShadow: theme.palette.mode === 'light'
                    ? '0 8px 25px rgba(102, 126, 234, 0.5)'
                    : '0 8px 25px rgba(79, 172, 254, 0.5)',
                  '&::before': {
                    opacity: 1,
                  }
                }
              }}
            >
              Shop
            </Button>

            {/* Theme Toggle with Rotation */}
            <Tooltip 
              title={theme.palette.mode === 'dark' ? 'Light mode' : 'Dark mode'}
              arrow
              TransitionProps={{ timeout: 300 }}
            >
              <IconButton 
                onClick={toggleColorMode}
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: 3,
                  background: theme.palette.mode === 'light'
                    ? 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)'
                    : 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: theme.palette.mode === 'light'
                    ? '0 4px 15px rgba(252, 182, 159, 0.4)'
                    : '0 4px 15px rgba(52, 152, 219, 0.4)',
                  '&:hover': {
                    transform: 'rotate(180deg) scale(1.1)',
                    boxShadow: theme.palette.mode === 'light'
                      ? '0 6px 20px rgba(252, 182, 159, 0.6)'
                      : '0 6px 20px rgba(52, 152, 219, 0.6)',
                  }
                }}
              >
                {theme.palette.mode === 'dark' ? (
                  <Brightness7Icon sx={{ fontSize: 22, color: 'white' }} />
                ) : (
                  <Brightness4Icon sx={{ fontSize: 22, color: 'white' }} />
                )}
              </IconButton>
            </Tooltip>

            {/* Cart Icon with Pulse Animation - FIXED */}
            {user && (
              <Tooltip title="Shopping Cart" arrow>
                <Box
                  component={Link}
                  to="/cart"
                  sx={{ 
                    display: 'inline-flex',
                    position: 'relative',
                    textDecoration: 'none',
                  }}
                >
                  <IconButton
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: 3,
                      background: theme.palette.mode === 'light'
                        ? 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
                        : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      boxShadow: '0 4px 15px rgba(250, 112, 154, 0.4)',
                      animation: cartItemsCount > 0 ? `${pulse} 2s ease-in-out infinite` : 'none',
                      '&:hover': {
                        transform: 'scale(1.1) translateY(-2px)',
                        boxShadow: '0 8px 25px rgba(250, 112, 154, 0.6)',
                      }
                    }}
                  >
                    <ShoppingCart sx={{ fontSize: 22, color: 'white' }} />
                  </IconButton>
                  {cartItemsCount > 0 && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: -2,
                        right: -2,
                        minWidth: '20px',
                        height: '20px',
                        borderRadius: '10px',
                        padding: '0 6px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        boxShadow: '0 2px 8px rgba(102, 126, 234, 0.5)',
                        border: '2px solid white',
                        animation: `${pulse} 1.5s ease-in-out infinite`,
                        pointerEvents: 'none',
                        zIndex: 1,
                      }}
                    >
                      {cartItemsCount}
                    </Box>
                  )}
                </Box>
              </Tooltip>
            )}

            {/* User Menu or Auth Buttons */}
            {user ? (
              <>
                <Tooltip title="Account" arrow>
                  <IconButton
                    onClick={handleMenu}
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: 3,
                      background: theme.palette.mode === 'light'
                        ? 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
                        : 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      boxShadow: '0 4px 15px rgba(168, 237, 234, 0.4)',
                      '&:hover': {
                        transform: 'scale(1.1) translateY(-2px)',
                        animation: `${float} 2s ease-in-out infinite`,
                      }
                    }}
                  >
                    <AccountCircle sx={{ fontSize: 28, color: 'white' }} />
                  </IconButton>
                </Tooltip>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  onClick={handleClose}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  TransitionProps={{
                    timeout: 300,
                  }}
                  PaperProps={{
                    elevation: 0,
                    sx: {
                      mt: 1.5,
                      minWidth: 240,
                      borderRadius: 3,
                      overflow: 'visible',
                      backdropFilter: 'blur(40px) saturate(180%)',
                      WebkitBackdropFilter: 'blur(40px) saturate(180%)',
                      backgroundColor: theme.palette.mode === 'light'
                        ? 'rgba(255, 255, 255, 0.98)'
                        : 'rgba(20, 25, 40, 0.98)',
                      border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                      boxShadow: theme.palette.mode === 'light'
                        ? '0 8px 32px rgba(0, 0, 0, 0.12)'
                        : '0 8px 32px rgba(0, 0, 0, 0.6)',
                      animation: `${slideDown} 0.3s ease-out`,
                      '&::before': {
                        content: '""',
                        display: 'block',
                        position: 'absolute',
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: theme.palette.mode === 'light'
                          ? 'rgba(255, 255, 255, 0.98)'
                          : 'rgba(20, 25, 40, 0.98)',
                        transform: 'translateY(-50%) rotate(45deg)',
                        zIndex: 0,
                        borderLeft: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                        borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                      },
                      '& .MuiMenuItem-root': {
                        px: 2.5,
                        py: 1.5,
                        borderRadius: 2,
                        mx: 1,
                        my: 0.5,
                        fontFamily: '"Inter", sans-serif',
                        fontWeight: 600,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.primary.main, 0.12),
                          transform: 'translateX(4px)',
                        }
                      }
                    },
                  }}
                >
                  <Box sx={{ px: 2.5, py: 2, mb: 1 }}>
                    <Typography 
                      variant="subtitle1" 
                      fontWeight={800}
                      sx={{
                        background: theme.palette.mode === 'light'
                          ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                          : 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontFamily: '"Inter", sans-serif',
                      }}
                    >
                      {user.name || 'User'}
                    </Typography>
                    <Typography 
                      variant="caption" 
                      color="text.secondary"
                      sx={{ 
                        fontWeight: 500,
                        fontFamily: '"Inter", sans-serif',
                      }}
                    >
                      {user.email}
                    </Typography>
                  </Box>
                  <Divider sx={{ my: 1 }} />
                  <MenuItem component={Link} to="/profile">
                    <ListItemIcon>
                      <Person fontSize="small" sx={{ color: theme.palette.primary.main }} />
                    </ListItemIcon>
                    <ListItemText>Profile</ListItemText>
                  </MenuItem>
                  <MenuItem component={Link} to="/orders">
                    <ListItemIcon>
                      <Receipt fontSize="small" sx={{ color: theme.palette.primary.main }} />
                    </ListItemIcon>
                    <ListItemText>My Orders</ListItemText>
                  </MenuItem>
                  <MenuItem component={Link} to="/wishlist">
                    <ListItemIcon>
                      <FavoriteBorder fontSize="small" sx={{ color: theme.palette.primary.main }} />
                    </ListItemIcon>
                    <ListItemText>Wishlist</ListItemText>
                  </MenuItem>
                  <Divider sx={{ my: 1 }} />
                  <MenuItem 
                    onClick={handleLogout}
                    sx={{
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.error.main, 0.1),
                      }
                    }}
                  >
                    <ListItemIcon>
                      <Logout fontSize="small" sx={{ color: 'error.main' }} />
                    </ListItemIcon>
                    <ListItemText sx={{ color: 'error.main' }}>Logout</ListItemText>
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Box sx={{ display: 'flex', gap: 1.5 }}>
                <Button 
                  component={Link} 
                  to="/login"
                  startIcon={<Login sx={{ fontSize: 18 }} />}
                  sx={{
                    px: { xs: 2, sm: 3 },
                    py: 1.2,
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    borderRadius: 3,
                    textTransform: 'none',
                    fontFamily: '"Inter", sans-serif',
                    color: theme.palette.text.primary,
                    border: `2px solid ${alpha(theme.palette.primary.main, 0.3)}`,
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
                      background: theme.palette.mode === 'light'
                        ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                        : 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                      transition: 'left 0.4s ease',
                      zIndex: -1,
                    },
                    '&:hover': {
                      color: 'white',
                      borderColor: 'transparent',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
                      '&::before': {
                        left: 0,
                      }
                    }
                  }}
                >
                  Login
                </Button>
                <Button 
                  component={Link} 
                  to="/register"
                  startIcon={<PersonAdd sx={{ fontSize: 18 }} />}
                  sx={{
                    px: { xs: 2, sm: 3 },
                    py: 1.2,
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    borderRadius: 3,
                    textTransform: 'none',
                    fontFamily: '"Inter", sans-serif',
                    color: 'white',
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
                      top: '-50%',
                      left: '-50%',
                      width: '200%',
                      height: '200%',
                      background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
                      opacity: 0,
                      transition: 'opacity 0.4s ease',
                    },
                    '&:hover': {
                      transform: 'translateY(-3px) scale(1.02)',
                      boxShadow: theme.palette.mode === 'light'
                        ? '0 8px 30px rgba(102, 126, 234, 0.6)'
                        : '0 8px 30px rgba(79, 172, 254, 0.6)',
                      '&::before': {
                        opacity: 1,
                      }
                    }
                  }}
                >
                  Register
                </Button>
              </Box>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;