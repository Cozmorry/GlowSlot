import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user: authUser, logout, getToken } = useAuth();
  const { showError } = useNotification();
  const [activeTab, setActiveTab] = useState('overview');
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Handle URL parameters for tab switching
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    if (tabParam && ['overview', 'appointments', 'stats', 'users', 'settings'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, []);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Function to handle tab changes
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    // Update URL without page reload
    const url = new URL(window.location);
    url.searchParams.set('tab', tabId);
    window.history.pushState({}, '', url);
  };

  // Listen for auth changes
  useEffect(() => {
    if (!authUser) {
      navigate('/login');
      return;
    }

    if (authUser.role !== 'admin') {
      logout();
      navigate('/login');
      return;
    }

    setUser(authUser);
    fetchStats();
  }, [authUser, navigate, logout]);



  const fetchStats = async () => {
    try {
      setLoading(true);
      const token = getToken();
      
      const response = await fetch('http://localhost:5000/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch statistics');
      }
      
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'linear-gradient(135deg, #f5c6ea 0%, #e91e63 100%)',
        color: '#fff',
        fontSize: '18px',
        fontWeight: '500'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          padding: '20px 40px',
          borderRadius: '12px',
          backdropFilter: 'blur(10px)',
      }}>
        Loading dashboard...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'linear-gradient(135deg, #f5c6ea 0%, #e91e63 100%)',
        color: '#fff'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          padding: '30px',
          borderRadius: '12px',
          backdropFilter: 'blur(10px)',
          textAlign: 'center',
          maxWidth: '400px'
        }}>
          <p style={{ color: '#ffebee', marginBottom: '20px', fontSize: '16px' }}>{error}</p>
        <button 
          onClick={handleLogout}
          style={{
              padding: '12px 24px',
              background: 'rgba(255, 255, 255, 0.2)',
            color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.2)';
          }}
        >
          Back to Login
        </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      background: 'linear-gradient(135deg, #f5c6ea 0%, #e91e63 100%)',
      minHeight: '100vh',
      color: '#2d3748',
      padding: '0'
    }}>
      {/* Header */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        padding: '20px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.2)'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
          maxWidth: '1400px',
          margin: '0 auto',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <h1 style={{ 
              margin: 0, 
              fontSize: isMobile ? '20px' : '28px',
              fontWeight: '700',
              color: '#e91e63',
              letterSpacing: '-0.5px'
            }}>
              GlowSlot Admin
            </h1>
            <div style={{
              background: '#e91e63',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '8px',
              fontSize: '10px',
              fontWeight: '600',
              textTransform: 'uppercase'
            }}>
              Admin
            </div>
          </div>
          
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px',
            flexWrap: 'wrap'
          }}>
            <div style={{
              background: 'rgba(233, 30, 99, 0.1)',
              padding: '6px 12px',
              borderRadius: '16px',
              fontSize: '12px',
              color: '#e91e63',
              fontWeight: '500'
            }}>
              {user?.name || 'Admin'}
            </div>
          <button
            onClick={handleLogout}
            style={{
              padding: '8px 16px',
                background: '#e91e63',
              color: 'white',
              border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '500',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#c2185b';
                e.target.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = '#e91e63';
                e.target.style.transform = 'translateY(0)';
            }}
          >
            Logout
          </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobile && (
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          padding: '12px 20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
      <div style={{
        display: 'flex',
            overflowX: 'auto',
            gap: '8px',
            paddingBottom: '4px'
          }}>
            {[
              { id: 'overview', label: 'Overview', icon: '📊' },
              { id: 'appointments', label: 'Appointments', icon: '📅' },
              { id: 'stats', label: 'Stats', icon: '📈' },
              { id: 'users', label: 'Users', icon: '👥' },
              { id: 'settings', label: 'Settings', icon: '⚙️' }
            ].map(tab => (
                              <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
          style={{
                  padding: '8px 12px',
                  borderRadius: '20px',
            cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  background: activeTab === tab.id ? '#e91e63' : 'rgba(233, 30, 99, 0.1)',
                  color: activeTab === tab.id ? 'white' : '#e91e63',
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: '500',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span style={{ fontSize: '14px' }}>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
        </div>
        </div>
      )}

      {/* Main Content */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: isMobile ? '16px' : '30px',
        display: isMobile ? 'block' : 'flex',
        gap: isMobile ? '0' : '30px'
      }}>
        {/* Sidebar - Desktop Only */}
        {!isMobile && (
          <div style={{
            width: '250px',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '20px',
            height: 'fit-content',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <nav>
              {[
                { id: 'overview', label: 'Overview', icon: '📊' },
                { id: 'appointments', label: 'Appointments', icon: '📅' },
                { id: 'stats', label: 'Statistics', icon: '📈' },
                { id: 'users', label: 'Users', icon: '👥' },
                { id: 'settings', label: 'Settings', icon: '⚙️' }
              ].map(tab => (
                              <div
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
          style={{
                    padding: '12px 16px',
                    marginBottom: '8px',
                    borderRadius: '8px',
            cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    background: activeTab === tab.id ? 'rgba(233, 30, 99, 0.1)' : 'transparent',
                    color: activeTab === tab.id ? '#e91e63' : '#4a5568',
                    fontWeight: activeTab === tab.id ? '600' : '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}
                  onMouseEnter={(e) => {
                    if (activeTab !== tab.id) {
                      e.target.style.background = 'rgba(233, 30, 99, 0.05)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeTab !== tab.id) {
                      e.target.style.background = 'transparent';
                    }
                  }}
                >
                  <span style={{ fontSize: '18px' }}>{tab.icon}</span>
                  {tab.label}
        </div>
              ))}
            </nav>
          </div>
        )}

        {/* Main Content Area */}
        <div style={{
          flex: 1,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          padding: isMobile ? '20px' : '30px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          marginTop: isMobile ? '16px' : '0'
        }}>
                      {activeTab === 'overview' && <OverviewTab stats={stats} isMobile={isMobile} onTabChange={handleTabChange} />}
            {activeTab === 'appointments' && <AppointmentsTab isMobile={isMobile} showError={showError} />}
            {activeTab === 'stats' && <StatsTab stats={stats} isMobile={isMobile} />}
            {activeTab === 'users' && <UsersTab isMobile={isMobile} />}
            {activeTab === 'settings' && <SettingsTab isMobile={isMobile} />}
        </div>
      </div>
    </div>
  );
}

// Overview Tab Component
function OverviewTab({ stats, isMobile, onTabChange }) {
  
  const StatCard = ({ title, value, icon, color, subtitle }) => (
    <div style={{
      background: 'rgba(255, 255, 255, 0.8)',
      padding: '24px',
      borderRadius: '12px',
      border: `1px solid ${color}20`,
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
      transition: 'all 0.2s ease'
    }}
    onMouseEnter={(e) => {
      e.target.style.transform = 'translateY(-2px)';
      e.target.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.1)';
    }}
    onMouseLeave={(e) => {
      e.target.style.transform = 'translateY(0)';
      e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.05)';
    }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          background: color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px'
        }}>
          {icon}
        </div>
        <div>
          <h3 style={{ margin: 0, fontSize: '16px', color: '#4a5568', fontWeight: '600' }}>{title}</h3>
          {subtitle && <p style={{ margin: 0, fontSize: '12px', color: '#718096' }}>{subtitle}</p>}
      </div>
      </div>
      <div style={{ fontSize: '28px', fontWeight: '700', color: '#2d3748' }}>{value}</div>
    </div>
  );

  return (
      <div>
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ 
          margin: '0 0 8px 0', 
          fontSize: '24px', 
          fontWeight: '700',
          color: '#2d3748'
        }}>
          Dashboard Overview
        </h2>
        <p style={{ 
          margin: 0, 
          color: '#718096',
          fontSize: '16px'
        }}>
          Welcome to your admin dashboard. Here's what's happening today.
        </p>
      </div>

      {stats ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: isMobile ? '16px' : '20px',
          marginBottom: '30px'
        }}>
          <StatCard 
            title="Total Bookings" 
            value={stats.totalBookings || 0} 
            icon="📊"
            color="#e91e63"
            subtitle="All time bookings"
          />
          <StatCard 
            title="Pending" 
            value={stats.pendingBookings || 0} 
            icon="⏳"
            color="#ff9800"
            subtitle="Awaiting confirmation"
          />
          <StatCard 
            title="Paid" 
            value={stats.paidBookings || 0} 
            icon="💳"
            color="#10B981"
            subtitle="Paid - Pending Allocation"
          />
          <StatCard 
            title="Confirmed" 
            value={stats.confirmedBookings || 0} 
            icon="✅"
            color="#4caf50"
            subtitle="Confirmed appointments"
          />
          <StatCard 
            title="Revenue" 
            value={`KSH ${stats.revenue || 0}`} 
            icon="💰"
            color="#2196f3"
            subtitle="Total earnings"
          />
        </div>
      ) : (
        <div style={{
          background: 'rgba(233, 30, 99, 0.1)',
          padding: '20px',
          borderRadius: '12px',
          textAlign: 'center',
          color: '#e91e63'
        }}>
          Loading statistics...
        </div>
      )}

      <div style={{
        background: 'rgba(255, 255, 255, 0.8)',
        padding: '24px',
        borderRadius: '12px',
        border: '1px solid rgba(233, 30, 99, 0.2)'
      }}>
        <h3 style={{ margin: '0 0 16px 0', color: '#2d3748', fontWeight: '600' }}>Quick Actions</h3>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button 
            onClick={() => onTabChange('appointments')}
            style={{
              padding: '12px 20px',
              background: '#e91e63',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#c2185b';
              e.target.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = '#e91e63';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            View All Appointments
          </button>
          <button 
            onClick={() => onTabChange('users')}
            style={{
              padding: '12px 20px',
              background: 'rgba(233, 30, 99, 0.1)',
              color: '#e91e63',
              border: '1px solid #e91e63',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(233, 30, 99, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(233, 30, 99, 0.1)';
            }}
          >
            Manage Users
          </button>
        </div>
      </div>
    </div>
  );
}

// Appointments Tab Component
function AppointmentsTab({ isMobile, showError }) {
  const { getToken } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const token = getToken();
      
      const response = await fetch('http://localhost:5000/api/admin/appointments', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch appointments');
      }
      
      const data = await response.json();
      setAppointments(data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setError('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const updateAppointmentStatus = async (id, status) => {
    try {
      const token = getToken();
      
      const response = await fetch(`http://localhost:5000/api/admin/appointments/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update appointment');
      }
      
      // Refresh appointments after update
      fetchAppointments();
    } catch (error) {
      console.error('Error updating appointment:', error);
      showError('Failed to update appointment status');
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#ff9800';
      case 'paid': return '#10B981';
      case 'confirmed': return '#4caf50';
      case 'completed': return '#2196f3';
      case 'cancelled': return '#f44336';
      default: return '#9e9e9e';
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '40px',
        color: '#718096'
      }}>
        Loading appointments...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        background: 'rgba(244, 67, 54, 0.1)',
        color: '#f44336',
        padding: '16px',
        borderRadius: '8px',
        border: '1px solid rgba(244, 67, 54, 0.2)'
      }}>
        {error}
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ 
          margin: '0 0 8px 0', 
          fontSize: '24px', 
          fontWeight: '700',
          color: '#2d3748'
        }}>
          Appointments Management
        </h2>
        <p style={{ 
          margin: 0, 
          color: '#718096',
          fontSize: '16px'
        }}>
          Manage and update appointment statuses
        </p>
      </div>
      
      {appointments.length === 0 ? (
        <div style={{
          background: 'rgba(255, 255, 255, 0.8)',
          padding: '40px',
          borderRadius: '12px',
          textAlign: 'center',
          color: '#718096'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📅</div>
          <h3 style={{ margin: '0 0 8px 0', color: '#2d3748' }}>No Appointments</h3>
          <p style={{ margin: 0 }}>No upcoming appointments found.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {appointments.map(appointment => (
            <div 
              key={appointment._id}
              style={{
                background: 'rgba(255, 255, 255, 0.8)',
                padding: '24px',
                borderRadius: '12px',
                border: '1px solid rgba(233, 30, 99, 0.1)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.05)';
              }}
            >
                                <div style={{ 
                    display: 'flex', 
                    flexDirection: isMobile ? 'column' : 'row',
                    justifyContent: 'space-between', 
                    alignItems: isMobile ? 'stretch' : 'flex-start',
                    gap: isMobile ? '16px' : '0'
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ 
                        display: 'flex', 
                        flexDirection: isMobile ? 'column' : 'row',
                        alignItems: isMobile ? 'flex-start' : 'center', 
                        gap: '12px', 
                        marginBottom: '16px' 
                      }}>
                        <h3 style={{ 
                          margin: 0, 
                          fontSize: isMobile ? '16px' : '18px', 
                          fontWeight: '600', 
                          color: '#2d3748' 
                        }}>
                          {appointment.service}
                        </h3>
                    <span style={{ 
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: '600',
                      color: 'white',
                          background: getStatusColor(appointment.status),
                          textTransform: 'uppercase',
                          alignSelf: isMobile ? 'flex-start' : 'center'
                    }}>
                          {appointment.status}
                    </span>
                </div>
                
                      <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(200px, 1fr))', 
                        gap: '12px' 
                      }}>
                        <div>
                          <strong style={{ color: '#4a5568', fontSize: '14px' }}>Client:</strong>
                          <p style={{ margin: '4px 0 0 0', color: '#2d3748' }}>{appointment.fullName}</p>
                        </div>
                        <div>
                          <strong style={{ color: '#4a5568', fontSize: '14px' }}>Phone:</strong>
                          <p style={{ margin: '4px 0 0 0', color: '#2d3748' }}>{appointment.phone}</p>
                        </div>
                        <div>
                          <strong style={{ color: '#4a5568', fontSize: '14px' }}>Date/Time:</strong>
                          <p style={{ margin: '4px 0 0 0', color: '#2d3748' }}>{formatDate(appointment.dateTime)}</p>
                        </div>
                        <div>
                          <strong style={{ color: '#4a5568', fontSize: '14px' }}>Staff:</strong>
                          <p style={{ margin: '4px 0 0 0', color: '#2d3748' }}>{appointment.staff}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div style={{ 
                      display: 'flex', 
                      flexDirection: isMobile ? 'row' : 'column', 
                      gap: '8px', 
                      marginLeft: isMobile ? '0' : '20px',
                      justifyContent: isMobile ? 'space-between' : 'flex-start'
                    }}>
                      {/* Show Confirm button only for paid appointments */}
                      {appointment.status === 'paid' && (
                  <button
                    onClick={() => updateAppointmentStatus(appointment._id, 'confirmed')}
                    style={{
                            padding: '8px 16px',
                            background: '#4caf50',
                      color: 'white',
                      border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontWeight: '500',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          Confirm Appointment
                  </button>
                      )}
                  
                      {/* Show Complete button for confirmed appointments */}
                      {appointment.status === 'confirmed' && (
                  <button
                    onClick={() => updateAppointmentStatus(appointment._id, 'completed')}
                    style={{
                            padding: '8px 16px',
                            background: '#2196f3',
                      color: 'white',
                      border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontWeight: '500',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          Mark Complete
                  </button>
                      )}
                  
                      {/* Show Cancel button for paid or confirmed appointments */}
                      {(appointment.status === 'paid' || appointment.status === 'confirmed') && (
                  <button
                    onClick={() => updateAppointmentStatus(appointment._id, 'cancelled')}
                    style={{
                            padding: '8px 16px',
                            background: '#f44336',
                      color: 'white',
                      border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontWeight: '500',
                            transition: 'all 0.2s ease'
                    }}
                  >
                    Cancel
                  </button>
                      )}
                      
                      {/* Show status info for completed or cancelled */}
                      {(appointment.status === 'completed' || appointment.status === 'cancelled') && (
                        <div style={{
                          padding: '8px 16px',
                          background: appointment.status === 'completed' ? '#90caf9' : '#ef9a9a',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '500',
                          opacity: 0.7,
                          textAlign: 'center'
                        }}>
                          {appointment.status === 'completed' ? 'Completed' : 'Cancelled'}
                        </div>
                      )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Stats Tab Component
function StatsTab({ stats, isMobile }) {
  if (!stats) {
    return (
      <div style={{
        background: 'rgba(233, 30, 99, 0.1)',
        padding: '20px',
        borderRadius: '12px',
        textAlign: 'center',
        color: '#e91e63'
      }}>
        No statistics available
      </div>
    );
  }

  const StatCard = ({ title, value, color, icon }) => (
    <div style={{
      background: 'rgba(255, 255, 255, 0.8)',
      padding: '24px',
      borderRadius: '12px',
      textAlign: 'center',
      border: `1px solid ${color}20`,
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
      transition: 'all 0.2s ease'
    }}
    onMouseEnter={(e) => {
      e.target.style.transform = 'translateY(-2px)';
      e.target.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.1)';
    }}
    onMouseLeave={(e) => {
      e.target.style.transform = 'translateY(0)';
      e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.05)';
    }}
    >
      <div style={{
        width: '48px',
        height: '48px',
        borderRadius: '12px',
        background: color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '24px',
        margin: '0 auto 16px auto'
      }}>
        {icon}
      </div>
      <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#4a5568', fontWeight: '600' }}>{title}</h3>
      <p style={{ fontSize: '24px', fontWeight: '700', margin: 0, color: '#2d3748' }}>{value}</p>
    </div>
  );

  return (
    <div>
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ 
          margin: '0 0 8px 0', 
          fontSize: '24px', 
          fontWeight: '700',
          color: '#2d3748'
        }}>
          Dashboard Statistics
        </h2>
        <p style={{ 
          margin: 0, 
          color: '#718096',
          fontSize: '16px'
        }}>
          Comprehensive overview of your business metrics
        </p>
      </div>
      
      <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: isMobile ? '12px' : '20px',
        marginBottom: '30px'
      }}>
          <StatCard title="Total Bookings" value={stats.totalBookings} color="#e91e63" icon="📊" />
          <StatCard title="Pending" value={stats.pendingBookings} color="#ff9800" icon="⏳" />
          <StatCard title="Confirmed" value={stats.confirmedBookings} color="#4caf50" icon="✅" />
          <StatCard title="Completed" value={stats.completedBookings} color="#2196f3" icon="🎉" />
          <StatCard title="Cancelled" value={stats.cancelledBookings} color="#f44336" icon="❌" />
          <StatCard title="Total Users" value={stats.totalUsers} color="#00bcd4" icon="👥" />
          <StatCard title="Upcoming" value={stats.upcomingBookings} color="#ff9800" icon="📅" />
          <StatCard title="Revenue" value={`KSH ${stats.revenue}`} color="#4caf50" icon="💰" />
      </div>
      
      <div style={{
        background: 'rgba(255, 255, 255, 0.8)',
        padding: '24px',
        borderRadius: '12px',
        border: '1px solid rgba(233, 30, 99, 0.1)'
      }}>
        <h3 style={{ margin: '0 0 20px 0', color: '#2d3748', fontWeight: '600' }}>Bookings by Category</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {stats.bookingsByCategory?.map((category, index) => (
          <div key={index} style={{
            display: 'flex',
            justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px 0',
              borderBottom: index < stats.bookingsByCategory.length - 1 ? '1px solid rgba(233, 30, 99, 0.1)' : 'none'
            }}>
              <span style={{ 
                textTransform: 'capitalize', 
                fontWeight: '500',
                color: '#2d3748'
              }}>
                {category._id}
              </span>
              <span style={{ 
                fontWeight: '600',
                color: '#e91e63',
                fontSize: '18px'
              }}>
                {category.count}
              </span>
          </div>
        ))}
        </div>
      </div>
    </div>
  );
}

// Users Tab Component
function UsersTab({ isMobile }) {
  const { getToken } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = getToken();
      
      const response = await fetch('http://localhost:5000/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '40px',
        color: '#718096'
      }}>
        Loading users...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        background: 'rgba(244, 67, 54, 0.1)',
        color: '#f44336',
        padding: '16px',
        borderRadius: '8px',
        border: '1px solid rgba(244, 67, 54, 0.2)'
      }}>
        {error}
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ 
          margin: '0 0 8px 0', 
          fontSize: '24px', 
          fontWeight: '700',
          color: '#2d3748'
        }}>
          User Management
        </h2>
        <p style={{ 
          margin: 0, 
          color: '#718096',
          fontSize: '16px'
        }}>
          Manage user accounts and permissions
        </p>
      </div>
      
      {users.length === 0 ? (
        <div style={{
          background: 'rgba(255, 255, 255, 0.8)',
          padding: '40px',
          borderRadius: '12px',
          textAlign: 'center',
          color: '#718096'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>👥</div>
          <h3 style={{ margin: '0 0 8px 0', color: '#2d3748' }}>No Users</h3>
          <p style={{ margin: 0 }}>No users found.</p>
        </div>
      ) : (
        <div style={{
          background: 'rgba(255, 255, 255, 0.8)',
          borderRadius: '12px',
          overflow: 'hidden',
          border: '1px solid rgba(233, 30, 99, 0.1)'
        }}>
          {isMobile ? (
            // Mobile layout - cards
            <div>
              {users.map(user => (
                <div key={user._id} style={{
                  padding: '16px',
                  borderBottom: '1px solid rgba(233, 30, 99, 0.1)',
                  transition: 'background 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(233, 30, 99, 0.02)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'transparent';
                }}
                >
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: '8px'
                  }}>
                    <div style={{ fontWeight: '600', color: '#2d3748', fontSize: '16px' }}>
                      {user.name}
                    </div>
                    <span style={{
                      display: 'inline-block',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      background: user.verified ? '#4caf50' : '#f44336',
                      color: 'white',
                      fontSize: '10px',
                      fontWeight: '600',
                      textTransform: 'uppercase'
                    }}>
                      {user.verified ? 'Verified' : 'Unverified'}
                    </span>
                  </div>
                  <div style={{ color: '#4a5568', fontSize: '14px', marginBottom: '4px' }}>
                    {user.email}
                  </div>
                  <div style={{ 
                    textTransform: 'capitalize',
                    color: '#718096',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}>
                    {user.role}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Desktop layout - table
            <>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 2fr 1fr 1fr',
                fontWeight: '600',
                padding: '20px',
                background: 'rgba(233, 30, 99, 0.05)',
                borderBottom: '1px solid rgba(233, 30, 99, 0.1)',
                color: '#2d3748'
          }}>
            <div>Name</div>
            <div>Email</div>
            <div>Role</div>
            <div>Status</div>
          </div>
          
          {users.map(user => (
            <div key={user._id} style={{
              display: 'grid',
              gridTemplateColumns: '1fr 2fr 1fr 1fr',
                  padding: '20px',
                  borderBottom: '1px solid rgba(233, 30, 99, 0.1)',
                  transition: 'background 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(233, 30, 99, 0.02)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'transparent';
                }}
                >
                  <div style={{ fontWeight: '500', color: '#2d3748' }}>{user.name}</div>
                  <div style={{ color: '#4a5568' }}>{user.email}</div>
                  <div style={{ 
                    textTransform: 'capitalize',
                    color: '#4a5568',
                    fontWeight: '500'
                  }}>
                    {user.role}
                  </div>
              <div>
                <span style={{
                  display: 'inline-block',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      background: user.verified ? '#4caf50' : '#f44336',
                  color: 'white',
                      fontSize: '12px',
                      fontWeight: '600',
                      textTransform: 'uppercase'
                }}>
                      {user.verified ? 'Verified' : 'Unverified'}
                </span>
              </div>
            </div>
          ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}

// Settings Tab Component
function SettingsTab({ isMobile }) {
  return (
    <div>
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ 
          margin: '0 0 8px 0', 
          fontSize: '24px', 
          fontWeight: '700',
          color: '#2d3748'
        }}>
          Settings
        </h2>
        <p style={{ 
          margin: 0, 
          color: '#718096',
          fontSize: '16px'
        }}>
          Manage your admin preferences and system settings
        </p>
      </div>
      
      <div style={{
        background: 'rgba(255, 255, 255, 0.8)',
        padding: '24px',
        borderRadius: '12px',
        border: '1px solid rgba(233, 30, 99, 0.1)',
        textAlign: 'center',
        color: '#718096'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚙️</div>
        <h3 style={{ margin: '0 0 8px 0', color: '#2d3748' }}>Settings Coming Soon</h3>
        <p style={{ margin: 0 }}>Advanced settings and configuration options will be available here.</p>
      </div>
    </div>
  );
}