import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    if (form.password !== form.confirm) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
      } else {
        setError(data.message || 'Signup failed');
      }
    } catch (err) {
      setError('Network error');
    }
    setLoading(false);
  };

  const handleSkip = () => {
    localStorage.setItem('guest', 'true');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/dashboard');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f5c6ea',
    }}>
      <form
        onSubmit={handleSubmit}
        style={{
          background: 'transparent',
          padding: '0',
          borderRadius: '1rem',
          minWidth: 320,
          maxWidth: 400,
          width: '100%',
          boxShadow: 'none',
        }}
      >
        <div style={{ marginBottom: 32, textAlign: 'center', fontWeight: 600, fontSize: 18, marginTop: 40 }}></div>
        {success ? (
          <div style={{ color: '#4caf50', background: '#f8f8f8', padding: '1rem', borderRadius: 8, textAlign: 'center' }}>
            A verification email has been sent. Please check your inbox and click the link to verify your account.
          </div>
        ) : (
          <>
            <div style={{ marginBottom: 8, fontWeight: 500 }}>Full name</div>
            <div style={{ marginBottom: 16 }}>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: 'none',
                  borderRadius: 0,
                  background: '#f7f7fa',
                  marginBottom: 8,
                  fontSize: 16,
                  borderBottom: '1px solid #bfa2d6',
                }}
              />
            </div>
            <div style={{ marginBottom: 8, fontWeight: 500 }}>Email</div>
            <div style={{ marginBottom: 16 }}>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: 'none',
                  borderRadius: 0,
                  background: '#f7f7fa',
                  marginBottom: 8,
                  fontSize: 16,
                  borderBottom: '1px solid #bfa2d6',
                }}
              />
            </div>
            <div style={{ marginBottom: 8, fontWeight: 500 }}>Password</div>
            <div style={{ marginBottom: 16, position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                minLength={6}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: 'none',
                  borderRadius: 0,
                  background: '#f7f7fa',
                  marginBottom: 8,
                  fontSize: 16,
                  borderBottom: '1px solid #bfa2d6',
                }}
              />
              <span
                onClick={() => setShowPassword((v) => !v)}
                style={{
                  position: 'absolute',
                  right: 10,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  cursor: 'pointer',
                  color: '#ff6f00',
                  fontSize: 18,
                  userSelect: 'none',
                }}
                title={showPassword ? 'Hide' : 'Show'}
              >
                {showPassword ? '🙈' : '👁️'}
              </span>
            </div>
            <div style={{ marginBottom: 8, fontWeight: 500 }}>Confirm password</div>
            <div style={{ marginBottom: 24, position: 'relative' }}>
              <input
                type={showConfirm ? 'text' : 'password'}
                name="confirm"
                value={form.confirm}
                onChange={handleChange}
                required
                minLength={6}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: 'none',
                  borderRadius: 0,
                  background: '#f7f7fa',
                  marginBottom: 8,
                  fontSize: 16,
                  borderBottom: '1px solid #bfa2d6',
                }}
              />
              <span
                onClick={() => setShowConfirm((v) => !v)}
                style={{
                  position: 'absolute',
                  right: 10,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  cursor: 'pointer',
                  color: '#ff6f00',
                  fontSize: 18,
                  userSelect: 'none',
                }}
                title={showConfirm ? 'Hide' : 'Show'}
              >
                {showConfirm ? '🙈' : '👁️'}
              </span>
            </div>
            {error && <div style={{ color: '#e75480', marginBottom: 12 }}>{error}</div>}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.9rem',
                background: '#222',
                color: '#fff',
                border: 'none',
                borderRadius: 24,
                fontWeight: 600,
                fontSize: 18,
                cursor: loading ? 'not-allowed' : 'pointer',
                marginBottom: 18,
                marginTop: 8,
                letterSpacing: 1,
              }}
            >
              {loading ? 'Signing up...' : 'SIGN UP'}
            </button>
            <div style={{ textAlign: 'center', marginBottom: 18, color: '#222' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: '#ff6f00', fontWeight: 500, textDecoration: 'none' }}>
                Login
              </Link>
            </div>
            <div style={{ textAlign: 'center', color: '#222', marginTop: 24, marginBottom: 8 }}>
              <button
                type="button"
                onClick={handleSkip}
                style={{ background: 'none', border: 'none', color: '#222', fontWeight: 500, fontSize: 16, cursor: 'pointer' }}
              >
                Skip now --&gt;
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default Signup; 