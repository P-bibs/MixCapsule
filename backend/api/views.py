from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.authentication import JWTAuthentication
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from django.conf import settings
from rest_framework import generics
import datetime
import requests
from api.models import SpotifyApiData, PlaylistOptions
from api.serializers import UserSerializer, SpotifyApiDataSerializer, PlaylistOptionsSerializer
from api.spotify_wrapper import request_refresh, get_top_tracks, create_playlist, add_tracks_to_playlist

class SpotifyAuthentication(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        if user is not None:
            if len(user.spotifyapidata_set.all()) == 0:
                raise Exception("Error: users spotify data does not exist")
            spotify_api_data = user.spotifyapidata_set.all()[0]
            return Response(
                SpotifyApiDataSerializer(spotify_api_data).data
            )
        else:
            raise Exception("Error: jwt token doesn't correspond to any user")

    def post(self, request):
        user = request.user
        code = request.data["code"]

        if user is not None:
            CLIENT_ID = settings.SPOTIFY_CLIENT_ID
            CLIENT_SECRET = settings.SPOTIFY_CLIENT_SECRET
            auth_bytes = "{CLIENT{CLIENT_ID}:{CLIENT_SECRET}".encode("ascii")
            REDIRECT_URI = settings.REDIRECT_URI

            print(REDIRECT_URI)
            response = requests.post(
            "https://accounts.spotify.com/api/token",
                data={
                    'grant_type': 'authorization_code',
                    'code': code,
                    'redirect_uri': REDIRECT_URI,
                    'client_id': CLIENT_ID,
                    'client_secret': CLIENT_SECRET
                }
            )
            response_data = response.json()
            print(response_data)
            if "error" in response_data:
                return Response({"error": "Spotify API error: " + response_data["error_description"]}, status=400)
            user_spotify_data = user.spotifyapidata_set.all()[0]
            user_spotify_data.refresh_token = response_data["refresh_token"]
            user_spotify_data.access_token = response_data["access_token"]
            user_spotify_data.authentication_date = datetime.date.today()
            user_spotify_data.save()

            return Response()
        else:
            raise Exception("Error: jwt token doesn't correspond to any user")

class TokenRequest(APIView):
    def post(self, request):
        google_token = request.data["google_token"]

        token_info = verify_google_jwt(google_token)
        if token_info:
            user = User.objects.filter(email=token_info["email"])

            # If this is a new user, create an entry for them
            if len(user) == 0:
                new_user = User.objects.create_user(token_info["email"], token_info["email"], "")
                new_user.set_unusable_password()
                new_user.save()

                new_user_data = SpotifyApiData()
                new_user_data.user = new_user
                new_user_data.refresh_token = ""
                new_user_data.access_token = ""
                new_user_data.save()

                user = new_user
            else:
                user = user[0]

            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            })
    

def verify_google_jwt(token):
    CLIENT_ID = settings.GOOGLE_CLIENT_ID
    # (Receive token by HTTPS POST)
    # ...
    try:
        # Specify the CLIENT_ID of the app that accesses the backend:
        idinfo = id_token.verify_oauth2_token(token, google_requests.Request(), CLIENT_ID)

        # Or, if multiple clients access the backend server:
        # idinfo = id_token.verify_oauth2_token(token, requests.Request())
        # if idinfo['aud'] not in [CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]:
        #     raise ValueError('Could not verify audience.')

        if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
            raise ValueError('Wrong issuer.')

        # If auth request is from a G Suite domain:
        # if idinfo['hd'] != GSUITE_DOMAIN_NAME:
        #     raise ValueError('Wrong hosted domain.')

        # ID token is valid. Get the user's Google Account ID from the decoded token.
        userid = idinfo['sub']
        return idinfo
    except ValueError:
        return False

class Playlist(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    def post(self, request):
        user = request.user

        if user is not None:
            user_spotify_data = user.spotifyapidata_set.all()[0]
            make_playlist(user_spotify_data)

            return Response()
        else:
            raise Exception("Error: jwt token doesn't correspond to any user")

class UserDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class PlaylistOptionsDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = PlaylistOptions.objects.all()
    serializer_class = PlaylistOptionsSerializer

def make_playlist(SpotifyApiData):
    secret = settings.SPOTIFY_CLIENT_SECRET
    id = settings.SPOTIFY_CLIENT_ID
    refresh_token = SpotifyApiData.refresh_token

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


