#!/bin/bash

set -e

# Change to git root directory
cd "$(git rev-parse --show-toplevel)"

# Update git subtree
git subtree pull --prefix foundry_scripts git@github.com:TheComamba/FoundryScripts.git main --squash

# Update npm packages
npm update
