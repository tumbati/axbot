#!/bin/sh

# The comment abode is a shebang that tells the OS which binary to run the script with

# The exec command below is how this script should end so it goes back and executes the command specified in the docker-compose.yml file
exec "$@"