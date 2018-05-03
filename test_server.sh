#! /bin/sh

open 'http://localhost:8080/app/player.html#url=http%3A%2F%2Fpodcast.1242.com%2Fsound%2F10656.mp3&title=test'
python -m SimpleHTTPServer 8080 2> /dev/null
