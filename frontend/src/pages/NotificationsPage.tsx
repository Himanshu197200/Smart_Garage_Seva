import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, List, ListItem, ListItemText, ListItemIcon,
  IconButton, Button, CircularProgress, Divider, Tooltip
} from '@mui/material';
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import DeleteIcon from '@mui/icons-material/Delete';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { notificationService } from '../services/notificationService';
import { Notification } from '../types';

const TYPE_COLORS: Record<string, string> = {
  JOB_STATUS_UPDATE: '#2563EB',
  SERVICE_REMINDER: '#3B82F6',
  LOW_INVENTORY_ALERT: '#D97706',
  RECOMMENDATION_ALERT: '#10B981',
  JOB_ASSIGNED: '#8B5CF6',
  PAYMENT_REMINDER: '#EF4444'
};

const TYPE_BG: Record<string, string> = {
  JOB_STATUS_UPDATE: '#EFF6FF',
  SERVICE_REMINDER: '#DBEAFE',
  LOW_INVENTORY_ALERT: '#FEF3C7',
  RECOMMENDATION_ALERT: '#D1FAE5',
  JOB_ASSIGNED: '#EDE9FE',
  PAYMENT_REMINDER: '#FEE2E2'
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try { setNotifications(await notificationService.getAll()); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const handleMarkRead = async (id: string) => {
    await notificationService.markAsRead(id);
    setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
  };

  const handleMarkAll = async () => {
    await notificationService.markAllAsRead();
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const handleDelete = async (id: string) => {
    await notificationService.delete(id);
    setNotifications(prev => prev.filter(n => n._id !== id));
  };

  const unread = notifications.filter(n => !n.isRead).length;

  return (
    <Box className="page-container fade-in">
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography sx={{ fontWeight: 700, fontSize: 24, color: '#111827' }}>Notifications</Typography>
          <Typography sx={{ color: '#6B7280', mt: 0.5, fontSize: 14 }}>
            {unread > 0 ? `${unread} unread` : 'All caught up'}
          </Typography>
        </Box>
        {unread > 0 && (
          <Button startIcon={<DoneAllIcon />} onClick={handleMarkAll} sx={{ color: '#2563EB' }}>
            Mark all as read
          </Button>
        )}
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>
      ) : notifications.length === 0 ? (
        <Paper elevation={0} sx={{ p: 6, textAlign: 'center', borderRadius: '8px' }}>
          <NotificationsOffIcon sx={{ fontSize: 56, color: '#D1D5DB', mb: 2 }} />
          <Typography sx={{ fontWeight: 600, fontSize: 18, color: '#6B7280' }}>No notifications yet</Typography>
        </Paper>
      ) : (
        <Paper elevation={0} sx={{ borderRadius: '8px', overflow: 'hidden' }}>
          <List disablePadding>
            {notifications.map((notification, index) => (
              <React.Fragment key={notification._id}>
                <ListItem
                  alignItems="flex-start"
                  sx={{
                    py: 2, px: 2.5,
                    background: notification.isRead ? '#FFFFFF' : '#EFF6FF',
                    '&:hover': { background: notification.isRead ? '#F9FAFB' : '#DBEAFE' },
                    transition: 'background 0.15s'
                  }}
                  secondaryAction={
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      {!notification.isRead && (
                        <Tooltip title="Mark as read">
                          <IconButton size="small" onClick={() => handleMarkRead(notification._id)} sx={{ color: '#9CA3AF', '&:hover': { color: '#2563EB' } }}>
                            <DoneAllIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      <Tooltip title="Delete">
                        <IconButton size="small" onClick={() => handleDelete(notification._id)} sx={{ color: '#9CA3AF', '&:hover': { color: '#EF4444' } }}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  }
                >
                  <ListItemIcon sx={{ minWidth: 32, mt: 0.5 }}>
                    {!notification.isRead ? (
                      <FiberManualRecordIcon sx={{ fontSize: 10, color: '#2563EB', mt: 0.75 }} />
                    ) : (
                      <Box sx={{ width: 10 }} />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Typography sx={{ fontWeight: notification.isRead ? 400 : 600, fontSize: 14, color: '#111827', flex: 1 }}>
                          {notification.message}
                        </Typography>
                        <Box sx={{
                          display: 'inline-flex', px: '8px', py: '2px',
                          borderRadius: '9999px', fontSize: 10, fontWeight: 500,
                          bgcolor: TYPE_BG[notification.type] || '#F3F4F6',
                          color: TYPE_COLORS[notification.type] || '#6B7280',
                          flexShrink: 0, whiteSpace: 'nowrap'
                        }}>
                          {notification.type.replace(/_/g, ' ')}
                        </Box>
                      </Box>
                    }
                    secondary={
                      <Typography sx={{ color: '#9CA3AF', fontSize: 12 }}>
                        {notification.createdAt ? new Date(notification.createdAt).toLocaleString() : ''}
                      </Typography>
                    }
                  />
                </ListItem>
                {index < notifications.length - 1 && <Divider sx={{ borderColor: '#E5E7EB' }} />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
}
