# Backend - Buddy Script API

A professional Django REST Framework API for the Buddy Script social networking application.

## 🏗️ Architecture

```
buddy-backend/
├── buddy_script/          # Main project configuration
│   ├── settings.py       # Django settings with logging
│   ├── urls.py           # URL routing
│   ├── middleware.py     # Custom middleware
│   ├── exceptions.py     # Custom API exceptions
│   └── response.py       # Standardized response formatter
├── users/                # User authentication & profiles
│   ├── models.py         # User model
│   ├── serializers.py    # Data serialization
│   ├── views.py          # API views
│   └── urls.py           # Endpoints
├── feed/                 # Posts and comments
├── friends/              # Friend requests and relationships
├── logs/                 # Application logs
├── requirements.txt      # Python dependencies
└── manage.py             # Django management
```

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- MySQL/MariaDB (XAMPP recommended)
- Virtual Environment

### Installation

1. **Create virtual environment**
```bash
cd buddy-backend
python -m venv venv
.\venv\Scripts\activate  # Windows
source venv/bin/activate  # Linux/Mac
```

2. **Install dependencies**
```bash
pip install -r requirements.txt
```

3. **Configure environment**
```bash
# Copy and edit .env file
cp .env.example .env

# Update database credentials:
DB_NAME=appifylab
DB_USER=root
DB_PASSWORD=
DB_HOST=localhost
```

4. **Create database tables**
```bash
python manage.py migrate
```

5. **Create admin user**
```bash
python create_admin.py
# Or use Django command:
# python manage.py createsuperuser
```

6. **Run development server**
```bash
python manage.py runserver
```

Server runs on: `http://localhost:8000`

## 📦 Dependencies

- **Django 4.2.3**: Web framework
- **Django REST Framework 3.14.0**: API development
- **django-cors-headers 4.2.0**: CORS support
- **PyMySQL 1.1.0**: MySQL driver
- **Pillow 12.2.0**: Image handling
- **python-decouple 3.8**: Environment configuration

See [requirements.txt](./requirements.txt) for complete list.

## 🔧 Configuration

### Environment Variables

Create `.env` file in project root:

```env
# Django
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database
DB_ENGINE=django.db.backends.mysql
DB_NAME=appifylab
DB_USER=root
DB_PASSWORD=
DB_HOST=localhost
DB_PORT=3306

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

### Logging

Logs are written to:
- **Console**: Real-time output in terminal
- **File**: `logs/buddy_script.log` (rotating, max 10MB)

Log levels: DEBUG, INFO, WARNING, ERROR, CRITICAL

View logs:
```bash
tail -f logs/buddy_script.log  # Linux/Mac
Get-Content logs/buddy_script.log -Tail 20 -Wait  # Windows PowerShell
```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register/` - Register new user
- `POST /api/auth/login/` - User login
- `POST /api/auth/logout/` - User logout

### Users
- `GET /api/users/profile/` - Get current user profile
- `GET /api/users/` - List all users (paginated)
- `GET /api/users/{id}/` - Get user by ID
- `GET /api/users/search/?q=...` - Search users
- `PATCH /api/users/{id}/` - Update user profile

### Posts
- `GET /api/feed/posts/` - Get feed posts
- `POST /api/feed/posts/` - Create post
- `GET /api/feed/posts/{id}/` - Get post detail
- `PATCH /api/feed/posts/{id}/` - Update post
- `DELETE /api/feed/posts/{id}/` - Delete post
- `POST /api/feed/posts/{id}/like/` - Like post
- `POST /api/feed/posts/{id}/unlike/` - Unlike post

### Comments
- `GET /api/feed/comments/?post={id}` - Get post comments
- `POST /api/feed/comments/` - Create comment
- `DELETE /api/feed/comments/{id}/` - Delete comment

### Friends
- `GET /api/friends/list/` - Get friends list
- `GET /api/friends/requests/` - Get friend requests
- `POST /api/friends/request/` - Send friend request
- `POST /api/friends/requests/{id}/accept/` - Accept request
- `POST /api/friends/requests/{id}/reject/` - Reject request
- `POST /api/friends/{id}/remove/` - Remove friend

