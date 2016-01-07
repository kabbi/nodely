'use strict';

const logger = require('../logger').child({
  component: 'LinkFactory'
});

// TODO: same discovery thing as for nodes

module.exports = class LinkFactory {
  createLink(inputStream, outputStream, linkData) {
    if (linkData.type !== 'local') {
      logger.error('Invalid link type specified');
      return Promise.reject(new Error('Only local nodes are supported right now'));
    }
    inputStream.pipe(outputStream, {
      end: false
    });
    return Promise.resolve(linkData);
  }
};
