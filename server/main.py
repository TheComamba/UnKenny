# This code is a combination from a Haystack tutorial and an SAP-Tutorial about ML-images. 

import os
import sys
import pickle
import numpy as np
import argparse
from flask import Flask
from flask import request as call_request

from haystack.document_stores import InMemoryDocumentStore
from haystack.utils import clean_wiki_text, convert_files_to_docs, fetch_archive_from_http
from haystack.nodes import TfidfRetriever
from haystack.nodes import FARMReader
from haystack.pipelines import ExtractiveQAPipeline


# Creates Flask serving engine
app = Flask(__name__)

pipe = None

@app.before_first_request
def init():
    """
    Create Document Store, deployment will not start
    """
    # In-Memory Document Store
    document_store = InMemoryDocumentStore() # All the model files will be read from /mnt/models
    
    # Let's first get some documents that we want to query
    # Here: 517 Wikipedia articles for Game of Thrones

    doc_dir = "data/tutorial3"
    if os.path.isdir(doc_dir):
        print("Files already loaded")
    else:
        s3_url = "https://s3.eu-central-1.amazonaws.com/deepset.ai-farm-qa/datasets/documents/wiki_gameofthrones_txt3.zip"
        fetch_archive_from_http(url=s3_url, output_dir=doc_dir)
        

    # convert files to dicts containing documents that can be indexed to our datastore
    # You can optionally supply a cleaning function that is applied to each doc (e.g. to remove footers)
    # It must take a str as input, and return a str.
    docs = convert_files_to_docs(dir_path=doc_dir, clean_func=clean_wiki_text, split_paragraphs=True)

    # We now have a list of dictionaries that we can write to our document store.
    # If your texts come from a different source (e.g. a DB), you can of course skip convert_files_to_dicts() and create the dictionaries yourself.
    # The default format here is: {"name": "<some-document-name>", "content": "<the-actual-text>"}

    # Let's have a look at the first 3 entries:
    ### print(docs[:3])

    # Now, let's write the docs to our DB.
    document_store.write_documents(docs)

    # An in-memory TfidfRetriever based on Pandas dataframes
    retriever = TfidfRetriever(document_store=document_store)

    # Load a  local model or any of the QA models on
    # Hugging Face's model hub (https://huggingface.co/models)
    reader = FARMReader(model_name_or_path="deepset/roberta-base-squad2", use_gpu=True)
    # reader = FARMReader(model_name_or_path="/model", use_gpu=False)

    # Create the pipeline
    global pipe 
    pipe = ExtractiveQAPipeline(reader, retriever)

    return None

@app.route("/greet", methods=["GET"])
def status():
    global pipe
    if pipe is None:
        return "Flask Code: Model was not loaded."
    else:
        return "Model is loaded."

# You may customize the endpoint, but must have the prefix `/v<number>`
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

    output = prediction['answers']

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
        app.run(host="0.0.0.0", debug=True, port=9420)
        print("Serving Started")
