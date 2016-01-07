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
    this.flowPath = `${config.baseKey}/flows/${config.flowId}`;
    this.consul = consul(Object.assign({}, config.consul, {
      promisify: true
    }));

    this.manager = new Manager(this);
  }

  start() {
    logger.debug('Starting agent');
    this.subscribeForFlow();
    logger.info('Agent started on', this.flowPath);
  }

  subscribeForFlow() {
    this.flowsWatch = this.consul.watch({
      method: this.consul.kv.get,
      options: {
        key: `${this.flowPath}/data`
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
    if (!response) {
      logger.info('No flow data found, just waiting');
      return;
    }
    logger.info('Received flow update, reconciling');
    JsonUtils.unpack(response.Value).then(flow => (
      this.manager.updateFlow(flow)
    )).catch(this.errorLogger);
  }
};
