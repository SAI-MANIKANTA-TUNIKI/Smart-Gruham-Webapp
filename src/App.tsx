import React, { useState, useEffect } from 'react';
import './App.css';
import Navbar from './Components/Navigation/Navbar';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './Components/Pages/Home';
import PowerSystem from './Components/Pages/Power';
import Profile from './Components/Pages/Profile';
import DeviceData from './Components/Pages/DeviceData';
import Camera from './Components/Pages/Camers'; // ✅ Fixed: was `Camers`
import OfficeRoom from './Components/Pages/OfficeRoom';
import SettingsPage from './Components/Pages/Setting';
import Authentication from './Components/Authentication/Authentication';
import LedStrip from './Components/Pages/Ledstrip';
import { supabase } from './Gruham-Server/supabaseClient';

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [tempProfile, setTempProfile] = useState<string>('');

  useEffect(() => {
    // Load dark mode setting from localStorage
    const storedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(storedDarkMode);

    // Get Supabase session
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setIsAuthenticated(true);
        setTempProfile(data.session.user.user_metadata?.name || '');
      }
    };
    getSession();

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
      if (session?.user) {
        setTempProfile(session.user.user_metadata?.name || '');
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode);
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
  };

  const handleUsernameChange = (newUsername: string) => {
    setTempProfile(newUsername);
  };

  return (
    <HashRouter>
      <div className={`app ${darkMode ? 'darkMode' : ''}`}>
        {isAuthenticated && <Navbar />}

        <Routes>
          {/* Authentication */}
          <Route
            path="/"
            element={
              isAuthenticated ? <Navigate to="/home" /> : <Authentication onLogin={handleLogin} />
            }
          />

          {/* Pages */}
          <Route
            path="/home"
            element={
              isAuthenticated ? (
                <Home darkMode={darkMode} username={tempProfile} />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/PowerSystem"
            element={
              isAuthenticated ? (
                <PowerSystem darkMode={darkMode} />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/DeviceData"
            element={
              isAuthenticated ? (
                <DeviceData darkMode={darkMode} />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/Camera"
            element={
              isAuthenticated ? (
                <Camera darkMode={darkMode} />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/OfficeRoom"
            element={
              isAuthenticated ? (
                <OfficeRoom darkMode={darkMode} />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/LedStrip"
            element={
              isAuthenticated ? (
                <LedStrip darkMode={darkMode} />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/SettingsPage" // ✅ Fixed capitalization
            element={
              isAuthenticated ? (
                <SettingsPage
                  darkMode={darkMode}
                  onToggleDarkMode={setDarkMode}
                  handleSignOut={handleLogout}
                />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/Profile"
            element={
              isAuthenticated ? (
                <Profile
                  darkMode={darkMode}
                  onUsernameChange={handleUsernameChange}
                />
              ) : (
                <Navigate to="/" />
              )
            }
          />
        </Routes>
      </div>
    </HashRouter>
  );
};

export default App;
