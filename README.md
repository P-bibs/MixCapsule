# MixCapsule
A website to make time capsule playlists of your most played Spotify tracks for the last month

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
mv .env.example .env
nano .env # Fill in missing credentials
chmod +x trigger-month.sh

cd ../services
mv TriggerMonth.service.example TriggerMonth.service
nano TriggerMonth.service # Fill in missing information
sudo systemctl link /full/path/to/TriggerMonth.service
sudo systemctl enable /full/path/to/TriggerMonth.timer
```