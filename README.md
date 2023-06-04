# UnKenny - NPCs with artificial intelligence

## About

__UnKenny is currently in its alpha phase. It is not yet intended for use.__

UnKenny is a module for [Foundry Virtual Table Top](https://foundryvtt.com/). The idea for it arose during our Starfinder game, because we wanted to simulate the interaction with a robotical NPC with limited AI.

Do not expect UnKenny to pass the [Turing test](https://plato.stanford.edu/entries/turing-test/)! The open source [large language model](https://en.wikipedia.org/wiki/Large_language_model) it uses behind the scenes is not as powerful as the ones developed by big tech companies. It is intended to capture the joy of interacting with an uncanny and slightly random AI and incorporate it into role playing.

Oh, and UnKenny is probably not safe for work. Even with a lot of time and budget it is a very daunting task to get language models trained by the internet to behave.

## Installation

Because UnKenny is not yet incorporated into the Foundry ecosystem, you have to manually copy the src/ folder of this repository to the {userData}/Data/modules/ folder of Foundry, and then rename it to 'unkenny' (the id declared in module.json).

On POSIX compliant operating systems like Linux and Mac you can alternatively use a symbolic link. It can be created via e.g.

```bash
ln -s {folder containing git repo}/UnKenny/src {Foundry user data}/Data/modules/unkenny
```

## Running the server

Sadly running of the server is quite cumbersome yet. You need to install python + necessary dependencies + packages and then start the server manually. This will be improved!

1. Install Python (we use 3.10)
2. Enter the folder and install the required packages: (Please feel free to do so in your favorite python envirentment to keep everything clean!)
```
pip install -r requirements.txt
```
3. Run the Script
```
python main.py --run OR   
python3 main.py --run
```
4. Pray to Aqua that it works!

You can check if the server is running under: http://127.0.0.1:23308/greet


## License

This software is distributed under the [MIT](https://choosealicense.com/licenses/mit/) license. In a nutshell this means that all code is made public, and you are free to use it without any charge.