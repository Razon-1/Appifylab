#!/usr/bin/env python
"""
DJANGO MANAGEMENT UTILITY
=========================
Central command-line utility for Django administrative tasks

COMMON COMMANDS:
- python manage.py runserver              - Start development server
- python manage.py migrate                - Apply database migrations
- python manage.py migrate <app>          - Migrate specific app
- python manage.py makemigrations         - Create database migrations
- python manage.py createsuperuser        - Create admin user
- python manage.py shell                  - Interactive Python shell
- python manage.py test                   - Run tests
- python manage.py collectstatic          - Collect static files

ENVIRONMENT:
- Uses Django settings from buddy_script.settings
- Requires virtual environment to be activated
- Database configuration in settings.py
"""
import os
import sys


def main():
    """Run administrative tasks."""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'buddy_script.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()
