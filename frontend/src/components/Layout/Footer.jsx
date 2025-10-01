import { Box, Container, Typography, Stack, Grid, Divider, useTheme } from '@mui/material';
import Store from '@mui/icons-material/Store';

function Footer() {
  const year = new Date().getFullYear();
  const theme = useTheme();

  return (
    <Box 
      component="footer" 
      sx={{ 
        mt: 'auto',
        pt: 6,
        pb: 4,
        borderTop: (t) => `1px solid ${t.palette.divider}`,
        backgroundColor: theme.palette.mode === 'light' 
          ? 'rgba(249, 250, 251, 0.8)' 
          : 'rgba(15, 21, 35, 0.4)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} sx={{ mb: 2 }}>
          <Grid item xs={12} md={6}>
            <Stack spacing={1.5}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Store sx={{ fontSize: 28 }} />
                <Typography variant="h6" fontWeight={700}>
                  ShopCart
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Quality products. Great experiences.
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: { xs: 'left', md: 'right' } }}>
              © {year} ShopCart. All rights reserved.
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Bottom Bar minimal */}
        <Stack direction={{ xs: 'column', sm: 'row' }} alignItems="center" justifyContent="space-between" spacing={2}>
          <Typography variant="caption" color="text.secondary">
            Made with ❤️
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}

export default Footer;