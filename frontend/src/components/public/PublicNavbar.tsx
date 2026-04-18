import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Wrench, Menu, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const links = [
  { label: 'Home', path: '/' },
  { label: 'Services', path: '/services' },
  { label: 'Pricing', path: '/pricing' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' }
];

export default function PublicNavbar() {
  const { pathname } = useLocation();
  const { isAuthenticated } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handle);
    return () => window.removeEventListener('scroll', handle);
  }, []);

  return (
    <nav className={`public-navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <div className="navbar-logo"><Wrench size={18} /></div>
          <span className="navbar-title">Smart Garage Seva</span>
        </Link>

        <ul className="navbar-links">
          {links.map(l => (
            <li key={l.path}>
              <Link to={l.path} className={`nav-link ${pathname === l.path ? 'active' : ''}`}>
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="navbar-actions">
          {isAuthenticated ? (
            <Link to="/dashboard" className="btn-get-started">Dashboard →</Link>
          ) : (
            <>
              <Link to="/login" className="btn-nav-login">Log in</Link>
              <Link to="/register" className="btn-get-started">Get Started →</Link>
            </>
          )}
        </div>

        <button className="mobile-menu-btn" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileOpen && (
        <div style={{
          position: 'absolute', top: 72, left: 0, right: 0,
          background: 'white', borderBottom: '1px solid #E2E8F0',
          padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 8
        }}>
          {links.map(l => (
            <Link key={l.path} to={l.path} className="nav-link" onClick={() => setMobileOpen(false)}>
              {l.label}
            </Link>
          ))}
          <Link to="/login" className="nav-link" onClick={() => setMobileOpen(false)}>Log in</Link>
          <Link to="/register" className="btn-get-started" onClick={() => setMobileOpen(false)} style={{ justifyContent: 'center' }}>Get Started →</Link>
        </div>
      )}
    </nav>
  );
}
