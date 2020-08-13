from datetime import datetime

import requests
from django.conf import settings
from django.utils import timezone
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.contrib.auth.mixins import LoginRequiredMixin
from django.core.exceptions import ObjectDoesNotExist
from google.auth.transport import requests as google_requests
from google.oauth2 import id_token
from rest_framework.generics import ListCreateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken

from api.models import Profile, PlaylistOptions, SpotifyApiData, GeneratedPlaylist
from api.serializers import (
    PlaylistOptionsSerializer,
    SpotifyApiDataSerializer,
    UserSerializer,
    ProfileSerializer,
    GeneratedPlaylistSerializer,
)


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

    def post(self, request):
        user = request.user
        code = request.data["code"]

        if user is not None:
            CLIENT_ID = settings.SPOTIFY_CLIENT_ID
            CLIENT_SECRET = settings.SPOTIFY_CLIENT_SECRET
            REDIRECT_URI = settings.REDIRECT_URI

            print(REDIRECT_URI)
            response = requests.post(
                "https://accounts.spotify.com/api/token",
                data={
                    "grant_type": "authorization_code",
                    "code": code,
                    "redirect_uri": REDIRECT_URI,
                    "client_id": CLIENT_ID,
                    "client_secret": CLIENT_SECRET,
                },
            )
            response_data = response.json()
            print(response_data)
            if "error" in response_data:
                return Response(
                    {
                        "error": "Spotify API error: "
                        + response_data["error_description"]
                    },
                    status=400,
                )
            user_spotify_data = user.spotifyapidata
            user_spotify_data.refresh_token = response_data["refresh_token"]
            user_spotify_data.access_token = response_data["access_token"]
            user_spotify_data.access_expires_at = timezone.now() + datetime.timedelta(
                seconds=response["expires_in"]
            )
            user_spotify_data.save()

            return Response({})
        else:
            raise Exception("Error: jwt token doesn't correspond to any user")


class TokenRequestView(APIView):
    def post(self, request):
        google_token = request.data["google_token"]

        token_info = verify_google_jwt(google_token)
        if token_info:
            user = User.objects.filter(email=token_info["email"])

            # If this is a new user, create an entry for them
            if len(user) == 0:
                new_user = User.objects.create_user(
                    token_info["email"],
                    token_info["email"],
                    "",
                    first_name=token_info["given_name"],
                    last_name=token_info["family_name"],
                )
                new_user.set_unusable_password()
                new_user.save()

                new_user_profile = Profile(user=new_user)
                new_user_profile.save()

                new_user_data = SpotifyApiData(user=new_user)
                new_user_data.save()

                new_user_options = PlaylistOptions(user=new_user)
                new_user_options.save()

                user = new_user
            else:
                user = user[0]

            refresh = RefreshToken.for_user(user)
            return Response(
                {"refresh": str(refresh), "access": str(refresh.access_token),}
            )


def verify_google_jwt(token):
    CLIENT_ID = settings.GOOGLE_CLIENT_ID
    try:
        # Specify the CLIENT_ID of the app that accesses the backend:
        idinfo = id_token.verify_oauth2_token(
            token, google_requests.Request(), CLIENT_ID
        )

        # Or, if multiple clients access the backend server:
        # idinfo = id_token.verify_oauth2_token(token, requests.Request())
        # if idinfo['aud'] not in [CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]:
        #     raise ValueError('Could not verify audience.')

        if idinfo["iss"] not in ["accounts.google.com", "https://accounts.google.com"]:
            raise ValueError("Wrong issuer.")

        # If auth request is from a G Suite domain:
        # if idinfo['hd'] != GSUITE_DOMAIN_NAME:
        #     raise ValueError('Wrong hosted domain.')

        return idinfo
    except ValueError:
        return False


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

