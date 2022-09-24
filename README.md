# SV task selection system front-end

This is the front-end code for the task selection system. It uses React.js
and d3. We also use websockets to remove tasks as they get selected by other
users.

## Installation

Built on Node v14.19.1. The easiest way to configure Node is to use nvm. It won't work on Node 16

Package management and building is all controlled through npm. To install all
required pacakges run:

```
npm install
```

This should pull down all required packages.

## Building

You can either start a local web server for developing the system:

```
npm start
```

or build everything to be copied to a local server:

```
npm run-script build
```

You can then copy the files in the `build` directory to a static web server.

## Configuration

There isn't much to configure. You can set what url the front-end connects
to in `src/config.js`. This is useful for switching between development and
production builds.
