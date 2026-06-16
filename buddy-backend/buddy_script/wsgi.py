"""
WSGI config for buddy_script project.
"""

import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'buddy_script.settings')

application = get_wsgi_application()
