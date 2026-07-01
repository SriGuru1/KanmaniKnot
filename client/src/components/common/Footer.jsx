import React from 'react';

export default function Footer() {
  return (
    <footer style={{
      backgroundColor: '#1f191a',
      color: '#fdfbf7',
      padding: '48px 0 24px 0',
      marginTop: 'auto',
      borderTop: '3px solid var(--accent)'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '32px',
          marginBottom: '32px'
        }}>
          <div>
            <h3 style={{ color: 'var(--accent)', marginBottom: '16px', fontFamily: 'var(--font-heading)' }}>Sri Guru Kanmani Knots</h3>
            <p style={{ color: '#bbb3b4', fontSize: '0.9rem', lineHeight: '1.6' }}>
              Multi-tenant SaaS platform empowering local weavers and boutiques to showcase traditional designs, manage customized tassel variations, and accept orders with transparent tracking.
            </p>
          </div>
          <div>
            <h4 style={{ color: '#ffffff', marginBottom: '16px', fontFamily: 'var(--font-heading)' }}>Quick Links</h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '8px' }}><a href="/products" style={{ color: '#bbb3b4', fontSize: '0.9rem' }}>Browse Sarees</a></li>
              <li style={{ marginBottom: '8px' }}><a href="/cart" style={{ color: '#bbb3b4', fontSize: '0.9rem' }}>Shopping Cart</a></li>
              <li style={{ marginBottom: '8px' }}><a href="/login" style={{ color: '#bbb3b4', fontSize: '0.9rem' }}>Partner Sign In</a></li>
              <li style={{ marginBottom: '8px' }}><a href="/register" style={{ color: '#bbb3b4', fontSize: '0.9rem' }}>Register Weaving Unit</a></li>
            </ul>
          </div>
          <div>
            <h4 style={{ color: '#ffffff', marginBottom: '16px', fontFamily: 'var(--font-heading)' }}>Tassel Techniques</h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '8px', color: '#bbb3b4', fontSize: '0.9rem' }}>Royal Baby Kuchu Knotting</li>
              <li style={{ marginBottom: '8px', color: '#bbb3b4', fontSize: '0.9rem' }}>Double Zari Flower Knotting</li>
              <li style={{ marginBottom: '8px', color: '#bbb3b4', fontSize: '0.9rem' }}>Pearl Bead Crochet Work</li>
              <li style={{ marginBottom: '8px', color: '#bbb3b4', fontSize: '0.9rem' }}>Cascade Ring Bead Fringes</li>
            </ul>
          </div>
          <div>
            <h4 style={{ color: '#ffffff', marginBottom: '16px', fontFamily: 'var(--font-heading)' }}>Contact & Support</h4>
            <p style={{ color: '#bbb3b4', fontSize: '0.9rem', marginBottom: '8px' }}>
              Email: support@kanmaniknots.com
            </p>
            <p style={{ color: '#bbb3b4', fontSize: '0.9rem', marginBottom: '8px' }}>
              Phone: +91 98765 43210
            </p>
            <p style={{ color: '#bbb3b4', fontSize: '0.9rem' }}>
              Address: Jayanagar 4th Block, Bengaluru, KA, India
            </p>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid #362d2e',
          paddingTop: '24px',
          textAlign: 'center',
          fontSize: '0.8rem',
          color: '#8b8081'
        }}>
          &copy; {new Date().getFullYear()} Sri Guru Kanmani Knots (Saree Tassels SaaS). Made with ♥ for Indian Handloom Weavers.
        </div>
      </div>
    </footer>
  );
}
