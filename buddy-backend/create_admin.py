"""
CREATE ADMIN USER SCRIPT
========================
Creates a default admin/superuser account for the application

PURPOSE:
- Initialize admin user with full backend access
- Can be used for development and initial setup
- Admin can manage users, posts, comments via Django admin

ADMIN CREDENTIALS (DEFAULT):
- Username: admin
- Email: admin@buddyscript.com
- Password: admin123

USAGE:
1. Ensure Django is set up with database migrations
2. Run: python create_admin.py
3. Access admin panel at: http://localhost:8000/admin

SECURITY NOTE:
- This script creates hardcoded credentials for development only
- Change password immediately in production
- Use stronger passwords for production
"""

import os

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'buddy_script.settings')

import django
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

# Create default admin user if doesn't exist
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser(
        username='admin',
        email='admin@buddyscript.com',
        password='admin123'
    )
    print("Admin user created successfully")
else:
    print("Admin user already exists")

