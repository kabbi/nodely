'use strict';

const stream = require('readable-stream');
const https = require('https');

const Node = require('../Node');

module.exports = class HttpsRequestNode extends Node {
  constructor(id, props) {
    super(id, props);
    this.output = new stream.Readable({
      objectMode: true,
      read: () => {
        // Do nothing, data flows otherway
      }
    });
    this.input = new stream.Writable({
      objectMode: true,
      write: (data, encoding, next) => {
        console.log('->', data.path);
        https.request(Object.assign(this.props, data), response => {
          let responseJson = '';
          response.setEncoding('utf8');
          response.on('data', chunk => {
            responseJson += chunk;
          });
          response.on('end', () => {
            this.output.push(JSON.parse(responseJson));
          });
        }).end();
        next();
      }
    });
  }

  getInputs() {
    return [{
      id: 'request',
      stream: this.input
    }];
  }

  getOutputs() {
    return [{
      id: 'response',
      stream: this.output
    }];
  }
};
