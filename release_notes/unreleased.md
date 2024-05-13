# Version 1.0.0

- __Breaking Change__: Removed calling actors via chat-command. Only the @-Syntax is allowed.
- __Breaking Change__: Api tokens stored on actors will be ignored. They now have to be set in the module configuration.
- __Breaking Change__: Replaced model gpt-4-preview with gpt-4 and gpt-4-turbo.
- Storing configuration parameters in global settings. Actors can overwrite them.
- Offering model parameters min/maxNewTokens, repetitionPenalty and tempareture.
