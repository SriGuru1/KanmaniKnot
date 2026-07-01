import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout({ children }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      backgroundColor: 'var(--bg-main)'
    }}>
      <Navbar />
      <main style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column'
      }}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
