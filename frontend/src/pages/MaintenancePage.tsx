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

const PRIORITY_STYLES: Record<string, { bg: string; color: string; chipColor: 'error' | 'warning' | 'info' }> = {
  HIGH: { bg: '#FEE2E2', color: '#991B1B', chipColor: 'error' },
  MEDIUM: { bg: '#FEF3C7', color: '#92400E', chipColor: 'warning' },
  LOW: { bg: '#FFEDD5', color: '#9A3412', chipColor: 'info' }
};

const PRIORITY_SCORE: Record<string, number> = { HIGH: 100, MEDIUM: 66, LOW: 33 };

function RecommendationCard({ rec }: { rec: Recommendation }) {
  const style = PRIORITY_STYLES[rec.priority] || PRIORITY_STYLES.LOW;
  return (
    <Box sx={{
      p: 2, borderRadius: '8px', mb: 1.5,
      border: '1px solid #E5E7EB',
      '&:hover': { bgcolor: '#F9FAFB' }, transition: 'background 0.15s'
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <Typography sx={{ fontWeight: 600, fontSize: 14, color: '#111827' }}>{rec.type.replace(/_/g, ' ')}</Typography>
        <Chip label={rec.priority} color={style.chipColor} size="small" />
      </Box>
      <Typography sx={{ color: '#6B7280', fontSize: 14, mb: 1 }}>{rec.message}</Typography>
      <Box>
        <Typography sx={{ color: '#9CA3AF', fontSize: 12 }}>Suggested Action</Typography>
        <Typography sx={{ color: '#10B981', fontSize: 12, fontWeight: 500 }}>{rec.suggestedAction}</Typography>
      </Box>
      <Box sx={{ mt: 1.5 }}>
        <Typography sx={{ color: '#9CA3AF', fontSize: 12, mb: 0.5 }}>Priority Level</Typography>
        <LinearProgress
          variant="determinate"
          value={PRIORITY_SCORE[rec.priority]}
          color={style.chipColor}
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
          <Typography sx={{ fontWeight: 700, fontSize: 24, color: '#111827' }}>Predictive Maintenance</Typography>
          <Typography sx={{ color: '#6B7280', mt: 0.5, fontSize: 14 }}>
            AI-powered maintenance recommendations for your fleet
          </Typography>
        </Box>
        {user?.role === 'ADMIN' && (
          <Button
            variant="contained"
            startIcon={<EngineeringIcon />}
            onClick={handleScan}
            disabled={scanning}
            sx={{ bgcolor: '#10B981', '&:hover': { bgcolor: '#059669' } }}
          >
            {scanning ? <CircularProgress size={18} color="inherit" /> : 'Run Full Scan'}
          </Button>
        )}
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}
      {scanMsg && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setScanMsg('')}>{scanMsg}</Alert>}

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
        <Paper elevation={0} sx={{ p: '20px', borderRadius: '8px', textAlign: 'center', flex: '1 1 180px' }}>
          <Typography sx={{ fontWeight: 700, fontSize: 36, color: '#EA580C' }}>{data.length}</Typography>
          <Typography sx={{ color: '#6B7280', fontSize: 14 }}>Vehicles Analysed</Typography>
        </Paper>
        <Paper elevation={0} sx={{ p: '20px', borderRadius: '8px', textAlign: 'center', flex: '1 1 180px' }}>
          <Typography sx={{ fontWeight: 700, fontSize: 36, color: '#D97706' }}>{totalRecs}</Typography>
          <Typography sx={{ color: '#6B7280', fontSize: 14 }}>Total Recommendations</Typography>
        </Paper>
        <Paper elevation={0} sx={{ p: '20px', borderRadius: '8px', textAlign: 'center', flex: '1 1 180px' }}>
          <Typography sx={{ fontWeight: 700, fontSize: 36, color: '#EF4444' }}>{highPri}</Typography>
          <Typography sx={{ color: '#6B7280', fontSize: 14 }}>High Priority Alerts</Typography>
        </Paper>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>
      ) : data.length === 0 ? (
        <Paper elevation={0} sx={{ p: 6, textAlign: 'center', borderRadius: '8px' }}>
          <EngineeringIcon sx={{ fontSize: 56, color: '#D1D5DB', mb: 2 }} />
          <Typography sx={{ fontWeight: 600, fontSize: 18, color: '#6B7280' }}>No recommendations at this time</Typography>
          <Typography sx={{ color: '#9CA3AF', mt: 1, fontSize: 14 }}>Your vehicles are in good health!</Typography>
        </Paper>
      ) : (
        <Box>
          {data.map((item, i) => (
            <Accordion
              key={i}
              defaultExpanded={i === 0}
              elevation={0}
              sx={{
                mb: 1.5, borderRadius: '8px !important', overflow: 'hidden',
                '&:before': { display: 'none' },
                border: '1px solid #E5E7EB'
              }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 2.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <DirectionsCarIcon sx={{ color: '#EA580C', fontSize: 20 }} />
                  <Typography sx={{ fontWeight: 600, fontSize: 15, color: '#111827' }}>
                    {item.vehicle}
                  </Typography>
                  <Box sx={{
                    display: 'inline-flex', px: '8px', py: '2px',
                    borderRadius: '9999px', bgcolor: '#FFEDD5', color: '#9A3412',
                    fontSize: 11, fontWeight: 500
                  }}>
                    {item.recommendations.length} recs
                  </Box>
                  {item.recommendations.some(r => r.priority === 'HIGH') && (
                    <Chip label="HIGH PRIORITY" color="error" size="small" />
                  )}
                </Box>
              </AccordionSummary>
              <AccordionDetails sx={{ px: 2.5, pb: 2.5 }}>
                {item.recommendations.length === 0 ? (
                  <Typography sx={{ color: '#6B7280', fontSize: 14 }}>No recommendations for this vehicle.</Typography>
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
