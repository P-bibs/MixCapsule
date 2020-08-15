import datetime

from django.conf import settings
from django.utils import timezone
from django.contrib.auth.models import User
from django.contrib.auth.mixins import LoginRequiredMixin
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.generics import ListCreateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken
import tekore as tk

from api.models import Profile, PlaylistOptions, SpotifyApiData, GeneratedPlaylist
from api.serializers import (
    PlaylistOptionsSerializer,
    SpotifyApiDataSerializer,
    UserSerializer,
    ProfileSerializer,
    GeneratedPlaylistSerializer,
)
import api.spotify_wrapper as spotify_wrapper


class HealthCheckView(APIView):
    def get(self, request):
        return Response("OK")


class SpotifyAuthenticationView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        if user is not None:
            try:
                spotify_api_data = user.spotifyapidata
                spotify_api_data.request_refresh()
                return Response(SpotifyApiDataSerializer(spotify_api_data).data)
            except ObjectDoesNotExist:
                raise Exception("Error: users spotify api data does not exist")
        else:
            raise Exception("Error: jwt token doesn't correspond to any user")


class TokenRequestView(APIView):
    def post(self, request):
        code = request.data["code"]

        CLIENT_ID = settings.SPOTIFY_CLIENT_ID
        CLIENT_SECRET = settings.SPOTIFY_CLIENT_SECRET
        REDIRECT_URI = settings.REDIRECT_URI

        auth_info = spotify_wrapper.exchange_code(
            CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, code
        )
        access_token = auth_info["access_token"]

        spotify = tk.Spotify(access_token)
        user_info = spotify.current_user()

        user_id = user_info.id
        user_email = user_info.email

        user = User.objects.filter(username=user_id)

        # If this is a new user, create an entry for them
        if len(user) == 0:
            new_user = User.objects.create_user(user_id, user_email, "",)
            new_user.set_unusable_password()
            new_user.save()

            new_user_profile = Profile(user=new_user)
            new_user_profile.save()

            new_user_data = SpotifyApiData(
                user=new_user,
                access_token=auth_info["access_token"],
                refresh_token=auth_info["refresh_token"],
                access_expires_at=timezone.now()
                + datetime.timedelta(seconds=auth_info["expires_in"]),
            )
            new_user_data.save()

            new_user_options = PlaylistOptions(user=new_user)
            new_user_options.save()

            user = new_user
        else:
            user = user[0]

        refresh = RefreshToken.for_user(user)
        return Response({"refresh": str(refresh), "access": str(refresh.access_token),})


# Generic get/update view
class UserDetailView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        if user is not None:
            return Response(UserSerializer(user).data)
        else:
            raise Exception("Error: jwt token doesn't correspond to any user")


# Generic get/update view
class ProfileDetailView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        if user is not None:
            return Response(ProfileSerializer(user.profile).data)
        else:
            raise Exception("Error: jwt token doesn't correspond to any user")


class PlaylistListCreateView(ListCreateAPIView):
    queryset = GeneratedPlaylist.objects.all()
    serializer_class = GeneratedPlaylistSerializer

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        if user is not None:
            successful = user.spotifyapidata.make_playlist()
            if successful:
                new_playlist = user.generatedplaylist_set.all()[
                    len(user.generatedplaylist_set.all()) - 1
                ]
                return Response(
                    GeneratedPlaylistSerializer(new_playlist).data, status=200
                )
            else:
                return Response(
                    {"error": "Server Error: Failed to create playlist"}, status=500
                )
        else:
            raise Exception("Error: jwt token doesn't correspond to any user")


# Generic get/update view
class PlaylistOptionsDetailView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        if user is not None:
            try:
                playlist_options = user.playlistoptions
                return Response(PlaylistOptionsSerializer(playlist_options).data)
            except ObjectDoesNotExist:
                raise Exception("Error: users playlist options do not exist")

        else:
            raise Exception("Error: jwt token doesn't correspond to any user")

    def patch(self, request):
        user = request.user
        if user is not None:
            try:
                playlist_options = user.playlistoptions
                serializer = PlaylistOptionsSerializer(
                    playlist_options, data=request.data, partial=True
                )
                if serializer.is_valid():
                    print(playlist_options)
                    print(serializer.data)
                    PlaylistOptions.objects.filter(pk=playlist_options.pk).update(
                        **request.data
                    )
                else:
                    print("error")
                    print(serializer.errors)
                    return Response({}, status=500)

                print(serializer)
                playlist_options.refresh_from_db()
                return Response(
                    PlaylistOptionsSerializer(playlist_options).data, status=200
                )
            except ObjectDoesNotExist:
                raise Exception("Error: users playlist options do not exist")

        else:
            raise Exception("Error: jwt token doesn't correspond to any user")

