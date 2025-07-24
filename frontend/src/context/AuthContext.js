import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tabId] = useState(() => `tab_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);

  useEffect(() => {
    // Check for user data in localStorage for this specific tab
    const storedUser = localStorage.getItem(`user_${tabId}`);
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);

    // Listen for storage changes from other tabs (but only for global auth changes)
    const handleStorageChange = (e) => {
      // Only respond to global auth changes, not tab-specific ones
      if (e.key === 'global_auth_change') {
        const changeData = JSON.parse(e.newValue || '{}');
        if (changeData.tabId !== tabId) {
          // Another tab changed auth, but we keep our own state
          // Only clear if it's a logout event
          if (changeData.action === 'logout' && changeData.userId === user?.id) {
            setUser(null);
            localStorage.removeItem(`user_${tabId}`);
          }
        }
      }
    };

    // Listen for custom auth change events (same tab)
    const handleAuthChange = (e) => {
      if (e.detail.tabId === tabId) {
        setUser(e.detail.user);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('authChange', handleAuthChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authChange', handleAuthChange);
    };
  }, [tabId, user?.id]);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem(`user_${tabId}`, JSON.stringify(userData));
    localStorage.setItem(`token_${tabId}`, userData.token || '');
    localStorage.setItem(`userId_${tabId}`, userData.id || '');
    localStorage.removeItem('guest');
    // Dispatch custom event for immediate tab synchronization
    window.dispatchEvent(new CustomEvent('authChange', { detail: { user: userData, tabId } }));
    // Notify other tabs about the login (but don't force them to change)
    localStorage.setItem('global_auth_change', JSON.stringify({
      action: 'login',
      tabId,
      userId: userData.id,
      timestamp: Date.now()
    }));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(`user_${tabId}`);
    localStorage.removeItem(`token_${tabId}`);
    localStorage.removeItem(`userId_${tabId}`);
    // Dispatch custom event for immediate tab synchronization
    window.dispatchEvent(new CustomEvent('authChange', { detail: { user: null, tabId } }));
    // Notify other tabs about the logout
    localStorage.setItem('global_auth_change', JSON.stringify({
      action: 'logout',
      tabId,
      userId: user?.id,
      timestamp: Date.now()
    }));
  };

  const setGuest = () => {
    setUser(null);
    localStorage.setItem('guest', 'true');
    localStorage.removeItem(`user_${tabId}`);
    localStorage.removeItem(`token_${tabId}`);
    localStorage.removeItem(`userId_${tabId}`);
  };

  const getToken = () => localStorage.getItem(`token_${tabId}`);
  const getUserId = () => localStorage.getItem(`userId_${tabId}`);

  const updateUser = (updatedUserData) => {
    setUser(updatedUserData);
    localStorage.setItem(`user_${tabId}`, JSON.stringify(updatedUserData));
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