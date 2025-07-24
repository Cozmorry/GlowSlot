import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to validate token with backend
  const validateToken = async (token) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/validate', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        return { valid: true, user: data.user };
      } else {
        return { valid: false, user: null };
      }
    } catch (error) {
      console.error('Token validation error:', error);
      return { valid: false, user: null };
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      // Check for user data in localStorage
      const storedUser = localStorage.getItem('user');
      const storedToken = localStorage.getItem('token');
      
      console.log('Loading stored user data');
      console.log('Stored user exists:', !!storedUser);
      console.log('Stored token exists:', !!storedToken);
      
      // Debug: Check all localStorage keys
      console.log('All localStorage keys:', Object.keys(localStorage));
      
      if (storedUser && storedToken) {
        const parsedUser = JSON.parse(storedUser);
        console.log('Parsed user data:', parsedUser);
        
        // Validate token with backend
        const validation = await validateToken(storedToken);
        
        if (validation.valid) {
          console.log('Token is valid, setting user');
          console.log('Validation user data:', validation.user);
          console.log('Parsed user data:', parsedUser);
          console.log('User role from validation:', validation.user?.role);
          console.log('User role from localStorage:', parsedUser?.role);
          
          // Use the user data from validation (backend) instead of localStorage
          console.log('Setting user from validation:', validation.user);
          
          // Check if there's a role mismatch between stored and validated user
          if (parsedUser && parsedUser.role !== validation.user.role) {
            console.log('Role mismatch detected! Clearing all auth data');
            console.log('Stored role:', parsedUser.role, 'Validated role:', validation.user.role);
            
            // Clear all auth-related localStorage data
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
          }
          
          setUser(validation.user);
        } else {
          console.log('Token is invalid, clearing auth data');
          // Clear invalid auth data
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
          setUser(null);
        }
      } else {
        console.log('No stored user or token found');
        setUser(null);
      }
      
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = (userData) => {
    console.log('Login called with userData:', userData);
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', userData.token || '');
    localStorage.setItem('userId', userData.id || '');
    localStorage.removeItem('guest');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
  };

  const setGuest = () => {
    setUser(null);
    localStorage.setItem('guest', 'true');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
  };

  const getToken = () => {
    const token = localStorage.getItem('token');
    console.log('Getting token:', token ? 'Found' : 'Not found');
    return token;
  };
  const getUserId = () => localStorage.getItem('userId');

  const updateUser = (updatedUserData) => {
    setUser(updatedUserData);
    localStorage.setItem('user', JSON.stringify(updatedUserData));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, setGuest, loading, getToken, getUserId, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};