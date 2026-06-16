import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { feedAPI } from '../api/api';
import PostCard from '../components/PostCard';
import CreatePost from '../components/CreatePost';

export default function Feed() {
  const navigate = useNavigate();
  const { logout, user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

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
    document.documentElement.setAttribute('data-theme', newDarkMode ? 'dark' : 'light');
  };

  return (
    <div className={`_main_layout ${darkMode ? '_dark_mode' : ''}`}>
      {/* Header/Navbar */}
      <nav className="navbar navbar-expand-lg bg-body sticky-top _layout_top_bar">
        <div className="container-fluid">
          {/* Logo */}
          <a className="navbar-brand" href="/feed">
            <img src="/assets/images/logo.svg" alt="Logo" className="_navbar_logo" />
          </a>

          {/* Toggler for mobile */}
          <button 
            className="navbar-toggler" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarContent"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Navbar Content */}
          <div className="collapse navbar-collapse" id="navbarContent">
            {/* Search Bar */}
            <div className="_layout_top_bar_search_area mx-auto">
              <input 
                type="text" 
                className="form-control _layout_top_bar_search_input" 
                placeholder="Search friends, posts..." 
              />
            </div>

            {/* Right side items */}
            <div className="d-flex align-items-center ms-auto gap-2">
              {/* Home */}
              <a href="/feed" className="btn btn-sm _layout_top_bar_btn">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
              </a>

              {/* Friend Requests */}
              <a href="#" className="btn btn-sm _layout_top_bar_btn">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                <span className="badge bg-danger">2</span>
              </a>

              {/* Notifications */}
              <div className="dropdown">
                <button 
                  className="btn btn-sm _layout_top_bar_btn dropdown-toggle" 
                  type="button" 
                  id="notificationDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                  </svg>
                  <span className="badge bg-info">3</span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="notificationDropdown">
                  <li><h6 className="dropdown-header">Notifications</h6></li>
                  <li><a className="dropdown-item" href="#"><small>John liked your post</small></a></li>
                  <li><a className="dropdown-item" href="#"><small>Sarah commented on your post</small></a></li>
                  <li><a className="dropdown-item" href="#"><small>New friend request from Alex</small></a></li>
                </ul>
              </div>

              {/* Dark Mode Toggle */}
              <button 
                className="btn btn-sm _layout_top_bar_btn"
                onClick={toggleDarkMode}
                title="Toggle dark mode"
              >
                {darkMode ? (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="12" r="5"></circle>
                    <line x1="12" y1="1" x2="12" y2="3"></line>
                    <line x1="12" y1="21" x2="12" y2="23"></line>
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                    <line x1="1" y1="12" x2="3" y2="12"></line>
                    <line x1="21" y1="12" x2="23" y2="12"></line>
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                  </svg>
                ) : (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                  </svg>
                )}
              </button>

              {/* User Profile */}
              <div className="dropdown">
                <button 
                  className="btn btn-sm _layout_top_bar_btn dropdown-toggle" 
                  type="button"
                  id="profileDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <img src="/assets/images/Avatar.png" alt="Profile" className="_navbar_avatar" />
                </button>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="profileDropdown">
                  <li><a className="dropdown-item" href="#">Profile</a></li>
                  <li><a className="dropdown-item" href="#">Settings</a></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><a className="dropdown-item" href="#" onClick={handleLogout}>Logout</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Layout */}
      <div className="_layout_inner_wrap">
        <div className="container-fluid">
          <div className="row">
            {/* Left Sidebar */}
            <div className="col-xl-2 col-lg-3 col-md-12 _layout_left_wrap">
              <div className="_layout_left_sidebar_wrap">
                <div className="_layout_sidebar_menu">
                  <ul className="list-unstyled">
                    <li className="mb-3">
                      <a href="/feed" className="_sidebar_link _active">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                          <polyline points="9 22 9 12 15 12 15 22"></polyline>
                        </svg>
                        <span>Home</span>
                      </a>
                    </li>
                    <li className="mb-3">
                      <a href="#" className="_sidebar_link">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                          <circle cx="9" cy="7" r="4"></circle>
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                        </svg>
                        <span>Friends</span>
                      </a>
                    </li>
                    <li className="mb-3">
                      <a href="#" className="_sidebar_link">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="11" cy="11" r="8"></circle>
                          <path d="m21 21-4.35-4.35"></path>
                        </svg>
                        <span>Explore</span>
                      </a>
                    </li>
                    <li className="mb-3">
                      <a href="#" className="_sidebar_link">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                          <line x1="9" y1="9" x2="15" y2="9"></line>
                          <line x1="9" y1="15" x2="15" y2="15"></line>
                        </svg>
                        <span>Messages</span>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Main Feed */}
            <div className="col-xl-6 col-lg-6 col-md-12 _layout_middle_wrap">
              <div className="_layout_middle_inner">
                {/* Create Post */}
                <CreatePost onPostCreate={handleCreatePost} darkMode={darkMode} />

                {/* Posts Feed */}
                <div className="_feed_posts_list mt-4">
                  {loading ? (
                    <div className="text-center py-5">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  ) : posts.length > 0 ? (
                    posts.map((post) => (
                      <PostCard key={post.id} post={post} darkMode={darkMode} />
                    ))
                  ) : (
                    <div className="alert alert-info text-center mt-5">
                      No posts yet. Be the first to share something!
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="col-xl-4 col-lg-3 col-md-12 _layout_right_wrap _mobile_none">
              <div className="_layout_right_sidebar_wrap">
                {/* Online Friends */}
                <div className="_layout_right_box mb-4">
                  <h6 className="mb-3">Online Friends</h6>
                  <div className="_online_friends_list">
                    <div className="d-flex align-items-center mb-3">
                      <img src="/assets/images/Avatar.png" alt="" className="_friend_avatar" />
                      <div className="flex-grow-1">
                        <p className="mb-0 text-sm">John Doe</p>
                        <small className="text-muted">Active now</small>
                      </div>
                    </div>
                    <div className="d-flex align-items-center mb-3">
                      <img src="/assets/images/Avatar.png" alt="" className="_friend_avatar" />
                      <div className="flex-grow-1">
                        <p className="mb-0 text-sm">Sarah Smith</p>
                        <small className="text-muted">5 min ago</small>
                      </div>
                    </div>
                    <div className="d-flex align-items-center mb-3">
                      <img src="/assets/images/Avatar.png" alt="" className="_friend_avatar" />
                      <div className="flex-grow-1">
                        <p className="mb-0 text-sm">Alex Johnson</p>
                        <small className="text-muted">10 min ago</small>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Suggested Friends */}
                <div className="_layout_right_box">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6>Suggested Friends</h6>
                    <small className="text-primary cursor-pointer">See All</small>
                  </div>
                  <div className="_suggested_friends_list">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <div className="d-flex align-items-center flex-grow-1">
                        <img src="/assets/images/Avatar.png" alt="" className="_friend_avatar" />
                        <div>
                          <p className="mb-0 text-sm font-weight-bold">Emma Wilson</p>
                          <small className="text-muted">10 mutual friends</small>
                        </div>
                      </div>
                      <button className="btn btn-sm btn-primary">Add</button>
                    </div>
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <div className="d-flex align-items-center flex-grow-1">
                        <img src="/assets/images/Avatar.png" alt="" className="_friend_avatar" />
                        <div>
                          <p className="mb-0 text-sm font-weight-bold">Michael Brown</p>
                          <small className="text-muted">8 mutual friends</small>
                        </div>
                      </div>
                      <button className="btn btn-sm btn-primary">Add</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
