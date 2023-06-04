import os
import sys
import pickle
import numpy as np
import argparse
from flask import Flask
from flask import request as call_request

# Creates Flask serving engine
app = Flask(__name__)

pipe = None

# @app.before_first_request
def init():
    """
    Initialize the Network for running
    """
    return None

@app.route("/greet", methods=["GET"])
def status():
    return "Hello!"


@app.route("/predict", methods=["POST"])
def predict():
    """
    Perform an inference on the model created in initialize

    Returns:
        Answer to question
    """
    global pipe
    # get query data
    query = dict(call_request.json)

    # Prediction
    prediction = pipe.run(
        query=query["Question"],
        params={"Retriever": {"top_k": 10}, "Reader": {"top_k": 5}}
    )

    output = "here is your answer"

    # Response
    return output

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Run Haystack from Inside a Docker')
    parser.add_argument('--init', action='store_true', required=False)
    parser.add_argument('--run', action='store_true', required=False)
    arguments = parser.parse_args(sys.argv[1:])

    if arguments.init: 
        print("Serving Initializing")
        init()
    if arguments.run:
        print("Starting serving")
        app.run(host="0.0.0.0", debug=True, port=23308)
        print("Serving Started")
