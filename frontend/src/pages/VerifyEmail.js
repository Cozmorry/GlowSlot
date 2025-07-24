import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const VerifyEmail = () => {
  const { login } = useAuth();
  const [status, setStatus] = useState('verifying');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    if (!token) {
      setStatus('error');
      return;
    }

    console.log('Verifying email with token:', token);
    fetch(`http://localhost:5000/auth/verify-email?token=${token}`)
      .then(res => {
        console.log('Verification response status:', res.status);
        return res.json();
      })
      .then(data => {
        console.log('Verification response data:', data);
        if (data.token) {
          // Include token in user data
          const userWithToken = { ...data.user, token: data.token };
          console.log('Logging in with user data:', userWithToken);
          login(userWithToken);
          setStatus('success');
          
          // Redirect based on role
          if (data.user.role === 'admin') {
            setTimeout(() => navigate('/admin'), 2000);
          } else {
            setTimeout(() => navigate('/home'), 2000);
          }
        } else {
          console.log('No token in response');
          setStatus('error');
        }
      })
      .catch((error) => {
        console.error('Verification error:', error);
        setStatus('error');
      });
  }, [location, navigate]);

  return (
    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
      {status === 'verifying' && <p>Verifying your email...</p>}
      {status === 'success' && <p>Email verified! Logging you in...</p>}
      {status === 'error' && <p>Verification failed or link expired.</p>}
    </div>
  );
};

export default VerifyEmail; 