import { Link as RouterLink } from 'react-router-dom';
import { Box, Container, Typography, Button, Stack, Grid, Card, CardContent, Chip, useTheme, IconButton, Avatar, LinearProgress } from '@mui/material';
import { useAuth } from '../contexts/AuthContext.jsx';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CreditScoreIcon from '@mui/icons-material/CreditScore';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import StarIcon from '@mui/icons-material/Star';
import { useReveal } from '../hooks/useReveal.jsx';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useEffect, useState } from 'react';

function Landing() {
  const theme = useTheme();
  const { user } = useAuth();
  const heroRef = useReveal();
  const valuesRef = useReveal();
  const ctaRef = useReveal();

  const images = [
    'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1512295767273-ac109ac3acfa?q=80&w=1600&auto=format&fit=crop'
  ];
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setSlide((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(id);
  }, [images.length]);



  return (
    <Box>
      {/* Hero */}
      <Box ref={heroRef} sx={{
        pt: { xs: 8, md: 12 },
        pb: { xs: 8, md: 12 },
        background: user 
          ? `linear-gradient(135deg, ${theme.palette.primary.main}15 0%, ${theme.palette.secondary.main}15 100%)`
          : `radial-gradient(1200px 600px at 10% -10%, ${theme.palette.primary.main}22, transparent), radial-gradient(800px 400px at 90% -20%, ${theme.palette.secondary.main}22, transparent)`,
        position: 'relative',
      }}>
        <Container maxWidth="lg">
          {user ? (
            // LOGGED IN VIEW - Personalized Dashboard Style
            <Box>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 4 }}>
                <Avatar sx={{ 
                  width: 64, 
                  height: 64, 
                  bgcolor: 'primary.main',
                  fontSize: '1.75rem',
                  fontWeight: 700
                }}>
                  {user.name?.charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
                    Welcome back, {user.name}!
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Ready to continue your shopping journey?
                  </Typography>
                </Box>
              </Stack>

              {/* Quick Actions */}
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={4}>
                  <Card sx={{ 
                    height: '100%',
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}15, ${theme.palette.primary.main}05)`,
                    border: `2px solid ${theme.palette.primary.main}30`,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4
                    }
                  }}>
                    <CardContent sx={{ textAlign: 'center', py: 4 }}>
                      <Box sx={{ 
                        width: 64, 
                        height: 64, 
                        borderRadius: '50%', 
                        bgcolor: 'primary.main',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto',
                        mb: 2,
                        color: 'white'
                      }}>
                        <ShoppingBagIcon sx={{ fontSize: 32 }} />
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                        Continue Shopping
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Explore our curated collection
                      </Typography>
                      <Button 
                        component={RouterLink} 
                        to="/shop" 
                        variant="contained"
                        fullWidth
                      >
                        Browse Products
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card sx={{ 
                    height: '100%',
                    background: `linear-gradient(135deg, ${theme.palette.secondary.main}15, ${theme.palette.secondary.main}05)`,
                    border: `2px solid ${theme.palette.secondary.main}30`,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4
                    }
                  }}>
                    <CardContent sx={{ textAlign: 'center', py: 4 }}>
                      <Box sx={{ 
                        width: 64, 
                        height: 64, 
                        borderRadius: '50%', 
                        bgcolor: 'secondary.main',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto',
                        mb: 2,
                        color: 'white'
                      }}>
                        <ShoppingBagIcon sx={{ fontSize: 32 }} />
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                        View Cart
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Review your selected items
                      </Typography>
                      <Button 
                        component={RouterLink} 
                        to="/cart" 
                        variant="contained"
                        color="secondary"
                        fullWidth
                      >
                        Go to Cart
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card sx={{ 
                    height: '100%',
                    background: theme.palette.mode === 'light' 
                      ? 'linear-gradient(135deg, #667eea15, #764ba205)'
                      : 'rgba(255,255,255,0.03)',
                    border: `2px solid ${theme.palette.divider}`,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4
                    }
                  }}>
                    <CardContent sx={{ textAlign: 'center', py: 4 }}>
                      <Box sx={{ 
                        width: 64, 
                        height: 64, 
                        borderRadius: '50%', 
                        bgcolor: 'action.selected',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto',
                        mb: 2,
                        color: 'text.primary'
                      }}>
                        <LocalShippingIcon sx={{ fontSize: 32 }} />
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                        My Orders
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Track your deliveries
                      </Typography>
                      <Button 
                        component={RouterLink} 
                        to="/orders" 
                        variant="outlined"
                        fullWidth
                      >
                        View Orders
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              {/* Special Offers Banner */}
              <Card sx={{ 
                p: 0,
                mb: 4,
                overflow: 'hidden',
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                color: 'white',
                position: 'relative'
              }}>
                <Box sx={{
                  position: 'absolute',
                  top: -50,
                  right: -50,
                  width: 200,
                  height: 200,
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.1)',
                  filter: 'blur(40px)'
                }} />
                <Box sx={{
                  position: 'absolute',
                  bottom: -30,
                  left: -30,
                  width: 150,
                  height: 150,
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.08)',
                  filter: 'blur(30px)'
                }} />
                <Stack direction={{ xs: 'column', md: 'row' }} alignItems="center" sx={{ p: 4, position: 'relative' }}>
                  <Box sx={{ flex: 1 }}>
                    <Chip 
                      label="MEMBER EXCLUSIVE" 
                      sx={{ 
                        bgcolor: 'rgba(255,255,255,0.2)', 
                        color: 'white',
                        fontWeight: 700,
                        mb: 2
                      }} 
                    />
                    <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
                      🎉 Special Offer Just For You!
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.95, mb: 2 }}>
                      Get 20% off your next purchase. Limited time only!
                    </Typography>
                    <Button 
                      component={RouterLink}
                      to="/shop"
                      variant="contained"
                      sx={{ 
                        bgcolor: 'white', 
                        color: 'primary.main',
                        fontWeight: 700,
                        '&:hover': {
                          bgcolor: 'rgba(255,255,255,0.9)'
                        }
                      }}
                      endIcon={<ChevronRightIcon />}
                    >
                      Shop Now
                    </Button>
                  </Box>
                  <Box sx={{ 
                    width: { xs: '100%', md: 200 }, 
                    height: 200,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mt: { xs: 3, md: 0 }
                  }}>
                    <Box sx={{
                      width: 140,
                      height: 140,
                      borderRadius: '50%',
                      bgcolor: 'rgba(255,255,255,0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      animation: 'pulse 2s ease-in-out infinite',
                      '@keyframes pulse': {
                        '0%, 100%': { transform: 'scale(1)' },
                        '50%': { transform: 'scale(1.05)' }
                      }
                    }}>
                      <Typography variant="h2" sx={{ fontWeight: 900 }}>
                        20%
                      </Typography>
                    </Box>
                  </Box>
                </Stack>
              </Card>

              {/* Personalized Recommendations Section */}
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card sx={{ 
                    p: 3, 
                    height: '100%',
                    background: theme.palette.mode === 'light' 
                      ? 'linear-gradient(135deg, #667eea15, #764ba215)' 
                      : 'rgba(255,255,255,0.03)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4
                    }
                  }}>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                      <TrendingUpIcon color="primary" />
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        Trending Now
                      </Typography>
                    </Stack>
                    <Typography color="text.secondary" sx={{ mb: 2 }}>
                      Check out what's hot this week! Popular picks based on customer favorites.
                    </Typography>
                    <Button 
                      component={RouterLink} 
                      to="/shop" 
                      variant="contained"
                      fullWidth
                      endIcon={<ChevronRightIcon />}
                    >
                      Explore Trending
                    </Button>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card sx={{ 
                    p: 3, 
                    height: '100%',
                    background: theme.palette.mode === 'light' 
                      ? 'linear-gradient(135deg, #fa709a15, #fee14015)' 
                      : 'rgba(255,255,255,0.03)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4
                    }
                  }}>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                      <LocalOfferIcon color="secondary" />
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        New Arrivals
                      </Typography>
                    </Stack>
                    <Typography color="text.secondary" sx={{ mb: 2 }}>
                      Fresh products just landed! Be the first to discover our latest collection.
                    </Typography>
                    <Button 
                      component={RouterLink} 
                      to="/shop" 
                      variant="contained"
                      color="secondary"
                      fullWidth
                      endIcon={<ChevronRightIcon />}
                    >
                      See What's New
                    </Button>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          ) : (
            // LOGGED OUT VIEW - Marketing/Sales Pitch
            <Stack direction={{ xs: 'column', md: 'row' }} alignItems="center" spacing={6}>
              <Box sx={{ flex: 1 }}>
                <Chip 
                  label="Premium marketplace" 
                  color="primary" 
                  variant="outlined" 
                  sx={{ mb: 2, fontWeight: 600 }} 
                />
                <Typography variant="h2" sx={{ fontWeight: 800, lineHeight: 1.1, mb: 2 }}>
                  Discover products you love, delivered with care
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
                  Curated selection, fast shipping, and delightful experiences. Shop smarter with a modern, secure cart flow.
                </Typography>
                
                {/* Feature highlights for logged out users */}
                <Stack spacing={2} sx={{ mb: 4 }}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box sx={{ 
                      width: 40, 
                      height: 40, 
                      borderRadius: 2, 
                      bgcolor: 'primary.main', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      color: 'white'
                    }}>
                      <LocalOfferIcon />
                    </Box>
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        Exclusive member deals
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Save up to 30% with member pricing
                      </Typography>
                    </Box>
                  </Stack>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box sx={{ 
                      width: 40, 
                      height: 40, 
                      borderRadius: 2, 
                      bgcolor: 'secondary.main', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      color: 'white'
                    }}>
                      <StarIcon />
                    </Box>
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        Earn reward points
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Get points on every purchase
                      </Typography>
                    </Box>
                  </Stack>
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Button 
                    component={RouterLink} 
                    to="/register" 
                    variant="gradient" 
                    size="large" 
                    sx={{ py: 1.5, px: 3 }}
                  >
                    Create Free Account
                  </Button>
                  <Button 
                    component={RouterLink} 
                    to="/shop" 
                    variant="outlined" 
                    size="large" 
                    startIcon={<ShoppingBagIcon />} 
                    sx={{ py: 1.5, px: 3 }}
                  >
                    Browse as Guest
                  </Button>
                </Stack>
              </Box>
              <Box sx={{ flex: 1, width: '100%', position: 'relative' }}>
                {/* Decorative blobs */}
                <Box className="anim-float" sx={{ 
                  position: 'absolute', 
                  top: -40, 
                  right: -40, 
                  width: 200, 
                  height: 200, 
                  borderRadius: '50%', 
                  filter: 'blur(40px)', 
                  opacity: 0.3, 
                  background: theme.palette.mode === 'light' 
                    ? 'linear-gradient(135deg, #667eea, #764ba2)' 
                    : 'linear-gradient(135deg, #4facfe, #00f2fe)' 
                }} />
                <Box className="anim-float" sx={{ 
                  position: 'absolute', 
                  bottom: -30, 
                  left: -30, 
                  width: 160, 
                  height: 160, 
                  borderRadius: '50%', 
                  filter: 'blur(40px)', 
                  opacity: 0.25, 
                  background: 'linear-gradient(135deg, #fa709a, #fee140)' 
                }} />
                {/* Image Carousel */}
                <Card sx={{ 
                  p: 2, 
                  overflow: 'hidden', 
                  background: theme.palette.mode === 'light' 
                    ? '#f6f9ff' 
                    : 'rgba(255,255,255,0.03)' 
                }}>
                  <Box sx={{ 
                    position: 'relative', 
                    borderRadius: 2, 
                    overflow: 'hidden', 
                    aspectRatio: '16/10' 
                  }}>
                    {images.map((src, idx) => (
                      <Box
                        key={idx}
                        component="img"
                        src={src}
                        alt={`Slide ${idx + 1}`}
                        sx={{
                          position: 'absolute',
                          inset: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          opacity: idx === slide ? 1 : 0,
                          transform: idx === slide ? 'scale(1.0)' : 'scale(1.02)',
                          transition: 'opacity 800ms ease, transform 1200ms ease',
                        }}
                      />
                    ))}

                    {/* Controls */}
                    <IconButton 
                      onClick={() => setSlide((s) => (s - 1 + images.length) % images.length)} 
                      sx={{ 
                        position: 'absolute', 
                        top: '50%', 
                        left: 8, 
                        transform: 'translateY(-50%)', 
                        bgcolor: 'rgba(0,0,0,0.3)', 
                        color: '#fff', 
                        '&:hover': { bgcolor: 'rgba(0,0,0,0.45)' } 
                      }}
                    >
                      <ChevronLeftIcon />
                    </IconButton>
                    <IconButton 
                      onClick={() => setSlide((s) => (s + 1) % images.length)} 
                      sx={{ 
                        position: 'absolute', 
                        top: '50%', 
                        right: 8, 
                        transform: 'translateY(-50%)', 
                        bgcolor: 'rgba(0,0,0,0.3)', 
                        color: '#fff', 
                        '&:hover': { bgcolor: 'rgba(0,0,0,0.45)' } 
                      }}
                    >
                      <ChevronRightIcon />
                    </IconButton>

                    {/* Dots */}
                    <Stack 
                      direction="row" 
                      spacing={1} 
                      sx={{ 
                        position: 'absolute', 
                        bottom: 10, 
                        left: '50%', 
                        transform: 'translateX(-50%)' 
                      }}
                    >
                      {images.map((_, i) => (
                        <Box 
                          key={i} 
                          onClick={() => setSlide(i)} 
                          sx={{ 
                            width: i === slide ? 18 : 8, 
                            height: 8, 
                            borderRadius: 6, 
                            bgcolor: i === slide ? 'primary.main' : 'rgba(255,255,255,0.7)', 
                            cursor: 'pointer', 
                            transition: 'all .2s ease' 
                          }} 
                        />
                      ))}
                    </Stack>
                  </Box>
                </Card>
              </Box>
            </Stack>
          )}
        </Container>
      </Box>

      {/* Value props */}
      <Container ref={valuesRef} maxWidth="lg" sx={{ py: { xs: 8, md: 10 } }}>
        <Grid container spacing={3}>
          {[{
            icon: <LocalShippingIcon color="primary" />, 
            title: 'Fast, free shipping', 
            desc: 'Free shipping on all orders with reliable, tracked delivery.'
          }, {
            icon: <CreditScoreIcon color="primary" />, 
            title: 'Secure checkout', 
            desc: 'Industry-grade security for safe and seamless purchases.'
          }, {
            icon: <SupportAgentIcon color="primary" />, 
            title: '24/7 support', 
            desc: 'We are here for you anytime via chat and email.'
          }].map((item, idx) => (
            <Grid item xs={12} md={4} key={idx}>
              <Card className="hover-lift shine">
                <CardContent>
                  <Stack spacing={1.5} direction="row" alignItems="flex-start">
                    {item.icon}
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 700 }} className="gradient-text">
                        {item.title}
                      </Typography>
                      <Typography color="text.secondary">{item.desc}</Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA band */}
      <Box ref={ctaRef} sx={{ 
        py: { xs: 6, md: 8 }, 
        background: theme.palette.mode === 'light' 
          ? '#0b57d0' 
          : theme.palette.primary.dark, 
        color: '#fff' 
      }}>
        <Container maxWidth="lg">
          <Stack 
            direction={{ xs: 'column', md: 'row' }} 
            alignItems={{ xs: 'flex-start', md: 'center' }} 
            justifyContent="space-between" 
            spacing={2}
          >
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {user ? 'Discover more amazing products' : 'Ready to upgrade your shopping?'}
            </Typography>
            <Button 
              component={RouterLink} 
              to="/shop" 
              size="large" 
              variant="contained" 
              color="secondary" 
              sx={{ color: '#fff', fontWeight: 700 }}
            >
              Browse Catalog
            </Button>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}

export default Landing;