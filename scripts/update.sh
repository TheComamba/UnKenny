#!/bin/bash

set -e

# Change to git root directory
cd "$(git rev-parse --show-toplevel)"

#npm update

if ! command -v jq &> /dev/null; then
    echo "jq is not installed. Installing..."
    sudo apt-get update
    sudo apt-get install -y jq
fi

openai_version=$(jq '.packages."node_modules/openai".version' package-lock.json | sed 's/\"//g')
transformers_version=$(jq '.packages."node_modules/@xenova/transformers".version' package-lock.json | sed 's/\"//g')
sed -i "s|\(\"openai\": \)\".*\"|\1\"$openai_version\"|" ./src/scripts/shared.js
sed -i "s|\(\"@xenova/transformers\": \)\".*\"|\1\"$transformers_version\"|" ./src/scripts/shared.js

#TODO: This currently breaks the crate because of the missing /+esm suffix.
