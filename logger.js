const bunyan = require('bunyan');
const fs = require('fs');

const config = require('./config');

module.exports = bunyan.createLogger({
  name: config.logger.name,
  level: 'error',
  streams: [{
    level: 'error',
    stream: process.stdout
  }, {
    level: 'debug',
    stream: fs.createWriteStream(`${config.dataDir}/debug.log`)
  }]
});
