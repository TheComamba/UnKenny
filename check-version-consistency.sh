#!/bin/bash

if ! command -v jq &> /dev/null; then
    echo "jq is not installed. Installing..."
    sudo apt-get install -y jq
fi

PACKAGE_VERSION=$(jq -r .version package.json)
MODULE_VERSION=$(jq -r .version src/module.json)

RELEASE_NOTES_PATH=release_notes
LATEST_RELEASE_NOTE=$(ls $RELEASE_NOTES_PATH | sort -Vr | head -n 1)
LATEST_VERSION=${LATEST_RELEASE_NOTE%.*}

if [ "$PACKAGE_VERSION" != "$LATEST_VERSION" ] || [ "$MODULE_VERSION" != "$LATEST_VERSION" ]; then
    echo "Version inconsistency detected!"
    echo "The latest version in the release notes is $LATEST_VERSION."
    echo "Package version: $PACKAGE_VERSION"
    echo "Module version: $MODULE_VERSION"
    exit 1
fi
