#!/bin/bash

set -e

if ! command -v sudo &> /dev/null; then
    echo "sudo is not installed. Installing..."
    apt-get install -y sudo
fi

if ! command -v curl &> /dev/null; then
    echo "curl is not installed. Installing..."
    sudo apt-get update
    sudo apt-get install -y curl
fi

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
