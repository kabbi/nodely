'use strict';

const logger = require('../logger').child({
  component: 'Manager'
});

const NodeFactory = require('./NodeFactory');
const LinkFactory = require('./LinkFactory');

const JsonUtils = require('./utils/Json');

module.exports = class Manager {
  constructor(agent) {
    this.flow = null;
    this.nodes = {};
    this.links = {};
    this.agent = agent;
    this.consul = agent.consul;
    this.nodeFactory = new NodeFactory();
    this.linkFactory = new LinkFactory();
  }

  notifyStatus(status, error) {
    return JsonUtils.pack({
      status, error
    }).then(value => (
      this.consul.kv.set(`${this.agent.flowPath}/status`, value)
    ));
  }

  statusNotifier(status) {
    return error => this.notifyStatus(status, error);
  }

  forEachPromise(entities, mapper) {
    return Promise.all(entities.map(nodeData => mapper.call(this, nodeData)));
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

    return this.notifyStatus('creating').then(() => (
      this.forEachPromise(flow.nodes, this.createNode)
    )).then(() => (
      this.forEachPromise(flow.links, this.createLink)
    )).then(() => {
      logger.info('Finished creating flow');
      this.flow = flow;
    }).then(
      this.statusNotifier('created'),
      this.statusNotifier('failed')
    );
  }

  destroyFlow() {
    if (!this.flow) {
      return Promise.resolve();
    }

    logger.info('Destroying flow', this.flow.id);
    return this.notifyStatus('destroying').then(() => (
      this.forEachPromise(this.flow.nodes, this.destroyNode)
    )).then(() => {
      logger.info('Finished destroying flow');
      this.flow = null;
    }).then(
      this.statusNotifier('destroyed'),
      this.statusNotifier('failed')
    );
  }

  updateFlow(flow) {
    logger.info('Updating flow', this.flow ? this.flow.id : 'null', '->', flow.id);
    return this.destroyFlow().then(() => this.createFlow(flow));
  }

  createNode(nodeData) {
    return this.nodeFactory.createNode(nodeData).then(node => {
      this.nodes[nodeData.id] = node;
      return node;
    });
  }

  destroyNode(nodeData) {
    return this.nodes[nodeData.id].destroy().then(() => {
      delete this.nodes[nodeData.id];
    });
  }

  findLinkStreams(linkData) {
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
    return Promise.resolve({
      from: fromNode.getOutput(fromOutputId).stream,
      to: toNode.getInput(toInputId).stream
    });
  }

  createLink(linkData) {
    return this.findLinkStreams(linkData).then(streams => (
      this.linkFactory.createLink(streams.from, streams.to, linkData)
    ));
  }

  destroyLink(linkData) {
    return this.findLinkStreams(linkData).then(streams => {
      streams.from.unpipe(streams.to);
    });
  }
};
