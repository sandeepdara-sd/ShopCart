import { useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  TextField,
  Typography,
  Paper,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext.jsx';
import axios from 'axios';
import { API_BASE_URL } from '../config.js';

function Profile() {
  const { user, setUser, token } = useAuth(); 
  const [name, setName] = useState(user?.name || '');
  const [email] = useState(user?.email || '');
  const [oldPassword, setOldPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSave = async () => {
    setError('');
    setSuccess('');

    // Validation
    if (password || confirmPassword) {
      if (!oldPassword) {
        setError('Old password is required to change password.');
        return;
      }
      if (!password || !confirmPassword) {
        setError('Both new password fields are required.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
    }

    try {
      setSaving(true);

      const payload = { name };
      if (password) {
        payload.oldPassword = oldPassword;
        payload.password = password;
        payload.confirmPassword = confirmPassword;
      }

      const res = await axios.patch(
        `${API_BASE_URL}/auth/update`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUser(res.data.user); // update auth context
      setSuccess('Profile updated successfully ✅');
      setOldPassword('');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto' }} className="anim-fade">
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>Profile</Typography>

      <Grid container spacing={3}>
        {/* Left side card */}
        <Grid item xs={12} md={4}>
          <Card className="hover-lift">
            <CardContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ width: 96, height: 96 }}>
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </Avatar>
                <Chip label={user?.email || 'guest@example.com'} variant="outlined" />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Right side form */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }} className="hover-lift">
            <Typography variant="h6" sx={{ mb: 2 }}>Account Details</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Full Name"
                  fullWidth
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Email" fullWidth value={email} disabled />
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />
            <Typography variant="h6" sx={{ mb: 2 }}>Security</Typography>
            <Grid container spacing={2}>
              {password && (
                <Grid item xs={12}>
                  <TextField
                    label="Old Password"
                    type="password"
                    fullWidth
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                  />
                </Grid>
              )}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="New Password"
                  type="password"
                  fullWidth
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Confirm Password"
                  type="password"
                  fullWidth
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </Grid>
            </Grid>

            {/* Feedback messages */}
            {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
            {success && <Typography color="success.main" sx={{ mt: 2 }}>{success}</Typography>}

            <Box sx={{ mt: 3, textAlign: 'right' }}>
              <Button
                variant="contained"
                size="large"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Profile;
