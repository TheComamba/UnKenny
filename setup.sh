#!/bin/bash

echo "This script is currently broken. Best install nodejs and npm manually, for the moment."
exit 1

set -e

# Source nvm script, replace with the path to your nvm script
# Usually it's in the home directory in .nvm/nvm.sh
[ -s "$HOME/.nvm/nvm.sh" ] && \. "$HOME/.nvm/nvm.sh"

if ! command -v nvm &> /dev/null; then
    echo "nvm is not installed. Installing..."
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash
    source ~/.bashrc
fi

nvm install 18
nvm use 18

echo "Ensuring dependencies..."
npm install
