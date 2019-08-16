"""Functions for requesting and refreshing authentication tokens for the Spotify API"""

import json
import os
import requests

def request_token(id, secret, code, redirect):    
    print('requesting a token')

    redirect_uri = redirect

    response = requests.post(
        "https://accounts.spotify.com/api/token",
        data={
            'grant_type': 'authorization_code',
            'code': code,
            'redirect_uri': redirect_uri,
            'client_id': id,
            'client_secret': secret
        }
    )

    if response.status_code != 200:
        if response.status_code == 400:
            print("ERROR: Your auth token is expired. Get a new one at http:/localhost:3000")
        else:
            print("ERROR: error when requesting token with code -- status code " + str(response.status_code))
            print(response.reason)
            print(response.text)
        return

    print('Received OK response for token request from code')

    return json.loads(response.text)


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
