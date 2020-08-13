#!/usr/bin/env bash
source ../venv/bin/activate
source ../.env
python ../backend/manage.py runscript trigger-time --script-args month
