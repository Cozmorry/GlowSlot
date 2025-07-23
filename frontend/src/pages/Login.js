import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithGoogle } from '../config/firebase';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('userId', data.user.id);  // Store the MongoDB _id
        navigate('/dashboard');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Network error');
    }
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await signInWithGoogle();
      
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('userId', data.user.id);
        navigate('/');
      } else {
        setError('Google sign-in failed');
      }
    } catch (err) {
      console.error('Google sign-in error:', err);
      setError(err.message || 'Error during Google sign-in');
    } finally {
      setLoading(false);
    }
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
        <div style={{ marginBottom: 32, textAlign: 'center', fontWeight: 600, fontSize: 18, marginTop: 40 }}>
          Enter your email and password
        </div>
        <div style={{ marginBottom: 8, fontWeight: 500 }}>Email</div>
        <div style={{ marginBottom: 20 }}>
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
              borderRadius: 6,
              background: '#f7f7fa',
              marginBottom: 8,
              fontSize: 16,
            }}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <span style={{ fontWeight: 500 }}>Password</span>
          <Link to="/forgot-password" style={{ color: '#ff6f00', fontWeight: 500, fontSize: 14, textDecoration: 'none' }}>
            Forgot password?
          </Link>
        </div>
        <div style={{ marginBottom: 24 }}>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '0.75rem',
              border: 'none',
              borderRadius: 6,
              background: '#f7f7fa',
              marginBottom: 8,
              fontSize: 16,
            }}
          />
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
          {loading ? 'Logging in...' : 'LOGIN'}
        </button>
        <div style={{ textAlign: 'center', marginBottom: 18, color: '#222' }}>
          Dont have an acount?{' '}
          <Link to="/signup" style={{ color: '#ff6f00', fontWeight: 500, textDecoration: 'none' }}>
            Sign up
          </Link>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', margin: '18px 0' }}>
          <div style={{ flex: 1, height: 1, background: '#d1aeea' }} />
          <span style={{ margin: '0 12px', color: '#888' }}>Sign In with</span>
          <div style={{ flex: 1, height: 1, background: '#d1aeea' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginBottom: 18 }}>
          <button
            type="button"
            onClick={handleGoogleSignIn}
            style={{
              background: '#fff',
              border: '1px solid #ccc',
              borderRadius: '8px',
              padding: '8px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              color: '#333'
            }}
          >
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" style={{ width: 18, height: 18 }} />
            Sign in with Google
          </button>
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
      </form>
    </div>
  );
};

export default Login; 