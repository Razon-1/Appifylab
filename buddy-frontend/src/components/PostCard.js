/**
 * POST CARD COMPONENT
 * ===================
 * Displays individual posts with interactions (likes, comments)
 * 
 * FEATURES:
 * 1. Post Display
 *    - Author information
 *    - Post content and image
 *    - Creation date/time
 *    - Privacy indicator (Public/Private)
 * 
 * 2. Interactions
 *    - Like/Unlike toggle
 *    - Like count display
 *    - View likes list (user modal)
 *    - Comments section (collapsible)
 * 
 * 3. Post Management
 *    - Delete button (author only)
 *    - Edit functionality (if implemented)
 *    - Error handling
 * 
 * 4. Comments
 *    - Show/hide comments toggle
 *    - Nested comment support (replies)
 *    - Comment likes
 * 
 * PROPS:
 * - post: Post object from API
 * - darkMode: Boolean for dark theme
 * - onPostDeleted: Callback when post deleted
 * - onRefresh: Callback to refresh data
 * 
 * STATE:
 * - showComments: Toggle comment visibility
 * - isLiked: Current like status
 * - likesCount: Number of likes
 * - showLikers: Toggle likes list modal
 * - likedByUsers: List of users who liked
 */

import React, { useState } from 'react';
import { feedAPI } from '../api/api';
import Comments from './Comments';

export default function PostCard({ post, darkMode, onPostDeleted, onRefresh }) {
  // UI state
  const [showComments, setShowComments] = useState(false);
  const [isLiked, setIsLiked] = useState(Boolean(post.is_liked));
  const [likesCount, setLikesCount] = useState(post.likes_count || 0);
  const [showLikers, setShowLikers] = useState(false);
  const [likedByUsers, setLikedByUsers] = useState(post.liked_by_users || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Handle like/unlike toggle
   * - API request to toggle like
   * - Update like count and status
   * - Fetch liked users list if modal open
   */
  const handleLike = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await feedAPI.likePost(post.id);
      setIsLiked(Boolean(response.data?.data?.is_liked));
      setLikesCount(response.data?.data?.likes_count || 0);

      // Refresh likes list if modal open
      if (showLikers) {
        const likesResponse = await feedAPI.getPostLikes(post.id);
        setLikedByUsers(likesResponse.data?.data || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update like');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle post deletion
   * - Request confirmation
   * - API delete request
   * - Notify parent component
   */
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      await feedAPI.deletePost(post.id);
      if (onPostDeleted) onPostDeleted(post.id);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to delete post');
    }
  };

  /**
   * Toggle and fetch likes list
   * - Fetch users who liked on first open
   * - Toggle modal visibility
   */
  const handleShowLikers = async () => {
    if (!showLikers) {
      try {
        const response = await feedAPI.getPostLikes(post.id);
        setLikedByUsers(response.data?.data || []);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to load likes');
      }
    }
    setShowLikers((current) => !current);
  };

  // Format post creation date
  const createdAt = new Date(post.created_at);

  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6 mb-4`}>
      {/* Error Display */}
      {error && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded text-sm">
          {error}
        </div>
      )}

      {/* Post Header */}
      <div className="flex items-start gap-4">
        {/* Author Avatar */}
        <div className="flex-shrink-0">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${
              darkMode ? 'bg-blue-600' : 'bg-blue-500'
            }`}
          >
            {post.author?.username?.charAt(0).toUpperCase() || '?'}
          </div>
        </div>

        {/* Post Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              {/* Author Info */}
              <p className="font-semibold">{post.author?.username || 'Unknown'}</p>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>
                  {createdAt.toLocaleDateString()} at{' '}
                  {createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <span>{post.privacy === 'private' ? 'Private' : 'Public'}</span>
              </div>
            </div>

            {/* Delete Button (Author Only) */}
            {post.can_delete && (
              <button
                onClick={handleDelete}
                className="text-gray-500 hover:text-red-500 text-xl"
                title="Delete post"
                aria-label="Delete post"
              >
                X
              </button>
            )}
          </div>

          <p className="mt-3 text-base leading-relaxed break-words">{post.content}</p>

          {post.image && (
            <img src={post.image} alt="Post content" className="mt-4 rounded-lg max-w-full max-h-96 object-cover" />
          )}

          {showLikers && (
            <div className={`mt-3 p-3 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <p className="text-sm font-semibold mb-2">Liked by:</p>
              {likedByUsers.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {likedByUsers.map((user) => (
                    <span key={user.id} className="text-sm">
                      {user.username || user.email || 'Unknown'}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No likes yet.</p>
              )}
            </div>
          )}

          <div className={`flex gap-8 mt-4 pt-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <button
              onClick={handleLike}
              disabled={loading}
              className={`flex items-center gap-2 transition ${
                isLiked
                  ? 'text-red-500 font-semibold'
                  : darkMode
                  ? 'text-gray-400 hover:text-red-500'
                  : 'text-gray-500 hover:text-red-500'
              }`}
            >
              {isLiked ? 'Unlike' : 'Like'} {likesCount}
            </button>

            {likesCount > 0 && (
              <button
                onClick={handleShowLikers}
                className={`text-sm transition ${
                  darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {showLikers ? 'Hide Likes' : 'Show Likes'}
              </button>
            )}

            <button
              onClick={() => setShowComments((current) => !current)}
              className={`flex items-center gap-2 transition ${
                darkMode ? 'text-gray-400 hover:text-blue-400' : 'text-gray-500 hover:text-blue-500'
              }`}
            >
              Comments {post.comments_count || 0}
            </button>
          </div>

          {showComments && <Comments postId={post.id} darkMode={darkMode} onCommentAdded={onRefresh} />}
        </div>
      </div>
    </div>
  );
}
