import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, IconButton, CircularProgress, Alert, Select, MenuItem,
  FormControl, InputLabel, Tooltip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import BuildIcon from '@mui/icons-material/Build';
import PriceCheckIcon from '@mui/icons-material/PriceCheck';
import { jobService } from '../services/jobService';
import { ServiceJob, JobStatus } from '../types';
import { useAuth } from '../contexts/AuthContext';

const STATUS_MAP: Record<string, { bg: string; color: string; dot: string; label: string }> = {
  CREATED: { bg: '#F3F4F6', color: '#4B5563', dot: '#6B7280', label: 'Created' },
  ASSIGNED: { bg: '#FFEDD5', color: '#9A3412', dot: '#EA580C', label: 'Assigned' },
  IN_PROGRESS: { bg: '#FEF3C7', color: '#92400E', dot: '#F59E0B', label: 'In Progress' },
  COMPLETED: { bg: '#D1FAE5', color: '#065F46', dot: '#10B981', label: 'Completed' },
  DELIVERED: { bg: '#EDE9FE', color: '#5B21B6', dot: '#8B5CF6', label: 'Delivered' }
};

const STATUS_LABELS: Record<string, string> = {
  CREATED: 'Created', ASSIGNED: 'Assigned', IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed', DELIVERED: 'Delivered'
};

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_MAP[status] || STATUS_MAP.CREATED;
  return (
    <Box sx={{
      display: 'inline-flex', alignItems: 'center', gap: '6px',
      px: '10px', py: '4px', borderRadius: '9999px',
      fontSize: 12, fontWeight: 500, bgcolor: s.bg, color: s.color
    }}>
      <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: s.dot }} />
      {s.label}
    </Box>
  );
}

function JobCard({ job, onAssign, onStatusChange, onEstimate, userRole }: {
  job: ServiceJob; onAssign: () => void; onStatusChange: () => void; onEstimate: () => void; userRole: string;
}) {
  return (
    <Paper elevation={0} sx={{
      p: '20px', borderRadius: '8px',
      transition: 'all 0.15s ease',
      '&:hover': { borderColor: '#D1D5DB', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }
    }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1.5 }}>
        <Box>
          <Typography sx={{ color: '#9CA3AF', fontFamily: 'monospace', fontSize: 11 }}>#{job._id.slice(-8)}</Typography>
          <Typography sx={{ fontWeight: 500, fontSize: 14, color: '#111827', mt: 0.25, lineHeight: 1.4 }}>
            {job.problemDescription.length > 60 ? job.problemDescription.slice(0, 60) + '…' : job.problemDescription}
          </Typography>
        </Box>
        <StatusBadge status={job.status} />
      </Box>
      <Box sx={{ display: 'flex', gap: 1.5, mb: 1.5 }}>
        <Typography sx={{ color: '#6B7280', fontSize: 12 }}>
          Estimate: <strong style={{ color: '#111827' }}>Rs. {job.costEstimate || '—'}</strong>
        </Typography>
        <Typography sx={{ color: '#D1D5DB', fontSize: 12 }}>·</Typography>
        <Typography sx={{ color: '#6B7280', fontSize: 12 }}>
          {new Date(job.createdAt || '').toLocaleDateString()}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        {userRole === 'ADMIN' && job.status === 'CREATED' && (
          <Button size="small" startIcon={<AssignmentIndIcon />} variant="outlined" onClick={onAssign}
            sx={{ borderColor: '#D1D5DB', color: '#EA580C', fontSize: 12, '&:hover': { borderColor: '#EA580C', bgcolor: '#FFF7ED' } }}>
            Assign
          </Button>
        )}
        {(userRole === 'ADMIN' || userRole === 'MECHANIC') && job.status !== 'DELIVERED' && (
          <Button size="small" startIcon={<ArrowForwardIcon />} variant="outlined" onClick={onStatusChange}
            sx={{ borderColor: '#D1D5DB', color: '#F97316', fontSize: 12, '&:hover': { borderColor: '#F97316', bgcolor: '#FFEDD5' } }}>
            Update Status
          </Button>
        )}
        {userRole === 'ADMIN' && (
          <Button size="small" startIcon={<PriceCheckIcon />} variant="outlined" onClick={onEstimate}
            sx={{ borderColor: '#D1D5DB', color: '#10B981', fontSize: 12, '&:hover': { borderColor: '#10B981', bgcolor: '#D1FAE5' } }}>
            Set Estimate
          </Button>
        )}
      </Box>
    </Paper>
  );
}

