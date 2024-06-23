import argparse
import json
from dotenv import load_dotenv # type: ignore
import os
import requests
import time

foundry_api_endpoint = "https://api.foundryvtt.com/_api/packages/release_version/"

def str2bool(v):
    if isinstance(v, bool):
       return v
    if v.lower() in ('yes', 'true', 't', 'y', '1'):
        return True
    elif v.lower() in ('no', 'false', 'f', 'n', '0'):
        return False
    else:
        raise argparse.ArgumentTypeError('Boolean value expected.')

parser = argparse.ArgumentParser()
parser.add_argument('--dry_run', type=str2bool, default=True, help='Needs to be explicitly set to False to actually release the module.')

args = parser.parse_args()

def prepare_headers():
    load_dotenv()
    foundry_api_key = os.getenv('FOUNDRY_API_KEY')
    if not foundry_api_key:
        raise ValueError("FOUNDRY_API_KEY is not set in the environment or .env file")

    return {
        'Content-Type': 'application/json',
        'Authorization': foundry_api_key
    }

def get_manifest():
    with open("src/module.json", 'r') as file:
        return json.load(file)

def manifest_url(version):
    return f"https://raw.githubusercontent.com/TheComamba/UnKenny/v{version}/src/module.json"

def release_notes_url(version):
    return f"https://github.com/TheComamba/UnKenny/blob/v{version}/release_notes/{version}.md"
    
def get_data(manifest):
    version = manifest.get("version")
    return {
        "id": manifest.get("id"),
        "dry-run": args.dry_run,
        "release": {
            "version": version,
            "manifest": manifest_url(version),
            "notes": release_notes_url(version),
            "compatibility": manifest.get("compatibility"),
        }
    }

def check_to_be_on_main_branch():
    branch = os.popen("git branch --show-current").read().strip()
    if branch != "main":
        raise ValueError("You need to be on the main branch to release a new version")

def tag_with_version(version):
    os.system(f"git tag v{version}")
    os.system(f"git push origin v{version}")

def check_url_existence(url):
    response = requests.get(url)
    if response.status_code == 200:
        return True
    else:
        return False

def wait_for_url_to_exists(url):
    max_retries = 10
    while not check_url_existence(url):
        print(f"Waiting one combat round for {url} to exist...")
        time.sleep(6)
        max_retries -= 1
        if max_retries == 0:
            raise ValueError(f"Timed out waiting for {url} to exist")

headers = prepare_headers()
manifest = get_manifest()
version = manifest.get("version")
data = get_data(manifest)

if not args.dry_run:
    check_to_be_on_main_branch()
    tag_with_version(version)
    wait_for_url_to_exists(manifest_url(version))
    wait_for_url_to_exists(release_notes_url(version))

response = requests.post(foundry_api_endpoint, headers=headers, data=json.dumps(data))
response_data = response.json()

print(response_data)
