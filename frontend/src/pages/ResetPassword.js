import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { FaLock, FaEye, FaEyeSlash, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

const ResetPassword = () => {
  const { login } = useAuth();
  const { showSuccess, showError } = useNotification();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [tokenValid, setTokenValid] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const token = new URLSearchParams(location.search).get('token');

  useEffect(() => {
    if (!token) {
      setTokenValid(false);
      setError('Invalid or missing reset token.');
    }
  }, [token]);

  const validatePassword = (password) => {
    const minLength = password.length >= 6;
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    return { minLength, hasLetter, hasNumber, isValid: minLength && hasLetter && hasNumber };
  };

  const passwordValidation = validatePassword(password);
  const passwordsMatch = password === confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!passwordValidation.isValid) {
      setError('Password must be at least 6 characters with letters and numbers.');
      setLoading(false);
      return;
    }

    if (!passwordsMatch) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      
      if (res.ok && data.token) {
        const userWithToken = { ...data.user, token: data.token };
        login(userWithToken);
        setSuccess(true);
        showSuccess('Password reset successful! You are now logged in.');
        setTimeout(() => navigate('/home'), 2000);
      } else {
        if (data.message.includes('expired')) {
          setTokenValid(false);
          setError('This reset link has expired. Please request a new password reset.');
        } else {
          setError(data.message || 'Reset failed');
        }
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
    }
    setLoading(false);
  };

  if (!tokenValid) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #ffe4ec 0%, #fff 100%)',
        padding: '20px',
      }}>
        <div style={{
          background: '#fff',
          padding: '2rem',
          borderRadius: '1rem',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          minWidth: 320,
          maxWidth: 400,
          width: '100%',
          textAlign: 'center',
        }}>
          <div style={{
            width: 60,
            height: 60,
            borderRadius: '50%',
            background: '#ff6b6b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px auto',
          }}>
            <FaExclamationTriangle size={24} color="white" />
          </div>
          <h2 style={{ color: '#ff6b6b', marginBottom: '1rem', fontSize: '20px' }}>
            Link Expired
          </h2>
          <p style={{ color: '#666', marginBottom: '1.5rem', lineHeight: '1.5' }}>
            This password reset link has expired or is invalid. Please request a new password reset.
          </p>
          <button
            onClick={() => navigate('/forgot-password')}
            style={{
              background: 'linear-gradient(135deg, #e91e63 0%, #c2185b 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 20px rgba(233, 30, 99, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            Request New Reset
          </button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #ffe4ec 0%, #fff 100%)',
        padding: '20px',
      }}>
        <div style={{
          background: '#fff',
          padding: '2rem',
          borderRadius: '1rem',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          minWidth: 320,
          maxWidth: 400,
          width: '100%',
          textAlign: 'center',
        }}>
          <div style={{
            width: 60,
            height: 60,
            borderRadius: '50%',
            background: '#4caf50',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px auto',
          }}>
            <FaCheckCircle size={24} color="white" />
          </div>
          <h2 style={{ color: '#4caf50', marginBottom: '1rem', fontSize: '20px' }}>
            Password Reset Successful!
          </h2>
          <p style={{ color: '#666', marginBottom: '1.5rem' }}>
            Your password has been updated. You are now logged in and will be redirected shortly.
          </p>
          <div style={{
            width: 40,
            height: 40,
            border: '3px solid #f3f3f3',
            borderTop: '3px solid #e91e63',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto',
          }} />
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #ffe4ec 0%, #fff 100%)',
      padding: '20px',
    }}>
      <div style={{
        background: '#fff',
        padding: '2rem',
        borderRadius: '1rem',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        minWidth: 320,
        maxWidth: 400,
        width: '100%',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: 60,
            height: 60,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #e91e63 0%, #c2185b 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px auto',
          }}>
            <FaLock size={24} color="white" />
          </div>
          <h2 style={{ 
            color: '#e91e63', 
            marginBottom: '0.5rem', 
            fontSize: '24px',
            fontWeight: '700'
          }}>
            Reset Password
          </h2>
          <p style={{ color: '#666', fontSize: '14px' }}>
            Enter your new password below
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  paddingRight: '40px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '16px',
                  background: '#f7fafc',
                  transition: 'all 0.2s ease',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#e91e63';
                  e.target.style.background = '#fff';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e2e8f0';
                  e.target.style.background = '#f7fafc';
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#666',
                  cursor: 'pointer',
                  padding: '4px',
                }}
              >
                {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
              </button>
            </div>
            
            {/* Password validation indicators */}
            <div style={{ marginTop: '8px', fontSize: '12px' }}>
              <div style={{ color: passwordValidation.minLength ? '#4caf50' : '#666' }}>
                ✓ At least 6 characters
              </div>
              <div style={{ color: passwordValidation.hasLetter ? '#4caf50' : '#666' }}>
                ✓ Contains letters
              </div>
              <div style={{ color: passwordValidation.hasNumber ? '#4caf50' : '#666' }}>
                ✓ Contains numbers
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ position: 'relative' }}>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  paddingRight: '40px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '16px',
                  background: '#f7fafc',
                  transition: 'all 0.2s ease',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#e91e63';
                  e.target.style.background = '#fff';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e2e8f0';
                  e.target.style.background = '#f7fafc';
                }}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#666',
                  cursor: 'pointer',
                  padding: '4px',
                }}
              >
                {showConfirmPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
              </button>
            </div>
            
            {confirmPassword && (
              <div style={{ 
                marginTop: '8px', 
                fontSize: '12px',
                color: passwordsMatch ? '#4caf50' : '#ff6b6b'
              }}>
                {passwordsMatch ? '✓ Passwords match' : '✗ Passwords do not match'}
              </div>
            )}
          </div>

          {error && (
            <div style={{ 
              color: '#ff6b6b', 
              background: '#ffe6e6',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '1rem',
              fontSize: '14px',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !passwordValidation.isValid || !passwordsMatch}
            style={{
              width: '100%',
              padding: '12px 16px',
              background: loading || !passwordValidation.isValid || !passwordsMatch 
                ? '#f8bbd0' 
                : 'linear-gradient(135deg, #e91e63 0%, #c2185b 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading || !passwordValidation.isValid || !passwordsMatch 
                ? 'not-allowed' 
                : 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: loading || !passwordValidation.isValid || !passwordsMatch 
                ? 'none' 
                : '0 4px 16px rgba(233, 30, 99, 0.3)',
            }}
            onMouseEnter={(e) => {
              if (!loading && passwordValidation.isValid && passwordsMatch) {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 20px rgba(233, 30, 99, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading && passwordValidation.isValid && passwordsMatch) {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 16px rgba(233, 30, 99, 0.3)';
              }
            }}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword; 