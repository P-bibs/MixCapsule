# [MixCapsule](https://mixcapsule.paulbiberstein.me)

<p align="center">
<a href="https://mixcapsule.paulbiberstein.me">
<img src="https://paulbiberstein.me/resources/OptimizedMixCapsuleGif.gif">
</a>
</p>

**[See the live version here](https://mixcapsule.paulbiberstein.me)**

A website to make time capsule playlists of your most played Spotify tracks for the last month!

![Uptime Robot ratio (30 days)](https://img.shields.io/uptimerobot/ratio/m785807715-5f834be838a5e5f36cee8947?label=uptime%20%2Fmonth)
![LGTM Grade](https://img.shields.io/lgtm/grade/javascript/github/P-bibs/MixCapsule)
![LGTM Grade](https://img.shields.io/lgtm/grade/python/github/P-bibs/MixCapsule)
![GitHub stars](https://img.shields.io/github/stars/P-bibs/MixCapsule?style=social)

# About
When I started college, I got the advice from a good friend to make CDs of all the songs I listened to each semester so I could listen to them years down the line and be transported back. It was a great idea (after I decided to exchange "CDs" for "playlists"), but I had a hard time remembering to keep tracks of songs as my tastes changed, and I quickly started finding holes in my self-recorded music history. To solve that problem, I created Mix Capsule.


Once you login with Spotify, Mix Capsule will deposit a playlist in your library every month containing your most listened to songs for that month. Now, whenever you want to kick back and listen to music that reminds you of the past, flip through your Mix Capsule playlists and see what you were listening to 1 month, 6 months, or even a year ago.

# Tech Stack
## Frontend
Mix Capsule utilizes [NextJS](https://nextjs.org/) on the frontend with [Tailwind](https://material-ui.com/) for styling, [Material UI](https://material-ui.com/) for buttons, [Ionicons](https://ionicons.com/) for icons, and [Drift](https://www.drift.com/) for live chat.
## Backend
Mix Capsule uses [Django](https://www.djangoproject.com/) and [Django Rest Framework](https://www.django-rest-framework.org/) on the backend with an sqlite database.

## Deployment
The frontend is deployed with [Vercel](https://vercel.com/). The backend is deployed to a [DigitalOcean](https://www.digitalocean.com/) droplet running an Apache webserver. [Apache](https://httpd.apache.org/) runs a WSGI proxy to send requests to Django. Additionally, monthly playlist creation is scheduled by systemd timers, which are preferable over cron jobs since they handle system down-time gracefully.

## API interactions
When interacting with the Spotify API, Mix Capsule uses the "authorization code" flow so that the backend can save a refresh token and continue to act on the user's behalf even after they've left the site. This is what allows monthly playlist creation with no intervention from the user. 

# Setting up Local Development
**Environment**
```bash
cp .env.example .env
nano .env # Follow the instructions in the file to fill in secrets
source .env
```

**Backend**
```bash
python3 -m venv venv
source venv/bin/activate
python -m pip install -r requirements.txt
cd backend
python manage.py migrate
python manage.py runserver
```

**Frontend**
```bash
cd frontend
npm i
npm start
```

**Services/Scripts**
```bash
cd scripts
chmod +x trigger-month.sh

cd ../services
mv TriggerMonth.service.example TriggerMonth.service
nano TriggerMonth.service # Fill in missing information
sudo systemctl link /full/path/to/TriggerMonth.service
sudo systemctl enable /full/path/to/TriggerMonth.timer
```