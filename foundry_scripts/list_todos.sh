#!/bin/bash

set -e

# Change to git root directory
cd "$(git rev-parse --show-toplevel)"

SCRIPT=$(readlink -f "$0")

if grep -rinI todo * \
    --exclude-dir=node_modules \
    --exclude-dir=coverage \
    --exclude-dir=venv \
    --exclude=$(basename $SCRIPT) \
    -B 3 -A 3; then
    echo
    echo "TODOs found!"
    exit 1
else
    echo "No TODOs found."
fi
