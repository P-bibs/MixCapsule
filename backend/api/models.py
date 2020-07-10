from django.db import models
from django.contrib.auth.models import User

class SpotifyApiData(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    refresh_token = models.TextField()
    access_token = models.TextField()

# class User(models.Model):
#     name = models.TextField()

#     class Meta:
#         ordering = ['name']
