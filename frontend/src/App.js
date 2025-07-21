import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Profile from './pages/Profile';
import { ThemeProvider } from './context/ThemeContext';
import LoadingPage from './pages/LoadingPage';
import Settings from './pages/Settings';
import Cart from './pages/Cart';
import Search from './pages/Search';
import MainLayout from './components/MainLayout';
import Signup from './pages/Signup';
import Login from './pages/Login';
import FAQs from './pages/FAQs';

function App() {
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);
  if (loading) return <LoadingPage />;
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          {/* Routes with MainLayout */}
          <Route path="/" element={<MainLayout><Home /></MainLayout>} />
          <Route path="/home" element={<MainLayout><Home /></MainLayout>} />
          <Route path="/profile" element={<MainLayout><Profile /></MainLayout>} />
          <Route path="/settings" element={<MainLayout><Settings /></MainLayout>} />
          <Route path="/cart" element={<MainLayout><Cart /></MainLayout>} />
          <Route path="/search" element={<MainLayout><Search /></MainLayout>} />
          <Route path="/faqs" element={<MainLayout><FAQs /></MainLayout>} />

          {/* Standalone Routes */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
