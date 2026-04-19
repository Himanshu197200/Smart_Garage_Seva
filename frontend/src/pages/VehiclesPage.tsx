import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, IconButton, CircularProgress, Tooltip, Alert
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
  vehicle: Vehicle; onEdit: () => void; onDelete: () => void;
}) {
  return (
    <Paper elevation={0} sx={{
      p: '20px', borderRadius: '8px',
      transition: 'all 0.15s ease',
      '&:hover': { borderColor: '#D1D5DB', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }
    }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{
            width: 44, height: 44, borderRadius: '8px',
            background: '#FFF7ED',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <DirectionsCarIcon sx={{ color: '#EA580C', fontSize: 22 }} />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 600, fontSize: 14, color: '#111827' }}>
              {vehicle.brand} {vehicle.modelName}
            </Typography>
            <Box sx={{
              display: 'inline-flex', px: '8px', py: '2px',
              borderRadius: '9999px', bgcolor: '#FFEDD5', color: '#9A3412',
              fontSize: 11, fontWeight: 500
            }}>
              {vehicle.registrationNumber}
            </Box>
          </Box>
        </Box>
        <Box>
          <Tooltip title="Edit">
            <IconButton size="small" onClick={onEdit} sx={{ color: '#9CA3AF', '&:hover': { color: '#EA580C' } }}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton size="small" onClick={onDelete} sx={{ color: '#9CA3AF', '&:hover': { color: '#EF4444' } }}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', gap: 3 }}>
        <Box>
          <Typography sx={{ color: '#9CA3AF', fontSize: 12 }}>Year</Typography>
          <Typography sx={{ fontWeight: 600, fontSize: 14, color: '#111827' }}>{vehicle.year}</Typography>
        </Box>
        <Box>
          <Typography sx={{ color: '#9CA3AF', fontSize: 12 }}>Mileage</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <SpeedIcon sx={{ fontSize: 14, color: '#10B981' }} />
            <Typography sx={{ fontWeight: 600, fontSize: 14, color: '#111827' }}>{vehicle.currentMileage.toLocaleString()} km</Typography>
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
    try { const data = await vehicleService.getMyVehicles(); setVehicles(data); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setEditVehicle(null);
    setForm({ ...EMPTY_FORM, garageId: user?.garageId || '' });
    setError(''); setDialogOpen(true);
  };

  const openEdit = (v: Vehicle) => {
    setEditVehicle(v);
    setForm({ registrationNumber: v.registrationNumber, brand: v.brand, modelName: v.modelName, year: v.year, currentMileage: v.currentMileage, garageId: typeof v.garageId === 'string' ? v.garageId : '' });
    setError(''); setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this vehicle?')) return;
    await vehicleService.delete(id); load();
  };

  const handleSave = async () => {
    setSaving(true); setError('');
    try {
      if (editVehicle) await vehicleService.update(editVehicle._id, form);
      else await vehicleService.create(form);
      setDialogOpen(false); load();
    } catch (err: any) { setError(err.response?.data?.message || 'Failed to save vehicle'); }
    finally { setSaving(false); }
  };

  const field = (key: keyof typeof form) => (e: any) => setForm(prev => ({ ...prev, [key]: e.target.value }));

  return (
    <Box className="page-container fade-in">
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography sx={{ fontWeight: 700, fontSize: 24, color: '#111827' }}>Vehicles</Typography>
          <Typography sx={{ color: '#6B7280', mt: 0.5, fontSize: 14 }}>Manage your registered vehicles</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openAdd}
          sx={{ bgcolor: '#EA580C', '&:hover': { bgcolor: '#C2410C' } }}>
          Add Vehicle
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>
      ) : vehicles.length === 0 ? (
        <Paper elevation={0} sx={{ p: 6, textAlign: 'center', borderRadius: '8px' }}>
          <DirectionsCarIcon sx={{ fontSize: 56, color: '#D1D5DB', mb: 2 }} />
          <Typography sx={{ fontWeight: 600, fontSize: 18, color: '#6B7280' }}>No vehicles registered</Typography>
          <Typography sx={{ color: '#9CA3AF', mb: 3, fontSize: 14 }}>Add your first vehicle to get started</Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={openAdd} sx={{ bgcolor: '#EA580C' }}>Add Vehicle</Button>
        </Paper>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2,1fr)', lg: 'repeat(3,1fr)' }, gap: 2 }}>
          {vehicles.map(v => (
            <VehicleCard key={v._id} vehicle={v} onEdit={() => openEdit(v)} onDelete={() => handleDelete(v._id)} />
          ))}
        </Box>
      )}

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle fontWeight={600} sx={{ color: '#111827' }}>{editVehicle ? 'Edit Vehicle' : 'Register Vehicle'}</DialogTitle>
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
          <Button onClick={() => setDialogOpen(false)} sx={{ color: '#6B7280' }}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} disabled={saving} sx={{ bgcolor: '#EA580C' }}>
            {saving ? <CircularProgress size={18} color="inherit" /> : (editVehicle ? 'Save Changes' : 'Register')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
