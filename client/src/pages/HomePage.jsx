import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/common/Layout';

export default function HomePage() {
  return (
    <Layout>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #421217 0%, #1f080a 100%)',
        color: '#fdfbf7',
        padding: '80px 0',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.1,
          backgroundImage: 'radial-gradient(var(--accent) 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}></div>
        
        <div className="container" style={{ position: 'relative', zIndex: 1, maxWidth: '800px' }}>
          <span style={{
            color: 'var(--accent)',
            textTransform: 'uppercase',
            letterSpacing: '3px',
            fontSize: '0.9rem',
            fontWeight: 700,
            display: 'block',
            marginBottom: '16px'
          }}>Digitizing Handloom Heritage</span>
          
          <h1 style={{
            fontSize: '3.5rem',
            color: '#ffffff',
            fontFamily: 'var(--font-heading)',
            fontWeight: 800,
            lineHeight: 1.15,
            marginBottom: '24px',
            textShadow: '0 4px 12px rgba(0,0,0,0.5)'
          }}>
            Every Saree Tells a Story. We Knot the Perfect Finish.
          </h1>
          
          <p style={{
            fontSize: '1.2rem',
            color: '#e2d6d7',
            marginBottom: '40px',
            lineHeight: 1.6
          }}>
            Sri Guru Kanmani Knots is the world's premier multi-tenant platform for saree weavers, designers, and boutiques. Digitally catalog your collections, configure custom tassel varieties, and connect with global saree connoisseurs.
          </p>
          
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '16px',
            flexWrap: 'wrap'
          }}>
            <Link to="/products" className="btn btn-accent" style={{ padding: '14px 28px', fontSize: '1.05rem' }}>
              Explore Sarees Collection
            </Link>
            <Link to="/register" className="btn btn-secondary" style={{
              padding: '14px 28px',
              fontSize: '1.05rem',
              color: '#ffffff',
              borderColor: '#ffffff'
            }}>
              Register Weaving Unit
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Counter Bar */}
      <section style={{
        background: 'var(--bg-card)',
        padding: '24px 0',
        borderBottom: '1px solid var(--border)'
      }}>
        <div className="container" style={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '24px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-heading)' }}>50+</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Weaving Communities</div>
          </div>
          <div style={{ width: '1px', height: '40px', backgroundColor: 'var(--border)' }}></div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-heading)' }}>10,000+</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Custom Sarees Cataloged</div>
          </div>
          <div style={{ width: '1px', height: '40px', backgroundColor: 'var(--border)' }}></div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-heading)' }}>12+</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Traditional Tassel Crafts</div>
          </div>
          <div style={{ width: '1px', height: '40px', backgroundColor: 'var(--border)' }}></div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-heading)' }}>99.8%</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Weave Integrity Rating</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '80px 0', backgroundColor: '#faf6f0' }}>
        <div className="container">
          <div className="luxury-title-center">
            <span style={{ textTransform: 'uppercase', color: 'var(--primary)', letterSpacing: '2px', fontSize: '0.8rem', fontWeight: 700 }}>Exclusive Tech-Heritage Stack</span>
            <h2 style={{ fontSize: '2.2rem', marginTop: '8px' }}>Crafting Saree Retail of the Future</h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '32px',
            marginTop: '16px'
          }}>
            <div className="card" style={{ padding: '32px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: 'rgba(114, 47, 55, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary)',
                marginBottom: '20px'
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              </div>
              <h3 style={{ marginBottom: '12px', fontSize: '1.25rem' }}>Tenant Isolation Security</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                Each saree boutique and weaving cooperative operates on a fully isolated virtual tenant slice, securing proprietary weaving configurations and customer databases.
              </p>
            </div>

            <div className="card" style={{ padding: '32px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: 'rgba(212, 175, 55, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-dark)',
                marginBottom: '20px'
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <h3 style={{ marginBottom: '12px', fontSize: '1.25rem' }}>Multi-Variant Configuration</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                Weavers can map multi-layered variations such as crochet styles, bead configurations, silk weight, zari types (pure/tested), and saree length combinations.
              </p>
            </div>

            <div className="card" style={{ padding: '32px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: 'rgba(114, 47, 55, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary)',
                marginBottom: '20px'
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="20" x2="18" y2="10"></line>
                  <line x1="12" y1="20" x2="12" y2="4"></line>
                  <line x1="6" y1="20" x2="6" y2="14"></line>
                </svg>
              </div>
              <h3 style={{ marginBottom: '12px', fontSize: '1.25rem' }}>Weave-to-Order Analytics</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                Comprehensive dashboards for weavers and shop owners to monitor order flows, demand by tassel categories, revenue growth, and seasonal weaving performance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Highlight Showcase Section */}
      <section style={{ padding: '80px 0', backgroundColor: 'var(--bg-card)' }}>
        <div className="container" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '64px',
          flexWrap: 'wrap'
        }}>
          <div style={{ flex: '1 1 450px' }}>
            <img src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80" alt="Authentic Kanchipuram Weaving" style={{
              width: '100%',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-lg)'
            }} />
          </div>
          <div style={{ flex: '1 2 450px' }}>
            <span style={{ color: 'var(--accent-dark)', fontWeight: 700, letterSpacing: '2px', fontSize: '0.85rem', textTransform: 'uppercase' }}>Tassel Knotting Artistry</span>
            <h2 style={{ fontSize: '2.5rem', margin: '8px 0 20px 0', color: 'var(--primary-dark)' }}>Traditional Kanmani Knots Made Modern</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '20px', fontSize: '1.05rem', lineHeight: '1.7' }}>
              Tassel work (kuchu) is more than an adornment; it is an age-old craft requiring immense precision. Hand-weaving silk threads, matching beads, and tying complex knots takes hours of skilled labor.
            </p>
            <p style={{ color: 'var(--text-muted)', marginBottom: '32px', fontSize: '1.05rem', lineHeight: '1.7' }}>
              Our platform allows customers to select exact tassel styles (like Royal Kuchu, Ring Ring Crochet, or Double Zari Flowers) when checking out. Weavers receive these specifications instantly on their order management boards, ensuring perfect synchronization.
            </p>
            <Link to="/products" className="btn btn-primary" style={{ padding: '12px 24px' }}>
              View Sarees & Customize Tassels
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
