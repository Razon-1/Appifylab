/**
 * Create Post Component
 * Allows users to create posts with text, images, and privacy settings.
 */

import React, { useRef, useState } from 'react';
import { feedAPI } from '../api/api';

export default function CreatePost({ onPostCreated, darkMode = false }) {
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [privacy, setPrivacy] = useState('public');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      setError('File must be an image');
      return;
    }

    setImage(file);
    setError(null);

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      setError('Post content cannot be empty');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('content', content.trim());
      formData.append('privacy', privacy);
      if (image) formData.append('image', image);

      const response = await feedAPI.createPost(formData);
      const createdPost = response.data?.data;

      setContent('');
      setImage(null);
      setImagePreview(null);
      setPrivacy('public');
      if (fileInputRef.current) fileInputRef.current.value = '';

      if (createdPost && onPostCreated) onPostCreated(createdPost);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6 mb-6`}>
      {error && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          className={`w-full p-4 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-200'
          }`}
          rows="4"
        />

        {imagePreview && (
          <div className="mt-4 relative inline-block">
            <img src={imagePreview} alt="Preview" className="max-h-64 rounded-lg" />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600"
              aria-label="Remove image"
            >
              X
            </button>
          </div>
        )}

        <div className="flex items-center justify-between mt-4 flex-wrap gap-4">
          <div className="flex gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition"
            >
              Image
            </button>

            <select
              value={privacy}
              onChange={(e) => setPrivacy(e.target.value)}
              className={`px-3 py-2 rounded border ${
                darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading || !content.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Posting...' : 'Post'}
          </button>
        </div>
      </form>
    </div>
  );
}
