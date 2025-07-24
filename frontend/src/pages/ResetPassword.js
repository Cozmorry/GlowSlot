import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ResetPassword = () => {
  const { login } = useAuth();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const token = new URLSearchParams(location.search).get('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    try {
      const res = await fetch(`http://localhost:5000/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        // Include token in user data
        const userWithToken = { ...data.user, token: data.token };
        login(userWithToken);
        setSuccess(true);
        setTimeout(() => navigate('/home'), 2000);
      } else {
        setError(data.message || 'Reset failed');
      }
    } catch (err) {
      setError('Network error');
    }
    setLoading(false);
  };

  if (!token) {
    return <div style={{ textAlign: 'center', marginTop: '2rem', color: '#e75480' }}>Invalid or missing reset token.</div>;
  }

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
        <h2 style={{ color: '#e75480', marginBottom: '1.5rem', textAlign: 'center' }}>Reset Password</h2>
        {success ? (
          <div style={{ color: '#4caf50', background: '#f8f8f8', padding: '1rem', borderRadius: 8, textAlign: 'center' }}>
            Password reset! Logging you in...
          </div>
        ) : (
          <>
            <div style={{ marginBottom: 16 }}>
              <input
                type="password"
                name="password"
                placeholder="New Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={6}
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
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </>
        )}
      </form>
    </div>
  );
};

export default ResetPassword; 