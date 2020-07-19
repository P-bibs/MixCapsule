import urllib
import json
import os
import auth

VERBOSE = True

dir_path = os.path.dirname(os.path.realpath(__file__))

with open(dir_path + '/../config.json') as f:
    config = json.load(f)

if VERBOSE:
    print("Loaded config:")
    print(config)

id = config['SETUP']['id']
secret = config['SETUP']['secret']
redirect = config['SETUP']['redirect']
code = config['DATA']['code']

response = auth.request_token(id, secret, code, redirect)

access_token = response['access_token']
refresh_token = response['refresh_token']

config['DATA'] = {
    **config['DATA'],
    "access_token": access_token,
    "refresh_token": refresh_token
}

print("Writing Config:")
print(config)

with open(dir_path + '/../config.json', 'w') as f:
    json.dump(config, f, ensure_ascii=False, indent=4)