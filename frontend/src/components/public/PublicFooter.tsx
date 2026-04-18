import React from 'react';
import { Link } from 'react-router-dom';
import { Wrench } from 'lucide-react';

const columns = [
  { title: 'Product', links: ['Features', 'Pricing', 'Integrations', 'Changelog'] },
  { title: 'Company', links: ['About Us', 'Careers', 'Contact', 'Partners'] },
  { title: 'Resources', links: ['Documentation', 'Help Center', 'Blog', 'API Docs'] },
  { title: 'Legal', links: ['Privacy Policy', 'Terms of Service', 'Cookie Policy'] }
];

export default function PublicFooter() {
  return (
    <footer className="public-footer">
      <div className="section-container">
        <div className="footer-grid">
          <div>
            <Link to="/" className="navbar-brand" style={{ textDecoration: 'none' }}>
              <div className="navbar-logo"><Wrench size={18} /></div>
              <span className="navbar-title" style={{ color: 'white' }}>Smart Garage Seva</span>
            </Link>
            <p className="footer-brand-text">
              The modern garage management platform built for Indian automotive businesses. Streamline operations, delight customers.
            </p>
          </div>
          {columns.map(col => (
            <div key={col.title}>
              <div className="footer-col-title">{col.title}</div>
              <ul className="footer-links">
                {col.links.map(link => (
                  <li key={link}><a href="#">{link}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="footer-bottom">
          <span className="footer-copyright">© 2024 Smart Garage Seva. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
