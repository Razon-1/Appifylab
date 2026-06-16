/**
 * LOGIN PAGE
 * ==========
 * User authentication page for existing users
 * 
 * FEATURES:
 * - Email/password authentication
 * - Remember me functionality
 * - Form validation
 * - Error handling with user feedback
 * - Responsive design (mobile + desktop)
 * - Decorative UI elements
 * 
 * FLOW:
 * 1. User enters email and password
 * 2. Form validates input
 * 3. API request to backend
 * 4. On success: Store token, redirect to /feed
 * 5. On error: Display error message
 * 
 * NAVIGATION:
 * - New users can navigate to /register
 * - After login, redirects to /feed
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../api/api';

export default function Login({ onLogin }) {
  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  /**
   * Handle form submission
   * - Validate inputs
   * - Make API request
   * - Handle success/error responses
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Call login API endpoint
      const response = await authAPI.login(email, password);
      const data = response.data.data || response.data;
      
      // Save remember-me preference
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      }
      
      // Update global auth state and navigate to feed
      onLogin(data);
      navigate('/feed');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex flex-col lg:flex-row bg-white">
      {/* Left Side - Image - Hidden on mobile, shown on lg screens */}
      <div className="hidden lg:flex lg:w-2/3 items-center justify-center p-4 lg:p-8">
        <div className="relative w-full max-w-2xl">
          {/* Decorative Shapes */}
          <div className="absolute -top-20 -left-20 opacity-10">
            <img src="/assets/images/shape1.svg" alt="" className="w-40 h-40" />
          </div>
          <div className="absolute -bottom-20 -right-20 opacity-10">
            <img src="/assets/images/shape2.svg" alt="" className="w-40 h-40" />
          </div>
          
          {/* Login Image */}
          <img src="/assets/images/login.png" alt="Login" className="w-full h-auto" />
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/3 flex items-center justify-center p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-sm">
          {/* Logo */}
          <div className="flex justify-center mb-6 md:mb-8">
            <img src="/assets/images/logo.svg" alt="Logo" className="w-32 h-auto" />
          </div>

          {/* Title */}
          <p className="text-center text-gray-600 text-sm mb-2">Welcome back</p>
          <h4 className="text-center text-2xl md:text-3xl font-bold text-gray-900 mb-8 md:mb-12">
            Login to your account
          </h4>

          {/* Google Button */}
          <button type="button" className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition mb-6 bg-white">
            <img src="/assets/images/google.svg" alt="Google" className="w-5 h-5" />
            <span className="text-gray-700 font-medium text-sm">Or sign-in with google</span>
          </button>

          {/* Divider */}
          <div className="relative flex items-center mb-6">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="px-3 text-gray-500 text-sm">Or</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
              />
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span className="text-sm text-gray-700">Remember me</span>
              </label>
              <a href="#forgot" className="text-sm text-primary hover:underline">
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-6 md:mt-8 bg-primary text-white font-semibold rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Login Now'}
            </button>
          </form>

          {/* Registration Link */}
          <p className="text-center text-gray-600 text-sm mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary font-semibold hover:underline">
              Create New Account
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
