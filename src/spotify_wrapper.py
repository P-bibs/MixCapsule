import json
import requests

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