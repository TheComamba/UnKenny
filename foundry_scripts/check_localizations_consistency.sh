#!/bin/bash

# Change to git root directory
cd "$(git rev-parse --show-toplevel)"

if ! command -v jq &> /dev/null; then
    echo "jq is not installed. Installing..."
    sudo apt-get install -y jq
fi

# Path to the English language file
EN_FILE="src/lang/en.json"

# Check if the English language file exists
if [ ! -f "$EN_FILE" ]; then
  echo "English language file not found!"
  exit 1
fi

RETURN_CODE=0

# Extract all keys from the English language file
EN_KEYS=$(jq -r 'keys[]' "$EN_FILE")

# Convert EN_KEYS to an array for easier checking
EN_KEYS_ARRAY=($EN_KEYS)

# Function to check if a key exists in the English keys
key_exists_in_en() {
  local key=$1
  for en_key in "${EN_KEYS_ARRAY[@]}"; do
	if [ "$en_key" == "$key" ]; then
	  return 0
	fi
  done
  return 1
}

# Loop through all other language files in the src/lang directory
for LANG_FILE in src/lang/*.json; do
  if [ "$LANG_FILE" != "$EN_FILE" ]; then
	for KEY in $EN_KEYS; do
	  if ! jq -e --arg key "$KEY" 'has($key)' "$LANG_FILE" > /dev/null; then
		echo "Missing key warning: $KEY in $LANG_FILE"
	  fi
	done

	# Extract all keys from the current language file
	LANG_KEYS=$(jq -r 'keys[]' "$LANG_FILE")
	for LANG_KEY in $LANG_KEYS; do
	  if ! key_exists_in_en "$LANG_KEY"; then
		echo "Extra key: $LANG_KEY in $LANG_FILE"
        RETURN_CODE=1
	  fi
	done
  fi
done

# Loop through all files in the src folder but not in the src/lang folder
for KEY in $EN_KEYS; do
  KEY_FOUND=false
  while IFS= read -r FILE; do
	if grep -Fq "$KEY" "$FILE"; then
	  KEY_FOUND=true
	  break
	fi
  done < <(find src -type f ! -path "src/lang/*")
  
  if [ "$KEY_FOUND" = false ]; then
	echo "Key $KEY from en.json not found in any file in src folder"
    RETURN_CODE=1
  fi
done

# Loop through all files in the src folder but not in the src/lang folder
while IFS= read -r FILE; do
  if [[ "$FILE" != src/lang/* && -f "$FILE" ]]; then
    # Check for localize(<key>)
    grep -oP 'localize\(\"\K[^\")]+' "$FILE" | while read -r KEY; do
      if ! key_exists_in_en "$KEY"; then
        echo "Key $KEY in $FILE not found in en.json"
        RETURN_CODE=1
      fi
    done
    
    # Check for {{localize <key>}}
    grep -oP '{{localize \"\K[^}\"]+' "$FILE" | while read -r KEY; do
      if ! key_exists_in_en "$KEY"; then
        echo "Key $KEY in $FILE not found in en.json"
        RETURN_CODE=1
      fi
    done
  fi
done < <(find src -type f ! -path "src/lang/*")

exit $RETURN_CODE
