import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Header({ onLogout, onDarkModeToggle, darkMode }) {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  return (
    <header className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} fixed top-0 left-0 right-0 border-b shadow-sm z-50 transition-colors duration-300`}>
      <div className="max-w-full mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center cursor-pointer" onClick={() => navigate('/feed')}>
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">BS</span>
            </div>
            <span className="ml-2 font-bold text-xl hidden sm:inline">Buddy Script</span>
          </div>

          {/* Search Bar */}
          <div className="hidden sm:flex flex-1 max-w-md mx-8">
            <input
              type="text"
              placeholder="Search..."
              className={`${darkMode ? 'bg-gray-700 text-white placeholder-gray-400' : 'bg-gray-100 text-gray-900'} w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </div>

          {/* Right Menu */}
          <div className="flex items-center gap-4">
            {/* Dark Mode Toggle */}
            <button
              onClick={onDarkModeToggle}
              className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition`}
            >
              {darkMode ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.536l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.828-2.828a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414l.707.707zm.464-4.536l.707-.707a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414zm-2.828 2.828a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>

            {/* Notifications */}
            <button className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition relative`}>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5.951-1.429 5.951 1.429a1 1 0 001.169-1.409l-7-14z" />
              </svg>
              <span className="absolute top-1 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span>
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className={`w-10 h-10 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} flex items-center justify-center font-bold text-sm transition hover:opacity-80`}
              >
                U
              </button>

              {showMenu && (
                <div className={`absolute right-0 mt-2 w-48 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <a href="/profile" className={`block px-4 py-2 text-sm first:rounded-t-lg hover:${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    Profile
                  </a>
                  <a href="/settings" className={`block px-4 py-2 text-sm hover:${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    Settings
                  </a>
                  <button
                    onClick={onLogout}
                    className={`w-full text-left px-4 py-2 text-sm last:rounded-b-lg hover:${darkMode ? 'bg-gray-700' : 'bg-gray-100'} text-red-600`}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
