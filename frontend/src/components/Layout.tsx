import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Box, Drawer, List, ListItem, ListItemIcon, ListItemText, ListItemButton,
  AppBar, Toolbar, Typography, IconButton, Avatar, Tooltip, Divider, InputBase
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import BuildIcon from '@mui/icons-material/Build';
import InventoryIcon from '@mui/icons-material/Inventory';
import NotificationsIcon from '@mui/icons-material/Notifications';
import EngineeringIcon from '@mui/icons-material/Engineering';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { useAuth } from '../contexts/AuthContext';

const DRAWER_WIDTH = 248;

const navItems = [
  { label: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { label: 'Vehicles', icon: <DirectionsCarIcon />, path: '/vehicles' },
  { label: 'Service Jobs', icon: <BuildIcon />, path: '/service-jobs' },
  { label: 'Inventory', icon: <InventoryIcon />, path: '/inventory' },
  { label: 'Maintenance', icon: <EngineeringIcon />, path: '/maintenance' },
  { label: 'Notifications', icon: <NotificationsIcon />, path: '/notifications' }
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const currentPage = navItems.find(item => location.pathname === item.path)?.label || 'Dashboard';

  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('theme-dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('theme-dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ px: 2.5, py: 2.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box sx={{
          width: 36, height: 36, borderRadius: '8px',
          background: '#EA580C',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0
        }}>
          <BuildIcon sx={{ fontSize: 20, color: '#fff' }} />
        </Box>
        <Box>
          <Typography sx={{ color: '#F8FAFC', fontWeight: 700, fontSize: 15, lineHeight: 1.2 }}>
            Smart Garage
          </Typography>
          <Typography sx={{ color: '#94A3B8', fontSize: 11, fontWeight: 500, letterSpacing: '0.03em' }}>
            Seva Platform
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)', mx: 2 }} />

      <Box sx={{ px: 2, mt: 2, mb: 1 }}>
        <Typography sx={{ color: '#64748B', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', px: 0.5 }}>
          Menu
        </Typography>
      </Box>

      <List sx={{ px: 1.5, flex: 1 }}>
        {navItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.25 }}>
              <ListItemButton
                onClick={() => { navigate(item.path); setMobileOpen(false); }}
                sx={{
                  borderRadius: '6px',
                  py: 0.9,
                  px: 1.5,
                  borderLeft: active ? '3px solid #EA580C' : '3px solid transparent',
                  background: active ? 'rgba(37, 99, 235, 0.12)' : 'transparent',
                  '&:hover': {
                    background: active ? 'rgba(37, 99, 235, 0.15)' : 'rgba(255,255,255,0.06)'
                  },
                  transition: 'all 0.15s ease'
                }}
              >
                <ListItemIcon sx={{ minWidth: 34, color: active ? '#F97316' : '#94A3B8' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight: active ? 600 : 400,
                    fontSize: 13.5,
                    color: active ? '#F8FAFC' : '#CBD5E1'
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)', mx: 2 }} />
      <Box sx={{ px: 1.5, py: 2 }}>
        <Box sx={{
          display: 'flex', alignItems: 'center', gap: 1.5,
          p: 1.5, borderRadius: '8px',
          background: 'rgba(255,255,255,0.05)'
        }}>
          <Avatar sx={{
            width: 32, height: 32, bgcolor: '#EA580C',
            fontSize: 13, fontWeight: 700
          }}>
            {user?.name?.charAt(0).toUpperCase()}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography noWrap sx={{ color: '#F8FAFC', fontWeight: 600, fontSize: 13 }}>
              {user?.name}
            </Typography>
            <Typography sx={{ color: '#94A3B8', fontSize: 11 }}>
              {user?.role}
            </Typography>
          </Box>
          <Tooltip title="Logout">
            <IconButton size="small" onClick={logout} sx={{ color: '#94A3B8', '&:hover': { color: '#EF4444' } }}>
              <LogoutIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar
        position="fixed"
        className="dashboard-mobile-appbar"
        sx={{
          display: { sm: 'none' },
          background: '#1E293B',
          boxShadow: 'none',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          zIndex: (theme) => theme.zIndex.drawer + 1
        }}
      >
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={() => setMobileOpen(!mobileOpen)}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" fontWeight={700} sx={{ ml: 1, color: '#F8FAFC' }}>Smart Garage Seva</Typography>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { sm: DRAWER_WIDTH }, flexShrink: { sm: 0 } }}>
        <Drawer
          className="dashboard-drawer"
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH,
              bgcolor: '#1E293B',
              borderRight: 'none'
            }
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          className="dashboard-drawer"
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH,
              bgcolor: '#1E293B',
              borderRight: 'none'
            }
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        className="dashboard-main-content"
        sx={{
          flexGrow: 1,
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          mt: { xs: '56px', sm: 0 },
          minHeight: '100vh',
          bgcolor: '#F8FAFC',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Box className="dashboard-topbar" sx={{
          height: 64,
          bgcolor: '#FFFFFF',
          borderBottom: '1px solid #E5E7EB',
          display: { xs: 'none', sm: 'flex' },
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 3
        }}>
          <Typography sx={{ fontWeight: 600, fontSize: 16, color: '#111827' }}>
            {currentPage}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton onClick={() => setIsDark(!isDark)} sx={{ color: '#9CA3AF' }}>
              {isDark ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
            </IconButton>

            <Box className="dashboard-searchbar" sx={{
              display: 'flex', alignItems: 'center',
              gap: 0.75, bgcolor: '#F3F4F6',
              borderRadius: '8px', px: 1.5, py: 0.5
            }}>
              <SearchIcon sx={{ color: '#9CA3AF', fontSize: 18 }} />
              <InputBase
                placeholder="Search…"
                sx={{ fontSize: 13, color: '#111827', width: 200 }}
              />
            </Box>
          </Box>
        </Box>

        <Box sx={{ flex: 1, overflowX: 'hidden' }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
