import datetime
from django.conf import settings
from django.db import models

from api.spotify_wrapper import (
    add_tracks_to_playlist,
    create_playlist,
    get_top_tracks,
    request_refresh,
)


class Profile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    spotify_name = models.CharField(max_length=50, null=False, blank=True)

    def __str__(self):
        return f"{self.user.username}'s profile"

    def spotify_auth_required(self):
        return self.user.spotifyapidata.refresh_token == ""

    def has_generated_first_playlist(self):
        return len(self.user.generatedplaylist_set.all()) != 0


class SpotifyApiData(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    refresh_token = models.TextField()
    access_token = models.TextField()
    authentication_date = models.DateField(default=None, blank=True, null=True)

    def __str__(self):
        return f"{self.user.username}'s spotify api data"

    def trigger_time_period(self, time_period):
        # TODO: add logic for other time periods
        if time_period == "day":
            pass
        elif time_period == "week":
            pass
        elif time_period == "month":
            self.make_playlist()
        elif time_period == "year":
            pass
        else:
            raise Exception("time_period must be one of [day, week, month, year]")

    def make_playlist(self):
        """
        Create a playlist with this data. Return True if successful, False otherwise
        """
        if self.authentication_date is None:
            print(
                "WARNING: couldn't create playlist for %s due to missing Spotify authentication"
                % self.user.username
            )
            return False

        secret = settings.SPOTIFY_CLIENT_SECRET
        id = settings.SPOTIFY_CLIENT_ID
        refresh_token = self.refresh_token

        response = request_refresh(id, secret, refresh_token)

        token = response["access_token"]

        top = get_top_tracks(token)

        top_tracks = top["items"]
        top_track_ids = list(map(lambda x: x["id"], top_tracks))
        top_track_uris = list(map(lambda x: "spotify:track:" + str(x), top_track_ids))

        date = datetime.date.today()
        month = date.month
        year = date.year

        playlist_id = create_playlist(
            token, str(month) + "/" + str(year) + " MixCapsule"
        )

        add_tracks_to_playlist(token, playlist_id, top_track_uris)

        # record new playlist in GneratedPlaylists table
        new_playlist_object = GeneratedPlaylist(user=self.user, spotify_id=playlist_id)
        new_playlist_object.save()

        return True


class PlaylistOptions(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    number_songs = models.PositiveSmallIntegerField(default=50)

    def __str__(self):
        return f"{self.user.username}'s playlist options"


class GeneratedPlaylist(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    spotify_id = models.CharField(max_length=25, blank=False, null=False)

    def __str__(self):
        return f"{self.user.username}'s playlist {self.spotify_id}"
