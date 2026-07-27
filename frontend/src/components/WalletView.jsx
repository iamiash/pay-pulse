import React, { useState, useEffect } from 'react';

const API_BASE_URL = "http://localhost:8000/api/v1";

export default function WalletView() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newSub, setNewSub] = useState({ name: '', category: 'Developer Tools', cost: '', billing_cycle: 'Monthly' });

  const fetchDashboard = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/dashboard`);
      const data = await response.json();
      setDashboardData(data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to connect to backend engine:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleToggle = async (id) => {
    try {
      await fetch(`${API_BASE_URL}/subscriptions/${id}/toggle`, { method: 'PATCH' });
      fetchDashboard();
    } catch (err) {
      console.error("Failed to toggle subscription:", err);
    }
  };

  const handleAddSubscription = async (e) => {
    e.preventDefault();
    if (!newSub.name || !newSub.cost) return;
    try {
      await fetch(`${API_BASE_URL}/subscriptions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newSub, cost: parseFloat(newSub.cost) })
      });
      setNewSub({ name: '', category: 'Developer Tools', cost: '', billing_cycle: 'Monthly' });
      fetchDashboard();
    } catch (err) {
      console.error("Failed to create subscription:", err);
    }
  };

  if (loading) return <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>Loading PayPulse Engine...</div>;

  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif', maxWidth: '1000px', margin: '0 auto' }}>
      <h2>PayPulse Subscription & Wallet Dashboard</h2>
      
      {dashboardData && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ padding: '1rem', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
            <h4>Wallet Balance</h4>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2e7d32' }}>${dashboardData.wallet_balance.toFixed(2)}</p>
          </div>
          <div style={{ padding: '1rem', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
            <h4>Monthly Spend</h4>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#c62828' }}>${dashboardData.monthly_spend.toFixed(2)}</p>
          </div>
          <div style={{ padding: '1rem', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
            <h4>Active Subscriptions</h4>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{dashboardData.active_subscriptions}</p>
          </div>
        </div>
      )}

      <h3>Add New Subscription</h3>
      <form onSubmit={handleAddSubscription} style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
        <input 
          type="text" 
          placeholder="Subscription Name" 
          value={newSub.name} 
          onChange={(e) => setNewSub({ ...newSub, name: e.target.value })} 
          style={{ padding: '0.5rem', flex: 2 }}
        />
        <input 
          type="number" 
          placeholder="Cost ($)" 
          value={newSub.cost} 
          onChange={(e) => setNewSub({ ...newSub, cost: e.target.value })} 
          style={{ padding: '0.5rem', flex: 1 }}
        />
        <button type="submit" style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>Add Subscription</button>
      </form>

      <h3>Managed Subscriptions</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #ccc' }}>
            <th style={{ padding: '0.5rem' }}>Name</th>
            <th style={{ padding: '0.5rem' }}>Category</th>
            <th style={{ padding: '0.5rem' }}>Cost</th>
            <th style={{ padding: '0.5rem' }}>Status</th>
            <th style={{ padding: '0.5rem' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {dashboardData?.subscriptions.map((sub) => (
            <tr key={sub.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '0.5rem' }}>{sub.name}</td>
              <td style={{ padding: '0.5rem' }}>{sub.category}</td>
              <td style={{ padding: '0.5rem' }}>${sub.cost.toFixed(2)}</td>
              <td style={{ padding: '0.5rem' }}>
                <span style={{ color: sub.status === 'Active' ? 'green' : 'gray', fontWeight: 'bold' }}>
                  {sub.status}
                </span>
              </td>
              <td style={{ padding: '0.5rem' }}>
                <button onClick={() => handleToggle(sub.id)} style={{ cursor: 'pointer' }}>
                  {sub.status === 'Active' ? 'Pause' : 'Activate'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
