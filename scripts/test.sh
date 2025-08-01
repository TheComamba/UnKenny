#!/bin/bash

set -e

# Change to git root directory
cd "$(git rev-parse --show-toplevel)"

for arg in "$@"
do
    case $arg in
        -a|--all)
        export RUN_REMOTE_TESTS=true
        export RUN_LOCAL_TESTS=true
        shift # Remove --all or -a from processing
        ;;
        -l|--local)
        export RUN_LOCAL_TESTS=true
        shift # Remove argument name from processing
        ;;
        -r|--remote)
        export RUN_REMOTE_TESTS=true
        shift # Remove argument name from processing
        ;;
    esac
done

if [[ "$RUN_LOCAL_TESTS" == "true" ]]; then
    ./scripts/local_model.sh start
fi

echo "Running tests..."
npm run test:coverage

if grep -r -q 'mocks' src/
then
    echo "'mocks' found in src/ files:"
    grep -r -q 'mocks' src/
    exit 1
fi
