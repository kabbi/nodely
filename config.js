const config = module.exports = require('rc')('nodely', {
  // Agent version, currently parced
  // directly from package.json file
  version: null,
  // Consul http access details and credentials
  consul: {
    token: process.env['NOMAD_META_CONSUL_TOKEN'] || null,
    host: 'localhost',
    port: 8500,
    secure: false,
    ca: null
  },
  // Base consul key prefix for all operations
  baseKey: 'nodely',
  // Logging configuration
  logger: {
    level: 'error',
    name: 'nodely',
    file: 'debug.log'
  },
  // Root directory to place runtime data
  dataDir: process.env['NOMAD_ALLOC_DIR'] || '.',
  // Flow id we are executing
  flowId: process.env['NOMAD_META_FLOW_ID'] || null
});

const packageInfo = require('./package.json');
config.version = packageInfo.version;

// TODO: validate the config and provide
// some errors when mandatory values are
// missing
