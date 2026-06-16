import os

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'buddy_script.settings')

import django
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

# Create default admin user
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser(
        username='admin',
        email='admin@buddyscript.com',
        password='admin123'
    )
    print("Admin user created successfully")
else:
    print("Admin user already exists")
