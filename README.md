# MixCapsule
A script to make a time capsule playlist of your most played Spotify tracks for the last month

# Testing
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
