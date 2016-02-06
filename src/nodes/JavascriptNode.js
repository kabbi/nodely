'use strict';

const through = require('through2');
const vm = require('vm');

const Node = require('../Node');

module.exports = class JavascriptNode extends Node {
  constructor(id, props) {
    super(id, props);
    this.stream = through.obj((data, encoding, next) => {
      // TODO: error handling
      const context = { data };
      this.script.runInNewContext(context);
      if (context.data) {
        next(null, context.data);
      }
    });
    this.script = new vm.Script(this.props.code, {
      filename: `node.${this.id}.js`
    });
  }

  destroy() {
    this.stream.end();
    return Promise.resolve();
  }

  getDefaultProps() {
    return {
      code: '// Do nothing'
    };
  }

  getInputs() {
    return [{
      id: 'data',
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
