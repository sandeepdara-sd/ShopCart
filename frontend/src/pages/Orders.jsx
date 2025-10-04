import { useState, useEffect } from 'react';
import {
  Typography,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Chip,
  Box,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
  Container,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Alert,
  Snackbar,
} from '@mui/material';
import { ExpandMore, Receipt, Delete } from '@mui/icons-material';
import axios from 'axios';
import { API_BASE_URL } from '../config';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/orders`);
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (orderId) => {
    setSelectedOrderId(orderId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/orders/${selectedOrderId}`);
      setOrders(orders.filter(order => order._id !== selectedOrderId));
      setSnackbar({
        open: true,
        message: 'Order cancelled successfully',
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Error cancelling order',
        severity: 'error'
      });
    } finally {
      setDeleteDialogOpen(false);
      setSelectedOrderId(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSelectedOrderId(null);
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'processing':
        return 'info';
      case 'shipped':
        return 'primary';
      case 'delivered':
        return 'success';
      default:
        return 'default';
    }
  };

  const canCancelOrder = (status) => {
    return status !== 'delivered';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (orders.length === 0) {
    return (
      <Container maxWidth="md">
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Receipt sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            No orders found
          </Typography>
          <Typography variant="body1" color="text.secondary">
            You haven't placed any orders yet.
          </Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        My Orders
      </Typography>

      <Box>
        {orders.map((order) => (
          <Accordion key={order._id} sx={{ mb: 2 }}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6">
                    Order #{order.orderNumber}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Chip
                    label={order.status.toUpperCase()}
                    color={getStatusColor(order.status)}
                    size="small"
                    sx={{ mb: 1 }}
                  />
                  <Typography variant="h6" color="primary">
                    ${order.totalPrice.toFixed(2)}
                  </Typography>
                </Box>
              </Box>
            </AccordionSummary>
            
            <AccordionDetails>
              <Divider sx={{ mb: 2 }} />
              
              <Typography variant="h6" gutterBottom>
                Items Ordered ({order.items.length})
              </Typography>
              
              <List>
                {order.items.map((item, index) => (
                  <ListItem key={index} sx={{ px: 0 }}>
                    <ListItemAvatar sx={{ mr: 2 }}>
                      <Avatar
                        src={item.image}
                        alt={item.title}
                        sx={{ width: 60, height: 60 }}
                        variant="rounded"
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="body1">
                          {item.title}
                        </Typography>
                      }
                      secondary={
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            Quantity: {item.quantity} × ${item.price.toFixed(2)}
                          </Typography>
                        </Box>
                      }
                    />
                    <Typography variant="h6" color="primary">
                      ${(item.price * item.quantity).toFixed(2)}
                    </Typography>
                  </ListItem>
                ))}
              </List>
              
              {order.shippingAddress && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Shipping Address
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {order.shippingAddress.street}<br />
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}<br />
                    {order.shippingAddress.country}
                  </Typography>
                </Box>
              )}

              {canCancelOrder(order.status) && (
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<Delete />}
                    onClick={() => handleDeleteClick(order._id)}
                  >
                    Cancel Order
                  </Button>
                </Box>
              )}
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
      >
        <DialogTitle>Cancel Order</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to cancel this order? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            No, Keep Order
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Yes, Cancel Order
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default Orders;