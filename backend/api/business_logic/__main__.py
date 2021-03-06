import urllib
import json
import os
import datetime
import auth, spotify_wrapper


dir_path = os.path.abspath(os.path.dirname(os.path.realpath(__file__)))

with open(dir_path + '/../config.json') as f:
    config = json.load(f)

id = config['SETUP']['id']
secret = config['SETUP']['secret']
refresh_token = config['DATA']['refresh_token']

response = auth.request_refresh(id, secret, refresh_token)

token = response['access_token']

top = spotify_wrapper.get_top_tracks(token)

top_tracks = top['items']
top_track_ids = list(map(lambda x : x['id'], top_tracks))
top_track_uris = list(map(lambda x : "spotify:track:" + str(x), top_track_ids))

date = datetime.date.today()
month = date.month
year  = date.year

playlist_id = spotify_wrapper.create_playlist(token, str(month) + "/" + str(year) + " MixCapsule")

spotify_wrapper.add_tracks_to_playlist(token, playlist_id, top_track_uris)
