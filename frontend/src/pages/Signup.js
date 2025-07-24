import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', role: 'customer' });
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
      // Use a direct URL for now, can be updated to use environment variables later
      const res = await fetch(`http://localhost:5000/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: form.name, 
          email: form.email, 
          password: form.password,
          role: form.role
        }),
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
            Create Account
          </h1>
          <p style={{
            fontSize: '16px',
            color: '#718096',
            margin: '0',
            fontWeight: '400',
          }}>
            Join GlowSlot and start booking your beauty services
          </p>
        </div>

        {success ? (
          <div style={{
            background: '#f0fff4',
            color: '#22543d',
            padding: '20px',
            borderRadius: '12px',
            textAlign: 'center',
            border: '1px solid #9ae6b4',
          }}>
            <div style={{
              fontSize: '48px',
              marginBottom: '16px',
            }}>
              ✉️
            </div>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              margin: '0 0 8px 0',
              color: '#22543d',
            }}>
              Check Your Email
            </h3>
            <p style={{
              fontSize: '14px',
              margin: '0',
              color: '#4a5568',
              lineHeight: '1.5',
            }}>
              A verification email has been sent to your inbox. Please check your email and click the verification link to activate your account.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Full Name Field */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#4a5568',
                marginBottom: '8px',
              }}>
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
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
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#4a5568',
                marginBottom: '8px',
              }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                minLength={6}
                  placeholder="Create a password"
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

            {/* Confirm Password Field */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#4a5568',
                marginBottom: '8px',
              }}>
                Confirm Password
              </label>
              <div style={{ position: 'relative' }}>
              <input
                type={showConfirm ? 'text' : 'password'}
                name="confirm"
                value={form.confirm}
                onChange={handleChange}
                required
                minLength={6}
                  placeholder="Confirm your password"
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
                  onClick={() => setShowConfirm(!showConfirm)}
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
                  {showConfirm ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* Account Type Field */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#4a5568',
                marginBottom: '8px',
              }}>
                Account Type
              </label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
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
                  appearance: 'none',
                  cursor: 'pointer',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#e91e63';
                  e.target.style.boxShadow = '0 0 0 3px rgba(233, 30, 99, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e2e8f0';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <option value="customer">Customer</option>
                <option value="admin">Admin</option>
              </select>
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

            {/* Sign Up Button */}
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
              {loading ? 'Creating account...' : 'Create Account'}
            </button>

            {/* Login Link */}
            <div style={{
              textAlign: 'center',
              marginBottom: '32px',
              color: '#718096',
              fontSize: '14px',
            }}>
              Already have an account?{' '}
              <Link to="/login" style={{
                color: '#e91e63',
                fontWeight: '600',
                textDecoration: 'none',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={(e) => e.target.style.color = '#c2185b'}
              onMouseLeave={(e) => e.target.style.color = '#e91e63'}
              >
                Sign in
              </Link>
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
        )}
      </div>
    </div>
  );
};

export default Signup; 