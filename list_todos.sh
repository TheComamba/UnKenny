#!/bin/bash

SCRIPT=$(readlink -f "$0")

if grep -rin todo * \
    --include={*.js,*.hbs,*.json,*.sh,*.md} \
    --exclude-dir=node_modules \
    --exclude-dir=coverage \
    --exclude=$(basename $SCRIPT) \
    -B 3 -A 3; then
    echo
    echo "TODOs found!"
    exit 1
else
    echo "No TODOs found."
fi
