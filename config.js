module.exports = require('rc')('nodely', {
  // Agent name, must be configured and
  // must be unique within the cluster
  name: null,
  // Agent version, currently parced
  // directly from package.json file
  version: null,
  // Consul http access details and credentials
  consul: {
    token: null,
    address: 'localhost',
    port: 8500,
    secure: false,
    ca: null
  },
  // Various timeouts and ttls
  timing: {
    // Agent status heartbeat timeout
    agentSessionTtl: '60s',
    // Delay to forbid agent re-lock immediately
    agentLockDelay: '15s'
  },
  // Do flow status updates ourselves
  noManager: false,
  // Base consul key prefix for all operations
  baseKey: 'nodely',
  // Logging configuration
  logger: {
    name: 'nodely'
  },
});

const packageInfo = require('./package.json');
module.exports.version = packageInfo.version;

// TODO: validate the config and provide
// some errors when mandatory values are
// missing
