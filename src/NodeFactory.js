'use strict';

const logger = require('../logger').child({
  component: 'NodeFactory'
});

const localNodes = require('./nodes');

// TODO:
// - local (internal) nodes
// - local npm nodes
// - remore npm nodes (install those)
// - pluggable node factories

module.exports = class NodeFactory {
  createNode(nodeData) {
    const Node = localNodes[nodeData.type];
    if (!Node) {
      logger.error('Could not find node for type', nodeData.type);
      return Promise.reject(new Error('Node type is not supported'));
    }
    return Promise.resolve(new Node(nodeData.id, nodeData.props));
  }
};