See [API_DOCUMENTATION.md](../API_DOCUMENTATION.md) for full details.

## 🧪 Testing

### Using Django Shell
```bash
python manage.py shell

# Create test user
from django.contrib.auth import get_user_model
User = get_user_model()
User.objects.create_user(username='test', email='test@example.com', password='test123')
```

### Using cURL
```bash
# Register
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","username":"testuser","password":"pass123","password_confirm":"pass123"}'

# Login
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"pass123"}'
```

### Running Tests
```bash
python manage.py test
python manage.py test users           # Test specific app
python manage.py test --verbosity=2   # Detailed output
```

## 🗄️ Database Schema

### User Model (Extends Django User)
- id (Primary Key)
- username, email, password
- first_name, last_name
- bio (TextField)
- profile_picture (ImageField)
- created_at, updated_at (Timestamps)
- is_active, is_staff, is_superuser (Django)

### Post Model
- id, author (FK User), content
- image (ImageField, optional)
- created_at, updated_at
- likes (Many-to-Many with User)

### Comment Model
- id, post (FK Post), author (FK User)
- content (TextField)
- created_at

### Friend Models
- **Friend**: user1, user2 (user relationship)
- **FriendRequest**: sender, receiver, status (pending/accepted/rejected)

## 🔐 Security Best Practices

1. **Environment Variables**: Never commit `.env` file
2. **CORS**: Only allow frontend origin in production
3. **HTTPS**: Use HTTPS in production
4. **Password**: Use strong SECRET_KEY in production
5. **Permissions**: Always check user permissions in views
6. **Validation**: Validate all input data
7. **Logging**: Monitor suspicious activities

## 📊 Performance Optimization

- **Pagination**: 20 items per page
- **Select Related**: Optimize FK queries
- **Prefetch Related**: Optimize M2M queries
- **Caching**: Implement Redis for caching (optional)
- **Database Indexes**: Indexed on frequently queried fields

Example optimization:
```python
# Bad: N+1 query problem
posts = Post.objects.all()
for post in posts:
    print(post.author.username)

# Good: Single query
posts = Post.objects.select_related('author')
```

## 🐛 Common Issues

### Issue: ModuleNotFoundError for 'pkg_resources'
**Solution**: 
```bash
pip install setuptools
```

### Issue: ImageField error
**Solution**:
```bash
pip install Pillow
```

### Issue: MySQL connection error
**Solution**:
- Ensure MySQL/MariaDB is running
- Check connection credentials in `.env`
- Verify database exists: `appifylab`

### Issue: Port 8000 already in use
**Solution**:
```bash
python manage.py runserver 8001  # Use different port
```

## 📈 Monitoring

### Check Database
```bash
# Connect to MySQL
mysql -u root -p

# Select database
USE appifylab;

# View tables
SHOW TABLES;

# Check data
SELECT COUNT(*) FROM auth_user;
```

### View Logs
```bash
# Last 20 lines
tail -n 20 logs/buddy_script.log

# Real-time
tail -f logs/buddy_script.log

# Search for errors
grep ERROR logs/buddy_script.log
```

## 📝 Admin Panel

Access admin interface: `http://localhost:8000/admin`

**Credentials** (default):
- Username: `admin`
- Password: `admin123`

Features:
- Manage users
- View posts and comments
- Manage friend relationships
- View system logs

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/my-feature`
2. Follow PEP 8 style guide
3. Add docstrings to functions/classes
4. Test changes: `python manage.py test`
5. Submit pull request

## 📄 License

This project is part of Buddy Script social network application.

## 🆘 Support

For issues or questions:
1. Check logs: `logs/buddy_script.log`
2. Review API documentation: `API_DOCUMENTATION.md`
3. Check Django debug output in terminal
4. Ensure all dependencies installed: `pip install -r requirements.txt`
