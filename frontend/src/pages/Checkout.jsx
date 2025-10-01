import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Divider,
  Card,
  CardContent,
  Alert,
} from '@mui/material';
import { CreditCard } from '@mui/icons-material';
import axios from 'axios';
import { API_BASE_URL } from '../config.js';
import { useCart } from '../hooks/useCart.jsx';
import { useNotify } from '../contexts/NotificationContext.jsx';

function Checkout() {
  const { cart } = useCart();
  const navigate = useNavigate();
  const notify = useNotify();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [shippingInfo, setShippingInfo] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  });

  const handleInputChange = (e) => {
    setShippingInfo({
      ...shippingInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_BASE_URL}/orders/create`, {
        shippingAddress: shippingInfo,
      });

      // Navigate to orders page on success
      notify('Order placed successfully', { severity: 'success' });
      navigate('/orders');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to place order');
      notify(error.response?.data?.message || 'Failed to place order', { severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (!cart || cart.items.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6">Your cart is empty</Typography>
        <Button onClick={() => navigate('/')} sx={{ mt: 2 }}>
          Continue Shopping
        </Button>
      </Paper>
    );
  }

  const totalWithTax = cart.totalPrice + cart.totalPrice * 0.08;

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Checkout
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Shipping Information
            </Typography>
            
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handlePlaceOrder}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    name="street"
                    label="Street Address"
                    fullWidth
                    required
                    value={shippingInfo.street}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="city"
                    label="City"
                    fullWidth
                    required
                    value={shippingInfo.city}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="state"
                    label="State"
                    fullWidth
                    required
                    value={shippingInfo.state}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="zipCode"
                    label="ZIP Code"
                    fullWidth
                    required
                    value={shippingInfo.zipCode}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="country"
                    label="Country"
                    fullWidth
                    required
                    value={shippingInfo.country}
                    onChange={handleInputChange}
                  />
                </Grid>
              </Grid>

              <Box sx={{ mt: 4 }}>
                <Typography variant="h6" gutterBottom>
                  Payment Information
                </Typography>
                <Alert severity="info" sx={{ mb: 2 }}>
                  This is a demo application. No real payment will be processed.
                </Alert>
                
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      label="Card Number"
                      fullWidth
                      placeholder="1234 5678 9012 3456"
                      InputProps={{
                        startAdornment: <CreditCard sx={{ mr: 1, color: 'text.secondary' }} />,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Expiry Date"
                      fullWidth
                      placeholder="MM/YY"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="CVV"
                      fullWidth
                      placeholder="123"
                    />
                  </Grid>
                </Grid>
              </Box>

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={loading}
                sx={{ mt: 4, py: 2 }}
              >
                {loading ? 'Processing...' : `Place Order - $${totalWithTax.toFixed(2)}`}
              </Button>
            </form>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ position: 'sticky', top: 20 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Order Summary
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <List dense>
                {cart.items.map((item) => (
                  <ListItem key={item.productId} sx={{ px: 0 }}>
                    <ListItemAvatar>
                      <Avatar
                        src={item.image}
                        alt={item.title}
                        variant="rounded"
                        sx={{ width: 50, height: 50 }}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={item.title}
                      secondary={`Qty: ${item.quantity}`}
                      primaryTypographyProps={{ variant: 'body2' }}
                    />
                    <Typography variant="body2">
                      ${(item.price * item.quantity).toFixed(2)}
                    </Typography>
                  </ListItem>
                ))}
              </List>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Subtotal:</Typography>
                <Typography>${cart.totalPrice.toFixed(2)}</Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Shipping:</Typography>
                <Typography>Free</Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Tax:</Typography>
                <Typography>${(cart.totalPrice * 0.08).toFixed(2)}</Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6">Total:</Typography>
                <Typography variant="h6" color="primary">
                  ${totalWithTax.toFixed(2)}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Checkout;