export default function ServiceJobsPage() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<ServiceJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [estimateOpen, setEstimateOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<ServiceJob | null>(null);
  const [transitions, setTransitions] = useState<JobStatus[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [createForm, setCreateForm] = useState({ vehicleId: '', garageId: '', problemDescription: '' });
  const [mechanicId, setMechanicId] = useState('');
  const [newStatus, setNewStatus] = useState<JobStatus>('ASSIGNED');
  const [estimate, setEstimate] = useState('');

  const load = async () => {
    try { const data = await jobService.getJobs(user?.garageId); setJobs(data); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const handleCreate = async () => {
    setSaving(true); setError('');
    try { await jobService.create(createForm); setCreateOpen(false); load(); }
    catch (e: any) { setError(e.response?.data?.message || 'Failed to create job'); }
    finally { setSaving(false); }
  };

  const openAssign = (job: ServiceJob) => { setSelectedJob(job); setMechanicId(''); setAssignOpen(true); };
  const handleAssign = async () => {
    if (!selectedJob) return; setSaving(true);
    try { await jobService.assignMechanic(selectedJob._id, mechanicId); setAssignOpen(false); load(); }
    catch (e: any) { setError(e.response?.data?.message || 'Failed to assign'); }
    finally { setSaving(false); }
  };

  const openStatus = async (job: ServiceJob) => {
    setSelectedJob(job);
    const t = await jobService.getTransitions(job._id);
    setTransitions(t); if (t.length) setNewStatus(t[0]); setStatusOpen(true);
  };
  const handleStatus = async () => {
    if (!selectedJob) return; setSaving(true);
    try { await jobService.updateStatus(selectedJob._id, newStatus); setStatusOpen(false); load(); }
    catch (e: any) { setError(e.response?.data?.message || 'Failed to update status'); }
    finally { setSaving(false); }
  };

  const openEstimate = (job: ServiceJob) => { setSelectedJob(job); setEstimate(String(job.costEstimate || '')); setEstimateOpen(true); };
  const handleEstimate = async () => {
    if (!selectedJob) return; setSaving(true);
    try { await jobService.updateEstimate(selectedJob._id, Number(estimate)); setEstimateOpen(false); load(); }
    catch (e: any) { setError(e.response?.data?.message || 'Failed to update estimate'); }
    finally { setSaving(false); }
  };

  return (
    <Box className="page-container fade-in">
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography sx={{ fontWeight: 700, fontSize: 24, color: '#111827' }}>Service Jobs</Typography>
          <Typography sx={{ color: '#6B7280', mt: 0.5, fontSize: 14 }}>Track and manage all service requests</Typography>
        </Box>
        {user?.role === 'CUSTOMER' && (
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => { setCreateForm({ vehicleId: '', garageId: '', problemDescription: '' }); setError(''); setCreateOpen(true); }}
            sx={{ bgcolor: '#EA580C', '&:hover': { bgcolor: '#C2410C' } }}>
            New Request
          </Button>
        )}
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>
      ) : jobs.length === 0 ? (
        <Paper elevation={0} sx={{ p: 6, textAlign: 'center', borderRadius: '8px' }}>
          <BuildIcon sx={{ fontSize: 56, color: '#D1D5DB', mb: 2 }} />
          <Typography sx={{ fontWeight: 600, fontSize: 18, color: '#6B7280' }}>No service jobs</Typography>
        </Paper>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2,1fr)' }, gap: 2 }}>
          {jobs.map(job => (
            <JobCard key={job._id} job={job} userRole={user?.role || ''} onAssign={() => openAssign(job)} onStatusChange={() => openStatus(job)} onEstimate={() => openEstimate(job)} />
          ))}
        </Box>
      )}

      <Dialog open={createOpen} onClose={() => setCreateOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle fontWeight={600} sx={{ color: '#111827' }}>New Service Request</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField id="j-vehicle" label="Vehicle Registration No." placeholder="e.g. GJ05PQ1234" value={createForm.vehicleId} onChange={e => setCreateForm(p => ({ ...p, vehicleId: e.target.value.toUpperCase() }))} fullWidth required />
            <TextField id="j-garage" label="Garage ID" value={createForm.garageId} onChange={e => setCreateForm(p => ({ ...p, garageId: e.target.value }))} fullWidth required />
            <TextField id="j-problem" label="Problem Description" value={createForm.problemDescription} onChange={e => setCreateForm(p => ({ ...p, problemDescription: e.target.value }))} fullWidth required multiline rows={3} />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setCreateOpen(false)} sx={{ color: '#6B7280' }}>Cancel</Button>
          <Button variant="contained" onClick={handleCreate} disabled={saving} sx={{ bgcolor: '#EA580C' }}>{saving ? <CircularProgress size={18} color="inherit" /> : 'Submit'}</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={assignOpen} onClose={() => setAssignOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle fontWeight={600} sx={{ color: '#111827' }}>Assign Mechanic</DialogTitle>
        <DialogContent>
          <TextField id="assign-mech" label="Mechanic User ID" value={mechanicId} onChange={e => setMechanicId(e.target.value)} fullWidth sx={{ mt: 1 }} />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setAssignOpen(false)} sx={{ color: '#6B7280' }}>Cancel</Button>
          <Button variant="contained" onClick={handleAssign} disabled={saving} sx={{ bgcolor: '#EA580C' }}>{saving ? <CircularProgress size={18} color="inherit" /> : 'Assign'}</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={statusOpen} onClose={() => setStatusOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle fontWeight={600} sx={{ color: '#111827' }}>Update Job Status</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 1 }}>
            <InputLabel>New Status</InputLabel>
            <Select id="status-select" value={newStatus} label="New Status" onChange={e => setNewStatus(e.target.value as JobStatus)}>
              {transitions.map(t => <MenuItem key={t} value={t}>{STATUS_LABELS[t]}</MenuItem>)}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setStatusOpen(false)} sx={{ color: '#6B7280' }}>Cancel</Button>
          <Button variant="contained" onClick={handleStatus} disabled={saving || !transitions.length} sx={{ bgcolor: '#EA580C' }}>{saving ? <CircularProgress size={18} color="inherit" /> : 'Update'}</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={estimateOpen} onClose={() => setEstimateOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle fontWeight={600} sx={{ color: '#111827' }}>Set Cost Estimate</DialogTitle>
        <DialogContent>
          <TextField id="estimate-input" label="Cost Estimate (Rs.)" type="number" value={estimate} onChange={e => setEstimate(e.target.value)} fullWidth sx={{ mt: 1 }} />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setEstimateOpen(false)} sx={{ color: '#6B7280' }}>Cancel</Button>
          <Button variant="contained" onClick={handleEstimate} disabled={saving} sx={{ bgcolor: '#EA580C' }}>{saving ? <CircularProgress size={18} color="inherit" /> : 'Save'}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
