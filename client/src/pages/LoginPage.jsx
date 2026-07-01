import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../store/slices/authSlice';
import Layout from '../components/common/Layout';

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(null);

  const { loading, user, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      if (user.role === 'tenant_admin' || user.role === 'platform_admin') {
        navigate('/dashboard');
      } else {
        navigate('/products');
      }
    }
  }, [user, navigate]);

  useEffect(() => {
    if (error) {
      setLoginError(error);
    }
  }, [error]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoginError(null);
    if (!email || !password) {
      setLoginError('Please enter both email and password');
      return;
    }
    dispatch(loginUser({ email, password }));
  };

  const handleFillCredentials = (role) => {
    if (role === 'admin') {
      setEmail('demo@kanmaniknot.com');
      setPassword('demo1234');
    } else if (role === 'customer') {
      setEmail('customer@demo.com');
      setPassword('demo1234');
    }
  };

  return (
    <Layout>
      <div style={{
        display: 'flex',
        minHeight: 'calc(100vh - 160px)',
        alignItems: 'stretch',
        flexWrap: 'wrap'
      }}>
        {/* Left Side Info Panel */}
        <div style={{
          flex: '1 1 500px',
          background: 'linear-gradient(135deg, rgba(114, 47, 55, 0.95), rgba(86, 34, 40, 0.98)), url("https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'multiply',
          color: '#ffffff',
          padding: '60px 40px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          <span style={{ color: 'var(--accent)', fontWeight: 700, letterSpacing: '2px', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '16px' }}>Boutique Workspace</span>
          <h2 style={{ fontSize: '2.5rem', color: '#ffffff', marginBottom: '24px', fontFamily: 'var(--font-heading)' }}>Enter Your Boutique Portal</h2>
          <p style={{ fontSize: '1.1rem', color: '#e5dcdb', lineHeight: '1.7', marginBottom: '32px' }}>
            Weavers and boutique owners can log in here to manage their live catalogs, check custom order queues, update design tags, and configure global store settings.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent)' }}></div>
              <span>Track tassel configurations for custom orders.</span>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent)' }}></div>
              <span>Monitor weaver capacity and supply chain analytics.</span>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent)' }}></div>
              <span>Direct communication channels for order fulfillment.</span>
            </div>
          </div>
        </div>

        {/* Right Side Form Panel */}
        <div style={{
          flex: '1 1 500px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px 40px',
          backgroundColor: 'var(--bg-main)'
        }}>
          <div style={{ width: '100%', maxWidth: '420px' }} className="animate-fade-in">
            <h2 style={{ fontSize: '2rem', marginBottom: '8px', color: 'var(--primary-dark)' }}>Welcome Back</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Sign in to continue to your workspace.</p>

            {loginError && (
              <div style={{
                backgroundColor: 'rgba(198, 40, 40, 0.08)',
                border: '1px solid var(--error)',
                color: 'var(--error)',
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                marginBottom: '24px',
                fontSize: '0.9rem'
              }}>
                {loginError}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="name@kanmaniknot.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '24px' }}>
                <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Password</span>
                  <a href="#forgot" style={{ fontSize: '0.8rem', color: 'var(--primary)' }}>Forgot Password?</a>
                </label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', padding: '12px', fontSize: '1rem', marginBottom: '24px' }}
                disabled={loading}
              >
                {loading ? 'Authenticating...' : 'Sign In to Portal'}
              </button>
            </form>

            {/* Quick Demo Credentials Panel */}
            <div style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              padding: '16px',
              marginBottom: '24px'
            }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-dark)', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '12px' }}>
                Demo Credentials (Click to Auto-fill)
              </span>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => handleFillCredentials('admin')}
                  className="btn btn-secondary"
                  style={{ flex: 1, padding: '8px', fontSize: '0.8rem', borderRadius: 'var(--radius-sm)' }}
                >
                  Boutique Owner (Admin)
                </button>
                <button
                  type="button"
                  onClick={() => handleFillCredentials('customer')}
                  className="btn btn-secondary"
                  style={{ flex: 1, padding: '8px', fontSize: '0.8rem', borderRadius: 'var(--radius-sm)' }}
                >
                  Customer User
                </button>
              </div>
            </div>

            <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Want to register a new boutique? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>Create an Account</Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
