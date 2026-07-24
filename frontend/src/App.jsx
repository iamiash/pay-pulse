import { useState, useEffect } from 'react';

export default function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Developer Tools');
  const [cost, setCost] = useState('');
  const [billingCycle, setBillingCycle] = useState('Monthly');

  const fetchDashboardData = () => {
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
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleAddSubscription = (e) => {
    e.preventDefault();
    if (!name || !cost) return;

    fetch('http://127.0.0.1:8000/api/v1/subscriptions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        category,
        cost: parseFloat(cost),
        billing_cycle: billingCycle,
      }),
    }).then(() => {
      setName('');
      setCost('');
      fetchDashboardData();
    });
  };

  const handleToggleStatus = (id) => {
    fetch(`http://127.0.0.1:8000/api/v1/subscriptions/${id}/toggle`, {
      method: 'PATCH',
    }).then(() => fetchDashboardData());
  };

  const handleDelete = (id) => {
    fetch(`http://127.0.0.1:8000/api/v1/subscriptions/${id}`, {
      method: 'DELETE',
    }).then(() => fetchDashboardData());
  };

  return (
    <div className="dashboard-container">
      <header className="header">
        <div>
          <h1 style={{ margin: 0 }}>💳 PayPulse</h1>
          <p style={{ color: '#94a3b8', margin: '0.25rem 0 0 0' }}>SQLite Persistent Control Center</p>
        </div>
        <span className="badge">● SQLite Engine Connected</span>
      </header>

      {loading && <p>Connecting to database engine...</p>}
      {error && <p style={{ color: '#f87171' }}>⚠️ Error: {error}. Ensure FastAPI backend is running!</p>}

      {data && (
        <>
          <section className="metrics-grid">
            <div className="metric-card">
              <h3>Available Balance</h3>
              <p className="amount">${data.wallet_balance.toFixed(2)}</p>
            </div>
            <div className="metric-card">
              <h3>Active Monthly Spend</h3>
              <p className="amount" style={{ color: '#38bdf8' }}>${data.monthly_spend.toFixed(2)}</p>
            </div>
            <div className="metric-card">
              <h3>Active Services</h3>
              <p className="amount" style={{ color: '#34d399' }}>{data.active_subscriptions}</p>
            </div>
          </section>

          <form className="add-form" onSubmit={handleAddSubscription}>
            <input
              type="text"
              placeholder="Subscription Name (e.g. ChatGPT Pro)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="Developer Tools">Developer Tools</option>
              <option value="Cloud Infrastructure">Cloud Infrastructure</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Design Tools">Design Tools</option>
              <option value="AI Services">AI Services</option>
            </select>
            <input
              type="number"
              step="0.01"
              placeholder="Cost ($)"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              required
            />
            <select value={billingCycle} onChange={(e) => setBillingCycle(e.target.value)}>
              <option value="Monthly">Monthly</option>
              <option value="Yearly">Yearly</option>
            </select>
            <button type="submit" className="btn-primary">+ Add Subscription</button>
          </form>

          <section>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Active Subscriptions in SQLite</h2>
            <table className="subscriptions-table">
              <thead>
                <tr>
                  <th>Service Name</th>
                  <th>Category</th>
                  <th>Cost</th>
                  <th>Billing</th>
                  <th>Status</th>
                  <th>Actions</th>
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
                    <td>
                      <button className="btn-action" onClick={() => handleToggleStatus(sub.id)}>
                        {sub.status === 'Active' ? 'Pause' : 'Activate'}
                      </button>
                      <button className="btn-action btn-danger" onClick={() => handleDelete(sub.id)}>
                        Delete
                      </button>
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