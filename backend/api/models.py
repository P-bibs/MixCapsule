from django.db import models
from django.contrib.auth.models import User

class SpotifyApiData(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    refresh_token = models.TextField()
    access_token = models.TextField()
    authentication_date = models.DateField(default=None, blank=True, null=True)

class PlaylistOptions(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    number_songs = models.IntegerField
