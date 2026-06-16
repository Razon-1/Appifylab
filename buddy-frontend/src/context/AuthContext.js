/**
 * AUTH CONTEXT
 * ============
 * Global authentication state management using React Context API
 * 
 * PURPOSE:
 * - Provides authentication state to all components
 * - Eliminates prop drilling for auth data
 * - Centralizes login/logout logic
 * 
 * CONTEXT VALUE:
 * {
 *   isAuthenticated: boolean - Whether user is logged in
 *   user: object|null - Current user data (id, username, email, token, etc)
 *   login: function - Function to authenticate user
 *   logout: function - Function to logout user
 * }
 * 
 * USAGE:
 * import { AuthContext } from './context/AuthContext';
 * const { isAuthenticated, user, login, logout } = useContext(AuthContext);
 */

import React from 'react';

export const AuthContext = React.createContext({
  isAuthenticated: false,
  user: null,
  login: () => {},
  logout: () => {},
});
