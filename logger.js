const bunyan = require('bunyan');
const fs = require('fs');

const config = require('./config');

module.exports = bunyan.createLogger({
  name: config.logger.name,
  streams: [{
    level: config.logger.level,
    stream: process.stdout
  }, {
    level: 'debug',
    stream: fs.createWriteStream(`${config.dataDir}/${config.logger.file}`)
  }]
});
