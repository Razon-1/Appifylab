/**
 * Post Card Component
 * Displays individual posts with like, comment, and reply functionality
 */

import React, { useState } from 'react';
import { feedAPI } from '../services/apiClient';
import Comments from './Comments';

export default function PostCard({ post, darkMode, onPostDeleted, onPostUpdated, onRefresh }) {
  const [showComments, setShowComments] = useState(false);
  const [isLiked, setIsLiked] = useState(post.is_liked);
  const [likesCount, setLikesCount] = useState(post.likes_count);
  const [showLikers, setShowLikers] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLike = async () => {
    try {
      setLoading(true);
      const response = await feedAPI.likePost(post.id);
      setIsLiked(response.data.is_liked);
      setLikesCount(response.data.likes_count);
    } catch (err) {
      setError(err.message);
      console.error('Like error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await feedAPI.deletePost(post.id);
      if (onPostDeleted) {
        onPostDeleted(post.id);
      }
    } catch (err) {
      setError(err.message);
      console.error('Delete error:', err);
    }
  };

  const handleShowLikers = async () => {
    if (!showLikers && post.liked_by_users && post.liked_by_users.length === 0) {
      try {
        const response = await feedAPI.getPostLikes(post.id);
        post.liked_by_users = response.data;
      } catch (err) {
        console.error('Failed to load likers:', err);
      }
    }
    setShowLikers(!showLikers);
  };

  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6 mb-4`}>
      {/* Error Message */}
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
            {post.author?.username?.charAt(0).toUpperCase()}
          </div>
        </div>

        {/* Post Info and Actions */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-semibold">{post.author?.username || 'Unknown'}</p>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>
                  {new Date(post.created_at).toLocaleDateString()} •{' '}
                  {new Date(post.created_at).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
                <span>{post.privacy === 'private' ? '🔒' : '🌐'}</span>
              </div>
            </div>

            {/* Delete Button (if owner) */}
            {post.can_delete && (
              <button
                onClick={handleDelete}
                className="text-gray-500 hover:text-red-500 text-xl"
                title="Delete post"
              >
                ✕
              </button>
            )}
          </div>

          {/* Post Content */}
          <p className="mt-3 text-base leading-relaxed break-words">{post.content}</p>

          {/* Post Image */}
          {post.image && (
            <img
              src={post.image}
              alt="Post content"
              className="mt-4 rounded-lg max-w-full max-h-96 object-cover"
            />
          )}

          {/* Likers List */}
          {showLikers && post.liked_by_users && post.liked_by_users.length > 0 && (
            <div
              className={`mt-3 p-3 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
            >
              <p className="text-sm font-semibold mb-2">Liked by:</p>
              <div className="flex flex-wrap gap-2">
                {post.liked_by_users.map((user) => (
                  <span key={user.id} className="text-sm">
                    {user.username}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Actions Bar */}
          <div
            className={`flex gap-8 mt-4 pt-4 border-t ${
              darkMode ? 'border-gray-700' : 'border-gray-200'
            }`}
          >
            {/* Like Button */}
            <button
              onClick={handleLike}
              disabled={loading}
              className={`flex items-center gap-2 transition ${
                isLiked
                  ? 'text-red-500 font-semibold'
                  : `${darkMode ? 'text-gray-400 hover:text-red-500' : 'text-gray-500 hover:text-red-500'}`
              }`}
            >
              {isLiked ? '❤️' : '🤍'} {likesCount}
            </button>

            {/* Show Likers Button */}
            {post.likes_count > 0 && (
              <button
                onClick={handleShowLikers}
                className={`text-sm transition ${
                  darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Show Likers
              </button>
            )}

            {/* Comments Button */}
            <button
              onClick={() => setShowComments(!showComments)}
              className={`flex items-center gap-2 transition ${
                darkMode ? 'text-gray-400 hover:text-blue-400' : 'text-gray-500 hover:text-blue-500'
              }`}
            >
              💬 {post.comments_count}
            </button>
          </div>

          {/* Comments Section */}
          {showComments && (
            <Comments
              postId={post.id}
              darkMode={darkMode}
              onCommentAdded={onRefresh}
            />
          )}
        </div>
      </div>
    </div>
  );
}
