'use strict';

const consul = require('consul');

const config = require('../config');
const logger = require('../logger').child({
  component: 'Agent'
});

const Manager = require('./Manager');
const JsonUtils = require('./utils/Json');
const LoggerUtils = require('./utils/Logger');

module.exports = class Agent {
  constructor() {
    logger.debug('New agent created');
    this.errorLogger = LoggerUtils.createErrorLogger(logger);
    this.agentKey = `${config.baseKey}/agents/${config.name}`;
    this.consul = consul(Object.assign({}, config.consul, {
      promisify: true
    }));

    this.manager = new Manager(this);
  }

  start() {
    logger.debug('Starting agent');
    return this.subscribeForFlow().then(() => {
      logger.info('Agent started');
    }).catch(this.errorLogger);
  }

  subscribeForFlow() {
    this.flowsWatch = this.consul.watch({
      method: this.consul.kv.get,
      options: {
        key: `${this.agentKey}/flow`
      }
    });
    this.flowsWatch.on('change', this.handleFlowUpdated.bind(this));
    this.flowsWatch.on('error', this.errorLogger);
  }

  destroy() {
    logger.debug('Destroying agent');
    if (this.flowsWatch) {
      this.flowsWatch.end();
    }
    return this.manager.destroyFlow().then(() => {
      logger.info('Agent destroyed');
    });
  }

  handleFlowUpdated(response) {
    logger.info('Received flow update, reconciling');
    JsonUtils.unpack(response.Value).then(flow => (
      this.manager.updateFlow(flow)
    )).catch(this.errorLogger);
  }
};
