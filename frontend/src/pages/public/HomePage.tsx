import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Play, CheckCircle, Wrench, Package, Users,
  Bell, BarChart3, Shield, Sparkles, Star
} from 'lucide-react';

const features = [
  { icon: <Wrench size={24} />, title: 'Service Job Tracking', desc: 'Track jobs from creation to delivery with real-time status updates and seamless workflow management.', bg: '#EFF6FF', color: '#2563EB' },
  { icon: <Package size={24} />, title: 'Inventory Management', desc: 'Never run out of parts with smart low-stock alerts, automated tracking, and usage analytics.', bg: '#D1FAE5', color: '#059669' },
  { icon: <Users size={24} />, title: 'Customer Management', desc: 'Build lasting relationships with complete vehicle history, service records, and communication tools.', bg: '#EDE9FE', color: '#7C3AED' },
  { icon: <Bell size={24} />, title: 'Smart Notifications', desc: 'Stay updated with real-time alerts for job assignments, status changes, and low inventory warnings.', bg: '#FEF3C7', color: '#D97706' },
  { icon: <BarChart3 size={24} />, title: 'Predictive Maintenance', desc: 'AI-powered recommendations to predict service needs before breakdowns happen.', bg: '#DBEAFE', color: '#2563EB' },
  { icon: <Shield size={24} />, title: 'Role-Based Access', desc: 'Secure dashboards for Admins, Mechanics, and Customers — each with tailored views and permissions.', bg: '#FEE2E2', color: '#DC2626' }
];

const steps = [
  { num: '1', title: 'Register Your Garage', desc: 'Create your garage account in under two minutes. No credit card needed.' },
  { num: '2', title: 'Add Your Vehicles', desc: 'Register customer vehicles with Indian registration format and build service history.' },
  { num: '3', title: 'Manage Service Jobs', desc: 'Create jobs, assign mechanics, track progress, and deliver — all in one place.' }
];

const testimonials = [
  { text: 'Smart Garage Seva transformed how we operate. We saw 40% more efficiency in just the first month!', name: 'Rajesh K.', loc: 'AutoCare Workshop, Pune', init: 'RK' },
  { text: 'Finally, a software that understands how Indian garages work. The Hindi support is a game-changer.', name: 'Priya S.', loc: 'Priya Motors, Mumbai', init: 'PS' },
  { text: 'The predictive maintenance feature alone saved us lakhs in emergency repairs. Absolutely worth it.', name: 'Amit P.', loc: 'Royal Garage, Delhi', init: 'AP' }
];

const stats = [
  { value: '500+', label: 'Garages Trust Us' },
  { value: '10,000+', label: 'Vehicles Managed' },
  { value: '50,000+', label: 'Jobs Completed' },
  { value: '99.9%', label: 'Uptime' }
];

export default function HomePage() {
  return (
    <>
      <section className="hero-section">
        <div className="section-container">
          <div className="hero-badge">
            <Sparkles size={14} />
            Now with AI-Powered Predictive Maintenance
          </div>
          <h1 className="hero-headline">
            The Modern Way to<br />
            <span className="gradient-text">Manage Your Garage</span>
          </h1>
          <p className="hero-subheadline">
            Streamline operations, boost efficiency, and delight customers with
            Smart Garage Seva's all-in-one automotive service platform.
          </p>
          <div className="hero-cta-group">
            <Link to="/register" className="btn-primary-lg">
              Get Started Free <ArrowRight size={18} />
            </Link>
            <button className="btn-ghost-lg">
              <Play size={16} /> Watch Demo
            </button>
          </div>
          <div className="hero-trust">
            <span><CheckCircle size={14} color="#10B981" /> No credit card required</span>
            <span><CheckCircle size={14} color="#10B981" /> Free 14-day trial</span>
            <span><CheckCircle size={14} color="#10B981" /> Cancel anytime</span>
          </div>
          <div className="hero-image-wrap">
            <div style={{
              height: 400, background: 'linear-gradient(135deg, #1E293B, #334155)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'rgba(255,255,255,0.15)', fontSize: 80, fontWeight: 800,
              fontFamily: 'Plus Jakarta Sans, sans-serif', letterSpacing: -2
            }}>
              SGS
            </div>
          </div>
        </div>
      </section>

      <section className="logos-section">
        <div className="section-container">
          <div className="logos-title">Trusted by leading garages across India</div>
          <div className="logos-row">
            <span>AutoCare</span>
            <span>SpeedFix</span>
            <span>GarageOne</span>
            <span>TurboServ</span>
            <span>MotorHub</span>
            <span>FixMyRide</span>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="section-container">
          <div className="section-eyebrow">Features</div>
          <h2 className="section-headline">Everything you need to run your garage</h2>
          <p className="section-subtitle">One platform to manage jobs, inventory, and customers — designed specifically for Indian automotive businesses.</p>
          <div className="features-grid">
            {features.map(f => (
              <div key={f.title} className="feature-card">
                <div className="feature-icon" style={{ background: f.bg, color: f.color }}>{f.icon}</div>
                <div className="feature-title">{f.title}</div>
                <div className="feature-desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="how-section">
        <div className="section-container">
          <div className="section-eyebrow">How It Works</div>
          <h2 className="section-headline">Get started in 3 simple steps</h2>
          <p className="section-subtitle">From sign-up to your first service job in under 5 minutes.</p>
          <div className="steps-grid">
            {steps.map(s => (
              <div key={s.num} className="step-card">
                <div className="step-number">{s.num}</div>
                <div className="step-title">{s.title}</div>
                <div className="step-desc">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="stats-section">
        <div className="section-container">
          <div className="stats-grid">
            {stats.map(s => (
              <div key={s.label} className="stat-item">
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="testimonials-section">
        <div className="section-container">
          <div className="section-eyebrow">Testimonials</div>
          <h2 className="section-headline">Loved by garage owners across India</h2>
          <p className="section-subtitle">See what our customers have to say about transforming their business.</p>
          <div className="testimonials-grid">
            {testimonials.map(t => (
              <div key={t.name} className="testimonial-card">
                <div className="testimonial-quote">"</div>
                <p className="testimonial-text">{t.text}</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">{t.init}</div>
                  <div>
                    <div className="testimonial-name">{t.name}</div>
                    <div className="testimonial-loc">{t.loc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="section-container">
          <div className="cta-banner">
            <h2 className="cta-headline">Ready to transform your garage?</h2>
            <p className="cta-sub">Join 500+ garages already using Smart Garage Seva</p>
            <div className="cta-actions">
              <Link to="/register" className="btn-cta-primary">
                Get Started Free <ArrowRight size={18} />
              </Link>
              <Link to="/contact" className="btn-cta-ghost">
                Schedule a Demo
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
