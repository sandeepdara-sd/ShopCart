import { Box, Container, Grid, Typography, Paper, Button } from '@mui/material';
import { useWishlist } from '../contexts/WishlistContext.jsx';
import ProductCard from '../components/Product/ProductCard.jsx';
import { Link } from 'react-router-dom';

function Wishlist() {
  const { items } = useWishlist();

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 800 }} className="gradient-text">Wishlist</Typography>

      {items.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Your wishlist is empty</Typography>
          <Button component={Link} to="/shop" variant="gradient">Browse products</Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {items.map((product) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}

export default Wishlist;


