import React from 'react';
import { Link } from 'react-router-dom';
import {
  Wrench, Package, Users, Bell, BarChart3, Shield,
  ArrowRight, Zap, Settings, TrendingUp
} from 'lucide-react';

const services = [
  { icon: <Wrench size={24} />, title: 'Job Card Management', desc: 'Track every job through its full lifecycle — from CREATED to ASSIGNED, IN_PROGRESS, COMPLETED, and DELIVERED. Full transparency for every stakeholder.', bg: '#FFF7ED', color: '#EA580C' },
  { icon: <Package size={24} />, title: 'Inventory Control', desc: 'Real-time stock tracking with automatic low-stock alerts. Know exactly which parts are available and when to reorder.', bg: '#D1FAE5', color: '#059669' },
  { icon: <Users size={24} />, title: 'Vehicle Registration & History', desc: 'Register vehicles with Indian registration format (GJ05PQ1234). Maintain complete service history for every vehicle.', bg: '#EDE9FE', color: '#7C3AED' },
  { icon: <Settings size={24} />, title: 'Mechanic Assignment', desc: 'Assign jobs to available mechanics, track workload distribution, and manage mechanic availability in real-time.', bg: '#FEF3C7', color: '#D97706' },
  { icon: <Bell size={24} />, title: 'Smart Notifications', desc: 'Automated alerts for job status updates, low inventory warnings, service reminders, and payment notifications.', bg: '#FFEDD5', color: '#EA580C' },
  { icon: <TrendingUp size={24} />, title: 'Predictive Maintenance', desc: 'AI-powered engine analyzes mileage patterns and service history to predict when vehicles need maintenance — before breakdowns occur.', bg: '#FEE2E2', color: '#DC2626' },
  { icon: <BarChart3 size={24} />, title: 'Reports & Analytics', desc: 'Comprehensive dashboards showing job statistics, revenue metrics, inventory turnover, and mechanic performance.', bg: '#FFEDD5', color: '#EA580C' },
  { icon: <Shield size={24} />, title: 'Multi-Role Access Control', desc: 'Three distinct dashboards for Admins, Mechanics, and Customers — each with tailored views and appropriate permissions.', bg: '#FFF7ED', color: '#9A3412' },
  { icon: <Zap size={24} />, title: 'RESTful API', desc: 'Full API access for integrations with accounting software, CRM systems, and custom applications. Built with Express.js and TypeScript.', bg: '#FEF3C7', color: '#D97706' }
];

export default function ServicesPage() {
  return (
    <>
      <section className="page-hero">
        <div className="section-container">
          <div className="section-eyebrow">Our Services</div>
          <h1 className="page-hero-title">Everything Your Garage Needs</h1>
          <p className="page-hero-sub">A comprehensive suite of tools designed specifically for Indian automotive service businesses.</p>
        </div>
      </section>

      <section className="features-section" style={{ paddingTop: 60 }}>
        <div className="section-container">
          <div className="features-grid">
            {services.map(s => (
              <div key={s.title} className="feature-card">
                <div className="feature-icon" style={{ background: s.bg, color: s.color }}>{s.icon}</div>
                <div className="feature-title">{s.title}</div>
                <div className="feature-desc">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="section-container">
          <div className="cta-banner">
            <h2 className="cta-headline">Start managing your garage smarter</h2>
            <p className="cta-sub">All features included in every plan. No feature gating.</p>
            <div className="cta-actions">
              <Link to="/register" className="btn-cta-primary">Get Started Free <ArrowRight size={18} /></Link>
              <Link to="/pricing" className="btn-cta-ghost">View Pricing</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
