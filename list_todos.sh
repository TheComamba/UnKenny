#!/bin/bash

if grep -rin todo * --exclude-dir=node_modules --include={*.js,*.hbs,*.json,*.sh,*.md} -B 3 -A 3; then
    echo "TODOs found!"
    exit 1
else
    echo "No TODOs found."
fi