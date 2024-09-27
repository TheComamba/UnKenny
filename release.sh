#!/bin/bash

set -e

# Change to git root directory
cd "$(git rev-parse --show-toplevel)"

if [ ! -d "scripts/venv" ]; then
    python3 -m venv scripts/venv
fi
if [ -f scripts/venv/bin/activate ]; then
  source scripts/venv/bin/activate
else
  source scripts/venv/Scripts/activate
fi
pip install python-dotenv > /dev/null
pip install requests > /dev/null

if [ "$1" = "--release" ]; then
    python3 scripts/release.py --dry_run False
else
    python3 scripts/release.py
    echo "Dry run. Use argument --release to actually release."
fi
