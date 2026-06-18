"""
BUDDY SCRIPT - MAIN URL CONFIGURATION
======================================
Defines the routing for the entire backend API

API ENDPOINTS:
- /admin/               - Django admin panel
- /api/auth/           - User authentication (login, register, logout)
- /api/feed/           - Posts and comments management
- /api/friends/        - Friend requests and friend management
- /api/users/          - User profile management
- /media/              - Media files (images, uploads) - only in DEBUG mode
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse
from django.views.static import serve


def health_check(request):
    return JsonResponse({
        'status': 'ok',
        'service': 'buddy-script-api',
    })

urlpatterns = [
    path('', health_check, name='health-check'),
    path('admin/', admin.site.urls),
    # User authentication endpoints (register, login, logout)
    path('api/auth/', include('users.urls')),
    # Posts and comments endpoints
    path('api/feed/', include('feed.urls')),
    # Friend requests and friend management endpoints
    path('api/friends/', include('friends.urls')),
    # User profile and search endpoints
    path('api/users/', include('users.profile_urls')),
]

# Serve uploaded media files. Render's free filesystem is ephemeral, so uploads may
# disappear after redeploys/restarts unless persistent storage or S3 is added.
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
else:
    urlpatterns += [
        path('media/<path:path>', serve, {'document_root': settings.MEDIA_ROOT}),
    ]
