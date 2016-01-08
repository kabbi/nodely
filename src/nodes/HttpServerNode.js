'use strict';

const http = require('http');
const from = require('from2');

const Node = require('../Node');

module.exports = class HttpServerNode extends Node {
  constructor(id, props) {
    super(id, props);

    if (!this.props.port) {
      throw new Error('You must provide port number to listen on');
    }

    this.buffer = [];
    this.server = http.createServer((request, response) => {
      this.buffer.push({ request, response });
    }).listen(props.port);

    this.stream = from.obj((size, next) => {
      if (this.buffer.length) {
        next(null, this.buffer.pop());
        return;
      }
      this.server.once('request', (request, response) => {
        next(null, { request, response });
      });
    });
  }

  destroy() {
    this.stream.destroy();
    this.server.close();
    // TODO: async!
    return Promise.resolve();
  }

  getOutputs() {
    return [{
      id: 'request',
      stream: this.stream
    }];
  }
};
