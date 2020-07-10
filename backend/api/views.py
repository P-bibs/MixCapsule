from rest_framework.decorators import api_view
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
import json, urllib, os, datetime
import requests
# import api.spotify_wrapper

from api.models import SpotifyApiData

# @api_view(['GET'])
# @authentication_classes([SessionAuthentication, BasicAuthentication])
# @permission_classes([IsAuthenticated])


class HasSpotifyAuthentication(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    def get(self, request, format=None):
        user = request.user
        if user is not None:
            # extract first field of the two-tuple (user, token)
            # user = user[0]
            if len(user.spotifyapidata_set.all()) == 0:
                raise Exception("Error: users spotify data does not exist")
            spotify_api_data = user.spotifyapidata_set.all()[0]
            has_spotify_authentication = spotify_api_data.refresh_token != ""
            return Response(has_spotify_authentication)
        else:
            raise Exception("Error: jwt token doesn't correspond to any user")

class RequestSpotifyTokens(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    def post(self, request, format=None):
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
            user_spotify_data.save()

            return Response()
        else:
            raise Exception("Error: jwt token doesn't correspond to any user")

@api_view(['POST'])
def request_token(request):
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
    CLIENT_ID = "701121595899-aqsiqmiqfl58n3uup5ojss0pam6638q7.apps.googleusercontent.com"
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

class PlaylistManualCreation(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    def get(self, request, format=None):
        user = request.user

        if user is not None:
            user_spotify_data = user.spotifyapidata_set.all()[0]
            make_playlist(user_spotify_data)

            return Response()
        else:
            raise Exception("Error: jwt token doesn't correspond to any user")

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


def request_refresh(id, secret, refresh_token):
    print('requesting a token')


    response = requests.post(
        "https://accounts.spotify.com/api/token",
        data={
            'grant_type': 'refresh_token',
            'refresh_token': refresh_token,
            'client_id': id,
            'client_secret': secret
        }
    )

    if response.status_code != 200:
        print("ERROR: error when requesting token with code -- status code " + str(response.status_code))
        print(response.reason)
        print(response.text)
        return

    print('Received OK response for token refresh')

    return json.loads(response.text)


def get_top_tracks(token):
    """Returns top 50 tracks over last four weeks"""

    url = "https://api.spotify.com/v1/me/top/tracks"

    headers = {'Authorization': "Bearer " + token}

    query = {
        "limit": 50,
        "time_range": "short_term"
    }

    response = requests.get(url, headers=headers, params=query)

    if response.status_code != 200:
        print("ERROR: error when requesting top tracks with code -- status code " + str(response.status_code))
        print(response.reason)
        print(response.text)
        return

    print('Received OK response for top tracks request')

    return json.loads(response.text)

def get_me(token):
    """Return id of currently authenticated user"""

    url = "https://api.spotify.com/v1/me"

    headers = {
        'Authorization': "Bearer " + token
    }

    response = requests.get(url, headers=headers)

    if response.status_code != 200:
        print("ERROR: error when requesting current user with code -- status code " + str(response.status_code))
        print(response.reason)
        print(response.text)
        return

    print('Received OK response for get current user request')
    id = json.loads(response.text)['id']


    return id

def create_playlist(token, name):
    """Creates a playlist with specified name. Returns id"""

    my_id = get_me(token)

    url = "https://api.spotify.com/v1/users/" + str(my_id) + "/playlists"

    headers = {
        'Authorization': "Bearer " + token,
        'Content-Type': "application/json"
    }

    payload = {
        "name": name,
        "public": "false"
    }

    response = requests.post(url, headers=headers, json=payload)

    if response.status_code != 200 and response.status_code != 201:
        print("ERROR: error when requesting playlist creation with code -- status code " + str(response.status_code))
        print(response.reason)
        print(response.text)
        return

    print('Received OK response for playlist creation request')

    id = json.loads(response.text)['id']
    return id

def add_tracks_to_playlist(token, playlist_id, track_uris):
    """Adds given track uris to given playlist"""

    url = "https://api.spotify.com/v1/playlists/" + playlist_id + "/tracks"
    
    headers = {
        'Authorization': "Bearer " + token,
        'Content-Type': "application/json"
    }

    payload = {
        "uris": track_uris
    }

    response = requests.post(url, headers=headers, json=payload)

    if response.status_code != 200 and response.status_code != 201:
        print("ERROR: error when adding tracks with code -- status code " + str(response.status_code))
        print(response.reason)
        print(response.text)
        return

    print('Received OK response for adding tracks')

    return