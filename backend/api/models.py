import datetime
from django.conf import settings
from django.db import models
from django.utils import timezone
import datetime

import api.spotify_wrapper as spotify_wrapper


class Profile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    spotify_name = models.CharField(max_length=50, null=False, blank=True)

    def __str__(self):
        return f"{self.user.username}'s profile"

    def has_generated_first_playlist(self):
        return len(self.user.generatedplaylist_set.all()) != 0


class SpotifyApiData(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    refresh_token = models.CharField(max_length=300, blank=True, null=False)
    access_token = models.CharField(max_length=300, blank=True, null=False)
    access_expires_at = models.DateTimeField(null=True)

    def __str__(self):
        return f"{self.user.username}'s spotify api data"

    def spotify_auth_required(self):
        return self.refresh_token == ""

    def request_refresh(self, force=False):
        # If the user doesn't have spotify data, return
        if self.refresh_token == "":
            return
        # If the cached values are still usable, return
        if (
            not force
            and self.access_expires_at is not None
            and timezone.now() < self.access_expires_at
        ):
            return self.access_token

        secret = settings.SPOTIFY_CLIENT_SECRET
        id = settings.SPOTIFY_CLIENT_ID
        refresh_token = self.refresh_token

        response = spotify_wrapper.request_refresh(id, secret, refresh_token)

        self.access_token = response["access_token"]
        self.access_expires_at = timezone.now() + datetime.timedelta(
            seconds=response["expires_in"]
        )
        self.save()

        return response["access_token"]

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
        if self.access_token is None:
            print(
                "WARNING: couldn't create playlist for %s due to missing Spotify authentication"
                % self.user.username
            )
            return False

        token = self.request_refresh()

        top = spotify_wrapper.get_top_tracks(
            token,
            self.user.playlistoptions.number_songs,
            self.user.playlistoptions.history_duration,
        )

        top_tracks = top["items"]
        top_track_ids = list(map(lambda x: x["id"], top_tracks))
        top_track_uris = list(map(lambda x: "spotify:track:" + str(x), top_track_ids))

        date = datetime.date.today()
        month = date.month
        year = date.year

        playlist_id = spotify_wrapper.create_playlist(
            token, str(month) + "/" + str(year) + " MixCapsule"
        )

        spotify_wrapper.add_tracks_to_playlist(token, playlist_id, top_track_uris)

        # record new playlist in GeneratedPlaylists table
        new_playlist_object = GeneratedPlaylist(user=self.user, spotify_id=playlist_id)
        new_playlist_object.save()

        return True


class PlaylistOptions(models.Model):
    SHORT = "long_term"
    MEDIUM = "short_term"
    LONG = "medium_term"
    HISTORY_DURATION_CHOICES = [
        (SHORT, "1 month"),
        (MEDIUM, "6 months"),
        (LONG, "All time"),
    ]

    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    number_songs = models.PositiveSmallIntegerField(default=50)
    history_duration = models.CharField(
        max_length=25,
        choices=HISTORY_DURATION_CHOICES,
        blank=False,
        null=False,
        default="short_term",
    )

    def __str__(self):
        return f"{self.user.username}'s playlist options"


class GeneratedPlaylist(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    spotify_id = models.CharField(max_length=25, blank=False, null=False)

    def __str__(self):
        return f"{self.user.username}'s playlist {self.spotify_id}"
