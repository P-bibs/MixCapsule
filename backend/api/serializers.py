from django.contrib.auth.models import User
from rest_framework import serializers

from api.models import PlaylistOptions, SpotifyApiData


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "first_name", "last_name"]


class SpotifyApiDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = SpotifyApiData
        fields = ["refresh_token", "access_token", "authentication_date"]


class PlaylistOptionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlaylistOptions
        fields = ["number_songs"]
