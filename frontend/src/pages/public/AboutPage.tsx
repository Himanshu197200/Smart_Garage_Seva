import React from 'react';
import { Shield, Target, Lightbulb, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const timeline = [
  { year: '2023', title: 'The Garage Problem', desc: 'We noticed independent Indian garages struggling with paper job cards, untracked inventory, and frustrated customers. The existing software was designed for Western markets and didn\'t fit Indian workflows.' },
  { year: '2023', title: 'The First Prototype', desc: 'We spent 3 months sitting in garages in Pune and Mumbai, building the first version of Smart Garage Seva alongside actual mechanics and garage owners.' },
  { year: '2024', title: 'Launch & Growth', desc: 'We officially launched. Within 6 months, over 500 garages across India adopted our platform. We introduced AI-powered predictive maintenance the same year.' }
];

const values = [
  { icon: <Shield size={28} />, title: 'Reliability', desc: 'Garages depend on us to run their business. We ensure 99.9% uptime and bulletproof data security.' },
  { icon: <Target size={28} />, title: 'Customer First', desc: 'Every feature we build starts with a conversation with a garage owner or mechanic. We build for them.' },
  { icon: <Lightbulb size={28} />, title: 'Innovation', desc: 'We bring enterprise-grade technology (like AI predictive maintenance) to small independent garages.' }
];

export default function AboutPage() {
  return (
    <>
      <section className="about-hero">
        <div className="section-container">
          <div className="section-eyebrow">Our Story</div>
          <h1 className="page-hero-title">Built for Indian Garages,<br />by People Who Understand</h1>
          <p className="page-hero-sub">We're on a mission to organize the unstructured Indian automotive service sector through accessible, powerful technology.</p>
        </div>
      </section>

      <section className="timeline-section">
        <div className="section-container" style={{ maxWidth: 800 }}>
          <h2 className="section-headline" style={{ marginBottom: 48 }}>Our Journey</h2>
          <div className="timeline">
            {timeline.map(item => (
              <div key={item.year} className="timeline-item">
                <div className="timeline-year">{item.year}</div>
                <div className="timeline-content">
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="section-container">
          <h2 className="section-headline">Our Values</h2>
          <div className="values-grid">
            {values.map(v => (
              <div key={v.title} className="value-card">
                <div className="value-icon">{v.icon}</div>
                <div className="value-title">{v.title}</div>
                <div className="value-desc">{v.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="section-container">
          <div className="cta-banner">
            <h2 className="cta-headline">Join our growing team</h2>
            <p className="cta-sub">We're always looking for passionate engineers, designers, and automotive experts.</p>
            <div className="cta-actions">
              <Link to="/contact" className="btn-cta-primary">Contact Us <ArrowRight size={18} /></Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
