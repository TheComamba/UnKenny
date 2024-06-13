import requests
import json
import os
from dotenv import load_dotenv # type: ignore

load_dotenv()
foundry_api_key = os.getenv('FOUNDRY_API_KEY')
if not foundry_api_key:
    raise ValueError("FOUNDRY_API_TOKEN is not set in the environment or .env file")

with open("src/module.json", 'r') as file:
    manifest = json.load(file)

url = "https://api.foundryvtt.com/_api/packages/release_version/"
headers = {
    'Content-Type': 'application/json',
    'Authorization': foundry_api_key
}
version = manifest.get("version")
manifest_url = f"https://github.com/TheComamba/UnKenny/blob/v{version}/src/module.json"
notes = f"https://github.com/TheComamba/UnKenny/blob/v{version}/release_notes/{version}.md"
data = {
    "id": manifest.get("id"),
    "dry-run": True,
    "release": {
        "version": version,
        "manifest": manifest_url,
        "notes": notes,
        "compatibility": manifest.get("compatibility"),
    }
}

response = requests.post(url, headers=headers, data=json.dumps(data))
response_data = response.json()

print(response_data)
