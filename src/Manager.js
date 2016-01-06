'use strict';

const logger = require('../logger').child({
  component: 'Manager'
});

const NodeFactory = require('./NodeFactory');
const LinkFactory = require('./LinkFactory');

module.exports = class Manager {
  constructor(agent) {
    this.flow = null;
    this.agent = agent;
    this.nodeFactory = new NodeFactory();
    this.linkFactory = new LinkFactory();
  }

  createFlow(flow) {
    if (this.flow) {
      return Promise.resolve();
    }

    logger.info('Creating new flow', flow.id);
    logger.debug({ flow }, 'Flow data');

    if (!flow || !flow.id || !flow.nodes || !flow.links) {
      return Promise.reject(new Error('Malformed flow data'));
    }

    return Promise.all(flow.nodes.map(node => (
      this.createNode(node)
    ))).then(nodes => {
      this.nodes = {};
      for (const node of nodes) {
        this.nodes[node.id] = node;
      }
      return Promise.all(flow.links.map(link => (
        this.createLink(link)
      )));
    }).then(links => {
      this.links = {};
      for (const link of links) {
        this.links[link.id] = link;
      }

      logger.info('Finished creating flow');
      this.flow = flow;
    });
  }

  destroyFlow() {
    if (!this.flow) {
      return Promise.resolve();
    }
    // TODO: proper destroy
    logger.info('Destroying flow', this.flow.id);
    this.flow = null;
    return Promise.resolve();
  }

  updateFlow(flow) {
    logger.info('Updating flow', this.flow ? this.flow.id : 'null', '->', flow.id);
    // TODO: proper reconcilation: update nodes and connections instead of crude re-create
    return this.destroyFlow().then(() => this.createFlow(flow));
  }

  createNode(nodeData) {
    return this.nodeFactory.createNode(nodeData);
  }

  createLink(linkData) {
    const fromNode = this.nodes[linkData.from[0]];
    const fromOutputId = linkData.from[1];
    const toNode = this.nodes[linkData.to[0]];
    const toInputId = linkData.to[1];
    if (!fromNode || !fromNode.getOutput(fromOutputId)) {
      return Promise.reject(new Error('Source node or output not found'));
    }
    if (!toNode || !toNode.getInput(toInputId)) {
      return Promise.reject(new Error('Destination node or input not found'));
    }
    return this.linkFactory.createLink(
      fromNode.getOutput(fromOutputId).stream,
      toNode.getInput(toInputId).stream,
      linkData
    );
  }
};
