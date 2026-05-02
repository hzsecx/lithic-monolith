import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import SampleRequestButton from '../common/SampleRequestButton';

export default function Layout() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/lefevef/admin');

  return (
    <div className="min-h-screen flex flex-col">
      {!isAdmin && <Navbar />}
      <main className="flex-1">
        <Outlet />
      </main>
      {!isAdmin && <Footer />}
      {!isAdmin && <SampleRequestButton />}
    </div>
  );
}