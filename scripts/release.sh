set -e

# Change to git root directory
cd "$(git rev-parse --show-toplevel)"

source scripts/venv/bin/activate
pip install python-dotenv > /dev/null
pip install requests > /dev/null

if [ "$1" = "--release" ]; then
    python3 scripts/release.py --dry_run False
else
    python3 scripts/release.py
    echo "Dry run. Use argument --release to actually release."
fi
