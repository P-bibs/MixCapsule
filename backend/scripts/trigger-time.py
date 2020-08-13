from django.contrib.auth.models import User
from django.core.exceptions import ObjectDoesNotExist


def run(*args):
    if len(args) != 1:
        print(
            "Usage: python manage.py runscript trigger-time --script-arts [time_period]"
        )
        return

    time_period = args[0]
    if time_period not in ["day", "week", "month", "year"]:
        print("time_period must be day, week, month, or year")
        return

    users = User.objects.all()
    for user in users:
        try:
            user.spotifyapidata.trigger_time_period(time_period)
        except ObjectDoesNotExist as e:
            # If the user doesn't have a spotifyapidata reference, they're a staff member
            print(
                "User %s is non-client user or has no spotify api data, skipping playlist creation"
                % user.username
            )
