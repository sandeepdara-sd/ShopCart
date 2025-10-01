import { useState } from 'react';
import {
  Typography,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  IconButton,
  Button,
  Box,
  Divider,
  Grid,
  TextField,
  Card,
  CardContent,
  Container,
} from '@mui/material';
import { Add, Remove, Delete, ShoppingCart } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart.jsx';

function Cart() {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const [updatingItems, setUpdatingItems] = useState({});

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setUpdatingItems(prev => ({ ...prev, [productId]: true }));
    await updateQuantity(productId, newQuantity);
    setUpdatingItems(prev => ({ ...prev, [productId]: false }));
  };

  const handleRemoveItem = async (productId) => {
    setUpdatingItems(prev => ({ ...prev, [productId]: true }));
    await removeFromCart(productId);
    setUpdatingItems(prev => ({ ...prev, [productId]: false }));
  };

  if (!cart || cart.items.length === 0) {
    return (
      <Container maxWidth="md">
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <ShoppingCart sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Your cart is empty
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Start shopping to add items to your cart!
          </Typography>
          <Button
            component={Link}
            to="/shop"
            variant="contained"
            size="large"
            sx={{ mt: 2 }}
          >
            Continue Shopping
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Shopping Cart ({cart.items.length} items)
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <List>
              {cart.items.map((item, index) => (
                <div key={item.productId}>
                  <ListItem
                    sx={{
                      py: 2,
                      opacity: updatingItems[item.productId] ? 0.6 : 1,
                    }}
                  >
                    <ListItemAvatar sx={{ mr: 2 }}>
                      <Avatar
                        src={item.image}
                        alt={item.title}
                        sx={{ width: 80, height: 80 }}
                        variant="rounded"
                      />
                    </ListItemAvatar>
                    
                    <ListItemText
                      primary={
                        <Typography variant="h6" component="div">
                          {item.title}
                        </Typography>
                      }
                      secondary={
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="h6" color="primary" sx={{ mb: 1 }}>
                            ${item.price.toFixed(2)}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <IconButton
                              size="small"
                              onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                              disabled={item.quantity <= 1 || updatingItems[item.productId]}
                            >
                              <Remove />
                            </IconButton>
                            <TextField
                              value={item.quantity}
                              onChange={(e) => {
                                const value = parseInt(e.target.value) || 1;
                                handleQuantityChange(item.productId, value);
                              }}
                              size="small"
                              sx={{ width: 70 }}
                              inputProps={{ min: 1, style: { textAlign: 'center' } }}
                            />
                            <IconButton
                              size="small"
                              onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                              disabled={updatingItems[item.productId]}
                            >
                              <Add />
                            </IconButton>
                          </Box>
                        </Box>
                      }
                    />
                    
                    <Box sx={{ textAlign: 'right', ml: 2 }}>
                      <Typography variant="h6" color="primary" gutterBottom>
                        ${(item.price * item.quantity).toFixed(2)}
                      </Typography>
                      <IconButton
                        color="error"
                        onClick={() => handleRemoveItem(item.productId)}
                        disabled={updatingItems[item.productId]}
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  </ListItem>
                  
                  {index < cart.items.length - 1 && <Divider />}
                </div>
              ))}
            </List>
            
            <Box sx={{ mt: 2, textAlign: 'right' }}>
              <Button
                color="error"
                onClick={clearCart}
                sx={{ mr: 2 }}
              >
                Clear Cart
              </Button>
              <Button
                component={Link}
                to="/shop"
                variant="outlined"
              >
                Continue Shopping
              </Button>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ position: 'sticky', top: 20 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Order Summary
              </Typography>
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
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6">Total:</Typography>
                <Typography variant="h6" color="primary">
                  ${(cart.totalPrice + cart.totalPrice * 0.08).toFixed(2)}
                </Typography>
              </Box>
              
              <Button
                component={Link}
                to="/checkout"
                variant="contained"
                size="large"
                fullWidth
                sx={{ py: 2 }}
              >
                Proceed to Checkout
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Cart;