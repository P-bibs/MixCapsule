from django.contrib.auth.models import User
from django.conf import settings
from django.db import models


class SpotifyApiData(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    refresh_token = models.TextField()
    access_token = models.TextField()
    authentication_date = models.DateField(default=None, blank=True, null=True)

class PlaylistOptions(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    number_songs = models.PositiveSmallIntegerField(default=50)
