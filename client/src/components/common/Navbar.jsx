import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../../store/slices/authSlice';
import { clearCart } from '../../store/slices/cartSlice';

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { user } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);
  
  const cartCount = items.reduce((sum, item) => sum + item.qty, 0);

  const handleLogout = () => {
    dispatch(logoutUser());
    dispatch(clearCart());
    navigate('/products');
  };

  return (
    <nav className="glass" style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      padding: '12px 0',
      boxShadow: 'var(--shadow-sm)',
      borderBottom: '1px solid var(--border)'
    }}>
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: 'var(--primary)' }}>
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 800,
              fontSize: '1.25rem',
              color: 'var(--primary)',
              lineHeight: 1.1,
              letterSpacing: '-0.5px'
            }}>Kanmani Knots</span>
            <span style={{
              fontSize: '0.65rem',
              textTransform: 'uppercase',
              color: 'var(--accent-dark)',
              letterSpacing: '1.5px',
              fontWeight: 700
            }}>Sri Guru Tassels</span>
          </div>
        </Link>

        {/* Nav Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <Link to="/products" style={{
            fontFamily: 'var(--font-heading)',
            fontWeight: 500,
            color: 'var(--text-main)',
            fontSize: '0.95rem'
          }}>Sarees</Link>

          {user && (
            <Link to="/orders" style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 500,
              color: 'var(--text-main)',
              fontSize: '0.95rem'
            }}>My Orders</Link>
          )}

          {user && (user.role === 'tenant_admin' || user.role === 'platform_admin') && (
            <Link to="/dashboard" style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 500,
              color: 'var(--primary)',
              fontSize: '0.95rem',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="20" x2="18" y2="10"></line>
                <line x1="12" y1="20" x2="12" y2="4"></line>
                <line x1="6" y1="20" x2="6" y2="14"></line>
              </svg>
              Dashboard
            </Link>
          )}
        </div>

        {/* Action Panel */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Cart Icon */}
          <Link to="/cart" style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: 'var(--bg-input)',
            color: 'var(--primary-dark)',
            transition: 'var(--transition)'
          }} className="btn-text">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            {cartCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                background: 'linear-gradient(135deg, var(--accent), var(--accent-dark))',
                color: '#1a1608',
                borderRadius: '50%',
                width: '18px',
                height: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.65rem',
                fontWeight: 700,
                border: '1.5px solid var(--bg-card)',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                {cartCount}
              </span>
            )}
          </Link>

          {/* User Profile / Auth */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary-dark)' }}>{user.name}</span>
                <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--text-light)', fontWeight: 600 }}>
                  {user.role === 'tenant_admin' ? 'Boutique Owner' : 'Customer'}
                </span>
              </div>
              <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem', borderRadius: 'var(--radius-sm)' }}>
                Logout
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Link to="/login" className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                Register Boutique
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
