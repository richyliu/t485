# T485 Beta
[![Build Status](https://travis-ci.com/t485/t485.svg?branch=v2)](https://travis-ci.com/t485/t485)

The official Boy Scout Troop 485 website, version 2.0.0-beta.

# View it live

You can view it at [beta.t485.org](https://beta.t485.org).

# Build and develop it

The T485 Website uses [gulp](https://gulpjs.com/) and [nunjucks](https://mozilla.github.io/nunjucks/) to build and host a live development server. 

There is a developer guide avaliable [here](https://beta.t485.org/developer/).

Here's how to get started:

1. Install [node](https://nodejs.org/en/) and [npm](https://www.npmjs.com/) if you haven't already.
2. Install the dependencies in the same directory as the project: `$ npm install`.
3. Install the [Gulp](https://gulpjs.com/) CLI: `$ npm install gulp-cli -g` (`sudo` may be required on certain operating systems).
4. Build a minified production build with `$ gulp build` or run a live dev server (usually at localhost:3000) with `$ gulp watch`.


We also have a [internal documentation](https://beta.t485.org/developer/docs/) avaliable.
