#!/bin/bash

set -e

model_name="llama3.2"

arg="${1:-start}"
if [[ "$arg" != "start" && "$arg" != "stop" ]]; then
    echo "Usage: $0 [start|stop]"
    exit 1
fi

ensure_ollama() {
    if ! command -v ollama &> /dev/null; then
        echo "Ollama is not installed. Let's change that."
        if [[ "$(uname -s)" != "Linux" ]]; then
            echo "Nah, hold on. This script can only automatically install Ollama on Linux operating systems."
            echo "Please install Ollama manually by following the instructions at https://ollama.com/."
            exit 1
        fi
        curl -fsSL https://ollama.com/install.sh | sh
    fi
}

ensure_server() {
    if ! systemctl is-enabled --quiet ollama; then
        echo "Ollama service is not enabled. Enabling and starting it now."
        sudo systemctl enable --now ollama
    elif ! systemctl is-active --quiet ollama; then
        echo "Ollama service is installed but not running. Starting it now."
        sudo systemctl start ollama
    fi
    if ! pgrep -x "ollama" > /dev/null; then
        echo "Ollama server is not running. Starting it now."
        ollama serve &
    fi
}

stop_ollama() {
    if systemctl | grep -q ollama; then
        echo "Stopping Ollama service..."
        sudo systemctl stop ollama
    fi
}

if [[ "$arg" == "start" ]]; then
    ensure_ollama
    ensure_server
    ollama pull "$model_name"
elif [[ "$arg" == "stop" ]]; then
    stop_ollama
fi
