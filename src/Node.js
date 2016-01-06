'use strict';

module.exports = class Node {
  constructor(id, props) {
    this.id = id;
    this.props = Object.assign({},
      this.getDefaultProps(),
      props
    );
  }

  destroy() {
    return Promise.resolve();
  }

  getDefaultProps() {
    return {};
  }

  getInput(id) {
    for (const input of this.getInputs()) {
      if (input.id === id) {
        return input;
      }
    }
    return null;
  }

  getOutput(id) {
    for (const output of this.getOutputs()) {
      if (output.id === id) {
        return output;
      }
    }
    return null;
  }

  getInputs() {
    return [];
  }

  getOutputs() {
    return [];
  }
};
