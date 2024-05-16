#!/bin/bash

set -e

if ! command -v nvm &> /dev/null; then
    echo "nvm is not installed. Installing..."
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
fi

nvm install 18
nvm use 18

echo "Ensuring dependencies..."
npm install
