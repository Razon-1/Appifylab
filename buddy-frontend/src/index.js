/**
 * BUDDY SCRIPT FRONTEND - ENTRY POINT
 * ===================================
 * 
 * MAIN DEPENDENCIES:
 * 
 * 1. React (v18.2.0)
 *    - Core UI library
 *    - Component-based architecture
 *    - State management and hooks
 * 
 * 2. React-DOM (v18.2.0)
 *    - Renders React components to DOM
 *    - Mounts root App component to #root element
 * 
 * 3. React Router DOM (v6.14.2)
 *    - Client-side routing
 *    - Navigation between pages (Login, Register, Feed)
 *    - URL-based page management
 * 
 * 4. Axios (v1.4.0)
 *    - HTTP client for API requests
 *    - Request/response interceptors
 *    - Error handling
 * 
 * 5. Tailwind CSS (v3.4.19)
 *    - Utility-first CSS framework
 *    - Responsive design
 *    - Dark mode support
 * 
 * 6. PostCSS (v8.5.15) & Autoprefixer (v10.5.0)
 *    - CSS processing for Tailwind
 *    - Browser compatibility
 * 
 * BUILD & DEVELOPMENT:
 * - React Scripts (v5.0.1) - Build tools, hot reload, testing
 * - npm start: Development server (port 3000)
 * - npm build: Production build
 * - npm test: Run tests
 * 
 * PROJECT STRUCTURE:
 * src/
 *   ├── App.js              - Main app with routing
 *   ├── context/            - React Context (auth state)
 *   ├── pages/              - Page components (Login, Register, Feed)
 *   ├── components/         - Reusable components (PostCard, Comments, etc)
 *   ├── api/                - API endpoints and configuration
 *   ├── services/           - API service layer
 *   └── index.css           - Global styles + Tailwind imports
 * 
 * STYLING:
 * - Tailwind CSS classes for all styling
 * - Dark mode toggle support
 * - Mobile-first responsive design
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

/**
 * Render root App component
 * - Mounts to #root div in public/index.html
 * - Enables strict mode for development checks
 * - Single page application (SPA)
 */
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
