import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, Chip, CircularProgress, LinearProgress
} from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import BuildIcon from '@mui/icons-material/Build';
import InventoryIcon from '@mui/icons-material/Inventory';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { useAuth } from '../contexts/AuthContext';
import { vehicleService } from '../services/vehicleService';
import { jobService } from '../services/jobService';
import { inventoryService } from '../services/inventoryService';
import { notificationService } from '../services/notificationService';
import { Vehicle, ServiceJob, InventoryItem } from '../types';

function StatCard({ icon, label, value, color, sub }: {
  icon: React.ReactNode; label: string; value: string | number; color: string; sub?: string;
}) {
  return (
    <Paper elevation={0} sx={{ p: 2.5, borderRadius: '16px', position: 'relative', overflow: 'hidden', flex: '1 1 200px', minWidth: 0 }}>
      <Box sx={{
        position: 'absolute', top: -20, right: -20,
        width: 100, height: 100, borderRadius: '50%',
        background: color, opacity: 0.07
      }} />
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {label}
          </Typography>
          <Typography variant="h4" fontWeight={700} sx={{ color: '#f1f5f9', mt: 0.5, lineHeight: 1 }}>
            {value}
          </Typography>
          {sub && (
            <Typography variant="caption" sx={{ color: '#64748b', mt: 0.5, display: 'block' }}>
              {sub}
            </Typography>
          )}
        </Box>
        <Box sx={{
          width: 42, height: 42, borderRadius: '12px',
          background: color, opacity: 0.15,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
        }}>
          <Box sx={{ color }}>{icon}</Box>
        </Box>
      </Box>
    </Paper>
  );
}

function JobStatusBadge({ status }: { status: string }) {
  const map: Record<string, { color: 'success' | 'warning' | 'error' | 'info' | 'default'; label: string }> = {
    CREATED: { color: 'default', label: 'Created' },
    ASSIGNED: { color: 'info', label: 'Assigned' },
    IN_PROGRESS: { color: 'warning', label: 'In Progress' },
    COMPLETED: { color: 'success', label: 'Completed' },
    DELIVERED: { color: 'success', label: 'Delivered' }
  };
  const s = map[status] || { color: 'default', label: status };
  return <Chip label={s.label} color={s.color} size="small" />;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [jobs, setJobs] = useState<ServiceJob[]>([]);
  const [lowStock, setLowStock] = useState<InventoryItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [v, j, n] = await Promise.all([
          vehicleService.getMyVehicles(),
          jobService.getJobs(user?.garageId),
          notificationService.getUnreadCount()
        ]);
        setVehicles(v);
        setJobs(j);
        setUnreadCount(n);
        if (user?.role === 'ADMIN') {
          const ls = await inventoryService.getLowStock();
          setLowStock(ls);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  const activeJobs = jobs.filter(j => j.status !== 'DELIVERED');

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box className="page-container fade-in">
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={700} sx={{ color: '#f1f5f9' }}>
          Good morning, {user?.name?.split(' ')[0]}
        </Typography>
        <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>
          Here's what's happening at your garage today
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
        <StatCard icon={<DirectionsCarIcon />} label="My Vehicles" value={vehicles.length} color="#6366f1" sub="Registered vehicles" />
        <StatCard icon={<BuildIcon />} label="Active Jobs" value={activeJobs.length} color="#0ea5e9" sub="Pending completion" />
        <StatCard icon={<InventoryIcon />} label="Low Stock" value={lowStock.length} color="#f59e0b" sub="Items below threshold" />
        <StatCard icon={<NotificationsActiveIcon />} label="Notifications" value={unreadCount} color="#10b981" sub="Unread alerts" />
      </Box>

      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Paper elevation={0} sx={{ p: 2.5, borderRadius: '16px', flex: '2 1 400px', minWidth: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="subtitle1" fontWeight={600} sx={{ color: '#f1f5f9' }}>
              Recent Service Jobs
            </Typography>
            <TrendingUpIcon sx={{ color: '#64748b', fontSize: 20 }} />
          </Box>
          {jobs.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <BuildIcon sx={{ fontSize: 40, color: '#334155', mb: 1 }} />
              <Typography variant="body2" sx={{ color: '#64748b' }}>No service jobs yet</Typography>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {jobs.slice(0, 5).map(job => (
                <Box key={job._id} sx={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  p: 1.5, borderRadius: '10px', background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.05)'
                }}>
                  <Box>
                    <Typography variant="body2" fontWeight={500} sx={{ color: '#f1f5f9' }}>
                      {job.problemDescription.length > 45 ? job.problemDescription.slice(0, 45) + '…' : job.problemDescription}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748b' }}>
                      {new Date(job.createdAt || '').toLocaleDateString()}
                      {' · '}Rs. {job.costEstimate || '—'}
                    </Typography>
                  </Box>
                  <JobStatusBadge status={job.status} />
                </Box>
              ))}
            </Box>
          )}
        </Paper>

        <Paper elevation={0} sx={{ p: 2.5, borderRadius: '16px', flex: '1 1 280px', minWidth: 0 }}>
          <Typography variant="subtitle1" fontWeight={600} sx={{ color: '#f1f5f9', mb: 2 }}>
            Your Vehicles
          </Typography>
          {vehicles.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <DirectionsCarIcon sx={{ fontSize: 40, color: '#334155', mb: 1 }} />
              <Typography variant="body2" sx={{ color: '#64748b' }}>No vehicles registered</Typography>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {vehicles.slice(0, 4).map(v => (
                <Box key={v._id} sx={{
                  display: 'flex', alignItems: 'center', gap: 1.5,
                  p: 1.5, borderRadius: '10px', background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.05)'
                }}>
                  <Box sx={{
                    width: 36, height: 36, borderRadius: '8px',
                    background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(14,165,233,0.15))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                  }}>
                    <DirectionsCarIcon sx={{ fontSize: 18, color: '#818cf8' }} />
                  </Box>
                  <Box>
                    <Typography variant="body2" fontWeight={600} sx={{ color: '#f1f5f9' }}>
                      {v.brand} {v.modelName} ({v.year})
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748b' }}>
                      {v.registrationNumber} · {v.currentMileage.toLocaleString()} km
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        </Paper>
      </Box>

      {user?.role === 'ADMIN' && lowStock.length > 0 && (
        <Paper elevation={0} sx={{ p: 2.5, borderRadius: '16px', mt: 2 }}>
          <Typography variant="subtitle1" fontWeight={600} sx={{ color: '#f59e0b', mb: 2 }}>
            Low Stock Alerts
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {lowStock.map(item => (
              <Box key={item._id} sx={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                p: 1.5, borderRadius: '10px',
                background: 'rgba(245,158,11,0.05)',
                border: '1px solid rgba(245,158,11,0.15)'
              }}>
                <Box>
                  <Typography variant="body2" fontWeight={500} sx={{ color: '#f1f5f9' }}>{item.partName}</Typography>
                  <Typography variant="caption" sx={{ color: '#64748b' }}>Part #{item.partNumber} · Rs. {item.unitPrice}/unit</Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="body2" fontWeight={700} sx={{ color: '#f59e0b' }}>{item.quantity} left</Typography>
                  <LinearProgress variant="determinate" value={Math.min((item.quantity / item.lowStockThreshold) * 100, 100)} color="warning" sx={{ width: 80, mt: 0.5, borderRadius: 4 }} />
                </Box>
              </Box>
            ))}
          </Box>
        </Paper>
      )}
    </Box>
  );
}
