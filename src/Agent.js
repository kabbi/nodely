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
    logger.info('Acquiring agent session');
    // Verify the consul is reachable by reading root key
    return this.consul.kv.get(config.baseKey).then(result => {
      if (result === undefined) {
        throw new Error('No nodely root key found, configuration needed');
      }
      return this.acquireAgentSession();
    }).then(() => {
      this.subscribeForFlow();
      logger.info('Agent started');
    }).catch(this.errorLogger);
  }

  getAgentSession() {
    // TODO: put more things into agent session:
    // - current device available resources
    // - something else?
    return {
      name: config.name,
      version: config.version
    };
  }

  acquireAgentSession() {
    return JsonUtils.pack(this.getAgentSession()).then(agentSession => {
      this.lock = this.consul.lock({
        key: this.agentKey,
        value: agentSession,
        session: {
          ttl: config.timing.agentSessionTtl,
          lockdelay: config.timing.agentLockDelay
        }
      });

      return new Promise((resolve, reject) => {
        this.lock.acquire();
        // TODO: how to reject this promise properly?
        this.lock.once('acquire', () => {
          resolve();
        });
        this.lock.once('error', error => {
          reject(error);
        });
      });
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
    logger.info('Destroying agent');
    if (this.flowsWatch) {
      this.flowsWatch.end();
    }
    return this.manager.destroyFlow().then(() => (
      this.releaseAgentSession()
    )).then(() => {
      logger.info('Agent destroyed');
    });
  }

  releaseAgentSession() {
    return new Promise(resolve => {
      // TODO: how to wait for lock release?
      this.lock.release();
      resolve(null);
    });
  }

  handleFlowUpdated(response) {
    logger.info('Received flow update, reconciling');
    JsonUtils.unpack(response.Value).then(flow => (
      this.manager.updateFlow(flow)
    )).catch(this.errorLogger);
  }
};
