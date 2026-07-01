import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, Cell, PieChart, Pie } from 'recharts';
import api from '../services/api';
import Layout from '../components/common/Layout';

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('/analytics/dashboard?granularity=daily')
      .then((res) => setData(res.data))
      .catch((err) => setError(err.response?.data?.error || 'Failed to load analytics'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
          <h3>Analyzing boutique statistics...</h3>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
          <div className="card" style={{ maxWidth: '500px', margin: '0 auto', padding: '40px', border: '1px solid var(--error)' }}>
            <h3 style={{ color: 'var(--error)', marginBottom: '16px' }}>Access Denied</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
              {error.includes('analyticsAccess') 
                ? 'Your current Basic Plan does not support Analytics. Upgrade to Pro to view dashboards.'
                : error}
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  // Compute KPI summaries
  const totalRevenue = data.revenueTrend?.reduce((sum, item) => sum + item.revenue, 0) || 0;
  const totalOrders = data.orderVolume?.reduce((sum, item) => sum + item.count, 0) || 0;
  const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
  const topProductCount = data.topProducts?.reduce((sum, item) => sum + item.unitsSold, 0) || 0;

  // Pie chart colors
  const COLORS = ['#722f37', '#d4af37', '#2e7d32', '#ef6c00', '#c62828', '#8884d8', '#82ca9d'];

  return (
    <Layout>
      <div className="container" style={{ padding: '40px 20px' }}>
        <div className="luxury-title" style={{ marginBottom: '32px' }}>
          <span style={{ textTransform: 'uppercase', color: 'var(--accent-dark)', letterSpacing: '1px', fontSize: '0.8rem', fontWeight: 700 }}>Management Suite</span>
          <h1 style={{ fontSize: '2.5rem', marginTop: '6px' }}>Analytics & Weaving Metrics</h1>
        </div>

        {/* KPI Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '24px',
          marginBottom: '40px'
        }}>
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', textTransform: 'uppercase', fontWeight: 600 }}>Total Revenue</span>
            <strong style={{ fontSize: '2rem', color: 'var(--primary-dark)', fontFamily: 'var(--font-heading)' }}>
              ₹{totalRevenue.toLocaleString('en-IN')}
            </strong>
            <span style={{ fontSize: '0.75rem', color: 'var(--success)' }}>▲ 12.4% vs last month</span>
          </div>

          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', textTransform: 'uppercase', fontWeight: 600 }}>Order Placements</span>
            <strong style={{ fontSize: '2rem', color: 'var(--primary-dark)', fontFamily: 'var(--font-heading)' }}>
              {totalOrders} orders
            </strong>
            <span style={{ fontSize: '0.75rem', color: 'var(--success)' }}>▲ 8.1% vs last month</span>
          </div>

          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', textTransform: 'uppercase', fontWeight: 600 }}>Average Order Value</span>
            <strong style={{ fontSize: '2rem', color: 'var(--primary-dark)', fontFamily: 'var(--font-heading)' }}>
              ₹{avgOrderValue.toLocaleString('en-IN')}
            </strong>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Basket size equilibrium</span>
          </div>

          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', textTransform: 'uppercase', fontWeight: 600 }}>Total Sarees Handed Over</span>
            <strong style={{ fontSize: '2rem', color: 'var(--primary-dark)', fontFamily: 'var(--font-heading)' }}>
              {topProductCount} units
            </strong>
            <span style={{ fontSize: '0.75rem', color: 'var(--success)' }}>▲ 15.2% production growth</span>
          </div>
        </div>

        {/* Charts Section */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
          gap: '32px',
          marginBottom: '40px'
        }}>
          {/* Revenue Trend */}
          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '20px', color: 'var(--primary-dark)' }}>Revenue Timeline</h3>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.revenueTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e8e3d7" />
                  <XAxis dataKey="_id" stroke="#6b6262" style={{ fontSize: '0.75rem' }} />
                  <YAxis stroke="#6b6262" style={{ fontSize: '0.75rem' }} />
                  <Tooltip formatter={(v) => `₹${v}`} />
                  <Line type="monotone" dataKey="revenue" stroke="var(--primary)" strokeWidth={3} dot={{ fill: 'var(--accent)', stroke: 'var(--primary)', strokeWidth: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Products */}
          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '20px', color: 'var(--primary-dark)' }}>Top Weaves By Revenue</h3>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.topProducts}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e8e3d7" />
                  <XAxis dataKey="name" stroke="#6b6262" style={{ fontSize: '0.75rem' }} tickFormatter={(name) => name.split(' ')[0]} />
                  <YAxis stroke="#6b6262" style={{ fontSize: '0.75rem' }} />
                  <Tooltip formatter={(v) => `₹${v}`} />
                  <Bar dataKey="revenue" fill="var(--accent-dark)">
                    {data.topProducts?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Volume & Status Breakdowns */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '32px'
        }}>
          {/* Pie Chart breakdown */}
          <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '20px', alignSelf: 'flex-start', color: 'var(--primary-dark)' }}>Order Status Breakdown</h3>
            <div style={{ width: '100%', height: 260, display: 'flex', justifyContent: 'center' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.orderVolume}
                    dataKey="count"
                    nameKey="_id"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    style={{ fontSize: '0.75rem' }}
                  >
                    {data.orderVolume?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Products Table */}
          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '20px', color: 'var(--primary-dark)' }}>Top Selling Catalog Items</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-light)', height: '36px' }}>
                    <th>Saree / Collection</th>
                    <th style={{ textAlign: 'center' }}>Units Sold</th>
                    <th style={{ textAlign: 'right' }}>Revenue Generated</th>
                  </tr>
                </thead>
                <tbody>
                  {data.topProducts?.map((p, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid var(--border)', height: '48px' }}>
                      <td style={{ fontWeight: 600, color: 'var(--primary-dark)' }}>{p.name}</td>
                      <td style={{ textAlign: 'center' }}>{p.unitsSold} units</td>
                      <td style={{ textAlign: 'right', fontWeight: 700 }}>₹{p.revenue.toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
