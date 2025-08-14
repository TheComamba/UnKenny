#!/bin/bash

set -e

model_name="llama3.2"

arg="${1:-start}"
if [[ "$arg" != "start" && "$arg" != "stop" && "$arg" != "check" ]]; then
    echo "Usage: $0 [start|stop|check]"
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
elif [[ "$arg" == "check" ]]; then
    http_code=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:11434/v1/chat/completions -H "Content-Type: application/json" -d '{
        "model": "'"$model_name"'",
        "messages": [
            { "role": "system", "content": "You are a helpful assistant." },
            { "role": "user", "content": "What is UnKenny?"}
        ],
        "stream": false
    }')
    echo "Received HTTP Code $http_code"
    if [[ "$http_code" -lt 400 ]]; then
        echo "Ollama server is running and responding correctly."
    else
        echo "Ollama server is not responding correctly. HTTP Code: $http_code"
        exit 1
    fi
fi
