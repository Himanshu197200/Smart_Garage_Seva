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

function StatCard({ icon, label, value, color, bg, sub }: {
  icon: React.ReactNode; label: string; value: string | number; color: string; bg: string; sub?: string;
}) {
  return (
    <Paper elevation={0} sx={{
      p: '20px 24px', borderRadius: '8px',
      position: 'relative', overflow: 'hidden',
      flex: '1 1 200px', minWidth: 0,
      transition: 'all 0.15s ease',
      '&:hover': { borderColor: '#D1D5DB', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }
    }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <Box>
          <Typography sx={{ color: '#6B7280', fontWeight: 500, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {label}
          </Typography>
          <Typography sx={{ color: '#111827', mt: 0.5, lineHeight: 1, fontWeight: 700, fontSize: 28 }}>
            {value}
          </Typography>
          {sub && (
            <Typography sx={{ color: '#9CA3AF', mt: 0.5, display: 'block', fontSize: 12 }}>
              {sub}
            </Typography>
          )}
        </Box>
        <Box sx={{
          width: 40, height: 40, borderRadius: '8px',
          background: bg,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
        }}>
          <Box sx={{ color, display: 'flex' }}>{icon}</Box>
        </Box>
      </Box>
    </Paper>
  );
}

function JobStatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; color: string; dot: string; label: string }> = {
    CREATED: { bg: '#F3F4F6', color: '#4B5563', dot: '#6B7280', label: 'Created' },
    ASSIGNED: { bg: '#DBEAFE', color: '#1E40AF', dot: '#2563EB', label: 'Assigned' },
    IN_PROGRESS: { bg: '#FEF3C7', color: '#92400E', dot: '#F59E0B', label: 'In Progress' },
    COMPLETED: { bg: '#D1FAE5', color: '#065F46', dot: '#10B981', label: 'Completed' },
    DELIVERED: { bg: '#EDE9FE', color: '#5B21B6', dot: '#8B5CF6', label: 'Delivered' }
  };
  const s = map[status] || { bg: '#F3F4F6', color: '#4B5563', dot: '#6B7280', label: status };
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
        <Typography sx={{ fontWeight: 700, fontSize: 24, color: '#111827' }}>
          Welcome back, {user?.name?.split(' ')[0]}
        </Typography>
        <Typography sx={{ color: '#6B7280', mt: 0.5, fontSize: 14 }}>
          Here's what's happening at your garage today
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
        <StatCard icon={<DirectionsCarIcon />} label="My Vehicles" value={vehicles.length} color="#2563EB" bg="#EFF6FF" sub="Registered vehicles" />
        <StatCard icon={<BuildIcon />} label="Active Jobs" value={activeJobs.length} color="#3B82F6" bg="#DBEAFE" sub="Pending completion" />
        <StatCard icon={<InventoryIcon />} label="Low Stock" value={lowStock.length} color="#F59E0B" bg="#FEF3C7" sub="Items below threshold" />
        <StatCard icon={<NotificationsActiveIcon />} label="Notifications" value={unreadCount} color="#10B981" bg="#D1FAE5" sub="Unread alerts" />
      </Box>

      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Paper elevation={0} sx={{ p: '20px', borderRadius: '8px', flex: '2 1 400px', minWidth: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography sx={{ fontWeight: 600, fontSize: 16, color: '#111827' }}>
              Recent Service Jobs
            </Typography>
            <TrendingUpIcon sx={{ color: '#9CA3AF', fontSize: 20 }} />
          </Box>
          {jobs.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <BuildIcon sx={{ fontSize: 40, color: '#D1D5DB', mb: 1 }} />
              <Typography sx={{ color: '#6B7280', fontSize: 14 }}>No service jobs yet</Typography>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {jobs.slice(0, 5).map(job => (
                <Box key={job._id} sx={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  p: 1.5, borderRadius: '6px', border: '1px solid #E5E7EB',
                  '&:hover': { bgcolor: '#F9FAFB' }, transition: 'background 0.15s'
                }}>
                  <Box>
                    <Typography sx={{ fontWeight: 500, fontSize: 14, color: '#111827' }}>
                      {job.problemDescription.length > 45 ? job.problemDescription.slice(0, 45) + '…' : job.problemDescription}
                    </Typography>
                    <Typography sx={{ color: '#9CA3AF', fontSize: 12 }}>
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

        <Paper elevation={0} sx={{ p: '20px', borderRadius: '8px', flex: '1 1 280px', minWidth: 0 }}>
          <Typography sx={{ fontWeight: 600, fontSize: 16, color: '#111827', mb: 2 }}>
            Your Vehicles
          </Typography>
          {vehicles.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <DirectionsCarIcon sx={{ fontSize: 40, color: '#D1D5DB', mb: 1 }} />
              <Typography sx={{ color: '#6B7280', fontSize: 14 }}>No vehicles registered</Typography>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {vehicles.slice(0, 4).map(v => (
                <Box key={v._id} sx={{
                  display: 'flex', alignItems: 'center', gap: 1.5,
                  p: 1.5, borderRadius: '6px', border: '1px solid #E5E7EB',
                  '&:hover': { bgcolor: '#F9FAFB' }, transition: 'background 0.15s'
                }}>
                  <Box sx={{
                    width: 36, height: 36, borderRadius: '8px',
                    background: '#EFF6FF',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                  }}>
                    <DirectionsCarIcon sx={{ fontSize: 18, color: '#2563EB' }} />
                  </Box>
                  <Box>
                    <Typography sx={{ fontWeight: 600, fontSize: 14, color: '#111827' }}>
                      {v.brand} {v.modelName} ({v.year})
                    </Typography>
                    <Typography sx={{ color: '#9CA3AF', fontSize: 12 }}>
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
        <Paper elevation={0} sx={{ p: '20px', borderRadius: '8px', mt: 2 }}>
          <Typography sx={{ fontWeight: 600, fontSize: 16, color: '#92400E', mb: 2 }}>
            Low Stock Alerts
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {lowStock.map(item => (
              <Box key={item._id} sx={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                p: 1.5, borderRadius: '6px',
                background: '#FFFBEB',
                border: '1px solid #FDE68A'
              }}>
                <Box>
                  <Typography sx={{ fontWeight: 500, fontSize: 14, color: '#111827' }}>{item.partName}</Typography>
                  <Typography sx={{ color: '#9CA3AF', fontSize: 12 }}>Part #{item.partNumber} · Rs. {item.unitPrice}/unit</Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography sx={{ fontWeight: 700, fontSize: 14, color: '#D97706' }}>{item.quantity} left</Typography>
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
