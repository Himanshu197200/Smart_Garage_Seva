import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Chip, IconButton, CircularProgress, Alert, Select, MenuItem,
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

const STATUS_COLORS: Record<string, 'default' | 'info' | 'warning' | 'success' | 'error'> = {
  CREATED: 'default',
  ASSIGNED: 'info',
  IN_PROGRESS: 'warning',
  COMPLETED: 'success',
  DELIVERED: 'success'
};

const STATUS_LABELS: Record<string, string> = {
  CREATED: 'Created',
  ASSIGNED: 'Assigned',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  DELIVERED: 'Delivered'
};

function JobCard({ job, onAssign, onStatusChange, onEstimate, userRole }: {
  job: ServiceJob;
  onAssign: () => void;
  onStatusChange: () => void;
  onEstimate: () => void;
  userRole: string;
}) {
  return (
    <Paper elevation={0} sx={{
      p: 2.5, borderRadius: '16px',
      border: '1px solid rgba(255,255,255,0.06)',
      transition: 'border-color 0.2s',
      '&:hover': { borderColor: 'rgba(99,102,241,0.25)' }
    }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1.5 }}>
        <Box>
          <Typography variant="caption" sx={{ color: '#64748b', fontFamily: 'monospace' }}>#{job._id.slice(-8)}</Typography>
          <Typography variant="body2" fontWeight={600} sx={{ color: '#f1f5f9', mt: 0.25 }}>
            {job.problemDescription.length > 60 ? job.problemDescription.slice(0, 60) + '…' : job.problemDescription}
          </Typography>
        </Box>
        <Chip label={STATUS_LABELS[job.status]} color={STATUS_COLORS[job.status]} size="small" />
      </Box>
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1.5 }}>
        <Typography variant="caption" sx={{ color: '#64748b' }}>
          Estimate: <strong style={{ color: '#f1f5f9' }}>Rs. {job.costEstimate || '—'}</strong>
        </Typography>
        <Typography variant="caption" sx={{ color: '#64748b' }}>·</Typography>
        <Typography variant="caption" sx={{ color: '#64748b' }}>
          {new Date(job.createdAt || '').toLocaleDateString()}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        {userRole === 'ADMIN' && job.status === 'CREATED' && (
          <Button size="small" startIcon={<AssignmentIndIcon />} variant="outlined" onClick={onAssign}
            sx={{ borderColor: 'rgba(99,102,241,0.4)', color: '#818cf8', fontSize: 12 }}>
            Assign
          </Button>
        )}
        {(userRole === 'ADMIN' || userRole === 'MECHANIC') && job.status !== 'DELIVERED' && (
          <Button size="small" startIcon={<ArrowForwardIcon />} variant="outlined" onClick={onStatusChange}
            sx={{ borderColor: 'rgba(14,165,233,0.4)', color: '#38bdf8', fontSize: 12 }}>
            Update Status
          </Button>
        )}
        {userRole === 'ADMIN' && (
          <Button size="small" startIcon={<PriceCheckIcon />} variant="outlined" onClick={onEstimate}
            sx={{ borderColor: 'rgba(16,185,129,0.4)', color: '#34d399', fontSize: 12 }}>
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
    try {
      const data = await jobService.getJobs(user?.garageId);
      setJobs(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async () => {
    setSaving(true); setError('');
    try {
      await jobService.create(createForm);
      setCreateOpen(false);
      load();
    } catch (e: any) {
      setError(e.response?.data?.message || 'Failed to create job');
    } finally { setSaving(false); }
  };

  const openAssign = (job: ServiceJob) => { setSelectedJob(job); setMechanicId(''); setAssignOpen(true); };
  const handleAssign = async () => {
    if (!selectedJob) return;
    setSaving(true);
    try { await jobService.assignMechanic(selectedJob._id, mechanicId); setAssignOpen(false); load(); }
    catch (e: any) { setError(e.response?.data?.message || 'Failed to assign'); }
    finally { setSaving(false); }
  };

  const openStatus = async (job: ServiceJob) => {
    setSelectedJob(job);
    const t = await jobService.getTransitions(job._id);
    setTransitions(t);
    if (t.length) setNewStatus(t[0]);
    setStatusOpen(true);
  };
  const handleStatus = async () => {
    if (!selectedJob) return;
    setSaving(true);
    try { await jobService.updateStatus(selectedJob._id, newStatus); setStatusOpen(false); load(); }
    catch (e: any) { setError(e.response?.data?.message || 'Failed to update status'); }
    finally { setSaving(false); }
  };

  const openEstimate = (job: ServiceJob) => { setSelectedJob(job); setEstimate(String(job.costEstimate || '')); setEstimateOpen(true); };
  const handleEstimate = async () => {
    if (!selectedJob) return;
    setSaving(true);
    try { await jobService.updateEstimate(selectedJob._id, Number(estimate)); setEstimateOpen(false); load(); }
    catch (e: any) { setError(e.response?.data?.message || 'Failed to update estimate'); }
    finally { setSaving(false); }
  };

  return (
    <Box className="page-container fade-in">
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight={700} sx={{ color: '#f1f5f9' }}>Service Jobs</Typography>
          <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>Track and manage all service requests</Typography>
        </Box>
        {user?.role === 'CUSTOMER' && (
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => { setCreateForm({ vehicleId: '', garageId: '', problemDescription: '' }); setError(''); setCreateOpen(true); }}
            sx={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', boxShadow: '0 4px 16px rgba(99,102,241,0.4)' }}>
            New Request
          </Button>
        )}
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>
      ) : jobs.length === 0 ? (
        <Paper elevation={0} sx={{ p: 6, textAlign: 'center', borderRadius: '16px' }}>
          <BuildIcon sx={{ fontSize: 56, color: '#334155', mb: 2 }} />
          <Typography variant="h6" fontWeight={600} sx={{ color: '#64748b' }}>No service jobs</Typography>
        </Paper>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2,1fr)' }, gap: 2 }}>
          {jobs.map(job => (
            <JobCard key={job._id} job={job} userRole={user?.role || ''} onAssign={() => openAssign(job)} onStatusChange={() => openStatus(job)} onEstimate={() => openEstimate(job)} />
          ))}
        </Box>
      )}

      <Dialog open={createOpen} onClose={() => setCreateOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '16px' } }}>
        <DialogTitle fontWeight={700}>New Service Request</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField id="j-vehicle" label="Vehicle ID" value={createForm.vehicleId} onChange={e => setCreateForm(p => ({ ...p, vehicleId: e.target.value }))} fullWidth required />
            <TextField id="j-garage" label="Garage ID" value={createForm.garageId} onChange={e => setCreateForm(p => ({ ...p, garageId: e.target.value }))} fullWidth required />
            <TextField id="j-problem" label="Problem Description" value={createForm.problemDescription} onChange={e => setCreateForm(p => ({ ...p, problemDescription: e.target.value }))} fullWidth required multiline rows={3} />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setCreateOpen(false)} sx={{ color: '#64748b' }}>Cancel</Button>
          <Button variant="contained" onClick={handleCreate} disabled={saving}>{saving ? <CircularProgress size={18} color="inherit" /> : 'Submit'}</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={assignOpen} onClose={() => setAssignOpen(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: '16px' } }}>
        <DialogTitle fontWeight={700}>Assign Mechanic</DialogTitle>
        <DialogContent>
          <TextField id="assign-mech" label="Mechanic User ID" value={mechanicId} onChange={e => setMechanicId(e.target.value)} fullWidth sx={{ mt: 1 }} />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setAssignOpen(false)} sx={{ color: '#64748b' }}>Cancel</Button>
          <Button variant="contained" onClick={handleAssign} disabled={saving}>{saving ? <CircularProgress size={18} color="inherit" /> : 'Assign'}</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={statusOpen} onClose={() => setStatusOpen(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: '16px' } }}>
        <DialogTitle fontWeight={700}>Update Job Status</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 1 }}>
            <InputLabel>New Status</InputLabel>
            <Select id="status-select" value={newStatus} label="New Status" onChange={e => setNewStatus(e.target.value as JobStatus)}>
              {transitions.map(t => <MenuItem key={t} value={t}>{STATUS_LABELS[t]}</MenuItem>)}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setStatusOpen(false)} sx={{ color: '#64748b' }}>Cancel</Button>
          <Button variant="contained" onClick={handleStatus} disabled={saving || !transitions.length}>{saving ? <CircularProgress size={18} color="inherit" /> : 'Update'}</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={estimateOpen} onClose={() => setEstimateOpen(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: '16px' } }}>
        <DialogTitle fontWeight={700}>Set Cost Estimate</DialogTitle>
        <DialogContent>
          <TextField id="estimate-input" label="Cost Estimate (Rs.)" type="number" value={estimate} onChange={e => setEstimate(e.target.value)} fullWidth sx={{ mt: 1 }} />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setEstimateOpen(false)} sx={{ color: '#64748b' }}>Cancel</Button>
          <Button variant="contained" onClick={handleEstimate} disabled={saving}>{saving ? <CircularProgress size={18} color="inherit" /> : 'Save'}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
