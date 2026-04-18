import React from 'react';
import { Outlet } from 'react-router-dom';
import PublicNavbar from '../public/PublicNavbar';
import PublicFooter from '../public/PublicFooter';
import '../../styles/public.css';

export default function PublicLayout() {
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
