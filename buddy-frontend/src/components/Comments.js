/**
 * Comments Component
 * Displays comments and replies for a post.
 */

import React, { useCallback, useEffect, useState } from 'react';
import { feedAPI } from '../api/api';

const getUsersText = (users = []) => {
  if (!users.length) return 'No likes yet';
  return users.map((user) => user.username || user.email || 'Unknown').join(', ');
};

export default function Comments({ postId, darkMode, onCommentAdded }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [replyText, setReplyText] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [expandedLikes, setExpandedLikes] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchComments = useCallback(async () => {
    try {
      const response = await feedAPI.getComments(postId);
      setComments(response.data?.data || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load comments');
    }
  }, [postId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setLoading(true);
    setError(null);
    try {
      await feedAPI.createComment(postId, newComment.trim());
      setNewComment('');
      await fetchComments();
      if (onCommentAdded) onCommentAdded();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to add comment');
    } finally {
      setLoading(false);
    }
  };

  const handleAddReply = async (e, parentCommentId) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    setLoading(true);
    setError(null);
    try {
      await feedAPI.createReply(postId, parentCommentId, replyText.trim());
      setReplyText('');
      setReplyingTo(null);
      await fetchComments();
      if (onCommentAdded) onCommentAdded();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to add reply');
    } finally {
      setLoading(false);
    }
  };

  const handleLikeComment = async (commentId) => {
    try {
      await feedAPI.likeComment(commentId);
      await fetchComments();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update like');
    }
  };

  const toggleLikedBy = async (commentId) => {
    if (expandedLikes[commentId]) {
      setExpandedLikes((current) => ({ ...current, [commentId]: null }));
      return;
    }

    try {
      const response = await feedAPI.getCommentLikes(commentId);
      setExpandedLikes((current) => ({
        ...current,
        [commentId]: response.data?.data || [],
      }));
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load likes');
    }
  };

  const renderLikeSummary = (item) => (
    <>
      {item.likes_count > 0 && (
        <button
          type="button"
          onClick={() => toggleLikedBy(item.id)}
          className={darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-900'}
        >
          Liked by
        </button>
      )}
      {expandedLikes[item.id] && (
        <p className={`mt-2 text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Liked by: {getUsersText(expandedLikes[item.id])}
        </p>
      )}
    </>
  );

  return (
    <div className={`mt-6 pt-6 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
      <h3 className="font-semibold mb-4">Comments ({comments.length})</h3>

      {error && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleAddComment} className="mb-6">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          className={`w-full p-3 border rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-200'
          }`}
          rows="2"
        />
        <button
          type="submit"
          disabled={loading || !newComment.trim()}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Adding...' : 'Add Comment'}
        </button>
      </form>

      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className={`p-4 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <p className="font-semibold text-sm">{comment.author?.username || 'Unknown'}</p>
            <p className="text-xs text-gray-500">{new Date(comment.created_at).toLocaleDateString()}</p>
            <p className="mt-2 text-sm break-words">{comment.content}</p>

            <div className="flex gap-4 mt-3 text-xs">
              <button
                onClick={() => handleLikeComment(comment.id)}
                className={`transition ${
                  comment.is_liked
                    ? 'text-red-500 font-semibold'
                    : darkMode
                    ? 'text-gray-400 hover:text-red-500'
                    : 'text-gray-600 hover:text-red-500'
                }`}
              >
                {comment.is_liked ? 'Unlike' : 'Like'} {comment.likes_count}
              </button>
              {renderLikeSummary(comment)}
              <button
                onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                className={darkMode ? 'text-gray-400 hover:text-blue-400' : 'text-gray-600 hover:text-blue-500'}
              >
                Reply
              </button>
            </div>

            {comment.replies?.length > 0 && (
              <div className="mt-4 ml-4 space-y-3 border-l-2 border-gray-400 pl-4">
                {comment.replies.map((reply) => (
                  <div key={reply.id} className={`p-3 rounded ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
                    <p className="font-semibold text-sm">{reply.author?.username || 'Unknown'}</p>
                    <p className="text-xs text-gray-500 mb-2">
                      {new Date(reply.created_at).toLocaleDateString()}
                    </p>
                    <p className="text-sm break-words">{reply.content}</p>
                    <div className="flex gap-4 mt-2 text-xs">
                      <button
                        onClick={() => handleLikeComment(reply.id)}
                        className={`transition ${
                          reply.is_liked
                            ? 'text-red-500 font-semibold'
                            : darkMode
                            ? 'text-gray-400 hover:text-red-500'
                            : 'text-gray-600 hover:text-red-500'
                        }`}
                      >
                        {reply.is_liked ? 'Unlike' : 'Like'} {reply.likes_count}
                      </button>
                      {renderLikeSummary(reply)}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {replyingTo === comment.id && (
              <form onSubmit={(e) => handleAddReply(e, comment.id)} className="mt-4">
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write a reply..."
                  className={`w-full p-2 border rounded text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    darkMode ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400' : 'bg-white border-gray-300'
                  }`}
                  rows="2"
                />
                <div className="flex gap-2 mt-2">
                  <button
                    type="submit"
                    disabled={loading || !replyText.trim()}
                    className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 disabled:opacity-50"
                  >
                    Reply
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setReplyingTo(null);
                      setReplyText('');
                    }}
                    className="px-3 py-1 bg-gray-400 text-white text-sm rounded hover:bg-gray-500"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        ))}

        {comments.length === 0 && (
          <p className={`text-center py-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            No comments yet. Be the first to comment!
          </p>
        )}
      </div>
    </div>
  );
}
