# LangChain Code Assistant

The following is a port of the Rust Auto Gippity project from Rust to Typescript. The original project can be found https://github.com/coderaidershaun/rust-auto-gippity-full-code/blob/main/README.md

## Setup

In order to run the application you'll need an OpenAI API key. It is currently expected to be exposed as an environment variable as follows:

```plaintext
OPEN_AI_KEY=YOUR_OPEN_AI_KEY
```

This is referenced in the src/apis/ChatLLM.ts file as the default configuration.

## Building

```plaintext
yarn build
yarn run run
```
