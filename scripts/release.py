import requests
import json
import os
from dotenv import load_dotenv

# Load .env file if exists
load_dotenv()

# Get the FOUNDRY_API_TOKEN
foundry_api_key = os.getenv('FOUNDRY_API_KEY')

if not foundry_api_key:
    raise ValueError("FOUNDRY_API_TOKEN is not set in the environment or .env file")

url = "https://api.foundryvtt.com/_api/packages/release_version/"
headers = {
    'Content-Type': 'application/json',
    'Authorization': foundry_api_key
}
data = {
    "id": "unkenny",
    "dry-run": True,
    "release": {
        "version": "1.0.0",
        "manifest": "https://github.com/example/example-module/issues/releases/download/release-1.0.0/system.json",
        "notes": "https://github.com/example/example-module/releases/tag/release-1.0.0",
        "compatibility": {
            "minimum": "10.312",
            "verified": "11",
            "maximum": ""
        }
    }
}

response = requests.post(url, headers=headers, data=json.dumps(data))
response_data = response.json()

print(response_data)
