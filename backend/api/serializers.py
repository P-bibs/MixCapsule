from django.contrib.auth.models import User
from rest_framework import serializers

from api.models import Profile, PlaylistOptions, SpotifyApiData, GeneratedPlaylist


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "first_name", "last_name"]
        depth = 1


class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Profile
        fields = [
            "user",
            "spotify_auth_required",
            "spotify_name",
            "has_generated_first_playlist",
        ]
        depth = 1


class SpotifyApiDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = SpotifyApiData
        fields = ["refresh_token", "access_token", "authentication_date"]


class PlaylistOptionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlaylistOptions
        fields = ["number_songs"]


class GeneratedPlaylistSerializer(serializers.ModelSerializer):
    class Meta:
        model = GeneratedPlaylist
        fields = ["spotify_id"]
