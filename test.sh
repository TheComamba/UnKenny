#!/bin/bash

if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Installing..."
    sudo apt-get install -y nodejs
fi

if ! command -v npm &> /dev/null; then
    echo "JavaScript package manager npm is not installed. Installing..."
    sudo apt-get install -y npm
fi
