import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import PublicNavbar from '../public/PublicNavbar';
import PublicFooter from '../public/PublicFooter';
import '../../styles/public.css';

export default function PublicLayout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="public-page">
      <PublicNavbar />
      <main>
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  );
}
