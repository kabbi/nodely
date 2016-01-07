'use strict';

const net = require('net');
const invert = require('invert-stream');

const Node = require('../Node');

module.exports = class TcpServerNode extends Node {
  constructor(id, props) {
    super(id, props);

    if (!this.props.port) {
      throw new Error('You must provide port number to listen on');
    }

    this.dataStream = invert();
    this.server = net.createServer(connection => {
      connection.pipe(this.dataStream.other, {
        end: false
      });
    }).listen(props.port);
  }

  destroy() {
    this.dataStream.end();
    this.server.close();
    // TODO: async!
    return Promise.resolve();
  }

  getOutputs() {
    return [{
      id: 'data',
      stream: this.dataStream
    }];
  }
};
