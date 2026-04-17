import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Chip, IconButton, CircularProgress, Tooltip, Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import SpeedIcon from '@mui/icons-material/Speed';
import { vehicleService } from '../services/vehicleService';
import { Vehicle } from '../types';
import { useAuth } from '../contexts/AuthContext';

function VehicleCard({ vehicle, onEdit, onDelete }: {
  vehicle: Vehicle;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <Paper elevation={0} sx={{
      p: 2.5, borderRadius: '16px',
      transition: 'border-color 0.2s',
      border: '1px solid rgba(255,255,255,0.06)',
      '&:hover': { borderColor: 'rgba(99,102,241,0.3)' }
    }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{
            width: 44, height: 44, borderRadius: '12px',
            background: 'linear-gradient(135deg, rgba(99,102,241,0.25), rgba(14,165,233,0.15))',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <DirectionsCarIcon sx={{ color: '#818cf8', fontSize: 22 }} />
          </Box>
          <Box>
            <Typography variant="subtitle2" fontWeight={700} sx={{ color: '#f1f5f9' }}>
              {vehicle.brand} {vehicle.modelName}
            </Typography>
            <Chip label={vehicle.registrationNumber} size="small" sx={{ bgcolor: 'rgba(99,102,241,0.12)', color: '#818cf8', fontSize: 11, height: 20 }} />
          </Box>
        </Box>
        <Box>
          <Tooltip title="Edit">
            <IconButton size="small" onClick={onEdit} sx={{ color: '#64748b', '&:hover': { color: '#818cf8' } }}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton size="small" onClick={onDelete} sx={{ color: '#64748b', '&:hover': { color: '#ef4444' } }}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', gap: 3 }}>
        <Box>
          <Typography variant="caption" sx={{ color: '#64748b' }}>Year</Typography>
          <Typography variant="body2" fontWeight={600} sx={{ color: '#f1f5f9' }}>{vehicle.year}</Typography>
        </Box>
        <Box>
          <Typography variant="caption" sx={{ color: '#64748b' }}>Mileage</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <SpeedIcon sx={{ fontSize: 14, color: '#10b981' }} />
            <Typography variant="body2" fontWeight={600} sx={{ color: '#f1f5f9' }}>{vehicle.currentMileage.toLocaleString()} km</Typography>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}

const EMPTY_FORM = { registrationNumber: '', brand: '', modelName: '', year: new Date().getFullYear(), currentMileage: 0, garageId: '' };

export default function VehiclesPage() {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editVehicle, setEditVehicle] = useState<Vehicle | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const data = await vehicleService.getMyVehicles();
      setVehicles(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setEditVehicle(null);
    setForm({ ...EMPTY_FORM, garageId: user?.garageId || '' });
    setError('');
    setDialogOpen(true);
  };

  const openEdit = (v: Vehicle) => {
    setEditVehicle(v);
    setForm({ registrationNumber: v.registrationNumber, brand: v.brand, modelName: v.modelName, year: v.year, currentMileage: v.currentMileage, garageId: typeof v.garageId === 'string' ? v.garageId : '' });
    setError('');
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this vehicle?')) return;
    await vehicleService.delete(id);
    load();
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      if (editVehicle) {
        await vehicleService.update(editVehicle._id, form);
      } else {
        await vehicleService.create(form);
      }
      setDialogOpen(false);
      load();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save vehicle');
    } finally {
      setSaving(false);
    }
  };

  const field = (key: keyof typeof form) => (e: any) => setForm(prev => ({ ...prev, [key]: e.target.value }));

  return (
    <Box className="page-container fade-in">
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight={700} sx={{ color: '#f1f5f9' }}>Vehicles</Typography>
          <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>Manage your registered vehicles</Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openAdd}
          sx={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', boxShadow: '0 4px 16px rgba(99,102,241,0.4)' }}
        >
          Add Vehicle
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>
      ) : vehicles.length === 0 ? (
        <Paper elevation={0} sx={{ p: 6, textAlign: 'center', borderRadius: '16px' }}>
          <DirectionsCarIcon sx={{ fontSize: 56, color: '#334155', mb: 2 }} />
          <Typography variant="h6" fontWeight={600} sx={{ color: '#64748b' }}>No vehicles registered</Typography>
          <Typography variant="body2" sx={{ color: '#475569', mb: 3 }}>Add your first vehicle to get started</Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={openAdd}>Add Vehicle</Button>
        </Paper>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2,1fr)', lg: 'repeat(3,1fr)' }, gap: 2 }}>
          {vehicles.map(v => (
            <VehicleCard key={v._id} vehicle={v} onEdit={() => openEdit(v)} onDelete={() => handleDelete(v._id)} />
          ))}
        </Box>
      )}

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '16px' } }}>
        <DialogTitle fontWeight={700}>{editVehicle ? 'Edit Vehicle' : 'Register Vehicle'}</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mt: 0.5 }}>
            <TextField id="v-reg" label="Registration Number" value={form.registrationNumber} onChange={field('registrationNumber')} fullWidth required />
            <TextField id="v-brand" label="Brand" value={form.brand} onChange={field('brand')} fullWidth required />
            <TextField id="v-model" label="Model Name" value={form.modelName} onChange={field('modelName')} fullWidth required />
            <TextField id="v-year" label="Year" type="number" value={form.year} onChange={field('year')} fullWidth required />
            <TextField id="v-mileage" label="Current Mileage (km)" type="number" value={form.currentMileage} onChange={field('currentMileage')} fullWidth />
            <TextField id="v-garage" label="Garage ID" value={form.garageId} onChange={field('garageId')} fullWidth required />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setDialogOpen(false)} sx={{ color: '#64748b' }}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} disabled={saving}>
            {saving ? <CircularProgress size={18} color="inherit" /> : (editVehicle ? 'Save Changes' : 'Register')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
