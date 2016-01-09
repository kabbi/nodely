'use strict';

const npm = require('npm');

const PromiseUtils = require('./Promise');

exports.NPM_CONFIG = {
  progress: false
};

exports.loadConfig = (npmConfig) => (
  PromiseUtils.promisify(npm.load, [npmConfig || exports.NPM_CONFIG], npm)
);

exports.installPackage = (packageName) => (
  PromiseUtils.promisify(npm.commands.install, [[packageName]], npm.commands)
);
