import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, Chip, CircularProgress, Button, Alert,
  Accordion, AccordionSummary, AccordionDetails, LinearProgress
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EngineeringIcon from '@mui/icons-material/Engineering';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Recommendation } from '../types';

interface VehicleRecs {
  vehicle: string;
  recommendations: Recommendation[];
}

const PRIORITY_COLORS: Record<string, 'error' | 'warning' | 'info'> = {
  HIGH: 'error',
  MEDIUM: 'warning',
  LOW: 'info'
};

const PRIORITY_SCORE: Record<string, number> = { HIGH: 100, MEDIUM: 66, LOW: 33 };

function RecommendationCard({ rec }: { rec: Recommendation }) {
  return (
    <Box sx={{
      p: 2, borderRadius: '12px', mb: 1.5,
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.06)'
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="body2" fontWeight={600} sx={{ color: '#f1f5f9' }}>{rec.type.replace(/_/g, ' ')}</Typography>
        <Chip label={rec.priority} color={PRIORITY_COLORS[rec.priority]} size="small" />
      </Box>
      <Typography variant="body2" sx={{ color: '#94a3b8', mb: 1 }}>{rec.message}</Typography>
      <Box>
        <Typography variant="caption" sx={{ color: '#64748b' }}>Suggested Action</Typography>
        <Typography variant="caption" sx={{ color: '#10b981', display: 'block' }}>{rec.suggestedAction}</Typography>
      </Box>
      <Box sx={{ mt: 1.5 }}>
        <Typography variant="caption" sx={{ color: '#64748b', mb: 0.5, display: 'block' }}>Priority Level</Typography>
        <LinearProgress
          variant="determinate"
          value={PRIORITY_SCORE[rec.priority]}
          color={PRIORITY_COLORS[rec.priority]}
          sx={{ borderRadius: 4, height: 4 }}
        />
      </Box>
    </Box>
  );
}

export default function MaintenancePage() {
  const { user } = useAuth();
  const [data, setData] = useState<VehicleRecs[]>([]);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [scanMsg, setScanMsg] = useState('');
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const res = await api.get('/maintenance/recommendations');
      setData(res.data.data || []);
    } catch (e: any) {
      setError(e.response?.data?.message || 'Failed to load recommendations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleScan = async () => {
    setScanning(true); setScanMsg('');
    try {
      const res = await api.post('/maintenance/scan');
      setScanMsg(res.data.message || 'Scan complete');
    } catch (e: any) {
      setError(e.response?.data?.message || 'Scan failed');
    } finally {
      setScanning(false);
    }
  };

  const totalRecs = data.reduce((acc, v) => acc + v.recommendations.length, 0);
  const highPri = data.reduce((acc, v) => acc + v.recommendations.filter(r => r.priority === 'HIGH').length, 0);

  return (
    <Box className="page-container fade-in">
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight={700} sx={{ color: '#f1f5f9' }}>Predictive Maintenance</Typography>
          <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>
            AI-powered maintenance recommendations for your fleet
          </Typography>
        </Box>
        {user?.role === 'ADMIN' && (
          <Button
            variant="contained"
            startIcon={<EngineeringIcon />}
            onClick={handleScan}
            disabled={scanning}
            sx={{ background: 'linear-gradient(135deg, #10b981, #059669)', boxShadow: '0 4px 16px rgba(16,185,129,0.4)' }}
          >
            {scanning ? <CircularProgress size={18} color="inherit" /> : 'Run Full Scan'}
          </Button>
        )}
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}
      {scanMsg && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setScanMsg('')}>{scanMsg}</Alert>}

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
        <Paper elevation={0} sx={{ p: 2.5, borderRadius: '16px', textAlign: 'center', flex: '1 1 180px' }}>
          <Typography variant="h3" fontWeight={700} sx={{ color: '#6366f1' }}>{data.length}</Typography>
          <Typography variant="body2" sx={{ color: '#64748b' }}>Vehicles Analysed</Typography>
        </Paper>
        <Paper elevation={0} sx={{ p: 2.5, borderRadius: '16px', textAlign: 'center', flex: '1 1 180px' }}>
          <Typography variant="h3" fontWeight={700} sx={{ color: '#f59e0b' }}>{totalRecs}</Typography>
          <Typography variant="body2" sx={{ color: '#64748b' }}>Total Recommendations</Typography>
        </Paper>
        <Paper elevation={0} sx={{ p: 2.5, borderRadius: '16px', textAlign: 'center', flex: '1 1 180px' }}>
          <Typography variant="h3" fontWeight={700} sx={{ color: '#ef4444' }}>{highPri}</Typography>
          <Typography variant="body2" sx={{ color: '#64748b' }}>High Priority Alerts</Typography>
        </Paper>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>
      ) : data.length === 0 ? (
        <Paper elevation={0} sx={{ p: 6, textAlign: 'center', borderRadius: '16px' }}>
          <EngineeringIcon sx={{ fontSize: 56, color: '#334155', mb: 2 }} />
          <Typography variant="h6" sx={{ color: '#64748b' }}>No recommendations at this time</Typography>
          <Typography variant="body2" sx={{ color: '#475569', mt: 1 }}>Your vehicles are in good health!</Typography>
        </Paper>
      ) : (
        <Box>
          {data.map((item, i) => (
            <Accordion
              key={i}
              defaultExpanded={i === 0}
              elevation={0}
              sx={{
                mb: 1.5, borderRadius: '16px !important', overflow: 'hidden',
                '&:before': { display: 'none' },
                border: '1px solid rgba(255,255,255,0.06)'
              }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 2.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <DirectionsCarIcon sx={{ color: '#818cf8', fontSize: 20 }} />
                  <Typography variant="subtitle1" fontWeight={600} sx={{ color: '#f1f5f9' }}>
                    {item.vehicle}
                  </Typography>
                  <Chip label={`${item.recommendations.length} recs`} size="small" sx={{ bgcolor: 'rgba(99,102,241,0.12)', color: '#818cf8' }} />
                  {item.recommendations.some(r => r.priority === 'HIGH') && (
                    <Chip label="HIGH PRIORITY" color="error" size="small" />
                  )}
                </Box>
              </AccordionSummary>
              <AccordionDetails sx={{ px: 2.5, pb: 2.5 }}>
                {item.recommendations.length === 0 ? (
                  <Typography variant="body2" sx={{ color: '#64748b' }}>No recommendations for this vehicle.</Typography>
                ) : (
                  item.recommendations.map((rec, j) => <RecommendationCard key={j} rec={rec} />)
                )}
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      )}
    </Box>
  );
}
