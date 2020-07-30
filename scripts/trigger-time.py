import argparse, os
import requests
from dotenv import load_dotenv

# Set up argument parser
parser = argparse.ArgumentParser(description='Send a time trigger to MixCapsule server')
parser.add_argument('time_period',
  action="store",
  type=str,
  choices=["day", "week", "month", "year"],
  help="The time period to trigger",
  metavar="time_period",
)
args = parser.parse_args()

# Load admin credentials from environment file
load_dotenv()

# Load in relevant variables
time_period = args.time_period
admin_user = os.getenv("MIXCAPSULE_ADMIN_USERNAME")
admin_pass = os.getenv("MIXCAPSULE_ADMIN_PASS")

print(f""" Making request to:
  https://api.mixcapsule.paulbiberstein.me/admin/trigger/{time_period}
  {admin_user}
  {admin_pass}""")

r = requests.post(
  "https://api.mixcapsule.paulbiberstein.me/admin/trigger/%s" % time_period,
  json={
    "username": admin_user,
    "password": admin_pass
  }
)

print(r.text)
