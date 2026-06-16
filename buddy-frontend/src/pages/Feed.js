import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { feedAPI } from '../api/api';
import PostCard from '../components/PostCard';
import CreatePost from '../components/CreatePost';

export default function Feed() {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetchPosts();
    const isDark = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDark);
  }, []);

  const fetchPosts = async () => {
    try {
      setError(null);
      const response = await feedAPI.getPosts();
      setPosts(response.data?.data || response.data?.results || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load feed');
    } finally {
      setLoading(false);
    }
  };

  const handlePostCreated = (post) => {
    setPosts((currentPosts) => [post, ...currentPosts]);
  };

  const handlePostDeleted = (postId) => {
    setPosts((currentPosts) => currentPosts.filter((post) => post.id !== postId));
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} transition-colors duration-300`}>
      {/* Mobile Header */}
      <div className="md:hidden sticky top-0 z-50 bg-white dark:bg-gray-800 shadow">
        <div className="flex items-center justify-between px-4 py-3">
          <img src="/assets/images/logo.svg" alt="Logo" className="h-8 w-auto" />
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        {mobileMenuOpen && (
          <div className="border-t border-gray-200 dark:border-gray-700 p-4 space-y-2">
            <a href="/feed" className="block px-4 py-2 text-primary font-semibold">Home</a>
            <button onClick={toggleDarkMode} className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
            <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
              Logout
            </button>
          </div>
        )}
      </div>

      {/* Desktop Header/Navbar */}
      <nav className="hidden md:flex sticky top-0 z-50 bg-white dark:bg-gray-800 shadow items-center justify-between px-4 md:px-6 lg:px-8 py-4">
        {/* Logo */}
        <div className="flex-shrink-0">
          <a href="/feed">
            <img src="/assets/images/logo.svg" alt="Logo" className="h-10 w-auto" />
          </a>
        </div>

        {/* Search Bar - Hidden on small tablets */}
        <div className="hidden lg:flex flex-1 mx-8">
          <input
            type="text"
            placeholder="Search friends, posts..."
            className="w-full max-w-md px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-gray-50 dark:bg-gray-700"
          />
        </div>

        {/* Right Menu Items */}
        <div className="flex items-center gap-2 md:gap-3 lg:gap-4">
          {/* Home */}
          <a href="/feed" className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition" title="Home">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-3m0 0l7-4 7 4M5 9v10a1 1 0 001 1h12a1 1 0 001-1V9m-9 11l4-4m-9-3l-4.147-4.147a1 1 0 011.414-1.414L12 7.586l7.146-7.146a1 1 0 011.414 1.414L13.414 9m0 0L9 13.414" />
            </svg>
          </a>

          {/* Friend Requests - Hidden on small screens */}
          <a href="#" className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition hidden sm:block relative" title="Friend Requests">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-2a6 6 0 0112 0v2zm0 0h6v-2a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">2</span>
          </a>

          {/* Notifications - Hidden on small screens */}
          <a href="#" className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition hidden sm:block relative" title="Notifications">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-1 right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span>
          </a>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            title="Toggle dark mode"
          >
            {darkMode ? (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 18a6 6 0 100-12 6 6 0 000 12z" />
                <path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m3.08 3.08l4.24 4.24M1 12h6m6 0h6m-16.78 7.78l4.24-4.24m3.08-3.08l4.24-4.24" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </button>

          {/* Profile Dropdown */}
          <div className="relative group">
            <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition">
              <img src="/assets/images/Avatar.png" alt="Profile" className="w-8 h-8 rounded-full object-cover" />
            </button>
            <div className="hidden group-hover:block absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 z-50">
              <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">Profile</a>
              <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">Settings</a>
              <hr className="my-2 dark:border-gray-700" />
              <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700">Logout</button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row gap-4 md:gap-6 lg:gap-8 p-4 md:p-6 lg:p-8 max-w-8xl mx-auto">
        {/* Left Sidebar - Hidden on mobile */}
        <aside className="hidden md:block md:w-48 lg:w-56">
          <div className={`sticky top-24 p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow`}>
            <nav className="space-y-2">
              <a href="/feed" className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-primary text-white font-medium">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-3m0 0l7-4 7 4M5 9v10a1 1 0 001 1h12a1 1 0 001-1V9m-9 11l4-4m-9-3l-4.147-4.147a1 1 0 011.414-1.414L12 7.586l7.146-7.146a1 1 0 011.414 1.414L13.414 9m0 0L9 13.414" />
                </svg>
                Home
              </a>
              <a href="#" className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition hover:${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-2a6 6 0 0112 0v2zm0 0h6v-2a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                Friends
              </a>
              <a href="#" className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition hover:${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Explore
              </a>
              <a href="#" className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition hover:${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8s-9-3.582-9-8 4.03-8 9-8 9 3.582 9 8z" />
                </svg>
                Messages
              </a>
            </nav>
          </div>
        </aside>

        {/* Center - Main Feed */}
        <main className="flex-1 md:flex-1 lg:max-w-2xl">
          {/* Create Post */}
          <CreatePost onPostCreated={handlePostCreated} darkMode={darkMode} />

          {/* Posts Feed */}
          <div className="mt-4 md:mt-6 space-y-4 md:space-y-6">
            {error && (
              <div className="rounded-lg bg-red-100 border border-red-400 text-red-700 px-4 py-3">
                {error}
              </div>
            )}
            {loading ? (
              <div className="flex justify-center py-12">
                <div className={`animate-spin rounded-full h-12 w-12 border-b-2 border-primary`}></div>
              </div>
            ) : posts.length > 0 ? (
              posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  darkMode={darkMode}
                  onPostDeleted={handlePostDeleted}
                  onRefresh={fetchPosts}
                />
              ))
            ) : (
              <div className={`rounded-lg shadow p-8 text-center ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <p className="text-gray-500">No posts yet. Be the first to share!</p>
              </div>
            )}
          </div>
        </main>

        {/* Right Sidebar - Hidden on small/medium screens */}
        <aside className="hidden lg:block lg:w-64">
          <div className="sticky top-24 space-y-4">
            {/* Online Friends */}
            <div className={`p-4 rounded-lg shadow ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h3 className="font-bold text-lg mb-4">Online Friends</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <img src="/assets/images/Avatar.png" alt="" className="w-10 h-10 rounded-full object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">John Doe</p>
                    <p className="text-xs text-gray-500">Active now</p>
                  </div>
                  <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                </div>
                <div className="flex items-center gap-3">
                  <img src="/assets/images/Avatar.png" alt="" className="w-10 h-10 rounded-full object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">Sarah Smith</p>
                    <p className="text-xs text-gray-500">5 min ago</p>
                  </div>
                  <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                </div>
                <div className="flex items-center gap-3">
                  <img src="/assets/images/Avatar.png" alt="" className="w-10 h-10 rounded-full object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">Alex Johnson</p>
                    <p className="text-xs text-gray-500">10 min ago</p>
                  </div>
                  <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                </div>
              </div>
            </div>

            {/* Suggested Friends */}
            <div className={`p-4 rounded-lg shadow ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg">Suggested Friends</h3>
                <a href="#" className="text-primary text-sm font-medium hover:underline">See All</a>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <img src="/assets/images/Avatar.png" alt="" className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold truncate">Emma Wilson</p>
                      <p className="text-xs text-gray-500 truncate">10 mutual friends</p>
                    </div>
                  </div>
                  <button className="ml-2 px-3 py-1 bg-primary text-white text-xs rounded-lg hover:bg-blue-600 transition flex-shrink-0">
                    Add
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <img src="/assets/images/Avatar.png" alt="" className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold truncate">Michael Brown</p>
                      <p className="text-xs text-gray-500 truncate">8 mutual friends</p>
                    </div>
                  </div>
                  <button className="ml-2 px-3 py-1 bg-primary text-white text-xs rounded-lg hover:bg-blue-600 transition flex-shrink-0">
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
