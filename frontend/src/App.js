import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import User from './pages/User';
import { ThemeProvider } from './context/ThemeContext';
import LoadingPage from './pages/LoadingPage';

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
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/user" element={<User />} />
          {/* ...other routes... */}
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
