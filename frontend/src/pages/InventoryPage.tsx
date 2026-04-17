import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Chip, IconButton, CircularProgress, Alert, LinearProgress, Tooltip
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
      p: 2.5, borderRadius: '16px',
      border: `1px solid ${isLow ? 'rgba(245,158,11,0.25)' : 'rgba(255,255,255,0.06)'}`,
      background: isLow ? 'rgba(245,158,11,0.03)' : undefined
    }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1.5 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <Typography variant="subtitle2" fontWeight={700} sx={{ color: '#f1f5f9' }}>{item.partName}</Typography>
            {isLow && <WarningAmberIcon sx={{ fontSize: 16, color: '#f59e0b' }} />}
          </Box>
          <Chip label={`# ${item.partNumber}`} size="small" sx={{ bgcolor: 'rgba(99,102,241,0.1)', color: '#818cf8', fontSize: 11, height: 20 }} />
        </Box>
        {isAdmin && (
          <Box>
            <Tooltip title="Edit"><IconButton size="small" onClick={onEdit} sx={{ color: '#64748b', '&:hover': { color: '#818cf8' } }}><EditIcon fontSize="small" /></IconButton></Tooltip>
            <Tooltip title="Delete"><IconButton size="small" onClick={onDelete} sx={{ color: '#64748b', '&:hover': { color: '#ef4444' } }}><DeleteIcon fontSize="small" /></IconButton></Tooltip>
          </Box>
        )}
      </Box>
      <Box sx={{ display: 'flex', gap: 3, mb: 1.5 }}>
        <Box>
          <Typography variant="caption" sx={{ color: '#64748b' }}>Unit Price</Typography>
          <Typography variant="body2" fontWeight={600} sx={{ color: '#10b981' }}>Rs. {item.unitPrice}</Typography>
        </Box>
        <Box>
          <Typography variant="caption" sx={{ color: '#64748b' }}>Threshold</Typography>
          <Typography variant="body2" fontWeight={600} sx={{ color: '#f1f5f9' }}>{item.lowStockThreshold}</Typography>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="caption" sx={{ color: '#64748b' }}>Stock</Typography>
        <Typography variant="caption" fontWeight={700} sx={{ color: isLow ? '#f59e0b' : '#10b981' }}>{item.quantity} units</Typography>
      </Box>
      <LinearProgress variant="determinate" value={stockPercent} color={isLow ? 'warning' : 'success'} sx={{ borderRadius: 4, height: 5 }} />
      {isAdmin && (
        <Button size="small" onClick={onStock} sx={{ color: '#818cf8', fontSize: 12, mt: 1.5, px: 0 }}>Update Stock</Button>
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
    setError('');
    setDialogOpen(true);
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
    if (!selected) return;
    setSaving(true);
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
          <Typography variant="h5" fontWeight={700} sx={{ color: '#f1f5f9' }}>Inventory</Typography>
          <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>
            {lowStockItems.length > 0 && <><WarningAmberIcon sx={{ fontSize: 14, color: '#f59e0b', verticalAlign: 'middle' }} /> {lowStockItems.length} items below threshold · </>}
            {items.length} total parts
          </Typography>
        </Box>
        {isAdmin && (
          <Button variant="contained" startIcon={<AddIcon />} onClick={openAdd}
            sx={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', boxShadow: '0 4px 16px rgba(99,102,241,0.4)' }}>
            Add Part
          </Button>
        )}
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>
      ) : items.length === 0 ? (
        <Paper elevation={0} sx={{ p: 6, textAlign: 'center', borderRadius: '16px' }}>
          <InventoryIcon sx={{ fontSize: 56, color: '#334155', mb: 2 }} />
          <Typography variant="h6" sx={{ color: '#64748b' }}>No inventory items</Typography>
        </Paper>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2,1fr)', lg: 'repeat(3,1fr)' }, gap: 2 }}>
          {items.map(item => (
            <InventoryCard key={item._id} item={item} isAdmin={isAdmin} onEdit={() => openEdit(item)} onDelete={() => handleDelete(item._id)} onStock={() => openStock(item)} />
          ))}
        </Box>
      )}

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '16px' } }}>
        <DialogTitle fontWeight={700}>{selected ? 'Edit Part' : 'Add Part'}</DialogTitle>
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
          <Button onClick={() => setDialogOpen(false)} sx={{ color: '#64748b' }}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} disabled={saving}>{saving ? <CircularProgress size={18} color="inherit" /> : 'Save'}</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={stockOpen} onClose={() => setStockOpen(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: '16px' } }}>
        <DialogTitle fontWeight={700}>Update Stock</DialogTitle>
        <DialogContent>
          <TextField id="stock-qty" label="New Quantity" type="number" value={newQty} onChange={e => setNewQty(e.target.value)} fullWidth sx={{ mt: 1 }} />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setStockOpen(false)} sx={{ color: '#64748b' }}>Cancel</Button>
          <Button variant="contained" onClick={handleStock} disabled={saving}>{saving ? <CircularProgress size={18} color="inherit" /> : 'Update'}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
