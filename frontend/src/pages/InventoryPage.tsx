import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, IconButton, CircularProgress, Alert, LinearProgress, Tooltip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import InventoryIcon from '@mui/icons-material/Inventory';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { inventoryService } from '../services/inventoryService';
import { InventoryItem } from '../types';
import { useAuth } from '../contexts/AuthContext';

function InventoryCard({ item, onEdit, onDelete, onStock, isAdmin }: {
  item: InventoryItem; onEdit: () => void; onDelete: () => void; onStock: () => void; isAdmin: boolean;
}) {
  const isLow = item.quantity <= item.lowStockThreshold;
  const stockPercent = Math.min((item.quantity / (item.lowStockThreshold * 2 || 10)) * 100, 100);
  return (
    <Paper elevation={0} sx={{
      p: '20px', borderRadius: '8px',
      border: isLow ? '1px solid #FDE68A' : undefined,
      background: isLow ? '#FFFBEB' : undefined,
      transition: 'all 0.15s ease',
      '&:hover': { boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }
    }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1.5 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <Typography sx={{ fontWeight: 600, fontSize: 14, color: '#111827' }}>{item.partName}</Typography>
            {isLow && <WarningAmberIcon sx={{ fontSize: 16, color: '#D97706' }} />}
          </Box>
          <Box sx={{
            display: 'inline-flex', px: '8px', py: '2px',
            borderRadius: '9999px', bgcolor: '#FFEDD5', color: '#9A3412',
            fontSize: 11, fontWeight: 500
          }}>
            # {item.partNumber}
          </Box>
        </Box>
        {isAdmin && (
          <Box>
            <Tooltip title="Edit"><IconButton size="small" onClick={onEdit} sx={{ color: '#9CA3AF', '&:hover': { color: '#EA580C' } }}><EditIcon fontSize="small" /></IconButton></Tooltip>
            <Tooltip title="Delete"><IconButton size="small" onClick={onDelete} sx={{ color: '#9CA3AF', '&:hover': { color: '#EF4444' } }}><DeleteIcon fontSize="small" /></IconButton></Tooltip>
          </Box>
        )}
      </Box>
      <Box sx={{ display: 'flex', gap: 3, mb: 1.5 }}>
        <Box>
          <Typography sx={{ color: '#9CA3AF', fontSize: 12 }}>Unit Price</Typography>
          <Typography sx={{ fontWeight: 600, fontSize: 14, color: '#10B981' }}>Rs. {item.unitPrice}</Typography>
        </Box>
        <Box>
          <Typography sx={{ color: '#9CA3AF', fontSize: 12 }}>Threshold</Typography>
          <Typography sx={{ fontWeight: 600, fontSize: 14, color: '#111827' }}>{item.lowStockThreshold}</Typography>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <Typography sx={{ color: '#9CA3AF', fontSize: 12 }}>Stock</Typography>
        <Typography sx={{ fontWeight: 700, fontSize: 12, color: isLow ? '#D97706' : '#10B981' }}>{item.quantity} units</Typography>
      </Box>
      <LinearProgress variant="determinate" value={stockPercent} color={isLow ? 'warning' : 'success'} sx={{ borderRadius: 4, height: 5 }} />
      {isAdmin && (
        <Button size="small" onClick={onStock} sx={{ color: '#EA580C', fontSize: 12, mt: 1.5, px: 0 }}>Update Stock</Button>
      )}
    </Paper>
  );
}

const EMPTY = { partName: '', partNumber: '', quantity: 0, unitPrice: 0, lowStockThreshold: 5, garageId: '' };

export default function InventoryPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [stockOpen, setStockOpen] = useState(false);
  const [selected, setSelected] = useState<InventoryItem | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [newQty, setNewQty] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    try { setItems(await inventoryService.getInventory(user?.garageId)); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const openAdd = () => { setSelected(null); setForm({ ...EMPTY, garageId: user?.garageId || '' }); setError(''); setDialogOpen(true); };
  const openEdit = (item: InventoryItem) => {
    setSelected(item);
    setForm({ partName: item.partName, partNumber: item.partNumber, quantity: item.quantity, unitPrice: item.unitPrice, lowStockThreshold: item.lowStockThreshold, garageId: typeof item.garageId === 'string' ? item.garageId : '' });
    setError(''); setDialogOpen(true);
  };
  const handleDelete = async (id: string) => { if (!confirm('Delete this item?')) return; await inventoryService.delete(id); load(); };
  const openStock = (item: InventoryItem) => { setSelected(item); setNewQty(String(item.quantity)); setStockOpen(true); };

  const handleSave = async () => {
    setSaving(true); setError('');
    try {
      if (selected) await inventoryService.update(selected._id, form);
      else await inventoryService.create(form);
      setDialogOpen(false); load();
    } catch (e: any) { setError(e.response?.data?.message || 'Failed to save'); }
    finally { setSaving(false); }
  };

  const handleStock = async () => {
    if (!selected) return; setSaving(true);
    try { await inventoryService.updateStock(selected._id, Number(newQty)); setStockOpen(false); load(); }
    catch (e: any) { setError(e.response?.data?.message || 'Failed'); }
    finally { setSaving(false); }
  };

  const f = (key: keyof typeof form) => (e: any) => setForm(p => ({ ...p, [key]: e.target.value }));
  const lowStockItems = items.filter(i => i.quantity <= i.lowStockThreshold);

  return (
    <Box className="page-container fade-in">
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography sx={{ fontWeight: 700, fontSize: 24, color: '#111827' }}>Inventory</Typography>
          <Typography sx={{ color: '#6B7280', mt: 0.5, fontSize: 14 }}>
            {lowStockItems.length > 0 && <><WarningAmberIcon sx={{ fontSize: 14, color: '#D97706', verticalAlign: 'middle' }} /> {lowStockItems.length} items below threshold · </>}
            {items.length} total parts
          </Typography>
        </Box>
        {isAdmin && (
          <Button variant="contained" startIcon={<AddIcon />} onClick={openAdd}
            sx={{ bgcolor: '#EA580C', '&:hover': { bgcolor: '#C2410C' } }}>
            Add Part
          </Button>
        )}
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>
      ) : items.length === 0 ? (
        <Paper elevation={0} sx={{ p: 6, textAlign: 'center', borderRadius: '8px' }}>
          <InventoryIcon sx={{ fontSize: 56, color: '#D1D5DB', mb: 2 }} />
          <Typography sx={{ fontWeight: 600, fontSize: 18, color: '#6B7280' }}>No inventory items</Typography>
        </Paper>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2,1fr)', lg: 'repeat(3,1fr)' }, gap: 2 }}>
          {items.map(item => (
            <InventoryCard key={item._id} item={item} isAdmin={isAdmin} onEdit={() => openEdit(item)} onDelete={() => handleDelete(item._id)} onStock={() => openStock(item)} />
          ))}
        </Box>
      )}

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle fontWeight={600} sx={{ color: '#111827' }}>{selected ? 'Edit Part' : 'Add Part'}</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mt: 0.5 }}>
            <TextField id="inv-name" label="Part Name" value={form.partName} onChange={f('partName')} fullWidth />
            <TextField id="inv-num" label="Part Number" value={form.partNumber} onChange={f('partNumber')} fullWidth />
            <TextField id="inv-qty" label="Quantity" type="number" value={form.quantity} onChange={f('quantity')} fullWidth />
            <TextField id="inv-price" label="Unit Price (Rs.)" type="number" value={form.unitPrice} onChange={f('unitPrice')} fullWidth />
            <TextField id="inv-threshold" label="Low Stock Threshold" type="number" value={form.lowStockThreshold} onChange={f('lowStockThreshold')} fullWidth />
            <TextField id="inv-garage" label="Garage ID" value={form.garageId} onChange={f('garageId')} fullWidth />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setDialogOpen(false)} sx={{ color: '#6B7280' }}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} disabled={saving} sx={{ bgcolor: '#EA580C' }}>{saving ? <CircularProgress size={18} color="inherit" /> : 'Save'}</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={stockOpen} onClose={() => setStockOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle fontWeight={600} sx={{ color: '#111827' }}>Update Stock</DialogTitle>
        <DialogContent>
          <TextField id="stock-qty" label="New Quantity" type="number" value={newQty} onChange={e => setNewQty(e.target.value)} fullWidth sx={{ mt: 1 }} />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setStockOpen(false)} sx={{ color: '#6B7280' }}>Cancel</Button>
          <Button variant="contained" onClick={handleStock} disabled={saving} sx={{ bgcolor: '#EA580C' }}>{saving ? <CircularProgress size={18} color="inherit" /> : 'Update'}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
