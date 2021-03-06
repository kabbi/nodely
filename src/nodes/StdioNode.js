'use strict';

const Node = require('../Node');

module.exports = class StdioNode extends Node {
  getInputs() {
    return [{
      id: 'stdout',
      stream: process.stdout
    }, {
      id: 'stderr',
      stream: process.stderr
    }];
  }
};
