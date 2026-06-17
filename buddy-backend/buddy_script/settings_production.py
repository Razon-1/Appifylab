"""
Production settings override for Buddy Script
Run with: python manage.py runserver --settings=buddy_script.settings_production
"""

from .settings import *

# Override settings for production
DEBUG = False

# Security Settings
SECURE_SSL_REDIRECT = True
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_SECURITY_POLICY = {
    'default-src': ("'self'",),
}

# Static and Media files on S3 (optional)
# STATIC_URL = 'https://your-s3-bucket.s3.amazonaws.com/static/'
# MEDIA_URL = 'https://your-s3-bucket.s3.amazonaws.com/media/'
