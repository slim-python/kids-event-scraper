#!/bin/bash
echo "$(date) - Running kids-event-scraper" >> /main-script/kids-event-scraper/-kids-event-cron-log
/usr/bin/node /main-script/kids-event-scraper/cron.js >> /main-script/kids-event-scraper/-kids-event-cron-log 2>&1
