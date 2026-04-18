import React, { useState } from 'react';
import { MapPin, Mail, Phone, Clock, Send } from 'lucide-react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thank you for your message. We will get back to you shortly.');
    setForm({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  return (
    <>
      <section className="page-hero" style={{ paddingBottom: 80 }}>
        <div className="section-container">
          <div className="section-eyebrow">Contact Us</div>
          <h1 className="page-hero-title">Get in Touch</h1>
          <p className="page-hero-sub">We'd love to hear from you. Our team is always here to chat.</p>
        </div>
      </section>

      <section className="contact-section">
        <div className="section-container">
          <div className="contact-grid">
            <div>
              <div className="contact-info-card">
                <div className="contact-info-icon"><MapPin size={20} /></div>
                <div>
                  <div className="contact-info-label">Address</div>
                  <div className="contact-info-value">Hinjewadi Tech Park<br />Pune, Maharashtra 411057<br />India</div>
                </div>
              </div>

              <div className="contact-info-card">
                <div className="contact-info-icon"><Mail size={20} /></div>
                <div>
                  <div className="contact-info-label">Email</div>
                  <div className="contact-info-value">hello@smartgarageseva.com<br />support@smartgarageseva.com</div>
                </div>
              </div>

              <div className="contact-info-card">
                <div className="contact-info-icon"><Phone size={20} /></div>
                <div>
                  <div className="contact-info-label">Phone</div>
                  <div className="contact-info-value">+91 98765 43210<br />+91 12345 67890</div>
                </div>
              </div>

              <div className="contact-info-card">
                <div className="contact-info-icon"><Clock size={20} /></div>
                <div>
                  <div className="contact-info-label">Hours</div>
                  <div className="contact-info-value">Mon - Sat: 9:00 AM - 6:00 PM<br />Sunday: Closed</div>
                </div>
              </div>
            </div>

            <div className="contact-form">
              <h3 style={{ fontSize: 24, fontWeight: 700, color: '#0F172A', marginBottom: 24 }}>Send us a message</h3>
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="John Doe" />
                  </div>
                  <div className="form-group">
                    <label>Email Address *</label>
                    <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="john@example.com" />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+91 98765 43210" />
                  </div>
                  <div className="form-group">
                    <label>Subject</label>
                    <select value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}>
                      <option value="">Select a subject...</option>
                      <option value="sales">Sales Inquiry</option>
                      <option value="support">Technical Support</option>
                      <option value="partnership">Partnership</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>Message *</label>
                  <textarea required value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="How can we help you?"></textarea>
                </div>
                <button type="submit" className="btn-submit">
                  Send Message <Send size={16} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
