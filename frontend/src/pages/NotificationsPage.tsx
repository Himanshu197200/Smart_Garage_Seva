import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, List, ListItem, ListItemText, ListItemIcon,
  IconButton, Button, CircularProgress, Chip, Divider, Tooltip
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import DeleteIcon from '@mui/icons-material/Delete';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { notificationService } from '../services/notificationService';
import { Notification } from '../types';

const TYPE_COLORS: Record<string, string> = {
  JOB_STATUS_UPDATE: '#6366f1',
  SERVICE_REMINDER: '#0ea5e9',
  LOW_INVENTORY_ALERT: '#f59e0b',
  RECOMMENDATION_ALERT: '#10b981',
  JOB_ASSIGNED: '#8b5cf6',
  PAYMENT_REMINDER: '#ef4444'
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
          <Typography variant="h5" fontWeight={700} sx={{ color: '#f1f5f9' }}>Notifications</Typography>
          <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>
            {unread > 0 ? `${unread} unread` : 'All caught up'}
          </Typography>
        </Box>
        {unread > 0 && (
          <Button startIcon={<DoneAllIcon />} onClick={handleMarkAll} sx={{ color: '#818cf8' }}>
            Mark all as read
          </Button>
        )}
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>
      ) : notifications.length === 0 ? (
        <Paper elevation={0} sx={{ p: 6, textAlign: 'center', borderRadius: '16px' }}>
          <NotificationsOffIcon sx={{ fontSize: 56, color: '#334155', mb: 2 }} />
          <Typography variant="h6" sx={{ color: '#64748b' }}>No notifications yet</Typography>
        </Paper>
      ) : (
        <Paper elevation={0} sx={{ borderRadius: '16px', overflow: 'hidden' }}>
          <List disablePadding>
            {notifications.map((notification, index) => (
              <React.Fragment key={notification._id}>
                <ListItem
                  alignItems="flex-start"
                  sx={{
                    py: 2, px: 2.5,
                    background: notification.isRead ? 'transparent' : 'rgba(99,102,241,0.04)',
                    '&:hover': { background: 'rgba(255,255,255,0.03)' },
                    transition: 'background 0.2s'
                  }}
                  secondaryAction={
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      {!notification.isRead && (
                        <Tooltip title="Mark as read">
                          <IconButton size="small" onClick={() => handleMarkRead(notification._id)} sx={{ color: '#64748b', '&:hover': { color: '#818cf8' } }}>
                            <DoneAllIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      <Tooltip title="Delete">
                        <IconButton size="small" onClick={() => handleDelete(notification._id)} sx={{ color: '#64748b', '&:hover': { color: '#ef4444' } }}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  }
                >
                  <ListItemIcon sx={{ minWidth: 32, mt: 0.5 }}>
                    {!notification.isRead ? (
                      <FiberManualRecordIcon sx={{ fontSize: 10, color: '#6366f1', mt: 0.75 }} />
                    ) : (
                      <Box sx={{ width: 10 }} />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Typography variant="body2" fontWeight={notification.isRead ? 400 : 600} sx={{ color: '#f1f5f9', flex: 1 }}>
                          {notification.message}
                        </Typography>
                        <Chip
                          label={notification.type.replace(/_/g, ' ')}
                          size="small"
                          sx={{
                            bgcolor: `${TYPE_COLORS[notification.type] || '#64748b'}18`,
                            color: TYPE_COLORS[notification.type] || '#64748b',
                            fontSize: 10, height: 20, flexShrink: 0
                          }}
                        />
                      </Box>
                    }
                    secondary={
                      <Typography variant="caption" sx={{ color: '#64748b' }}>
                        {notification.createdAt ? new Date(notification.createdAt).toLocaleString() : ''}
                      </Typography>
                    }
                  />
                </ListItem>
                {index < notifications.length - 1 && <Divider sx={{ borderColor: 'rgba(255,255,255,0.04)' }} />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
}
