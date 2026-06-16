from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import override_settings
from django.utils import timezone
from rest_framework.authtoken.models import Token
from rest_framework.test import APITestCase

from .models import Post


@override_settings(MEDIA_ROOT='test_media')
class FeedPostAPITests(APITestCase):
    def setUp(self):
        User = get_user_model()
        self.user = User.objects.create_user(
            username='feeduser',
            email='feeduser@example.com',
            password='password123',
        )
        self.other_user = User.objects.create_user(
            username='otheruser',
            email='otheruser@example.com',
            password='password123',
        )
        self.token = Token.objects.create(user=self.user)

    def authenticate(self, user=None):
        user = user or self.user
        token, _ = Token.objects.get_or_create(user=user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {token.key}')

    def get_posts_payload(self, response):
        return response.data.get('data') or response.data.get('results') or []

    def test_feed_is_protected(self):
        response = self.client.get('/api/feed/posts/')

        self.assertEqual(response.status_code, 401)

    def test_authenticated_user_sees_other_users_public_posts_newest_first(self):
        older = Post.objects.create(
            author=self.other_user,
            content='Older public post',
            privacy='public',
        )
        newer = Post.objects.create(
            author=self.other_user,
            content='Newer public post',
            privacy='public',
        )
        Post.objects.filter(id=older.id).update(created_at=timezone.now() - timezone.timedelta(days=1))
        Post.objects.filter(id=newer.id).update(created_at=timezone.now())

        self.authenticate()
        response = self.client.get('/api/feed/posts/')

        self.assertEqual(response.status_code, 200)
        payload = self.get_posts_payload(response)
        post_ids = [post['id'] for post in payload]
        self.assertIn(older.id, post_ids)
        self.assertIn(newer.id, post_ids)
        self.assertLess(post_ids.index(newer.id), post_ids.index(older.id))

    def test_authenticated_user_can_create_text_and_image_post(self):
        self.authenticate()
        image = SimpleUploadedFile(
            'feed-test.gif',
            b'GIF87a\x01\x00\x01\x00\x80\x01\x00\x00\x00\x00\xff\xff\xff,\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02\x02D\x01\x00;',
            content_type='image/gif',
        )

        response = self.client.post(
            '/api/feed/posts/',
            {'content': 'Post with image', 'privacy': 'public', 'image': image},
            format='multipart',
        )

        self.assertEqual(response.status_code, 201)
        post = Post.objects.get(content='Post with image')
        self.assertEqual(post.author, self.user)
        self.assertTrue(post.image.name)
        self.assertEqual(response.data['data']['content'], 'Post with image')
        self.assertTrue(response.data['data']['image'])

    def test_like_endpoint_toggles_like_state_for_authenticated_user(self):
        post = Post.objects.create(
            author=self.other_user,
            content='Like target',
            privacy='public',
        )
        self.authenticate()

        like_response = self.client.post(f'/api/feed/posts/{post.id}/like/')
        self.assertEqual(like_response.status_code, 200)
        self.assertTrue(like_response.data['data']['is_liked'])
        self.assertEqual(like_response.data['data']['likes_count'], 1)

        feed_response = self.client.get('/api/feed/posts/')
        feed_post = next(item for item in self.get_posts_payload(feed_response) if item['id'] == post.id)
        self.assertTrue(feed_post['is_liked'])
        self.assertEqual(feed_post['likes_count'], 1)

        unlike_response = self.client.post(f'/api/feed/posts/{post.id}/like/')
        self.assertEqual(unlike_response.status_code, 200)
        self.assertFalse(unlike_response.data['data']['is_liked'])
        self.assertEqual(unlike_response.data['data']['likes_count'], 0)
