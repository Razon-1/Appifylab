# Frontend - Buddy Script Web App

A modern React application for the Buddy Script social networking platform with Tailwind CSS styling.

## 🏗️ Architecture

```
buddy-frontend/
├── src/
│   ├── components/           # Reusable components
│   │   ├── Header.js        # Navigation header
│   │   ├── Sidebar.js       # Sidebar menu
│   │   ├── CreatePost.js    # Post creation form
│   │   ├── PostCard.js      # Post display component
│   │   └── ErrorBoundary.js # Error handling
│   ├── pages/               # Page components
│   │   ├── Login.js         # Login page
│   │   ├── Register.js      # Registration page
│   │   └── Feed.js          # Main feed page
│   ├── services/            # API service layer
│   │   └── apiClient.js     # Centralized API calls
│   ├── context/             # React context
│   │   └── AuthContext.js   # Authentication state
│   ├── App.js               # Main app component
│   ├── App.css              # Global styles
│   └── index.js             # React entry point
├── public/                  # Static files
├── package.json             # Dependencies
├── tailwind.config.js       # Tailwind configuration
└── README.md               # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- npm or yarn
- Backend running on `http://localhost:8000`

### Installation

1. **Install dependencies**
```bash
cd buddy-frontend
npm install
```

2. **Configure environment**
```bash
# Copy environment template
cp .env.example .env

# Update API URL (if needed)
REACT_APP_API_URL=http://localhost:8000/api
```

3. **Start development server**
```bash
npm start
```

App runs on: `http://localhost:3000`

## 📦 Dependencies

### Core
- **React 18.2.0**: UI library
- **React Router 6.14.2**: Routing
- **Axios**: HTTP requests (can be replaced with fetch)

### Styling
- **Tailwind CSS 3.3.0**: Utility-first CSS
- **Tailwind Plugins**: Forms, Typography

### Development
- **Create React App**: Build tool
- **ESLint**: Code quality
- **Prettier**: Code formatting

See [package.json](./package.json) for complete dependencies.

## 🎨 Features

### Authentication
- User registration with validation
- Secure login with session management
- Password confirmation
- Logout functionality
- Protected routes

### User Profile
- View current profile
- Update profile information
- Change profile picture
- Search other users
- View user profiles

### Social Feed
- Create posts with text and images
- View posts from all users
- Like/unlike posts
- Comment on posts
- Delete own posts
- Infinite scroll (ready to implement)

### Friends System
- Send friend requests
- Accept/reject requests
- View friends list
- Remove friends
- Friend suggestions

### UI/UX
- Dark mode support
- Responsive design (mobile, tablet, desktop)
- Loading states
- Error handling
- Toast notifications (ready)

## 🔧 Configuration

### Environment Variables

Create `.env` file:

```env
# API Configuration
REACT_APP_API_URL=http://localhost:8000/api

# App Configuration
REACT_APP_APP_NAME=Buddy Script
REACT_APP_VERSION=1.0.0

# Feature Flags
REACT_APP_ENABLE_DARK_MODE=true
REACT_APP_ENABLE_NOTIFICATIONS=false
```

## 📚 Component Structure

### Page Components

#### Login.js
- Email/password form
- Validation messages
- OAuth button ready
- Link to registration

#### Register.js
- Email, username, password fields
- Password confirmation
- Terms agreement checkbox
- Email validation

#### Feed.js
- Post creation form
- Posts list with pagination
- Like/comment functionality
- Real-time post updates ready

### Reusable Components

#### Header.js
- Navigation menu
- User profile dropdown
- Logout button
- Dark mode toggle

#### Sidebar.js
- Navigation links
- User menu
- Settings shortcuts
- Notifications indicator

#### CreatePost.js
- Text area for post content
- Image upload ready
- Submit button with loading state
- Clear on successful post

#### PostCard.js
- Post author info
- Post content
- Like button with count
- Comment section
- Delete button (for author)

#### ErrorBoundary.js
- Catches component errors
- Shows error UI
- Error details in development
- Recovery button

## 🔄 State Management

### Context API Usage

**AuthContext** (`src/context/AuthContext.js`)
```javascript
const { user, isAuthenticated, login, logout, register } = useContext(AuthContext);
```

