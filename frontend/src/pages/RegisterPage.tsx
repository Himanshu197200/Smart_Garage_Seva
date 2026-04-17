import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box, TextField, Button, Typography, Alert, CircularProgress,
  Paper, Select, MenuItem, FormControl, InputLabel
} from '@mui/material';
import BuildIcon from '@mui/icons-material/Build';
import { authService } from '../services/authService';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', email: '', password: '', phone: '', role: 'CUSTOMER', garageId: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field: string) => (e: any) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authService.register(form);
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(ellipse at 40% 80%, rgba(14,165,233,0.12) 0%, transparent 60%), #0f172a',
      p: 2
    }}>
      <Box sx={{ width: '100%', maxWidth: 440 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box sx={{
            width: 56, height: 56, borderRadius: '16px',
            background: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            mx: 'auto', mb: 2,
            boxShadow: '0 8px 32px rgba(14,165,233,0.4)'
          }}>
            <BuildIcon sx={{ fontSize: 28, color: '#fff' }} />
          </Box>
          <Typography variant="h5" fontWeight={700} sx={{ color: '#f1f5f9', mb: 0.5 }}>
            Create account
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b' }}>
            Join Smart Garage Seva
          </Typography>
        </Box>

        <Paper sx={{ p: 3, borderRadius: '16px' }} elevation={0}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}
          <Box component="form" id="register-form" onSubmit={handleSubmit}>
            <TextField id="reg-name" label="Full Name" value={form.name} onChange={handleChange('name')} fullWidth required sx={{ mb: 2 }} />
            <TextField id="reg-email" label="Email address" type="email" value={form.email} onChange={handleChange('email')} fullWidth required sx={{ mb: 2 }} />
            <TextField id="reg-phone" label="Phone (10 digits)" value={form.phone} onChange={handleChange('phone')} fullWidth required sx={{ mb: 2 }} inputProps={{ maxLength: 10 }} />
            <TextField id="reg-password" label="Password" type="password" value={form.password} onChange={handleChange('password')} fullWidth required sx={{ mb: 2 }} />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="reg-role-label">Role</InputLabel>
              <Select
                labelId="reg-role-label"
                id="reg-role"
                value={form.role}
                label="Role"
                onChange={handleChange('role')}
              >
                <MenuItem value="CUSTOMER">Customer</MenuItem>
                <MenuItem value="MECHANIC">Mechanic</MenuItem>
                <MenuItem value="ADMIN">Admin</MenuItem>
              </Select>
            </FormControl>
            {(form.role === 'MECHANIC' || form.role === 'ADMIN') && (
              <TextField
                id="reg-garage-id"
                label="Garage ID"
                value={form.garageId}
                onChange={handleChange('garageId')}
                fullWidth
                sx={{ mb: 2 }}
                helperText="Required for Mechanic and Admin roles"
              />
            )}
            <Button
              id="register-submit"
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{
                py: 1.5, mt: 1,
                background: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
                boxShadow: '0 4px 16px rgba(14,165,233,0.4)',
                '&:hover': { boxShadow: '0 6px 20px rgba(14,165,233,0.5)' }
              }}
            >
              {loading ? <CircularProgress size={20} color="inherit" /> : 'Create account'}
            </Button>
          </Box>
        </Paper>

        <Typography variant="body2" align="center" sx={{ mt: 2.5, color: '#64748b' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#818cf8', fontWeight: 600 }}>
            Sign in
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}
