const config = module.exports = require('rc')('nodely', {
  // Agent version, currently parced
  // directly from package.json file
  version: null,
  // Consul http access details and credentials
  consul: {
    token: null,
    host: 'localhost',
    port: 8500,
    secure: false,
    ca: null
  },
  // Base consul key prefix for all operations
  baseKey: 'nodely',
  // Logging configuration
  logger: {
    name: 'nodely',
    file: 'debug.log'
  },
  // Root directory to place runtime data
  dataDir: '.',
  // Flow id we are executing
  flowId: null
});

const packageInfo = require('./package.json');
config.version = packageInfo.version;

// Play nice with nomad config scheme

const allocDir = process.env['NOMAD_ALLOC_DIR'];
if (allocDir) {
  config.dataDir = allocDir;
}

const consulToken = process.env['NOMAD_META_CONSUL_TOKEN'];
if (consulToken) {
  config.consul.token = consulToken;
}
const flowId = process.env['NOMAD_META_FLOW_ID'];
if (consulToken) {
  config.flowId = flowId;
}

// TODO: validate the config and provide
// some errors when mandatory values are
// missing
