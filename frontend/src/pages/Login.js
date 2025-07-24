import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { signInWithGoogle } from '../config/firebase';

const Login = () => {
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Check if user is already logged in and redirect immediately
  useEffect(() => {
    if (user) {
      navigate('/home'); // Redirect to home page instead of showing logout screen
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`http://localhost:5000/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      console.log('Login response data:', data);
      if (res.ok && data.token) {
        // Include token in user data
        const userWithToken = { ...data.user, token: data.token };
        console.log('User data with token:', userWithToken);
        login(userWithToken);
        
        // Add a small delay to ensure state is updated
        setTimeout(() => {
          // Redirect based on role
          console.log('User role:', data.user.role);
          console.log('About to navigate - role check:', data.user.role === 'admin' ? 'ADMIN' : 'USER');
          if (data.user.role === 'admin') {
            console.log('Redirecting to admin dashboard');
            console.log('Current URL before redirect:', window.location.href);
            navigate('/admin');
            console.log('Navigate called for /admin');
            console.log('Navigation should have happened to /admin');
          } else {
            console.log('Redirecting to home');
            navigate('/home');
            console.log('Navigation should have happened to /home');
          }
        }, 100);
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
        // Include token in user data
        const userWithToken = { ...data.user, token: data.token };
        login(userWithToken);

        // Redirect based on role
        if (data.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/home');
        }
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
    navigate('/home');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f5c6ea 0%, #e91e63 100%)',
      padding: '20px',
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        padding: '40px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
        minWidth: 320,
        maxWidth: 400,
        width: '100%',
        border: '1px solid rgba(255, 255, 255, 0.2)',
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#2d3748',
            margin: '0 0 8px 0',
            letterSpacing: '-0.5px',
          }}>
            Welcome Back
          </h1>
          <p style={{
            fontSize: '16px',
            color: '#718096',
            margin: '0',
            fontWeight: '400',
          }}>
            Sign in to your GlowSlot account
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Email Field */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#4a5568',
              marginBottom: '8px',
            }}>
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
              style={{
                width: '100%',
                padding: '16px',
                border: '2px solid #e2e8f0',
                borderRadius: '12px',
                fontSize: '16px',
                transition: 'all 0.2s ease',
                boxSizing: 'border-box',
                background: '#fff',
                color: '#2d3748',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#e91e63';
                e.target.style.boxShadow = '0 0 0 3px rgba(233, 30, 99, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e2e8f0';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* Password Field */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '8px',
            }}>
              <label style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#4a5568',
              }}>
                Password
              </label>
              <Link to="/forgot-password" style={{
                color: '#e91e63',
                fontWeight: '500',
                fontSize: '14px',
                textDecoration: 'none',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={(e) => e.target.style.color = '#c2185b'}
              onMouseLeave={(e) => e.target.style.color = '#e91e63'}
              >
                Forgot password?
              </Link>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
                style={{
                  width: '100%',
                  padding: '16px',
                  paddingRight: '50px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '12px',
                  fontSize: '16px',
                  transition: 'all 0.2s ease',
                  boxSizing: 'border-box',
                  background: '#fff',
                  color: '#2d3748',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#e91e63';
                  e.target.style.boxShadow = '0 0 0 3px rgba(233, 30, 99, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e2e8f0';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#a0aec0',
                  fontSize: '18px',
                  padding: '0',
                  transition: 'color 0.2s ease',
                }}
                onMouseEnter={(e) => e.target.style.color = '#e91e63'}
                onMouseLeave={(e) => e.target.style.color = '#a0aec0'}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div style={{
              background: '#fed7d7',
              color: '#c53030',
              padding: '12px 16px',
              borderRadius: '8px',
              fontSize: '14px',
              marginBottom: '24px',
              border: '1px solid #feb2b2',
            }}>
              {error}
            </div>
          )}

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '16px',
              background: loading ? '#a0aec0' : 'linear-gradient(135deg, #e91e63 0%, #c2185b 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: '12px',
              fontWeight: '600',
              fontSize: '16px',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginBottom: '24px',
              transition: 'all 0.2s ease',
              boxShadow: loading ? 'none' : '0 4px 12px rgba(233, 30, 99, 0.3)',
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.transform = 'translateY(-1px)';
                e.target.style.boxShadow = '0 6px 16px rgba(233, 30, 99, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 12px rgba(233, 30, 99, 0.3)';
              }
            }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          {/* Sign Up Link */}
          <div style={{
            textAlign: 'center',
            marginBottom: '32px',
            color: '#718096',
            fontSize: '14px',
          }}>
            Don't have an account?{' '}
            <Link to="/signup" style={{
              color: '#e91e63',
              fontWeight: '600',
              textDecoration: 'none',
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={(e) => e.target.style.color = '#c2185b'}
            onMouseLeave={(e) => e.target.style.color = '#e91e63'}
            >
              Sign up
            </Link>
          </div>

          {/* Divider */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            margin: '32px 0',
          }}>
            <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
            <span style={{
              margin: '0 16px',
              color: '#a0aec0',
              fontSize: '14px',
              fontWeight: '500',
            }}>
              or continue with
            </span>
            <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
          </div>

          {/* Google Sign In Button */}
          <div style={{ marginBottom: '32px' }}>
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              style={{
                width: '100%',
                background: '#fff',
                border: '2px solid #e2e8f0',
                borderRadius: '12px',
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '16px',
                color: '#4a5568',
                fontWeight: '500',
                fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                transition: 'all 0.2s ease',
                opacity: loading ? 0.6 : 1,
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.target.style.borderColor = '#cbd5e0';
                  e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.target.style.borderColor = '#e2e8f0';
                  e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
                }
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign in with Google
            </button>
          </div>

          {/* Skip Option */}
          <div style={{ textAlign: 'center' }}>
            <button
              type="button"
              onClick={handleSkip}
              style={{
                background: 'none',
                border: 'none',
                color: '#a0aec0',
                fontWeight: '500',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'color 0.2s ease',
                textDecoration: 'underline',
              }}
              onMouseEnter={(e) => e.target.style.color = '#718096'}
              onMouseLeave={(e) => e.target.style.color = '#a0aec0'}
            >
              Continue as guest
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login; 
