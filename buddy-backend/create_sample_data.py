"""
CREATE SAMPLE DATA SCRIPT
=========================
Creates sample users and posts for testing and demonstration

PURPOSE:
- Populate database with test data for development
- Enable frontend testing without manual data creation
- Demonstrate application functionality
- Speed up development workflow

SAMPLE DATA CREATED:
1. Users:
   - alice (alice@example.com) - password: password123
   - bob (bob@example.com) - password: password123
   - charlie (charlie@example.com) - password: password123

2. Posts:
   - 5 sample posts distributed among users
   - Various content types (project updates, pictures, learning updates)
   
USAGE:
1. Ensure Django is set up and migrations are applied
2. Create admin user (optional): python create_admin.py
3. Run this script: python create_sample_data.py
4. Data persists in database
5. Users can login with their username and password123

SAFETY:
- Script checks if data already exists to prevent duplicates
- Safe to run multiple times
- Only creates missing data
"""

import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'buddy_script.settings')

import django
django.setup()

from django.contrib.auth import get_user_model
from feed.models import Post

User = get_user_model()

# ============================================================================
# CREATE SAMPLE USERS
# ============================================================================
# Sample user data for testing and demonstration
users_data = [
    {'username': 'alice', 'email': 'alice@example.com', 'first_name': 'Alice', 'last_name': 'Smith'},
    {'username': 'bob', 'email': 'bob@example.com', 'first_name': 'Bob', 'last_name': 'Johnson'},
    {'username': 'charlie', 'email': 'charlie@example.com', 'first_name': 'Charlie', 'last_name': 'Brown'},
]

print("Creating sample users...")
for user_data in users_data:
    if not User.objects.filter(username=user_data['username']).exists():
        user = User.objects.create_user(
            username=user_data['username'],
            email=user_data['email'],
            first_name=user_data['first_name'],
            last_name=user_data['last_name'],
            password='password123'  # All sample users use this password
        )
        print(f"Created user: {user.username}")
    else:
        print(f"User {user_data['username']} already exists")

# ============================================================================
# CREATE SAMPLE POSTS
# ============================================================================
# Sample posts distributed among users for feed testing
print("\nCreating sample posts...")
users = User.objects.all()
sample_posts = [
    "Just launched my new project! 🚀",
    "Beautiful sunset today 🌅",
    "Learning React has been amazing!",
    "Coffee and coding ☕💻",
    "Happy to join this awesome community!",
]

for i, post_content in enumerate(sample_posts):
    user = users[i % len(users)]
    if not Post.objects.filter(author=user, content=post_content).exists():
        Post.objects.create(
            author=user,
            content=post_content
        )
        print(f"Created post by {user.username}")

print("\nSample data created successfully!")
