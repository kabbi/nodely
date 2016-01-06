const config = require('./config');
const logger = require('./logger');

// TODO: make some cool realtime streaming logs,
// like `nodely monitor` to get the logs from the
// running instance

logger.info('Starting nodely');
process.on('exit', () => {
  logger.info('Exiting nodely');
});

const help = () => {
  console.log('Just type `nodely agent`');
};

if (config.help || !config._.length) {
  help();
  process.exit(2);
}

switch (config._[0]) {
  case 'agent': {
    const Agent = require('./src/Agent');
    const agent = new Agent();
    agent.start();
    process.once('SIGINT', () => {
      logger.info('Interrupt signal received, attempting to shutdown gracefully');
      agent.destroy().then(() => {
        process.exit(0);
      });
    });
    break;
  }
  case 'scheduler': {
    console.error('Scheduler is not supported yet');
    break;
  }
  case 'config': {
    console.log(JSON.stringify(config, null, 2));
    break;
  }
  default: {
    help();
    break;
  }
}
