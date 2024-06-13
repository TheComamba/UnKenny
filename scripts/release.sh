set -e

# Change to git root directory
cd "$(git rev-parse --show-toplevel)"

source scripts/venv/bin/activate
pip install python-dotenv > /dev/null
pip install requests > /dev/null
python3 scripts/release.py
