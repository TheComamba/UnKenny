#!/bin/bash

set -e

# Change to git root directory
cd "$(git rev-parse --show-toplevel)"

for arg in "$@"
do
    case $arg in
        -a|--all)
        export RUN_OPENAI_TESTS=true
        shift # Remove --all or -a from processing
        ;;
        -o|--openai)
        export RUN_OPENAI_TESTS=true
        shift # Remove argument name from processing
        ;;
    esac
done

echo "Running tests..."
OPENAI_API_KEY=$OPENAI_API_KEY npm run test:coverage

if grep -r -q 'mocks' src/
then
    echo "'mocks' found in src/ files:"
    grep -r -q 'mocks' src/
    exit 1
fi
