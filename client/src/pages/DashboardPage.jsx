import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import api from '../services/api';

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

  if (loading) return <p style={{ padding: '2rem' }}>Loading dashboard…</p>;
  if (error)   return <p style={{ padding: '2rem', color: 'red' }}>{error}</p>;

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Analytics Dashboard</h1>

      <h2>Revenue Trend</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data.revenueTrend}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="_id" />
          <YAxis />
          <Tooltip formatter={(v) => `₹${v}`} />
          <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>

      <h2>Top Products</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data.topProducts}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip formatter={(v) => `₹${v}`} />
          <Bar dataKey="revenue" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
