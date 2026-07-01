import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/common/Layout';

export default function RegisterPage() {
  const navigate = useNavigate();

  const [tenantName, setTenantName] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [plan, setPlan] = useState('basic');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!tenantName || !name || !email || !password) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    try {
      await axios.post('/api/auth/register', {
        name,
        email,
        password,
        tenantName,
        plan
      });
      setSuccess(true);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Try a different boutique name or email.');
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Layout>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 'calc(100vh - 160px)',
          backgroundColor: 'var(--bg-main)',
          padding: '40px 20px'
        }}>
          <div className="card text-center" style={{ maxWidth: '480px', width: '100%', textAlign: 'center', padding: '40px' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'rgba(46, 125, 50, 0.1)',
              color: 'var(--success)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '24px'
            }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <h2 style={{ fontSize: '2rem', color: 'var(--primary-dark)', marginBottom: '12px' }}>Registration Successful!</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '32px', fontSize: '1rem', lineHeight: '1.6' }}>
              Your boutique <strong>{tenantName}</strong> has been registered successfully. A welcome email has been sent to <strong>{email}</strong>.
            </p>
            <Link to="/login" className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>
              Proceed to Sign In
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div style={{
        display: 'flex',
        minHeight: 'calc(100vh - 160px)',
        alignItems: 'stretch',
        flexWrap: 'wrap'
      }}>
        {/* Left Info Panel */}
        <div style={{
          flex: '1 1 500px',
          background: 'linear-gradient(135deg, rgba(86, 34, 40, 0.96), rgba(66, 18, 23, 0.98)), url("https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'multiply',
          color: '#ffffff',
          padding: '60px 40px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          <span style={{ color: 'var(--accent)', fontWeight: 700, letterSpacing: '2px', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '16px' }}>Tenant Registration</span>
          <h2 style={{ fontSize: '2.5rem', color: '#ffffff', marginBottom: '24px', fontFamily: 'var(--font-heading)' }}>Launch Your Saree Brand Globally</h2>
          <p style={{ fontSize: '1.1rem', color: '#e5dcdb', lineHeight: '1.7', marginBottom: '32px' }}>
            Join a network of modern weavers and digital boutiques. Expand your sales reach, track customized knot requests, and build trust using automated order timelines.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent)' }}></div>
              <span>Automated subdomains for independent boutique branding.</span>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent)' }}></div>
              <span>Custom price modifiers for luxury tassel options.</span>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent)' }}></div>
              <span>Integrated Razorpay payment gateways out-of-the-box.</span>
            </div>
          </div>
        </div>

        {/* Right Form Panel */}
        <div style={{
          flex: '1 1 500px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px 40px',
          backgroundColor: 'var(--bg-main)'
        }}>
          <div style={{ width: '100%', maxWidth: '460px' }} className="animate-fade-in">
            <h2 style={{ fontSize: '2rem', marginBottom: '8px', color: 'var(--primary-dark)' }}>Create Weaving Workspace</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Fill in the details to register your boutique tenant.</p>

            {error && (
              <div style={{
                backgroundColor: 'rgba(198, 40, 40, 0.08)',
                border: '1px solid var(--error)',
                color: 'var(--error)',
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                marginBottom: '24px',
                fontSize: '0.9rem'
              }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Boutique Name *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Sri Guru Weaving Co"
                  value={tenantName}
                  onChange={(e) => setTenantName(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Owner Name *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Ramesh Kumar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="ramesh@sriguru.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Secure Password *</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="Min. 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '32px' }}>
                <label className="form-label">Subscription Tier</label>
                <select
                  className="form-input"
                  value={plan}
                  onChange={(e) => setPlan(e.target.value)}
                  disabled={loading}
                  style={{ appearance: 'none', backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23722f37\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpolyline points=\'6 9 12 15 18 9\'%3E%3C/polyline%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 16px center', backgroundSize: '16px' }}
                >
                  <option value="basic">Basic Plan (Up to 100 products)</option>
                  <option value="pro">Pro Plan (Up to 1000 products + Analytics)</option>
                  <option value="enterprise">Enterprise Plan (Unlimited products + API)</option>
                </select>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', padding: '12px', fontSize: '1rem', marginBottom: '24px' }}
                disabled={loading}
              >
                {loading ? 'Creating Tenant Workspace...' : 'Register & Create Store'}
              </button>
            </form>

            <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Already registered? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Sign In here</Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
