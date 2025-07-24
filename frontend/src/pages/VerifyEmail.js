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

    fetch(`${process.env.REACT_APP_API_URL}/auth/verify-email?token=${token}`)
      .then(res => res.json())
      .then(data => {
        if (data.token) {
          login(data.user);
          setStatus('success');
          setTimeout(() => navigate('/dashboard'), 2000);
        } else {
          setStatus('error');
        }
      })
      .catch(() => setStatus('error'));
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