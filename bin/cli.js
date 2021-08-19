#!/usr/bin/env node

require('source-map-support').install();
require('../build/main').default(require('yargs'));
