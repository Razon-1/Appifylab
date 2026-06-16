/**
 * BUDDY SCRIPT - MAIN APP COMPONENT
 * ===================================
 * Root component for the entire React application
 * 
 * FEATURES:
 * 1. Authentication Management
 *    - Login/logout functionality
 *    - Persistent login (localStorage)
 *    - Protected routes
 * 
 * 2. Routing
 *    - /login: User login page
 *    - /register: User registration page
 *    - /feed: Main feed (protected, requires login)
 * 
 * 3. Context Provider
 *    - Provides auth state to all child components
 *    - Enables global auth state management
 * 
 * FLOW:
 * 1. Component mounts and checks for existing auth token
 * 2. If token exists, automatically logs user in
 * 3. Routes redirect unauthenticated users to /login
 * 4. Authenticated users can access /feed
 */

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Feed from './pages/Feed';
import { AuthContext } from './context/AuthContext';

function App() {
  // Auth state management
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  /**
   * Handle user login
   * - Store user data in state and localStorage
   * - Store authentication token for API requests
   */
  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('authToken', userData.token);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  /**
   * Handle user logout
   * - Clear user data and token
   * - Redirect to login
   */
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  };

  /**
   * Auto-login on app load if token exists
   * - Restores user session from localStorage
   * - Enables refresh without re-login
   */
  React.useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      <Router>
        <Routes>
          {/* Public Routes - Accessible when not authenticated */}
          <Route 
            path="/login" 
            element={!isAuthenticated ? <Login onLogin={login} /> : <Navigate to="/feed" />} 
          />
          <Route 
            path="/register" 
            element={!isAuthenticated ? <Register onRegister={login} /> : <Navigate to="/feed" />} 
          />

          {/* Protected Routes - Require authentication */}
          <Route 
            path="/feed" 
            element={isAuthenticated ? <Feed /> : <Navigate to="/login" />} 
          />

          {/* Fallback - Redirect to login */}
          <Route path="/" element={<Navigate to={isAuthenticated ? "/feed" : "/login"} />} />
          <Route path="*" element={<Navigate to={isAuthenticated ? "/feed" : "/login"} />} />
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
            path="/login" 
            element={isAuthenticated ? <Navigate to="/feed" /> : <Login onLogin={login} />} 
          />
          <Route 
            path="/register" 
            element={isAuthenticated ? <Navigate to="/feed" /> : <Register onRegister={login} />} 
          />
          <Route 
            path="/feed" 
            element={isAuthenticated ? <Feed /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/" 
            element={<Navigate to={isAuthenticated ? "/feed" : "/login"} />} 
          />
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
