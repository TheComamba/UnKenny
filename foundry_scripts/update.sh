#!/bin/bash

set -e

# Change to git root directory
cd "$(git rev-parse --show-toplevel)"

# Update git subtree
git subtree pull --prefix foundry_scripts FoundryScripts main --squash

# Update npm packages
npm update
