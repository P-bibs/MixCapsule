from datetime import date
from django.http import JsonResponse
from django.middleware.csrf import get_token
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.authentication import JWTAuthentication
from google.oauth2 import id_token
from google.auth.transport import requests
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

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
        idinfo = id_token.verify_oauth2_token(token, requests.Request(), CLIENT_ID)

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


