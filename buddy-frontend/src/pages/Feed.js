import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { feedAPI } from '../api/api';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import PostCard from '../components/PostCard';
import CreatePost from '../components/CreatePost';

export default function Feed() {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    fetchPosts();
    // Check dark mode preference
    const isDark = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDark);
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await feedAPI.getPosts();
      setPosts(response.data);
    } catch (err) {
      console.error('Failed to fetch posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (content) => {
    try {
      await feedAPI.createPost(content);
      fetchPosts(); // Refresh posts
    } catch (err) {
      console.error('Failed to create post:', err);
    }
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
    <div className={`${darkMode ? 'dark bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'} min-h-screen transition-colors duration-300`}>
      <Header onLogout={handleLogout} onDarkModeToggle={toggleDarkMode} darkMode={darkMode} />

      <div className="flex pt-16">
        {/* Sidebar */}
        <Sidebar darkMode={darkMode} />

        {/* Main Feed */}
        <div className="flex-1 overflow-y-auto pb-8">
          <div className="max-w-2xl mx-auto px-4 py-8">
            {/* Create Post */}
            <CreatePost onPostCreate={handleCreatePost} darkMode={darkMode} />

            {/* Posts Feed */}
            <div className="mt-6 space-y-6">
              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : posts.length > 0 ? (
                posts.map((post) => (
                  <PostCard key={post.id} post={post} darkMode={darkMode} />
                ))
              ) : (
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-8 text-center`}>
                  <p className="text-gray-500">No posts yet. Be the first to share!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar (Notifications) */}
        <div className="hidden lg:block w-80 border-l border-gray-200 dark:border-gray-700 p-6 overflow-y-auto">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
            <h3 className="font-bold text-lg mb-4">Notifications</h3>
            <div className="space-y-3">
              <div className="p-3 rounded hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition">
                <p className="text-sm font-medium">John liked your post</p>
                <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
              </div>
              <div className="p-3 rounded hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition">
                <p className="text-sm font-medium">Sarah commented on your post</p>
                <p className="text-xs text-gray-500 mt-1">4 hours ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
