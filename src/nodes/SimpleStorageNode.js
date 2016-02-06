'use strict';

const stream = require('readable-stream');

const Node = require('../Node');

module.exports = class StdioNode extends Node {
  constructor(id, props) {
    super(id, props);
    this.store = new Map();
    this.output = new stream.Readable({
      objectMode: true,
      read: () => {
        // Do nothing, data flows otherway
      }
    });
    this.initializeMap();
    this.input = new stream.Writable({
      objectMode: true,
      write: (data, encoding, next) => {
        if (data.key && data.value) {
          this.store.set(data.key, data.value);
        }
        if (data.key) {
          this.output.push(this.store.get(data.key));
        }
        next();
      }
    });
  }

  initializeMap() {
    for (const key of Object.keys(this.props)) {
      this.store.set(key, this.props[key]);
      this.output.push(this.props[key]);
    }
  }

  getInputs() {
    return [{
      id: 'control',
      stream: this.input
    }];
  }

  getOutputs() {
    return [{
      id: 'value',
      stream: this.output
    }];
  }
};