Manages:
- Current user data
- Authentication state
- Login/logout actions
- Token storage

## 🌐 API Integration

### Service Layer Pattern

```javascript
// Import API services
import { authAPI, userAPI, feedAPI } from '../services/apiClient';

// Use in components
const handleLogin = async (email, password) => {
  const response = await authAPI.login(email, password);
  // Handle response
};
```

### Error Handling

```javascript
try {
  const data = await feedAPI.createPost(content, image);
  // Success handling
} catch (error) {
  if (error.isUnauthorized()) {
    // Handle auth error
  } else if (error.isServerError()) {
    // Handle server error
  }
}
```

## 🎯 Available Scripts

```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Format code
npm run format

# Lint code
npm run lint

# Eject configuration (irreversible)
npm run eject
```

## 🧪 Testing

### Testing Components

```bash
npm test
```

Example test:
```javascript
import { render, screen } from '@testing-library/react';
import Login from '../pages/Login';

test('renders login form', () => {
  render(<Login />);
  expect(screen.getByText(/email/i)).toBeInTheDocument();
});
```

### Manual Testing

1. **Authentication Flow**
   - Register new account
   - Login with credentials
   - View profile
   - Logout

2. **Feed Functionality**
   - Create post
   - Like post
   - Add comment
   - Delete comment

3. **User Interaction**
   - Search users
   - View user profile
   - Send friend request
   - Accept friend request

## 📱 Responsive Design

Breakpoints (Tailwind):
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

Example usage:
```jsx
<div className="md:flex lg:gap-4">
  <aside className="hidden md:block w-64">...</aside>
  <main className="flex-1">...</main>
</div>
```

## 🎨 Styling with Tailwind

### Color Scheme
- **Primary**: Blue (#3B82F6)
- **Success**: Green (#10B981)
- **Warning**: Yellow (#F59E0B)
- **Error**: Red (#EF4444)

### Dark Mode
```jsx
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
  Content
</div>
```

## 🔐 Security Best Practices

1. **Token Storage**: Stored in httpOnly cookies (preferred) or sessionStorage
2. **CORS**: Frontend configured for backend origin
3. **Input Validation**: Validate all user inputs
4. **XSS Protection**: React escapes by default
5. **CSRF Protection**: Include CSRF token from backend
6. **Password**: Use strong password requirements

## ⚡ Performance Optimization

- **Code Splitting**: React.lazy for route-based splitting
- **Memoization**: React.memo for expensive components
- **Lazy Loading**: Images and components
- **Caching**: API response caching ready
- **Bundle Analysis**: Analyze bundle size

```bash
npm run build --analyze
```

## 🐛 Common Issues

### Issue: API Connection Error
**Solution**:
- Ensure backend is running on port 8000
- Check `REACT_APP_API_URL` in `.env`
- Verify CORS settings in backend

### Issue: Token Expiration
**Solution**:
- Implement token refresh logic
- Redirect to login on 401 error
- Clear session storage

### Issue: Blank Page
**Solution**:
- Check browser console for errors
- Verify React is rendering in DOM
- Check if `public/index.html` exists

### Issue: Tailwind Styles Not Applying
**Solution**:
```bash
npm run build  # Rebuild
# Or clear cache:
rm -rf node_modules/.cache
```

## 🚀 Building for Production

```bash
# Create optimized build
npm run build

# Build outputs to 'build/' directory
# Ready to deploy to any static hosting

# Test production build locally
npx serve -s build
```

Production build includes:
- Minified code
- CSS optimization
- Image optimization
- Source map generation (optional)

## 📊 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- IE 11 (with polyfills)

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/my-feature`
2. Follow React best practices
3. Use functional components with hooks
4. Write clean, documented code
5. Test changes thoroughly
6. Submit pull request

## 📄 License

Part of Buddy Script social network application.

## 🆘 Support

For issues:
1. Check browser console (F12)
2. Review Network tab for API errors
3. Check backend logs
4. Review API documentation: `../API_DOCUMENTATION.md`
5. Ensure backend is running: `http://localhost:8000`

## 🔗 Related Documentation

- [Backend README](../buddy-backend/README.md)
- [API Documentation](../API_DOCUMENTATION.md)
- [Setup Guide](../SETUP_GUIDE.md)
