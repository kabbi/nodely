'use strict';

const logger = require('../logger').child({
  component: 'NodeFactory'
});

const localPackage = require('./nodes');
const NpmUtils = require('./utils/Npm');

module.exports = class NodeFactory {
  constructor(npmOptions) {
    this.npmOptions = npmOptions;
    this.npmConfigured = false;
  }

  createNode(nodeData) {
    const packageName = nodeData.package || 'local';
    if (packageName === 'local') {
      logger.debug('Looking up the node in local package:', nodeData.type);
      return localPackage.createNode(nodeData);
    }

    let configureNpm = Promise.resolve();
    if (!this.npmConfigured) {
      configureNpm = NpmUtils.loadConfig();
    }

    logger.debug('Installing npm package:', packageName);
    return configureNpm.then(() => (
      NpmUtils.installPackage(packageName)
    )).then(() => {
      logger.debug('Looking up node in installed package:', nodeData.type);
      const factory = require(packageName);
      return factory.createNode(nodeData);
    });
  }
};
