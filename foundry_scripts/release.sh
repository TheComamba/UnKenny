#!/bin/bash

set -e

# Change to git root directory
cd "$(git rev-parse --show-toplevel)"

if [ ! -d "foundry_scripts/venv" ]; then
    python3 -m venv foundry_scripts/venv
fi
if [ -f foundry_scripts/venv/bin/activate ]; then
  source foundry_scripts/venv/bin/activate
else
  source foundry_scripts/venv/Scripts/activate
fi
pip install python-dotenv > /dev/null
pip install requests > /dev/null

if [ "$1" = "--release" ]; then
    python3 foundry_scripts/release.py --dry_run False
else
    python3 foundry_scripts/release.py
    echo "Dry run. Use argument --release to actually release."
fi
