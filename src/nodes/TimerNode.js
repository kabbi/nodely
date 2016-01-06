'use strict';

const from = require('from2');

const Node = require('../Node');

module.exports = class TimerNode extends Node {
  constructor(id, props) {
    super(id, props);

    this.stream = from((size, next) => {
      setTimeout(() => {
        next(null, this.props.data);
      }, this.props.interval);
    });
  }

  getDefaultProps() {
    return {
      interval: 1000,
      data: {}
    };
  }

  getOutputs() {
    return [...super.getOutputs(), {
      id: 'data',
      stream: this.stream
    }];
  }
};
