import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box, TextField, Button, Typography, Alert, CircularProgress,
  Paper, Select, MenuItem, FormControl, InputLabel
} from '@mui/material';
import BuildIcon from '@mui/icons-material/Build';
import { authService } from '../services/authService';

import { useAuth } from '../contexts/AuthContext';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
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
      const payload = { ...form };
      if (!payload.garageId) delete (payload as any).garageId;
      await authService.register(payload);
      await login(form.email, form.password);
      navigate('/dashboard');
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
      background: '#F8FAFC',
      p: 2
    }}>
      <Box sx={{ width: '100%', maxWidth: 440 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box sx={{
            width: 48, height: 48, borderRadius: '12px',
            background: '#2563EB',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            mx: 'auto', mb: 2
          }}>
            <BuildIcon sx={{ fontSize: 24, color: '#fff' }} />
          </Box>
          <Typography variant="h5" fontWeight={700} sx={{ color: '#111827', mb: 0.5 }}>
            Create account
          </Typography>
          <Typography variant="body2" sx={{ color: '#6B7280' }}>
            Join Smart Garage Seva
          </Typography>
        </Box>

        <Paper sx={{ p: 4, borderRadius: '12px' }} elevation={0}>
          {error && (
            <Alert severity="error" sx={{ mb: 2.5 }} onClose={() => setError('')}>
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
                py: 1.4, mt: 1,
                bgcolor: '#2563EB',
                '&:hover': { bgcolor: '#1D4ED8' },
                fontSize: 14,
                fontWeight: 600
              }}
            >
              {loading ? <CircularProgress size={20} color="inherit" /> : 'Create account'}
            </Button>
          </Box>
        </Paper>

        <Typography variant="body2" align="center" sx={{ mt: 3, color: '#6B7280' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#2563EB', fontWeight: 600 }}>
            Sign in
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}
