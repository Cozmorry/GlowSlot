import React, { useState } from 'react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setSent(true);
      } else {
        setError(data.message || 'Failed to send reset link');
      }
    } catch (err) {
      setError('Network error');
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #ffe4ec 0%, #fff 100%)',
    }}>
      <form
        onSubmit={handleSubmit}
        style={{
          background: '#fff',
          padding: '2rem',
          borderRadius: '1rem',
          boxShadow: '0 2px 16px 0 #eee',
          minWidth: 320,
          maxWidth: 400,
          width: '100%',
        }}
      >
        <h2 style={{ color: '#e75480', marginBottom: '1.5rem', textAlign: 'center' }}>Forgot Password</h2>
        {sent ? (
          <div style={{ color: '#4caf50', background: '#f8f8f8', padding: '1rem', borderRadius: 8, textAlign: 'center' }}>
            If an account with that email exists, a password reset link has been sent.
          </div>
        ) : (
          <>
            <div style={{ marginBottom: 16 }}>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #eee',
                  borderRadius: 6,
                  background: '#f7f7fa',
                  marginBottom: 8,
                }}
              />
            </div>
            {error && <div style={{ color: '#e75480', marginBottom: 12 }}>{error}</div>}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.75rem',
                background: loading ? '#f8bbd0' : '#e75480',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                marginTop: 8,
              }}
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </>
        )}
      </form>
    </div>
  );
};

export default ForgotPassword; 