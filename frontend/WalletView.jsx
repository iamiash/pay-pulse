import React, { useState, useEffect } from 'react';

export default function WalletView() {
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);

  // Simulated API call to retrieve user wallet data
  useEffect(() => {
    // In production, this fetches from /api/v1/wallet/balance
    setTimeout(() => {
      setWallet({
        id: 1,
        user_id: 101,
        balance: 2500.50,
        currency: "USD"
      });
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return <div style={{ padding: '20px' }}>Loading wallet details...</div>;
  }

  return (
    <div style={{
      border: '1px solid #ccc',
      borderRadius: '8px',
      padding: '20px',
      maxWidth: '400px',
      margin: '20px auto',
      fontFamily: 'sans-serif'
    }}>
      <h2>User Wallet Information</h2>
      <p><strong>Account ID:</strong> {wallet.id}</p>
      <p><strong>User ID:</strong> {wallet.user_id}</p>
      <p><strong>Current Balance:</strong> ${wallet.balance.toFixed(2)} {wallet.currency}</p>
      <button 
        style={{
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          padding: '10px 15px',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
        onClick={() => alert("Refreshed wallet state!")}
      >
        Refresh Balance
      </button>
    </div>
  );
}
