#!/bin/bash

set -e

# Change to git root directory
cd "$(git rev-parse --show-toplevel)"

npm update
