import React from 'react';
import './App.css';
import Home from './pages/Home';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Profile from './pages/Profile';
import LoadingPage from './pages/LoadingPage';
import Settings from './pages/Settings';
import Cart from './pages/Cart';
import Search from './pages/Search';
import MainLayout from './components/MainLayout';
import Signup from './pages/Signup';
import Login from './pages/Login';
import FAQs from './pages/FAQs';
import About from './pages/About';
import Staff from './pages/Staff';
import Services from './pages/Services';
import Nails from './pages/Nails';
import Hair from './pages/Hair';
import Spa from './pages/Spa';
import Waxing from './pages/Waxing';
import MakeUp from './pages/MakeUp';
import Barber from './pages/Barber';
import Piercings from './pages/Piercings';
import Tattoo from './pages/Tattoo';
import Checkout from './pages/Checkout';

function App() {
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Set CSS variables for theme colors
  React.useEffect(() => {
    const mode = localStorage.getItem('theme');
    const theme = mode === 'dark'
      ? {
          background: '#1a1a1a',
          card: '#232323',
          text: '#fff',
          accent: '#D72660',
          input: '#2a2a2a',
          border: '#444',
        }
      : {
          background: '#FFFFFF',
          card: '#F5F5F5',
          text: '#333333',
          accent: '#D72660',
          input: '#F5F5F5',
          border: '#DDDDDD',
        };
    document.body.style.setProperty('--color-bg', theme.background);
    document.body.style.setProperty('--color-card', theme.card);
    document.body.style.setProperty('--color-text', theme.text);
    document.body.style.setProperty('--color-accent', theme.accent);
    document.body.style.setProperty('--color-input', theme.input);
    document.body.style.setProperty('--color-border', theme.border);
  }, []);
  if (loading) return <LoadingPage />;
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Redirect root to login */}
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/home" element={<MainLayout><Home /></MainLayout>} />
          <Route path="/profile" element={<MainLayout><Profile /></MainLayout>} />
          <Route path="/settings" element={<MainLayout><Settings /></MainLayout>} />
          <Route path="/cart" element={<MainLayout><Cart /></MainLayout>} />
          <Route path="/search" element={<MainLayout><Search /></MainLayout>} />
          <Route path="/faqs" element={<MainLayout><FAQs /></MainLayout>} />
          <Route path="/about" element={<MainLayout><About /></MainLayout>} />
          <Route path="/staff" element={<MainLayout><Staff /></MainLayout>} />
          <Route path="/services" element={<MainLayout><Services /></MainLayout>} />
          <Route path="/nails" element={<MainLayout><Nails /></MainLayout>} />
          <Route path="/hair" element={<MainLayout><Hair /></MainLayout>} />
          <Route path="/spa" element={<MainLayout><Spa /></MainLayout>} />
          <Route path="/waxing" element={<MainLayout><Waxing /></MainLayout>} />
          <Route path="/makeup" element={<MainLayout><MakeUp /></MainLayout>} />
          <Route path="/barber" element={<MainLayout><Barber /></MainLayout>} />
          <Route path="/piercings" element={<MainLayout><Piercings /></MainLayout>} />
          <Route path="/tattoo" element={<MainLayout><Tattoo /></MainLayout>} />
          <Route path="/checkout" element={<MainLayout><Checkout /></MainLayout>} />

            {/* Standalone Routes */}
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;