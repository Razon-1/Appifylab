"""
ASGI config for buddy_script project.
"""

import os

from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'buddy_script.settings')

application = get_asgi_application()
