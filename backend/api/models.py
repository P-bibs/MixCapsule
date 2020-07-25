import datetime
from django.contrib.auth.models import User
from django.conf import settings
from django.db import models

from api.spotify_wrapper import (add_tracks_to_playlist, create_playlist,
                                 get_top_tracks, request_refresh)

class SpotifyApiData(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    refresh_token = models.TextField()
    access_token = models.TextField()
    authentication_date = models.DateField(default=None, blank=True, null=True)

    def make_playlist(self):
        """
        Create a playlist with this data. Return True if successful, False otherwise
        """
        if self.authentication_date is None:
            return False
        
        secret = settings.SPOTIFY_CLIENT_SECRET
        id = settings.SPOTIFY_CLIENT_ID
        refresh_token = self.refresh_token

        response = request_refresh(id, secret, refresh_token)

        token = response['access_token']

        top = get_top_tracks(token)

        top_tracks = top['items']
        top_track_ids = list(map(lambda x : x['id'], top_tracks))
        top_track_uris = list(map(lambda x : "spotify:track:" + str(x), top_track_ids))

        date = datetime.date.today()
        month = date.month
        year  = date.year

        playlist_id = create_playlist(token, str(month) + "/" + str(year) + " MixCapsule")

        add_tracks_to_playlist(token, playlist_id, top_track_uris)

        return True

class PlaylistOptions(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    number_songs = models.PositiveSmallIntegerField(default=50)
