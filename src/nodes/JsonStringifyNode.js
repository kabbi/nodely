'use strict';

const ndjson = require('ndjson');

const Node = require('../Node');

module.exports = class JsonStringifyNode extends Node {
  constructor(id, props) {
    super(id, props);
    this.stream = ndjson.stringify();
  }

  destroy() {
    this.stream.end();
    return Promise.resolve();
  }

  getInputs() {
    return [{
      id: 'objects',
      stream: this.stream
    }];
  }

  getOutputs() {
    return [{
      id: 'data',
      stream: this.stream
    }];
  }
};
