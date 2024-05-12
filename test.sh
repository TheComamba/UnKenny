#!/bin/bash

for arg in "$@"
do
    case $arg in
        -a|--all)
        export RUN_SLOW_TESTS=true
        export RUN_OPENAI_TESTS=true
        shift # Remove --all or -a from processing
        ;;
        -o|--openai)
        export RUN_OPENAI_TESTS=true
        shift # Remove argument name from processing
        ;;
        -s|--slow)
        export RUN_SLOW_TESTS=true
        shift # Remove --slow or -s from processing
        ;;
    esac
done

if [[ "$RUN_OPENAI_TESTS" = true && -z "$OPENAI_API_KEY" ]]; then
    echo "OPENAI_API_KEY is not set. Before running OpenAI API tests, run:"
    echo "export OPENAI_API_KEY=<your-api-key>"
    exit 1
fi

echo "Running tests..."
npm run test:coverage
