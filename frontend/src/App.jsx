import { useState, useEffect } from 'react';

export default function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/v1/dashboard')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to connect to PayPulse API');
        return res.json();
      })
      .then((dashboardData) => {
        setData(dashboardData);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="dashboard-container">
      <header className="header">
        <div>
          <h1 style={{ margin: 0 }}>💳 PayPulse</h1>
          <p style={{ color: '#94a3b8', margin: '0.25rem 0 0 0' }}>Subscription & Expense Control Center</p>
        </div>
        <span className="badge">● Backend Online</span>
      </header>

      {loading && <p>Connecting to backend engine...</p>}
      {error && <p style={{ color: '#f87171' }}>⚠️ Error: {error}. Make sure FastAPI is running!</p>}

      {data && (
        <>
          <section className="metrics-grid">
            <div className="metric-card">
              <h3>Available Wallet Balance</h3>
              <p className="amount">${data.wallet_balance.toFixed(2)}</p>
            </div>
            <div className="metric-card">
              <h3>Monthly Recurring Spend</h3>
              <p className="amount" style={{ color: '#38bdf8' }}>${data.monthly_spend.toFixed(2)}</p>
            </div>
            <div className="metric-card">
              <h3>Active Subscriptions</h3>
              <p className="amount" style={{ color: '#34d399' }}>{data.active_subscriptions}</p>
            </div>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Tracked Subscriptions</h2>
            <table className="subscriptions-table">
              <thead>
                <tr>
                  <th>Service Name</th>
                  <th>Category</th>
                  <th>Cost</th>
                  <th>Billing</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {data.subscriptions.map((sub) => (
                  <tr key={sub.id}>
                    <td><strong>{sub.name}</strong></td>
                    <td style={{ color: '#94a3b8' }}>{sub.category}</td>
                    <td>${sub.cost.toFixed(2)}</td>
                    <td>{sub.billing_cycle}</td>
                    <td>
                      <span className={`status-tag ${sub.status.toLowerCase()}`}>
                        {sub.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </>
      )}
    </div>
  );
}