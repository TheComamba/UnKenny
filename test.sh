#!/bin/bash

for arg in "$@"
do
    case $arg in
        -a|--all)
        export RUN_SLOW_TESTS=true
        shift # Remove --all or -a from processing
        ;;
    esac
done

echo "Running tests..."
npm run test:coverage
